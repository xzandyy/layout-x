"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { Router } from "@/config/routes";
import { cn } from "@/lib/utils";

import { RouteBreadcrumbs } from "./route-breadcrumbs";

// --- Context: 尺寸在根上配置，子区域继承 ----------------------------------------

export type WorkspaceLayoutContextValue = {
  headerHeight: number;
  railWidth: number;
  sidebarPrimaryWidth: number;
  sidebarSecondaryWidth: number;
};

const WorkspaceLayoutContext = createContext<WorkspaceLayoutContextValue | null>(
  null,
);

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
  /** 第三栏（次侧栏）宽度，数值单位为 `rem` */
  sidebarSecondaryWidth?: number;
  children: ReactNode;
};

/**
 * 工作区根容器；内部使用 `WorkspaceLayout.Rail` / `Sidebar` / `Panel` 等组合。
 * 可放在 `app/layout` 或任意子目录 `layout` 中，由路由决定由谁包裹。
 */
function WorkspaceLayoutRoot({
  className,
  headerHeight = 3.5,
  railWidth = 3,
  sidebarPrimaryWidth = 16,
  sidebarSecondaryWidth = 20,
  children,
}: WorkspaceLayoutProps) {
  const value = useMemo(
    () => ({
      headerHeight,
      railWidth,
      sidebarPrimaryWidth,
      sidebarSecondaryWidth,
    }),
    [
      headerHeight,
      railWidth,
      sidebarPrimaryWidth,
      sidebarSecondaryWidth,
    ],
  );

  return (
    <WorkspaceLayoutContext.Provider value={value}>
      <div
        className={cn(
          "box-border flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row items-stretch overflow-hidden",
          "bg-zinc-100 dark:bg-zinc-950",
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

function Rail({ className, children }: WorkspaceLayoutRegionProps) {
  const { railWidth } = useWorkspaceLayoutContext();
  return (
    <aside
      aria-label="Rail"
      className={cn(
        "shrink-0 border-r border-black/10 dark:border-white/10",
        className,
      )}
      style={{ width: `${railWidth}rem` }}
    >
      {children}
    </aside>
  );
}

function Sidebar({ className, children }: WorkspaceLayoutRegionProps) {
  const { sidebarPrimaryWidth } = useWorkspaceLayoutContext();
  return (
    <aside
      aria-label="Primary sidebar"
      className={cn(
        "shrink-0 border-r border-black/10 dark:border-white/10",
        className,
      )}
      style={{ width: `${sidebarPrimaryWidth}rem` }}
    >
      {children}
    </aside>
  );
}

function Panel({ className, children }: WorkspaceLayoutRegionProps) {
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

export type WorkspaceLayoutHeaderProps = {
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

function Header({ className, breadcrumbRoute, end }: WorkspaceLayoutHeaderProps) {
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

function Body({ className, children }: WorkspaceLayoutRegionProps) {
  return (
    <div
      className={cn("flex min-h-0 min-w-0 flex-1 flex-row", className)}
    >
      {children}
    </div>
  );
}

function SidebarSecondary({ className, children }: WorkspaceLayoutRegionProps) {
  const { sidebarSecondaryWidth } = useWorkspaceLayoutContext();
  return (
    <aside
      aria-label="Secondary sidebar"
      className={cn(
        "shrink-0 border-r border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
      style={{ width: `${sidebarSecondaryWidth}rem` }}
    >
      {children}
    </aside>
  );
}

function Main({ className, children }: WorkspaceLayoutRegionProps) {
  return (
    <main
      aria-label="Main content"
      className={cn("min-h-0 min-w-0 flex-1", className)}
    >
      {children}
    </main>
  );
}

// --- 复合导出 ----------------------------------------------------------------

export const WorkspaceLayout = Object.assign(WorkspaceLayoutRoot, {
  Rail,
  Sidebar,
  Panel,
  Header,
  Body,
  SidebarSecondary,
  Main,
});
