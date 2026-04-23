import type { ReactNode } from "react";

import type { Router } from "@/config/routes";
import { cn } from "@/lib/utils";

import { RouteBreadcrumbs } from "./route-breadcrumbs";

export type WorkspaceLayoutProps = {
  className?: string;
  /** 左侧最窄栏宽度，数值单位为 `rem` */
  railWidth?: number;
  /** 主侧栏宽度，数值单位为 `rem` */
  sidebarPrimaryWidth?: number;
  /** 次级侧栏宽度，数值单位为 `rem` */
  sidebarSecondaryWidth?: number;
  /** 与当前 `pathname` 匹配的路由树，用于顶栏左侧面包屑；不传则不留面包屑位 */
  breadcrumbRoute?: Router;
  rail?: ReactNode;
  sidebarPrimary?: ReactNode;
  /**
   * 顶栏在面包屑（若有）**右侧**的附加内容，如操作按钮、搜索框。
   * 与 `breadcrumbRoute` 共同组成顶栏行。
   */
  header?: ReactNode;
  /** 顶栏高度（`min-height`），数值单位为 `rem` */
  headerHeight?: number;
  sidebarSecondary?: ReactNode;
  main?: ReactNode;
};

/**
 * 从左到右：rail → sidebar-primary →（上方 header，下方 secondary | main）。
 * 前三个侧栏为 aside，宽度可通过 props 指定；main 占满剩余空间。
 * 顶栏内左侧为按当前路径匹配的面包屑（`breadcrumbRoute`），右侧为 `header`。
 */
export function WorkspaceLayout({
  className,
  headerHeight = 3.5,
  railWidth = 3,
  sidebarPrimaryWidth = 16,
  sidebarSecondaryWidth = 20,
  breadcrumbRoute,
  header,
  rail,
  sidebarPrimary,
  sidebarSecondary,
  main,
}: WorkspaceLayoutProps) {
  return (
    <div
      className={cn(
        "box-border flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row items-stretch overflow-hidden",
        "bg-zinc-100 dark:bg-zinc-950",
        className,
      )}
    >
      <aside
        aria-label="Rail"
        className="shrink-0 border-r border-black/10 dark:border-white/10"
        style={{ width: `${railWidth}rem` }}
      >
        {rail}
      </aside>
      <aside
        aria-label="Primary sidebar"
        className="shrink-0 border-r border-black/10 dark:border-white/10"
        style={{ width: `${sidebarPrimaryWidth}rem` }}
      >
        {sidebarPrimary}
      </aside>
      <div
        className="m-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-700/60 dark:bg-zinc-900"
      >
        <header
          className="flex shrink-0 items-center border-b border-black/10 px-4 dark:border-white/10"
          style={{ minHeight: `${headerHeight}rem` }}
        >
          <div className="flex w-full min-w-0 items-center gap-3">
            {breadcrumbRoute ? (
              <RouteBreadcrumbs
                className="min-w-0 shrink"
                route={breadcrumbRoute}
              />
            ) : null}
            {header != null ? (
              <div
                className={cn(
                  "min-w-0",
                  breadcrumbRoute != null
                    ? "ml-auto flex min-w-0 items-center justify-end gap-2"
                    : "flex w-full",
                )}
              >
                {header}
              </div>
            ) : null}
          </div>
        </header>
        <div className="flex min-h-0 min-w-0 flex-1 flex-row">
          <aside
            aria-label="Secondary sidebar"
            className="shrink-0 border-r border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-950"
            style={{ width: `${sidebarSecondaryWidth}rem` }}
          >
            {sidebarSecondary}
          </aside>
          <main aria-label="Main content" className="min-h-0 min-w-0 flex-1">
            {main}
          </main>
        </div>
      </div>
    </div>
  );
}
