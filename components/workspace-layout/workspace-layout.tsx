import type { ReactNode } from "react";

import type { Router } from "@/config/routes";
import { cn } from "@/lib/utils";

import { RouteBreadcrumbs } from "./route-breadcrumbs";

export type WorkspaceLayoutProps = {
  className?: string;
  /** 左侧最窄栏宽度，如 `3rem`、`48px` */
  railWidth?: string;
  /** 主侧栏宽度 */
  sidebarPrimaryWidth?: string;
  /** 次级侧栏宽度 */
  sidebarSecondaryWidth?: string;
  /** 与当前 `pathname` 匹配的路由树，用于顶栏左侧面包屑；不传则不留面包屑位 */
  breadcrumbRoute?: Router;
  rail?: ReactNode;
  sidebarPrimary?: ReactNode;
  /**
   * 顶栏在面包屑（若有）**右侧**的附加内容，如操作按钮、搜索框。
   * 与 `breadcrumbRoute` 共同组成顶栏行。
   */
  header?: ReactNode;
  /** 顶栏高度（`min-height`），如 `3.5rem`、`48px`；默认 `3.5rem` */
  headerHeight?: string;
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
  headerHeight = "3.5rem",
  railWidth = "3rem",
  sidebarPrimaryWidth = "16rem",
  sidebarSecondaryWidth = "20rem",
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
        className,
      )}
    >
      <aside
        aria-label="Rail"
        className="shrink-0 border-r border-black/10 dark:border-white/10"
        style={{ width: railWidth }}
      >
        {rail}
      </aside>
      <aside
        aria-label="Primary sidebar"
        className="shrink-0 border-r border-black/10 dark:border-white/10"
        style={{ width: sidebarPrimaryWidth }}
      >
        {sidebarPrimary}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          className="flex shrink-0 items-center border-b border-black/10 px-4 dark:border-white/10"
          style={{ minHeight: headerHeight }}
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
        <div className="flex min-h-0 flex-1 flex-row">
          <aside
            aria-label="Secondary sidebar"
            className="shrink-0 border-r border-black/10 dark:border-white/10"
            style={{ width: sidebarSecondaryWidth }}
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
