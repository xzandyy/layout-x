import type {
  RouteConfig,
  SidebarContentConfig,
  SidebarMenuItemNode,
} from "./types";

function normalizePath(input: string): string {
  if (!input) return "/";
  let p = input.split("#")[0]!.split("?")[0]!;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return p || "/";
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function normalizedHrefMatchesPath(
  normPath: string,
  normHref: string,
): boolean {
  if (normHref === "/") return normPath === "/";
  return normPath === normHref || normPath.startsWith(`${normHref}/`);
}

function itemHasChildren(
  item: SidebarMenuItemNode,
): item is SidebarMenuItemNode & { children: SidebarMenuItemNode[] } {
  return (
    "children" in item && item.children != null && item.children.length > 0
  );
}

/**
 * Same as `resolveActiveRoute` in `menu-tree`: best-matching leaf href for pathname; or `undefined`.
 */
export function getActiveLeafNormForConfig(
  config: SidebarContentConfig,
  pathname: string,
): string | undefined {
  const normPath = normalizePath(pathname);
  let bestDepth = -1;
  let bestNorm: string | undefined;

  const visit = (items: readonly SidebarMenuItemNode[], groupIndex: number) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const isBranch = itemHasChildren(item);

      if (isBranch) {
        visit(item.children, groupIndex);
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

  for (let gi = 0; gi < config.nodes.length; gi++) {
    const node = config.nodes[gi]!;
    if (node.type === "group") visit(node.menu, gi);
  }

  return bestNorm;
}

/**
 * Pick the one `RouteConfig.entries` item whose `sidebar` has the most specific matching leaf
 * (longest normalized href). If none match, `undefined`.
 */
export function findBestEntryIdForPathname(
  route: RouteConfig,
  pathname: string,
): string | undefined {
  let bestId: string | undefined;
  let bestLen = -1;
  for (const e of route.entries) {
    const norm = getActiveLeafNormForConfig(e.sidebar, pathname);
    const len = norm?.length ?? -1;
    if (len > bestLen) {
      bestLen = len;
      bestId = e.id;
    }
  }
  return bestLen >= 0 ? bestId : undefined;
}
