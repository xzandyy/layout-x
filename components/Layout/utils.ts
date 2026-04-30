import type {
  MenuConfig,
  RailMenuItem,
  SidebarMenuConfig,
  SidebarMenuItemNode,
  SidebarNavItem,
  SidebarSubmenu,
} from "./types";

/**
 * 扁平化 rail 菜单项（与原始 `menuConfig.rail` 分块无关）。
 */
export function collectRailMenuItems(menuConfig: MenuConfig | undefined) {
  if (!menuConfig) return [] as RailMenuItem[];
  return menuConfig.rail.flatMap((b) => b.items);
}

/**
 * 规范化 URL 路径：去 hash/query、合并多余斜杠、补前导 `/`、去尾部 `/`（根除外）。
 */
export function normalizePath(input: string): string {
  if (!input) return "/";
  let p = input.split("#")[0]!.split("?")[0]!;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return p || "/";
}

/** 是否外链（http/https），侧栏不当作站内路由处理。 */
export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function normalizedHrefMatchesPath(
  normPath: string,
  normHref: string,
): boolean {
  if (normHref === "/") return normPath === "/";
  return normPath === normHref || normPath.startsWith(`${normHref}/`);
}

/** 菜单项是否带子级（可展开的分支，而非带 `href` 的叶子）。 */
export function itemHasChildren(
  item: SidebarMenuItemNode,
): item is SidebarSubmenu {
  return (
    "children" in item && item.children != null && item.children.length > 0
  );
}

/**
 * 在 sidebar 配置中找到与 pathname 最匹配（前缀最长）的叶子 href，并返回其规范化形式。
 */
export function getActiveLeafNormForConfig(
  config: SidebarMenuConfig,
  pathname: string,
): string | undefined {
  const normPath = normalizePath(pathname);
  let bestDepth = -1;
  let bestNorm: string | undefined;

  const visit = (items: readonly SidebarMenuItemNode[]) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      if (itemHasChildren(item)) {
        visit(item.children);
        continue;
      }
      const href = "href" in item ? item.href : undefined;
      if (!href || isExternalHref(href)) continue;
      const normHref = normalizePath(href);
      if (!normalizedHrefMatchesPath(normPath, normHref)) continue;
      if (normHref.length > bestDepth) {
        bestDepth = normHref.length;
        bestNorm = normHref;
      }
    }
  };

  for (const node of config.items) {
    if (node.type === "group") visit(node.menu);
  }
  return bestNorm;
}

/**
 * 在指定 sidebar 配置中按 **目标 normHref** 找到对应的 `SidebarNavItem` 叶子。
 */
export function findActiveSidebarNavItem(
  config: SidebarMenuConfig,
  targetLeafNorm: string | undefined,
): SidebarNavItem | undefined {
  if (!targetLeafNorm) return undefined;

  let found: SidebarNavItem | undefined;

  const visit = (items: readonly SidebarMenuItemNode[]) => {
    for (const item of items) {
      if (found) return;
      if (itemHasChildren(item)) {
        visit(item.children);
        continue;
      }
      const href = "href" in item ? item.href : undefined;
      if (!href || isExternalHref(href)) continue;
      if (normalizePath(href) !== targetLeafNorm) continue;
      found = item as SidebarNavItem;
      return;
    }
  };

  for (const node of config.items) {
    if (found) break;
    if (node.type === "group") visit(node.menu);
  }
  return found;
}

/**
 * 跨所有 rail 的 sidebar 全局裁决「唯一 active 叶子」。
 */
export function findGlobalActiveLeafNorm(
  menu: MenuConfig,
  pathname: string,
): string | undefined {
  let best: string | undefined;
  let bestLen = -1;
  for (const e of menu.rail.flatMap((b) => b.items)) {
    const norm = getActiveLeafNormForConfig(e.sidebar, pathname);
    if (norm == null) continue;
    if (norm.length > bestLen) {
      bestLen = norm.length;
      best = norm;
    }
  }
  return best;
}

/**
 * 在 `MenuConfig.rail` 各 `RailMenuItem` 中挑出与 pathname 最匹配的一项。
 */
export function findBestRailMenuForPathname(
  menu: MenuConfig,
  pathname: string,
): RailMenuItem | undefined {
  const railItems = menu.rail.flatMap((b) => b.items);
  let best: RailMenuItem | undefined;
  let bestLen = -1;
  for (const e of railItems) {
    const norm = getActiveLeafNormForConfig(e.sidebar, pathname);
    const len = norm?.length ?? -1;
    if (len > bestLen) {
      bestLen = len;
      best = e;
    }
  }
  return bestLen >= 0 ? best : undefined;
}
