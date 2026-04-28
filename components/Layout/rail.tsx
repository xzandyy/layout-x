"use client";

import {
  useLayoutEffect,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useLayout } from "./layout-context";

// -- Rail -- //

export type RailProps = {
  className?: string;
  children?: ReactNode;
};

export function Rail({ className, children }: RailProps): ReactElement {
  const { rootState, sidebarState, railState } = useLayout();
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
          "border-r border-border-hair",
          className,
        )}
        style={railVars}
      >
        {children}
      </aside>,
    );
    return () => {
      setMobileRailSlot(null);
    };
  }, [isDesktop, children, className, railVars, setMobileRailSlot]);

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
      {children}
    </aside>
  );
}

// -- Rail Header -- //

export type RailHeaderProps = {
  className?: string;
  children?: ReactNode;
};

export function RailHeader({ className, children }: RailHeaderProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>;
}

// -- Rail Footer -- //

export type RailFooterProps = {
  className?: string;
  children?: ReactNode;
};

export function RailFooter({ className, children }: RailFooterProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>;
}

// -- Rail Main -- //

export type RailMainProps = {
  className?: string;
  children?: ReactNode;
};

export function RailMain({ className, children }: RailMainProps) {
  const { route, activeEntryId, setActiveEntryId } = useLayout().rootState;
  const { isDesktop, setDesktopOpen } = useLayout().sidebarState;
  const items = useMemo(
    () => (route ? route.rail.flatMap((b) => b.items) : []),
    [route],
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
          {items.map((e) => {
            const isActive = e.id === activeEntryId;
            const name = typeof e.label === "string" ? e.label : e.id;
            return (
              <Button
                key={e.id}
                aria-pressed={isActive}
                aria-label={name}
                onPress={() => {
                  setActiveEntryId(e.id);
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
          })}
        </nav>
      ) : null}
      {children}
    </div>
  );
}
