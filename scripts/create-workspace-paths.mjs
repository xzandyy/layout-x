import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** 与 `app/` 下应用目录名一致（无前后斜杠） */
const appDirSegment = "workspace";
/** 对外 URL 前缀，面包屑与侧栏 href 一致 */
const routeBase = "/workspace";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app", appDirSegment);
const outFile = path.join(root, "config", "workspace-paths.json");

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

/** 相对 `app/<appDirSegment>` 的目录路径 -> URL 段数组 */
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
  if (segments.length === 0) return routeBase;
  return `${routeBase}/${segments.join("/")}`;
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
function trieToPaths(trie, segs, hasPageSet) {
  const keys = [...trie.keys()].sort((a, b) => a.localeCompare(b));
  const out = [];
  for (const k of keys) {
    const sub = trie.get(k);
    const newSegs = [...segs, k];
    const o = { path: k, title: "todo" };
    const fk = fullKey(newSegs);
    o.hasPage = hasPageSet.has(fk) ? true : false;
    if (sub && sub.size > 0)
      o.children = trieToPaths(sub, newSegs, hasPageSet);
    out.push(o);
  }
  return out;
}

/** 从旧 workspace-paths.json 收集 title，键为「完整 URL 路径」 */
function collectTitles(pathsRoot) {
  const m = new Map();
  function walk(n, segs) {
    if (!n) return;
    if (n.path === "/" || n.path === routeBase) {
      m.set("/", n.title ?? "");
      m.set(routeBase, n.title ?? "");
      for (const c of n.children ?? []) walk(c, []);
      return;
    }
    const newSegs = n.path ? [...segs, n.path] : segs;
    if (n.path) m.set(fullKey(newSegs), n.title ?? "");
    for (const c of n.children ?? []) walk(c, newSegs);
  }
  walk(pathsRoot, []);
  return m;
}

/** 将迁移前（根下直出）的 title 键合并为 `/workspace` 前缀 */
function migrateLegacyTitleMap(m) {
  const out = new Map(m);
  for (const [k, v] of m) {
    if (k === "/") {
      out.set(routeBase, out.get(routeBase) || v);
      continue;
    }
    if (
      k.startsWith("/") &&
      k !== routeBase &&
      !k.startsWith(`${routeBase}/`)
    ) {
      const nk = `${routeBase}${k === "/" ? "" : k}`;
      if (!out.has(nk)) out.set(nk, v);
    }
  }
  return out;
}

function mergeTitles(node, segs, titleMap) {
  if (!node) return;
  if (node.path === "/" || node.path === routeBase) {
    node.title =
      titleMap.get(routeBase) ?? titleMap.get("/") ?? "todo";
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
    console.error("Missing app directory at", appDir);
    process.exit(1);
  }

  const pageFiles = walkPageFiles(appDir);
  const hasPageSet = buildHasPageSet(pageFiles);
  const unique = uniquePrefixArrays(collectAllPrefixSegmentArrays(pageFiles));

  const trie = new Map();
  for (const segs of unique) {
    if (segs.length > 0) addPathToTrie(trie, segs);
  }

  const outRoot = {
    path: routeBase,
    title: "todo",
    hasPage: hasPageSet.has(routeBase) === true,
  };
  const children = trieToPaths(trie, [], hasPageSet);
  if (children.length) outRoot.children = children;

  let titleMap = new Map();
  if (fs.existsSync(outFile)) {
    try {
      const old = JSON.parse(fs.readFileSync(outFile, "utf8"));
      titleMap = migrateLegacyTitleMap(collectTitles(old));
    } catch (e) {
      console.warn("Could not parse existing workspace-paths.json:", e?.message);
    }
  }
  mergeTitles(outRoot, [], titleMap);
  omitHasPageWhenTrue(outRoot);

  const json = JSON.stringify(outRoot, null, 2) + "\n";
  fs.writeFileSync(outFile, json, "utf8");
  console.log(
    "Wrote",
    path.relative(root, outFile),
    `(${pageFiles.length} page.tsx under app/${appDirSegment})`,
  );
}

main();
