/**
 * 扫描 `app/` 下所有 `page.tsx`，覆盖写入 `config/routes.json`（Router 树）。
 *
 * - 启动前会读入**当前** `config/routes.json`，按「规范化全路径」保留各节点 `title`。
 * - 扫描得到的新节点若旧 JSON 无对应路径，则 `title` 为 `"todo"`。
 * - `hasPage` 仅由是否存在 `…/该段/page.tsx` 决定；`hasPage: true` 不会写入 JSON（与默认一致）。
 * - 路由组目录 `(name)` 不进入 URL；`[param]` 在树中为 `:param`。
 *
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app");
const outFile = path.join(root, "config", "routes.json");

function isRouteGroup(name) {
  return /^\([^/)]+\)$/.test(name);
}

/** 目录名 -> 路由段（`[x]` -> `:x`） */
function segmentForUrl(name) {
  if (isRouteGroup(name)) return null;
  const m = /^\[([^\]]+)\]$/.exec(name);
  if (m) return `:${m[1]}`;
  return name;
}

/** 相对 `app` 的目录路径 -> URL 段数组 */
function relDirToSegments(relFromApp) {
  if (!relFromApp) return [];
  const parts = relFromApp.split(/[/\\]/).filter(Boolean);
  const out = [];
  for (const p of parts) {
    const seg = segmentForUrl(p);
    if (seg == null) continue;
    out.push(seg);
  }
  return out;
}

function fullKey(segments) {
  if (segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

function pageDirKeyFromAbs(absPagePath) {
  const dir = path.dirname(absPagePath);
  const rel = path.relative(appDir, dir).replace(/\\/g, "/");
  return fullKey(relDirToSegments(rel));
}

function walkPageFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkPageFiles(full, out);
    else if (e.isFile() && e.name === "page.tsx") out.push(full);
  }
  return out;
}

function buildHasPageSet(pageFiles) {
  const set = new Set();
  for (const f of pageFiles) {
    set.add(pageDirKeyFromAbs(f));
  }
  return set;
}

function collectAllPrefixSegmentArrays(pageFiles) {
  const out = [];
  for (const f of pageFiles) {
    const rel = path.relative(appDir, path.dirname(f)).replace(/\\/g, "/");
    const segs = relDirToSegments(rel);
    for (let i = 0; i <= segs.length; i++) {
      out.push(segs.slice(0, i));
    }
  }
  return out;
}

function uniquePrefixArrays(arrays) {
  const map = new Map();
  for (const a of arrays) {
    map.set(fullKey(a), a);
  }
  return [...map.values()];
}

function addPathToTrie(trie, segs) {
  if (segs.length === 0) return;
  let n = trie;
  for (const s of segs) {
    if (!n.has(s)) n.set(s, new Map());
    n = n.get(s);
  }
}

/**
 * @param {Map} trie 嵌套 Map: segment -> 子 Map
 * @param {string[]} segs
 * @param {Set<string>} hasPageSet
 */
function trieToRouter(trie, segs, hasPageSet) {
  const keys = [...trie.keys()].sort((a, b) => a.localeCompare(b));
  const out = [];
  for (const k of keys) {
    const sub = trie.get(k);
    const newSegs = [...segs, k];
    const o = { path: k, title: "todo" };
    const fk = fullKey(newSegs);
    o.hasPage = hasPageSet.has(fk) ? true : false;
    if (sub && sub.size > 0) o.children = trieToRouter(sub, newSegs, hasPageSet);
    out.push(o);
  }
  return out;
}

function collectTitles(router) {
  const m = new Map();
  function walk(n, segs) {
    if (!n) return;
    if (n.path === "/") {
      m.set("/", n.title ?? "");
      for (const c of n.children ?? []) walk(c, []);
      return;
    }
    const newSegs = n.path ? [...segs, n.path] : segs;
    if (n.path) m.set(fullKey(newSegs), n.title ?? "");
    for (const c of n.children ?? []) walk(c, newSegs);
  }
  walk(router, []);
  return m;
}

function mergeTitles(node, segs, titleMap) {
  if (!node) return;
  if (node.path === "/") {
    node.title = titleMap.get("/") ?? "todo";
    for (const c of node.children ?? []) mergeTitles(c, [], titleMap);
    return;
  }
  const newSegs = node.path ? [...segs, node.path] : segs;
  node.title = titleMap.get(fullKey(newSegs)) ?? "todo";
  for (const c of node.children ?? []) mergeTitles(c, newSegs, titleMap);
}

/** 与手写配置一致：`hasPage` 仅在 `false` 时写入 JSON（与 breadcrumb 默认 `true` 一致） */
function omitHasPageWhenTrue(node) {
  if (!node) return;
  if (node.hasPage === true) delete node.hasPage;
  for (const c of node.children ?? []) omitHasPageWhenTrue(c);
}

function main() {
  if (!fs.existsSync(appDir)) {
    console.error("Missing app/ directory at", appDir);
    process.exit(1);
  }

  const pageFiles = walkPageFiles(appDir);
  const hasPageSet = buildHasPageSet(pageFiles);
  const unique = uniquePrefixArrays(
    collectAllPrefixSegmentArrays(pageFiles),
  );

  const trie = new Map();
  for (const segs of unique) {
    if (segs.length > 0) addPathToTrie(trie, segs);
  }

  const outRoot = {
    path: "/",
    title: "todo",
    hasPage: hasPageSet.has("/") === true,
  };
  const children = trieToRouter(trie, [], hasPageSet);
  if (children.length) outRoot.children = children;

  let titleMap = new Map();
  if (fs.existsSync(outFile)) {
    try {
      const old = JSON.parse(fs.readFileSync(outFile, "utf8"));
      titleMap = collectTitles(old);
    } catch (e) {
      console.warn("Could not parse existing routes.json:", e?.message);
    }
  }
  mergeTitles(outRoot, [], titleMap);
  omitHasPageWhenTrue(outRoot);

  const json = JSON.stringify(outRoot, null, 2) + "\n";
  fs.writeFileSync(outFile, json, "utf8");
  console.log("Wrote", path.relative(root, outFile), `(${pageFiles.length} page.tsx)`);
}

main();
