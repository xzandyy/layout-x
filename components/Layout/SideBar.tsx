"use client";

import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { Key } from "react-aria-components";
import { usePathname } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "./root";
import type {
  RouteConfig,
  SidebarContentConfig,
  SidebarGroupNode,
  SidebarMenuItemNode,
  SidebarNode,
  TooltipConfig,
} from "./types";

export type SidebarProps = {
  className?: string;
  children?: ReactNode;
};

export function Sidebar({ className, children }: SidebarProps) {
  const { sidebarWidth } = useLayoutContext();
  const sidebarVars = useMemo(
    () =>
      ({
        "--sidebar-width": `${sidebarWidth}rem`,
      }) as CSSProperties,
    [sidebarWidth],
  );
  return (
    <HeroSidebar
      className={cn("bg-canvas border-none shadow-none pr-2", className)}
      style={sidebarVars}
    >
      {children}
    </HeroSidebar>
  );
}

export type SidebarHeaderProps = {
  className?: string;
  children?: ReactNode;
};

export function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return (
    <HeroSidebar.Header className={cn("p-0", className)}>
      {children}
    </HeroSidebar.Header>
  );
}

export type SidebarFooterProps = {
  className?: string;
  children?: ReactNode;
};

export function SidebarFooter({ className, children }: SidebarFooterProps) {
  return (
    <HeroSidebar.Footer className={cn("p-0", className)}>
      {children}
    </HeroSidebar.Footer>
  );
}

export type SidebarMainProps = {
  className?: string;
  children?: ReactNode;
};

export function SidebarMain({ className, children }: SidebarMainProps) {
  const pathname = usePathname();
  const { activeEntry } = useLayoutContext();
  const sidebar = activeEntry?.sidebar;
  return (
    <HeroSidebar.Content className={cn("p-0", className)}>
      {sidebar && <MenuTree config={sidebar} pathname={pathname} />}
      {children}
    </HeroSidebar.Content>
  );
}

// -- MenuTree -- //

interface ActiveRoute {
  activeLeafNorm?: string;
  branchIds: string[];
}

interface DismissedState {
  forPath: string;
  keys: ReadonlySet<string>;
}

const EMPTY_SET: ReadonlySet<string> = new Set<string>();
const EMPTY_DISMISSED: DismissedState = { forPath: "", keys: EMPTY_SET };

function MenuTree({
  config,
  pathname,
}: {
  config: SidebarContentConfig;
  pathname: string;
}) {
  const activeRoute = useMemo(
    () => resolveActiveRoute(config, pathname),
    [config, pathname],
  );

  const { getExpandedForGroup, handleExpandedChange } = useMenuExpansion({
    pathname,
    requiredBranchIds: activeRoute.branchIds,
  });

  return (
    <>
      {config.nodes.map((node, i) => (
        <MenuNode
          key={i}
          node={node}
          groupIndex={i}
          activeRoute={activeRoute}
          expandedKeys={getExpandedForGroup(i)}
          onExpandedChange={(keys) => handleExpandedChange(i, keys)}
        />
      ))}
    </>
  );
}

function MenuNode({
  node,
  ...rest
}: {
  node: SidebarNode;
  groupIndex: number;
  activeRoute: ActiveRoute;
  expandedKeys: Set<string>;
  onExpandedChange: (keys: Set<Key> | "all") => void;
}) {
  if (node.type === "separator") return <HeroSidebar.Separator />;
  return <GroupNode node={node} {...rest} />;
}

function GroupNode({
  node,
  groupIndex,
  activeRoute,
  expandedKeys,
  onExpandedChange,
}: {
  node: SidebarGroupNode;
  groupIndex: number;
  activeRoute: ActiveRoute;
  expandedKeys: Set<string>;
  onExpandedChange: (keys: Set<Key> | "all") => void;
}) {
  return (
    <HeroSidebar.Group>
      {node.label && (
        <HeroSidebar.GroupLabel className="text-fg-4 text-xs font-mono tracking-wide">
          {node.label}
        </HeroSidebar.GroupLabel>
      )}
      <HeroSidebar.Menu
        aria-label={ariaLabelForSidebarMenu(node, groupIndex)}
        expandedKeys={expandedKeys}
        onExpandedChange={onExpandedChange}
      >
        {node.menu.map((item, i) => (
          <MenuItem
            key={i}
            item={item}
            groupIndex={groupIndex}
            itemPath={[i]}
            activeLeafNorm={activeRoute.activeLeafNorm}
          />
        ))}
      </HeroSidebar.Menu>
    </HeroSidebar.Group>
  );
}

