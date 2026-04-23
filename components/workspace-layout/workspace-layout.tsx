"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { Router } from "@/config/routes";
import { cn } from "@/lib/utils";

import { RouteBreadcrumbs } from "./route-breadcrumbs";

// --- Context: 尺寸在根上配置，子区域继承 ----------------------------------------

export type WorkspaceLayoutContextValue = {
  headerHeight: number;
  railWidth: number;
  sidebarPrimaryWidth: number;
};

const WorkspaceLayoutContext =
  createContext<WorkspaceLayoutContextValue | null>(null);

function useWorkspaceLayoutContext(): WorkspaceLayoutContextValue {
  const ctx = useContext(WorkspaceLayoutContext);
  if (ctx == null) {
    throw new Error(
      "WorkspaceLayout 子组件（Rail、Sidebar、Panel 等）必须放在 <WorkspaceLayout> 内使用。",
    );
  }
  return ctx;
}

// --- 根：外壳 + Provider -------------------------------------------------------

export type WorkspaceLayoutProps = {
  className?: string;
  /** 顶栏高度，数值单位为 `rem` */
  headerHeight?: number;
  /** 最窄左栏（Rail）宽度，数值单位为 `rem` */
  railWidth?: number;
  /** 主侧栏宽度，数值单位为 `rem` */
  sidebarPrimaryWidth?: number;
  children: ReactNode;
};

/**
 * 工作区根容器；内部使用 `WorkspaceLayout.Rail` / `Sidebar` / `Panel` + `PanelHeader` / `PanelMain` 等组合。
 * 可放在 `app/layout` 或任意子目录 `layout` 中，由路由决定由谁包裹。
 * 在 `index.ts` 中组装为 `WorkspaceLayout` 并导出，避免经 barrel 重导出时子组件引用丢失。
 */
export function WorkspaceLayoutRoot({
  className,
  headerHeight = 3.5,
  railWidth = 4,
  sidebarPrimaryWidth = 16,
  children,
}: WorkspaceLayoutProps) {
  const value = useMemo(
    () => ({
      headerHeight,
      railWidth,
      sidebarPrimaryWidth,
    }),
    [headerHeight, railWidth, sidebarPrimaryWidth],
  );

  return (
    <WorkspaceLayoutContext.Provider value={value}>
      <div
        className={cn(
          "box-border flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row items-stretch overflow-hidden",
          "bg-gray-100 dark:bg-zinc-950",
          className,
        )}
      >
        {children}
      </div>
    </WorkspaceLayoutContext.Provider>
  );
}

// --- 子区域 ------------------------------------------------------------------

export type WorkspaceLayoutRegionProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * 最左窄栏外壳；子区域用 `WorkspaceLayout.RailHeader`、`.RailMain`、`.RailFooter`（中间 `RailMain` 可滚动）。
 */
export function WorkspaceLayoutRail({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  const { railWidth } = useWorkspaceLayoutContext();
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

export function WorkspaceLayoutRailHeader({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      data-slot="workspace-rail-header"
    >
      {children}
    </div>
  );
}

export function WorkspaceLayoutRailMain({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn(
        "min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      data-slot="workspace-rail-main"
    >
      {children}
    </div>
  );
}

export function WorkspaceLayoutRailFooter({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      data-slot="workspace-rail-footer"
    >
      {children}
    </div>
  );
}

/**
 * 主侧栏外壳；子区域用 `WorkspaceLayout.SidebarHeader`、`.SidebarMain`、`.SidebarFooter`（中间 `SidebarMain` 可滚动）。
 */
export function WorkspaceLayoutSidebar({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  const { sidebarPrimaryWidth } = useWorkspaceLayoutContext();
  return (
    <aside
      aria-label="Primary sidebar"
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col",
        "shrink-0 self-stretch border-r border-black/10 dark:border-white/10",
        className,
      )}
      style={{ width: `${sidebarPrimaryWidth}rem` }}
    >
      {children}
    </aside>
  );
}

export function WorkspaceLayoutSidebarHeader({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      data-slot="workspace-sidebar-header"
    >
      {children}
    </div>
  );
}

export function WorkspaceLayoutSidebarMain({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn(
        "min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      data-slot="workspace-sidebar-main"
    >
      {children}
    </div>
  );
}

export function WorkspaceLayoutSidebarFooter({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      data-slot="workspace-sidebar-footer"
    >
      {children}
    </div>
  );
}

export function WorkspaceLayoutPanel({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn(
        "m-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-700/60 dark:bg-zinc-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type WorkspaceLayoutPanelHeaderProps = {
  className?: string;
  /**
   * 与当前路径匹配的路由树，顶栏左侧面包屑；不传则仅渲染 `end`（若有）。
   */
  breadcrumbRoute?: Router;
  /**
   * 顶栏**右侧**区域（与面包屑相对），如操作按钮、搜索框。
   */
  end?: ReactNode;
};

export function WorkspaceLayoutPanelHeader({
  className,
  breadcrumbRoute,
  end,
}: WorkspaceLayoutPanelHeaderProps) {
  const { headerHeight } = useWorkspaceLayoutContext();
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

/** 右侧面板主内容区，置于 `Panel` 内、通常位于 `PanelHeader` 下。 */
export function WorkspaceLayoutPanelMain({
  className,
  children,
}: WorkspaceLayoutRegionProps) {
  return (
    <main
      aria-label="Main content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}
    >
      {children}
    </main>
  );
}
