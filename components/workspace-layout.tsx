import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type WorkspaceLayoutProps = {
  className?: string;
  /** 左侧最窄栏宽度，如 `3rem`、`48px` */
  railWidth?: string;
  /** 主侧栏宽度 */
  sidebarPrimaryWidth?: string;
  /** 次级侧栏宽度 */
  sidebarSecondaryWidth?: string;
  rail?: ReactNode;
  sidebarPrimary?: ReactNode;
  /** 横跨 secondary + main 顶部的区域 */
  header?: ReactNode;
  /** 顶栏高度（`min-height`），如 `3.5rem`、`48px`；默认 `3.5rem` */
  headerHeight?: string;
  sidebarSecondary?: ReactNode;
  main?: ReactNode;
};

/**
 * 从左到右：rail → sidebar-primary →（上方 header，下方 secondary | main）。
 * 前三个侧栏为 aside，宽度可通过 props 指定；main 占满剩余空间。
 */
export function WorkspaceLayout({
  className,
  headerHeight = "3.5rem",
  railWidth = "3rem",
  sidebarPrimaryWidth = "16rem",
  sidebarSecondaryWidth = "20rem",
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
          {header}
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