function MenuItem({
  item,
  groupIndex,
  itemPath,
  activeLeafNorm,
}: {
  item: SidebarMenuItemNode;
  groupIndex: number;
  itemPath: number[];
  activeLeafNorm: string | undefined;
}) {
  const { icon, label, chip, actions, tooltip, onPress } = item;
  const children = "children" in item ? item.children : undefined;
  const hasSubmenu = Boolean(children && children.length > 0);
  const href = hasSubmenu ? undefined : "href" in item ? item.href : undefined;
  const isCurrent = Boolean(
    href && activeLeafNorm && normalizePath(href) === activeLeafNorm,
  );

  return (
    <HeroSidebar.MenuItem
      id={getItemId(groupIndex, itemPath)}
      href={href}
      isCurrent={isCurrent}
      onAction={onPress}
      tooltipProps={tooltip ? toTooltipProps(tooltip) : undefined}
    >
      <HeroSidebar.MenuItemContent
        className={cn(
          "flex items-center gap-2 min-h-8 my-px",
          "px-2.5 py-1 rounded-md",
          "transition-all duration-150",
          isCurrent
            ? "bg-surface text-fg-1"
            : "bg-transparent text-fg-3 hover:bg-canvas-2 hover:text-fg-1",
        )}
      >
        {icon && <HeroSidebar.MenuIcon>{icon}</HeroSidebar.MenuIcon>}
        <HeroSidebar.MenuLabel className="text-[0.8rem]">
          {label}
        </HeroSidebar.MenuLabel>
        {chip && <HeroSidebar.MenuChip>{chip}</HeroSidebar.MenuChip>}
        {actions && <HeroSidebar.MenuActions>{actions}</HeroSidebar.MenuActions>}
        {hasSubmenu && (
          <HeroSidebar.MenuTrigger>
            <HeroSidebar.MenuIndicator />
          </HeroSidebar.MenuTrigger>
        )}
      </HeroSidebar.MenuItemContent>

      {hasSubmenu && children != null && (
        <HeroSidebar.Submenu>
          {children.map((child, i) => (
            <MenuItem
              key={i}
              item={child}
              groupIndex={groupIndex}
              itemPath={[...itemPath, i]}
              activeLeafNorm={activeLeafNorm}
            />
          ))}
        </HeroSidebar.Submenu>
      )}
    </HeroSidebar.MenuItem>
  );
}

function ariaLabelForSidebarMenu(
  node: SidebarGroupNode,
  groupIndex: number,
): string {
  const { label } = node;
  if (typeof label === "string" && label.trim() !== "") {
    return `${label} menu`;
  }
  return `Menu group ${groupIndex + 1}`;
}

function toTooltipProps(tooltip: TooltipConfig) {
  return {
    content: tooltip.content,
    className: tooltip.className,
    delay: tooltip.delay,
    closeDelay: tooltip.closeDelay,
    placement: tooltip.placement ?? "right",
  } as const;
}

function getGroupIdPrefix(groupIndex: number): string {
  return `g${groupIndex}:`;
}

function getItemId(groupIndex: number, itemPath: readonly number[]): string {
  return `${getGroupIdPrefix(groupIndex)}${itemPath.join(".")}`;
}

function resolveActiveRoute(
  config: SidebarContentConfig,
  pathname: string,
): ActiveRoute {
  const normPath = normalizePath(pathname);
  let bestDepth = -1;
  let result: ActiveRoute = { branchIds: [] };

  const visit = (
    items: readonly SidebarMenuItemNode[],
    groupIndex: number,
    pathSoFar: readonly number[],
    branchIdsSoFar: readonly string[],
  ) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const itemPath = [...pathSoFar, i];
      const itemId = getItemId(groupIndex, itemPath);
      const isBranch = itemHasChildren(item);

      if (isBranch) {
        visit(item.children, groupIndex, itemPath, [...branchIdsSoFar, itemId]);
        continue;
      }

      const href = "href" in item ? item.href : undefined;
      if (!href || isExternalHref(href)) continue;

      const normHref = normalizePath(href);
      if (!normalizedHrefMatchesPath(normPath, normHref)) continue;

      if (normHref.length > bestDepth) {
        bestDepth = normHref.length;
        result = {
          activeLeafNorm: normHref,
          branchIds: [...branchIdsSoFar],
        };
      }
    }
  };

  for (let gi = 0; gi < config.nodes.length; gi++) {
    const node = config.nodes[gi]!;
    if (node.type === "group") visit(node.menu, gi, [], []);
  }

  return result;
}

