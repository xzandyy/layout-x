"use client";

import {
  Fragment,
  useLayoutEffect,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button, Tooltip } from "@heroui/react";
import { cn } from "@/lib/utils";
import { type LayoutChild, renderLayoutChild, useLayout } from "./context";
import type { RailMenuItem } from "./types";

// -- Rail -- //

export type RailProps = {
  className?: string;
  children?: LayoutChild;
};

export function Rail({ className, children }: RailProps): ReactElement {
  const ctx = useLayout();
  const { rootState, sidebarState, railState } = ctx;
  const resolvedChildren = renderLayoutChild(children, ctx);
  const { railWidth } = rootState;
  const { isDesktop } = sidebarState;
  const { setMobileRailSlot } = railState;

  const railVars = useMemo(
    () => ({ "--rail-width": `${railWidth}rem` }) as CSSProperties,
    [railWidth],
  );

  useLayoutEffect(() => {
    if (isDesktop) {
      setMobileRailSlot(null);
      return;
    }
    setMobileRailSlot(
      <aside
        className={cn(
          "z-100 flex h-full min-h-0 w-(--rail-width) shrink-0 flex-col self-stretch bg-canvas",
          className,
        )}
        style={railVars}
      >
        {resolvedChildren}
      </aside>,
    );
    return () => {
      setMobileRailSlot(null);
    };
  }, [isDesktop, resolvedChildren, className, railVars, setMobileRailSlot]);

  return (
    <aside
      className={cn(
        "hidden md:flex",
        "z-100 shrink-0 bg-canvas",
        "min-h-0 min-w-0 flex-col",
        "h-full w-(--rail-width) self-stretch",
        className,
      )}
      style={railVars}
    >
      {resolvedChildren}
    </aside>
  );
}

// -- Rail Header -- //

export type RailHeaderProps = {
  className?: string;
  children?: LayoutChild;
};

export function RailHeader({ className, children }: RailHeaderProps) {
  const ctx = useLayout();
  return (
    <div className={cn("shrink-0", className)}>
      {renderLayoutChild(children, ctx)}
    </div>
  );
}

// -- Rail Footer -- //

export type RailFooterProps = {
  className?: string;
  children?: LayoutChild;
};

export function RailFooter({ className, children }: RailFooterProps) {
  const ctx = useLayout();
  return (
    <div className={cn("shrink-0", className)}>
      {renderLayoutChild(children, ctx)}
    </div>
  );
}
// -- Rail Main -- //

export type RailMainProps = {
  className?: string;
  children?: LayoutChild;
};

export function RailMain({ className, children }: RailMainProps) {
  const ctx = useLayout();
  const { menuConfig, activeRailMenu, setActiveRailMenu } = ctx.rootState;
  const { isDesktop, setDesktopOpen } = ctx.sidebarState;
  const items = useMemo(
    () => (menuConfig ? menuConfig.rail.flatMap((b) => b.items) : []),
    [menuConfig],
  );

  return (
    <div
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
    >
      {items.length ? (
        <nav className="flex flex-col items-center justify-start gap-1 px-0 py-0">
          {items.map((e: RailMenuItem, index: number) => {
            const isActive = activeRailMenu === e;
            const name =
              typeof e.label === "string" ? e.label : `Rail ${index + 1}`;
            const button = (
              <Button
                aria-pressed={isActive}
                aria-label={name}
                onPress={() => {
                  setActiveRailMenu(e);
                  if (isDesktop) {
                    setDesktopOpen(true);
                  }
                }}
                className={cn(
                  "size-10 shrink-0 rounded-[10px]",
                  "transition-all duration-150",
                  "[&>svg]:size-5",
                  isActive
                    ? "bg-surface text-fg-1"
                    : "bg-transparent text-fg-3 hover:bg-canvas-2 hover:text-fg-1",
                )}
              >
                {e.icon}
              </Button>
            );
            return (
              <Fragment key={index}>
                <RailMenuTooltip label={e.label}>{button}</RailMenuTooltip>
              </Fragment>
            );
          })}
        </nav>
      ) : null}
      {renderLayoutChild(children, ctx)}
    </div>
  );
}

// -- Rail Menu Tooltip -- //

function RailMenuTooltip({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactElement;
}) {
  return (
    <Tooltip delay={600} closeDelay={0}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Content
        placement="right"
        className="border border-border-hair shadow-card bg-surface text-fg-1"
      >
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
}
