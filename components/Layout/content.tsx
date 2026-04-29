"use client";

import { type LayoutChild, renderLayoutChild, useLayout } from "./context";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import { workspacePaths } from "./types";

// -- Content -- //

export type ContentProps = {
  className?: string;
  children?: LayoutChild;
};

export function Content({ className, children }: ContentProps) {
  const ctx = useLayout();
  const { sidebarState } = ctx;
  const { isDesktopOpen, isDesktop } = sidebarState;
  const showDesktopInsetPadding = isDesktop && isDesktopOpen;
  return (
    <HeroSidebar.Main
      className={cn(
        "min-h-0 min-w-0 md:p-2 md:pl-0",
        "md:transition-[padding-left] duration-(--sidebar-duration,200ms) ease-(--sidebar-ease,ease)",
        showDesktopInsetPadding &&
          "md:pl-[calc(var(--layout-sidebar-width)-240px)]",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface",
          "md:rounded-[14px] md:border md:border-border-hair md:shadow-(--shadow-card)",
          className,
        )}
      >
        {renderLayoutChild(children, ctx)}
      </div>
    </HeroSidebar.Main>
  );
}

// -- Content Header -- //

export type ContentHeaderProps = {
  className?: string;
  children?: LayoutChild;
};

export function ContentHeader({ className, children }: ContentHeaderProps) {
  const ctx = useLayout();
  const { headerHeight } = ctx.rootState;
  const { contentHeaderPortalMounts, setContentHeaderAnchor } = ctx.slotState;
  const defaultTrailing = renderLayoutChild(children, ctx);
  const portalOpen = contentHeaderPortalMounts > 0;
  const hasNoSlot = !portalOpen;

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
        <Breadcrumbs className="min-w-0 shrink" paths={workspacePaths} />
        {hasNoSlot ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-end gap-2">
            {defaultTrailing}
          </div>
        ) : null}
        <div
          ref={setContentHeaderAnchor}
          className={cn(
            "flex min-h-0 min-w-0 flex-1 items-center justify-end gap-2",
            hasNoSlot &&
              "pointer-events-none size-0 min-h-0 min-w-0 overflow-hidden opacity-0",
          )}
          aria-hidden={hasNoSlot}
        />
      </div>
    </header>
  );
}

// -- Content Body -- //

export type ContentBodyProps = {
  className?: string;
  children?: LayoutChild;
};

export function ContentBody({ className, children }: ContentBodyProps) {
  const ctx = useLayout();
  return (
    <main className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}>
      {renderLayoutChild(children, ctx)}
    </main>
  );
}
