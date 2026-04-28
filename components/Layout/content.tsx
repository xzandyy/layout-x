"use client";

import type { ReactNode } from "react";
import { useLayout } from "./layout-context";
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
  const { sidebarState } = useLayout();
  const { isDesktopOpen, isDesktop } = sidebarState;
  const showDesktopInsetPadding = isDesktop && isDesktopOpen;
  return (
    <HeroSidebar.Main
      className={cn(
        "min-h-0 min-w-0 md:p-2 md:pl-0",
        "md:transition-[padding-left] duration-(--sidebar-duration,200ms) ease-(--sidebar-ease,ease)",
        showDesktopInsetPadding && "md:pl-[calc(var(--layout-sidebar-width)-240px)]",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface",
          "md:rounded-[14px] md:border md:border-border-hair md:shadow-(--shadow-card)",
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
  children?: ReactNode;
};

const breadcrumbRoute = appRouter as Router;

export function ContentHeader({ className, children }: ContentHeaderProps) {
  const { headerHeight } = useLayout().rootState;
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border-hair bg-surface pl-3 pr-5",
        className,
      )}
      style={{ minHeight: `${headerHeight}rem` }}
    >
      <div className="flex w-full min-w-0 items-center gap-1.5">
        <HeroSidebar.Trigger className={cn("shrink-0 text-fg-3")} />
        <Breadcrumbs className="min-w-0 shrink" route={breadcrumbRoute} />
        {children != null ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-end gap-2">
            {children}
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
