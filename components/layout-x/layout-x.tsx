"use client";

import {
  createContext,
  useContext,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import { RouteBreadcrumbs } from "./route-breadcrumbs";
import { MenuTree } from "./menu-tree";
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
  children,
}: LayoutXProps) {
  const router = useRouter();
  const value = useMemo(
    () => ({ headerHeight, railWidth }),
    [headerHeight, railWidth],
  );

  return (
    <LayoutXContext.Provider value={value}>
      <Sidebar.Provider navigate={router.push}>
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
    <div
      className={cn("shrink-0", className)}
      data-slot="layout-x-rail-footer"
    >
      {children}
    </div>
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
 * 侧栏可滚动内容区，映射到 `Sidebar.Content`。
 *
 * - 传入 `content` 时，内部自动渲染配置化菜单树（`isCurrent` 由 `usePathname` 自动派生）。
 * - `children` 与 `content` 可并存，先渲染 `content`，后渲染 `children`。
 */
export function LayoutXSidebarMain({
  className,
  content,
  children,
}: LayoutXSidebarMainProps) {
  const pathname = usePathname();
  return (
    <Sidebar.Content className={className}>
      {content && <MenuTree config={content} pathname={pathname} />}
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
          "m-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-700/60 dark:bg-zinc-900",
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
          <RouteBreadcrumbs className="min-w-0 shrink" route={breadcrumbRoute} />
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
