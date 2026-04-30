"use client";

import { Popover } from "@heroui/react";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import type { SVGProps } from "react";

import { Breadcrumbs } from "./breadcrumbs";
import { type LayoutChild, renderLayoutChild, useLayout } from "./context";
import { cn } from "@/lib/utils";
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
  const { isDesktop } = ctx.sidebarState;
  const { contentHeaderPortalMounts, setContentHeaderAnchor } = ctx.slotState;
  const defaultTrailing = renderLayoutChild(children, ctx);
  const portalOpen = contentHeaderPortalMounts > 0;
  const hasNoSlot = !portalOpen;

  const showMobileHeaderOverflow =
    !isDesktop &&
    (portalOpen || (hasNoSlot && defaultTrailing != null));

  const trailingClassName =
    "flex max-w-full shrink-0 touch-pan-x items-center justify-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex min-w-0 max-w-full shrink-0 items-center gap-2 overflow-x-hidden border-b border-border-hair bg-surface pl-3 pr-5",
        className,
      )}
      style={{ minHeight: `${headerHeight}rem` }}
    >
      <div className="flex w-full min-w-0 max-w-full items-center gap-1.5">
        <HeroSidebar.Trigger className={cn("shrink-0 text-fg-3")} />
        <Breadcrumbs
          className="min-w-0 flex-1 basis-0 max-w-full"
          paths={workspacePaths}
        />
        {isDesktop && hasNoSlot ? (
          <div className={trailingClassName}>{defaultTrailing}</div>
        ) : null}
        {isDesktop ? (
          <div
            ref={setContentHeaderAnchor}
            className={cn(
              trailingClassName,
              hasNoSlot &&
                "pointer-events-none flex-none size-0 shrink-0 gap-0 overflow-hidden p-0 opacity-0",
            )}
            aria-hidden={hasNoSlot}
          />
        ) : showMobileHeaderOverflow ? (
          <Popover.Root>
            <Popover.Trigger
              className={cn(
                "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-3 outline-none select-none",
                "hover:bg-canvas-2 data-focus-visible:ring-2 data-focus-visible:ring-focus data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-surface",
              )}
              aria-label="页面操作"
            >
              <HeaderOverflowDotsIcon className="size-5" />
            </Popover.Trigger>
            <Popover.Dialog>
              <Popover.Content
                placement="bottom end"
                className="max-w-[min(calc(100vw-1.5rem),20rem)] p-2"
              >
                <div
                  ref={setContentHeaderAnchor}
                  className="flex min-w-48 flex-col items-stretch gap-2"
                >
                  {hasNoSlot ? defaultTrailing : null}
                </div>
              </Popover.Content>
            </Popover.Dialog>
          </Popover.Root>
        ) : null}
      </div>
    </header>
  );
}

function HeaderOverflowDotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <circle cx="5" cy="12" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="19" cy="12" r="1.75" />
    </svg>
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

// -- Content Footer -- //

export type ContentFooterProps = {
  className?: string;
  children?: LayoutChild;
};

export function ContentFooter({ className, children }: ContentFooterProps) {
  const ctx = useLayout();
  const { contentFooterPortalMounts, setContentFooterAnchor } = ctx.slotState;
  const content = renderLayoutChild(children, ctx);
  const portalOpen = contentFooterPortalMounts > 0;
  const hasNoSlot = !portalOpen;

  return (
    <footer
      className={cn(
        "shrink-0 bg-surface",
        portalOpen && "border-t border-border-hair px-4 py-3",
        className,
      )}
    >
      {hasNoSlot ? <div className="w-full min-w-0">{content}</div> : null}
      <div
        ref={setContentFooterAnchor}
        className={cn(
          "flex min-h-0 min-w-0 w-full items-center justify-end",
          hasNoSlot &&
            "pointer-events-none size-0 min-h-0 min-w-0 overflow-hidden opacity-0",
        )}
        aria-hidden={hasNoSlot}
      />
    </footer>
  );
}
