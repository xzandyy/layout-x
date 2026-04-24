"use client";

import { useCallback, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { Sidebar } from "@heroui-pro/react";
import type {
  SidebarContentConfig,
  SidebarGroupNode,
  SidebarMenuItemNode,
  SidebarNode,
  TooltipConfig,
} from "./types";

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * 规范化路径：
 * - 移除 hash / query，只保留纯路径
 * - 合并连续斜杠
 * - 保证以 "/" 开头，无尾斜杠（根路径除外）
 */
function normalize(p: string): string {
  if (!p) return "/";
  p = p.split("#")[0]!.split("?")[0]!;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");
  if (!p) return "/";
  return p;
}

/**
 * 从全配置里收集所有**叶子**的 href（有 children 的不收集）。
 */
function collectLeafHrefsFromItem(
  item: SidebarMenuItemNode,
  out: string[],
): void {
  if ("children" in item && item.children && item.children.length > 0) {
    for (const c of item.children) collectLeafHrefsFromItem(c, out);
  } else if ("href" in item && item.href) {
    out.push(item.href);
  }
}

function collectLeafHrefsFromConfig(config: SidebarContentConfig): string[] {
  const out: string[] = [];
  for (const n of config.nodes) {
    if (n.type === "group") {
      for (const m of n.menu) collectLeafHrefsFromItem(m, out);
    }
  }
  return out;
}

/**
 * 在「与当前 path 匹配」的叶子 href 中，选**归一化后最长**的一条（最具体），
 * 这样 `/products/phones/pro/2024/42` 只会高亮 href 为 `/products/phones` 的叶子，
 * 而不会和更短的 `/products` 等同时亮（若存在多个叶子）。
 * 根路径 `/` 仅当 pathname 恰为 `/` 时参与匹配。
 */
function pickDeepestMatchingLeafNorm(
  pathname: string,
  leafHrefs: string[],
): string | undefined {
  const normPath = normalize(pathname);
  const matches: string[] = [];
  for (const raw of leafHrefs) {
    if (!raw || raw.startsWith("http://") || raw.startsWith("https://")) {
      continue;
    }
    const normHref = normalize(raw);
    if (normHref === "/") {
      if (normPath === "/") matches.push(normHref);
      continue;
    }
    if (normPath === normHref || normPath.startsWith(`${normHref}/`)) {
      matches.push(normHref);
    }
  }
  if (matches.length === 0) return undefined;
  return matches.sort((a, b) => b.length - a.length)[0];
}

/** 与 `Sidebar.Menu` 内 RAC Tree 的 item key 一一对应（同 config 下稳定）。 */
function makeItemId(nodeIndexInConfig: number, itemPath: number[]) {
  return `n${nodeIndexInConfig}-${itemPath.join("-")}`;
}

/**
 * 从当前高亮叶子的归一化 href 反推：路径上**所有带 submenu 的祖先** 的 `makeItemId`，
 * 须展开这些节点才能看到当前项。
 */
function findAncestorBranchIdsForActiveLeaf(
  config: SidebarContentConfig,
  activeLeafNorm: string | undefined,
): string[] {
  if (!activeLeafNorm) return [];
  for (let ni = 0; ni < config.nodes.length; ni++) {
    const n = config.nodes[ni]!;
    if (n.type !== "group") continue;
    const chain = findBranchIdChainInMenu(
      n.menu,
      ni,
      [],
      activeLeafNorm,
    );
    if (chain !== null) return chain;
  }
  return [];
}

/**
 * 找到目标叶子时返回自根到该叶路径上**仅分支**的 id 链（无 children 的叶子不生成 id进链）。
 */
function findBranchIdChainInMenu(
  items: SidebarMenuItemNode[],
  nodeIndex: number,
  pathSoFar: number[],
  targetNorm: string,
): string[] | null {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const path = [...pathSoFar, i];
    const id = makeItemId(nodeIndex, path);
    const isBranch =
      "children" in item && item.children && item.children.length > 0;
    if (isBranch) {
      const sub = findBranchIdChainInMenu(
        item.children!,
        nodeIndex,
        path,
        targetNorm,
      );
      if (sub !== null) {
        return [id, ...sub];
      }
    } else {
      const h = "href" in item && item.href;
      if (h && normalize(h) === targetNorm) {
        return [];
      }
    }
  }
  return null;
}

function buildTooltipProps(tooltip: TooltipConfig) {
  return {
    content: tooltip.content,
    className: tooltip.className,
    delay: tooltip.delay,
    closeDelay: tooltip.closeDelay,
    placement: tooltip.placement ?? "right",
  } as const;
}

// ---------------------------------------------------------------------------
// Recursive item renderer
// ---------------------------------------------------------------------------

