"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import { RouteBreadcrumbs } from "./route-breadcrumbs";
import { MenuTree } from "./menu-tree";
import { findBestEntryIdForPathname } from "./sidebar-routing";
import type {
  LayoutXContextValue,
  LayoutXContentHeaderProps,
  LayoutXProps,
  LayoutXRegionProps,
  LayoutXSidebarMainProps,
} from "./types";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LayoutXContext = createContext<LayoutXContextValue | null>(null);

function useLayoutXContext(): LayoutXContextValue {
  const ctx = useContext(LayoutXContext);
  if (ctx == null) {
    throw new Error(
      "LayoutX 子组件（Rail、SidebarHeader、ContentHeader 等）必须放在 <LayoutX> 内使用。",
    );
  }
  return ctx;
}

/** 读取 `LayoutX` 提供的 route / 当前激活 entry（须在 `<LayoutX>` 内使用）。 */
export function useLayoutX() {
  return useLayoutXContext();
}

// ---------------------------------------------------------------------------
// Root — Sidebar.Provider + flex 外壳
// ---------------------------------------------------------------------------

/**
 * 工作区根容器，同时挂载 Pro `Sidebar.Provider`（navigate 由内部 useRouter 注入）。
 * 子级按顺序放：`LayoutX.Rail`、`LayoutX.Sidebar`、`LayoutX.Content`。
 */
export function LayoutXRoot({
  headerHeight = 3.5,
  railWidth = 4,
  className,
  route,
  children,
}: LayoutXProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  /** 用户点 Rail 时的临时选择；`forPathname` 与当前 URL 一致时才生效，换路由后自动回退为 URL 推断。 */
  const [railOverride, setRailOverride] = useState<{
    entryId: string;
    forPathname: string;
  } | null>(null);

  const urlEntryId = useMemo(
    () => (route ? findBestEntryIdForPathname(route, pathname) : undefined),
    [route, pathname],
  );

  const fallbackId = useMemo(() => {
    if (!route?.entries.length) return undefined;
    return route.defaultEntryId ?? route.entries[0]!.id;
  }, [route]);

  const activeEntryId = useMemo(() => {
    if (!route) return undefined;
    if (
      railOverride != null &&
      railOverride.forPathname === pathname
    ) {
      return railOverride.entryId;
    }
    return urlEntryId ?? fallbackId;
  }, [route, railOverride, pathname, urlEntryId, fallbackId]);

  const activeEntry = useMemo(() => {
    if (!route || activeEntryId == null) return undefined;
    return route.entries.find((e) => e.id === activeEntryId);
  }, [route, activeEntryId]);

  const setActiveEntryId = useCallback(
    (id: string) => {
      if (!route) return;
      setRailOverride({ entryId: id, forPathname: pathname });
    },
    [route, pathname],
  );

  const value = useMemo<LayoutXContextValue>(
    () => ({
      headerHeight,
      railWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    }),
    [
      headerHeight,
      railWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    ],
  );

  return (
    <LayoutXContext.Provider value={value}>
      <Sidebar.Provider navigate={router.push} variant="inset">
        <div
          className={cn(
            "box-border flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row items-stretch overflow-hidden",
            "bg-gray-100 dark:bg-zinc-950",
            className,
          )}
        >
          {children}
        </div>
      </Sidebar.Provider>
    </LayoutXContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Rail（最左窄栏，手写 aside，与 Pro Sidebar 并列）
// ---------------------------------------------------------------------------

export function LayoutXRail({ className, children }: LayoutXRegionProps) {
  const { railWidth } = useLayoutXContext();
  return (
    <aside
      aria-label="Rail"
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col",
        "shrink-0 self-stretch border-r border-black/10 dark:border-white/10",
        className,
      )}
      style={{ width: `${railWidth}rem` }}
    >
      {children}
    </aside>
  );
}

export function LayoutXRailHeader({ className, children }: LayoutXRegionProps) {
  return (
    <div className={cn("shrink-0", className)} data-slot="layout-x-rail-header">
      {children}
    </div>
  );
}

