"use client";

import type { ReactNode } from "react";
import { useLayoutContext } from "./Root";
import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import type { Router } from "@/config/routes";

export type ContentProps = {
  className?: string;
  children?: ReactNode;
};

export function Content({ className, children }: ContentProps) {
  return (
    <HeroSidebar.Main className="min-h-0 min-w-0 p-2 pl-0">
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

export type ContentHeaderProps = {
  className?: string;
  breadcrumbRoute?: Router;
  end?: ReactNode;
};

export function ContentHeader({
  className,
  breadcrumbRoute,
  end,
}: ContentHeaderProps) {
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
        {breadcrumbRoute != null ? (
          <Breadcrumbs
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

export type ContentBodyProps = {
  className?: string;
  children?: ReactNode;
};

export function ContentBody({ className, children }: ContentBodyProps) {
  return (
    <main
      aria-label="Main content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}
    >
      {children}
    </main>
  );
}