function MenuItem({
  node,
  itemId,
  nodeIndex,
  itemPath,
  activeLeafNorm,
}: {
  node: SidebarMenuItemNode;
  /** RAC Tree 节点 id，与 expandedKeys 一致 */
  itemId: string;
  /** 对应 `config.nodes` 中的下标（本 group 所在位） */
  nodeIndex: number;
  /** 在 group.menu 树内的下标路径 */
  itemPath: number[];
  /** 全树算出的「当前应高亮」的叶子 href（归一化后）；仅叶子与其相等时 isCurrent */
  activeLeafNorm: string | undefined;
}) {
  const { icon, label, chip, actions, tooltip, onPress } = node;
  const hasSubmenu = Boolean(
    "children" in node && node.children && node.children.length > 0,
  );
  const children = "children" in node ? node.children : undefined;
  /** 有子菜单时不传 href（仅展开/收起）；若配置里误带 href 也忽略。 */
  const href =
    hasSubmenu ? undefined : "href" in node ? node.href : undefined;
  const isCurrent = Boolean(
    href && activeLeafNorm && normalize(href) === activeLeafNorm,
  );

  return (
    <Sidebar.MenuItem
      id={itemId}
      href={href}
      isCurrent={isCurrent}
      onAction={onPress}
      tooltipProps={tooltip ? buildTooltipProps(tooltip) : undefined}
    >
      <Sidebar.MenuItemContent>
        {icon && <Sidebar.MenuIcon>{icon}</Sidebar.MenuIcon>}
        <Sidebar.MenuLabel>{label}</Sidebar.MenuLabel>
        {chip && <Sidebar.MenuChip>{chip}</Sidebar.MenuChip>}
        {actions && <Sidebar.MenuActions>{actions}</Sidebar.MenuActions>}
        {hasSubmenu && (
          <Sidebar.MenuTrigger>
            <Sidebar.MenuIndicator />
          </Sidebar.MenuTrigger>
        )}
      </Sidebar.MenuItemContent>

      {hasSubmenu && children != null && (
        <Sidebar.Submenu>
          {children.map((child, i) => {
            const childPath = [...itemPath, i];
            return (
              <MenuItem
                key={i}
                node={child}
                itemId={makeItemId(nodeIndex, childPath)}
                nodeIndex={nodeIndex}
                itemPath={childPath}
                activeLeafNorm={activeLeafNorm}
              />
            );
          })}
        </Sidebar.Submenu>
      )}
    </Sidebar.MenuItem>
  );
}

function GroupNode({
  node,
  nodeIndex,
  activeLeafNorm,
  expandedForTree,
  onExpandedChangeForTree,
}: {
  node: SidebarGroupNode;
  /** `config.nodes` 里本 group 节点的下标 */
  nodeIndex: number;
  activeLeafNorm: string | undefined;
  /** 本 Menu（Tree）应展示的展开键（已按 nodeIndex 过滤） */
  expandedForTree: Set<string>;
  onExpandedChangeForTree: (keys: Set<Key> | "all") => void;
}) {
  return (
    <Sidebar.Group>
      {node.label && <Sidebar.GroupLabel>{node.label}</Sidebar.GroupLabel>}
      <Sidebar.Menu
        expandedKeys={expandedForTree}
        onExpandedChange={onExpandedChangeForTree}
      >
        {node.menu.map((item, i) => {
          const itemPath = [i];
          return (
            <MenuItem
              key={i}
              node={item}
              itemId={makeItemId(nodeIndex, itemPath)}
              nodeIndex={nodeIndex}
              itemPath={itemPath}
              activeLeafNorm={activeLeafNorm}
            />
          );
        })}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}

function SidebarContentNode({
  node,
  nodeIndex,
  activeLeafNorm,
  expandedForTree,
  onExpandedChangeForTree,
}: {
  node: SidebarNode;
  nodeIndex: number;
  activeLeafNorm: string | undefined;
  expandedForTree: Set<string>;
  onExpandedChangeForTree: (keys: Set<Key> | "all") => void;
}) {
  switch (node.type) {
    case "separator":
      return <Sidebar.Separator />;
    case "group":
      return (
        <GroupNode
          node={node}
          nodeIndex={nodeIndex}
          activeLeafNorm={activeLeafNorm}
          expandedForTree={expandedForTree}
          onExpandedChangeForTree={onExpandedChangeForTree}
        />
      );
  }
}

// ---------------------------------------------------------------------------
// Public: MenuTree
// ---------------------------------------------------------------------------

/**
 * 将 `SidebarContentConfig` 渲染为 Pro Sidebar 菜单节点树。
 * 由 `LayoutX.SidebarMain` 在接收到 `content` prop 时内部调用，
 * 不需要外部单独使用。
 */
export function MenuTree({
  config,
  pathname,
}: {
  config: SidebarContentConfig;
  pathname: string;
}) {
  const leafHrefs = useMemo(
    () => collectLeafHrefsFromConfig(config),
    [config],
  );
  const activeLeafNorm = useMemo(
    () => pickDeepestMatchingLeafNorm(pathname, leafHrefs),
    [pathname, leafHrefs],
  );

  const requiredBranchIds = useMemo(
    () => findAncestorBranchIdsForActiveLeaf(config, activeLeafNorm),
    [config, activeLeafNorm],
  );
  const [userExpanded, setUserExpanded] = useState<Set<string>>(() => new Set());

  const expandedKeys = useMemo(() => {
    const n = new Set(userExpanded);
    for (const k of requiredBranchIds) {
      n.add(k);
    }
    return n;
  }, [userExpanded, requiredBranchIds]);

  const onExpandedChangeForNodeIndex = useCallback(
    (nodeIndex: number) => (treeKeys: Set<Key> | "all") => {
      if (treeKeys === "all") return;
      const prefix = `n${nodeIndex}-`;
      setUserExpanded((prev) => {
        const next = new Set<string>();
        for (const k of prev) {
          if (!String(k).startsWith(prefix)) {
            next.add(String(k));
          }
        }
        for (const k of treeKeys) {
          next.add(String(k));
        }
        return next;
      });
    },
    [],
  );

  return (
    <>
      {config.nodes.map((node, i) => (
        <SidebarContentNode
          key={i}
          node={node}
          nodeIndex={i}
          activeLeafNorm={activeLeafNorm}
          expandedForTree={
            new Set(
              [...expandedKeys].filter((k) => String(k).startsWith(`n${i}-`)),
            )
          }
          onExpandedChangeForTree={onExpandedChangeForNodeIndex(i)}
        />
      ))}
    </>
  );
}