export function LayoutXRailMain({ className, children }: LayoutXRegionProps) {
  return (
    <div
      className={cn(
        "min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      data-slot="layout-x-rail-main"
    >
      {children}
    </div>
  );
}

export function LayoutXRailFooter({ className, children }: LayoutXRegionProps) {
  return (
    <div className={cn("shrink-0", className)} data-slot="layout-x-rail-footer">
      {children}
    </div>
  );
}

/**
 * 根据 `route.entries` 渲染 Rail 入口按钮，点击切换当前侧栏 `sidebar`。
 * 无 `route` 时不渲染。须放在 `LayoutX` 子树中。
 */
export function LayoutXRailRouteNav({ className }: LayoutXRegionProps) {
  const { route, activeEntryId, setActiveEntryId } = useLayoutXContext();
  if (!route?.entries.length) return null;
  return (
    <nav
      className={cn(
        "flex flex-col items-center gap-1 p-1",
        className,
      )}
      aria-label="工作区入口"
    >
      {route.entries.map((e) => {
        const isActive = e.id === activeEntryId;
        return (
          <button
            key={e.id}
            type="button"
            aria-pressed={isActive}
            aria-label={typeof e.label === "string" ? e.label : e.id}
            title={typeof e.label === "string" ? e.label : e.id}
            onClick={() => setActiveEntryId(e.id)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-foreground/80",
              "outline-none transition-colors hover:bg-foreground/10",
              "focus-visible:ring-2 focus-visible:ring-foreground/25",
              isActive && "bg-foreground/12 text-foreground",
            )}
          >
            {e.icon}
          </button>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Sidebar（Pro Sidebar aside，置于 Rail 右侧）
// ---------------------------------------------------------------------------

/**
 * 侧栏外壳，内部直接渲染 Pro `<Sidebar>`。
 * 子级可放 `LayoutX.SidebarHeader`、`LayoutX.SidebarMain`、`LayoutX.SidebarFooter`。
 */
export function LayoutXSidebar({ className, children }: LayoutXRegionProps) {
  return <Sidebar className={className}>{children}</Sidebar>;
}

/**
 * 侧栏顶部槽，映射到 `Sidebar.Header`。
 */
export function LayoutXSidebarHeader({
  className,
  children,
}: LayoutXRegionProps) {
  return <Sidebar.Header className={className}>{children}</Sidebar.Header>;
}

/**
 * 显示当前 `route` 激活项的图标 + `label`；无 `activeEntry` 时显示「导航」。
 */
export function LayoutXSidebarEntryHeading({ className }: LayoutXRegionProps) {
  const { activeEntry } = useLayoutXContext();
  if (!activeEntry) {
    return (
      <div
        className={cn(
          "border-b border-black/10 px-3 py-2.5 text-sm font-medium text-foreground dark:border-white/10",
          className,
        )}
      >
        导航
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex min-h-10 items-center gap-2 border-b border-black/10 px-3 py-2.5 text-sm font-medium text-foreground dark:border-white/10",
        className,
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-foreground/90 [&>svg]:size-4">
        {activeEntry.icon}
      </span>
      <span className="min-w-0 truncate">{activeEntry.label}</span>
    </div>
  );
}

/**
 * 侧栏可滚动内容区，映射到 `Sidebar.Content`。
 * 菜单树来自 `LayoutX` 根上 `route` 与当前 `activeEntry.sidebar`；`isCurrent` 等由 `usePathname` 派生。
 */
export function LayoutXSidebarMain({
  className,
  children,
}: LayoutXSidebarMainProps) {
  const pathname = usePathname();
  const { activeEntry } = useLayoutXContext();
  const sidebar = activeEntry?.sidebar;
  return (
    <Sidebar.Content
      aria-label="侧栏导航"
      className={className}
    >
      {sidebar && <MenuTree config={sidebar} pathname={pathname} />}
      {children}
    </Sidebar.Content>
  );
}

/**
 * 侧栏底部槽，映射到 `Sidebar.Footer`。
 */
export function LayoutXSidebarFooter({
  className,
  children,
}: LayoutXRegionProps) {
  return <Sidebar.Footer className={className}>{children}</Sidebar.Footer>;
}

// ---------------------------------------------------------------------------
// Content（Pro Sidebar.Main — 主内容区，对外名称 Content，不叫 Panel 或 Main）
// ---------------------------------------------------------------------------

/**
 * 主内容区外壳，映射到 Pro `Sidebar.Main`（`<main>` 标签）。
 * 内部保留原 Panel 的卡片外观（`m-2 rounded-xl border bg-white …`）。
 * 子级可放 `LayoutX.ContentHeader` + `LayoutX.ContentBody`。
 */
export function LayoutXContent({ className, children }: LayoutXRegionProps) {
  return (
    <Sidebar.Main>
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900",
          className,
        )}
      >
        {children}
      </div>
    </Sidebar.Main>
  );
}

/**
 * 主内容区顶栏，渲染面包屑（`breadcrumbRoute`）与右侧操作区（`end`）。
 * 顶栏：面包屑 + 右侧区域（与旧版 PanelHeader 视觉一致）。
 */
export function LayoutXContentHeader({
  className,
  breadcrumbRoute,
  end,
}: LayoutXContentHeaderProps) {
  const { headerHeight } = useLayoutXContext();
  return (
    <header
      className={cn(
        "flex shrink-0 items-center border-b border-black/10 px-4 dark:border-white/10",
        className,
      )}
      style={{ minHeight: `${headerHeight}rem` }}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {breadcrumbRoute != null ? (
          <RouteBreadcrumbs
            className="min-w-0 shrink"
            route={breadcrumbRoute}
          />
        ) : null}
        {end != null ? (
          <div
            className={cn(
              "min-w-0",
              breadcrumbRoute != null
                ? "ml-auto flex min-w-0 items-center justify-end gap-2"
                : "flex w-full",
            )}
          >
            {end}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * 主内容区可滚动主体，放于 `LayoutX.ContentHeader` 之下。
 * 主内容可滚区。
 */
export function LayoutXContentBody({
  className,
  children,
}: LayoutXRegionProps) {
  return (
    <main
      aria-label="Main content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}
    >
      {children}
    </main>
  );
}
