"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLayoutContext } from "./root";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import appRouter from "@/config/routes.json";
import type { Router } from "./types";

// -- Content -- //

export type ContentProps = {
  className?: string;
  children?: ReactNode;
};

export function Content({ className, children }: ContentProps) {
  const { sidebarWidth, isMobile, isOpen } = useLayoutContext();
  const isDesktop = !isMobile;
  const isDesktopOpen = isDesktop && isOpen;
  return (
    <HeroSidebar.Main
      className={cn(
        "min-h-0 min-w-0 p-2 md:pl-0",
        "transition-all duration-(--sidebar-duration,200ms) ease-(--sidebar-ease,ease)",
      )}
      style={
        isDesktopOpen
          ? ({
              "padding-left": `calc(${sidebarWidth}rem - 240px)`,
            } as CSSProperties)
          : undefined
      }
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "rounded-[14px] border border-border-hair bg-surface shadow-(--shadow-card)",
          className,
        )}
      >
        {children}
      </div>
    </HeroSidebar.Main>
  );
}

// -- Content Header -- //

export type ContentHeaderProps = {
  className?: string;
  end?: ReactNode;
};

const breadcrumbRoute = appRouter as Router;

export function ContentHeader({ className, end }: ContentHeaderProps) {
  const { headerHeight } = useLayoutContext();
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border-hair bg-surface px-5",
        className,
      )}
      style={{ minHeight: `${headerHeight}rem` }}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        <HeroSidebar.Trigger
          className="shrink-0 text-fg-3"
          aria-label="切换侧栏"
        />
        <Breadcrumbs className="min-w-0 shrink" route={breadcrumbRoute} />
        {end != null ? (
          <div
            className={cn(
              "min-w-0",
              "ml-auto flex min-w-0 items-center justify-end gap-2",
            )}
          >
            {end}
          </div>
        ) : null}
      </div>
    </header>
  );
}

// -- Content Body -- //

export type ContentBodyProps = {
  className?: string;
  children?: ReactNode;
};

export function ContentBody({ className, children }: ContentBodyProps) {
  return (
    <main className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}>
      {children}
    </main>
  );
}
