"use client";

import { useCallback, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { Sidebar } from "@heroui-pro/react";
import { cn } from "@/lib/utils";

import type {
  SidebarContentConfig,
  SidebarGroupNode,
  SidebarMenuItemNode,
  SidebarNode,
  TooltipConfig,
} from "./types";

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

// -- MenuTree -- //

export function MenuTree({
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

// -- MenuNode -- //

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
  if (node.type === "separator") return <Sidebar.Separator />;
  return <GroupNode node={node} {...rest} />;
}

// -- GroupNode -- //

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
    <Sidebar.Group>
      {node.label && (
        <Sidebar.GroupLabel className="text-fg-4 text-xs font-mono tracking-wide">
          {node.label}
        </Sidebar.GroupLabel>
      )}
      <Sidebar.Menu
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
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}

// -- MenuItem -- //

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
    <Sidebar.MenuItem
      id={getItemId(groupIndex, itemPath)}
      href={href}
      isCurrent={isCurrent}
      onAction={onPress}
      tooltipProps={tooltip ? toTooltipProps(tooltip) : undefined}
    >
      <Sidebar.MenuItemContent
        className={cn(
          "flex items-center gap-2 min-h-8 my-px",
          "px-2.5 py-1 rounded-md",
          "transition-all duration-150",
          isCurrent
            ? "bg-surface text-fg-1"
            : "bg-transparent text-fg-3 hover:bg-canvas-2 hover:text-fg-1",
        )}
      >
        {icon && <Sidebar.MenuIcon>{icon}</Sidebar.MenuIcon>}
        <Sidebar.MenuLabel className="text-[0.8rem]">{label}</Sidebar.MenuLabel>
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
          {children.map((child, i) => (
            <MenuItem
              key={i}
              item={child}
              groupIndex={groupIndex}
              itemPath={[...itemPath, i]}
              activeLeafNorm={activeLeafNorm}
            />
          ))}
        </Sidebar.Submenu>
      )}
    </Sidebar.MenuItem>
  );
}

// -- Helper Functions -- //

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

function itemHasChildren(
  item: SidebarMenuItemNode,
): item is SidebarMenuItemNode & { children: SidebarMenuItemNode[] } {
  return (
    "children" in item && item.children != null && item.children.length > 0
  );
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