function useMenuExpansion({
  pathname,
  requiredBranchIds,
}: {
  pathname: string;
  requiredBranchIds: readonly string[];
}) {
  const [userExpanded, setUserExpanded] =
    useState<ReadonlySet<string>>(EMPTY_SET);
  const [dismissed, setDismissed] = useState<DismissedState>(EMPTY_DISMISSED);

  const activeDismissed =
    dismissed.forPath === pathname ? dismissed.keys : EMPTY_SET;

  const mergedExpanded = useMemo(() => {
    const out = new Set(userExpanded);
    for (const id of requiredBranchIds) {
      if (!activeDismissed.has(id)) out.add(id);
    }
    return out;
  }, [userExpanded, requiredBranchIds, activeDismissed]);

  const getExpandedForGroup = useCallback(
    (groupIndex: number): Set<string> => {
      const prefix = getGroupIdPrefix(groupIndex);
      return filterByPrefix(mergedExpanded, prefix);
    },
    [mergedExpanded],
  );

  const handleExpandedChange = useCallback(
    (groupIndex: number, nextKeys: Set<Key> | "all") => {
      if (nextKeys === "all") return;

      const prefix = getGroupIdPrefix(groupIndex);
      const nextGroupKeys = toStringSet(nextKeys);

      setUserExpanded((prev) => replaceGroup(prev, prefix, nextGroupKeys));
      setDismissed((prev) =>
        computeDismissed(prev, {
          pathname,
          prefix,
          nextGroupKeys,
          requiredBranchIds,
        }),
      );
    },
    [pathname, requiredBranchIds],
  );

  return { getExpandedForGroup, handleExpandedChange };
}

function toStringSet(input: Iterable<Key>): Set<string> {
  const out = new Set<string>();
  for (const k of input) out.add(String(k));
  return out;
}

function filterByPrefix(
  source: ReadonlySet<string>,
  prefix: string,
): Set<string> {
  const out = new Set<string>();
  for (const k of source) {
    if (k.startsWith(prefix)) out.add(k);
  }
  return out;
}

function replaceGroup(
  source: ReadonlySet<string>,
  prefix: string,
  nextGroupKeys: ReadonlySet<string>,
): Set<string> {
  const out = new Set<string>();
  for (const k of source) {
    if (!k.startsWith(prefix)) out.add(k);
  }
  for (const k of nextGroupKeys) out.add(k);
  return out;
}

function computeDismissed(
  prev: DismissedState,
  args: {
    pathname: string;
    prefix: string;
    nextGroupKeys: ReadonlySet<string>;
    requiredBranchIds: readonly string[];
  },
): DismissedState {
  const { pathname, prefix, nextGroupKeys, requiredBranchIds } = args;
  const base = prev.forPath === pathname ? prev.keys : EMPTY_SET;
  const next = new Set(base);
  for (const id of requiredBranchIds) {
    if (!id.startsWith(prefix)) continue;
    if (nextGroupKeys.has(id)) next.delete(id);
    else next.add(id);
  }
  return { forPath: pathname, keys: next };
}

/**
 * 规范化 URL 路径：去 hash/query、合并多余斜杠、补前导 `/`、去尾部 `/`（根除外）。
 */
function normalizePath(input: string): string {
  if (!input) return "/";
  let p = input.split("#")[0]!.split("?")[0]!;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return p || "/";
}

/**
 * 是否外链（http/https），侧栏不当作站内路由处理。
 */
function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/**
 * 在已规范化的路径下，判断当前 path 是否落在某 href 对应路由上（或为其子路径）。
 */
function normalizedHrefMatchesPath(
  normPath: string,
  normHref: string,
): boolean {
  if (normHref === "/") return normPath === "/";
  return normPath === normHref || normPath.startsWith(`${normHref}/`);
}

/**
 * 菜单项是否带子级（可展开的分支，而非带 `href` 的叶子）。
 */
function itemHasChildren(
  item: SidebarMenuItemNode,
): item is SidebarMenuItemNode & { children: SidebarMenuItemNode[] } {
  return (
    "children" in item && item.children != null && item.children.length > 0
  );
}

/**
 * Same as `resolveActiveRoute` below: best-matching leaf href for pathname; or `undefined`.
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
