"use client";

import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "./root";

// -- Rail -- //

export type RailProps = {
  className?: string;
  children?: ReactNode;
};

export function Rail({ className, children }: RailProps) {
  const { railWidth } = useLayoutContext();
  return (
    <aside
      aria-label="Rail"
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col",
        "shrink-0 self-stretch bg-canvas",
        className,
      )}
      style={{ width: `${railWidth}rem` }}
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
  return (
    <div
      className={cn(
        "w-full min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

// -- Rail Main -> Rail Route Nav -- //

export type RailRouteNavProps = {
  className?: string;
};

export function RailRouteNav({ className }: RailRouteNavProps) {
  const { route, activeEntryId, setActiveEntryId } = useLayoutContext();
  if (!route?.entries.length) return null;
  return (
    <nav className={cn("flex flex-col items-center gap-1", className)}>
      {route.entries.map((e) => {
        const isActive = e.id === activeEntryId;
        const name = typeof e.label === "string" ? e.label : e.id;
        return (
          <Button
            key={e.id}
            aria-pressed={isActive}
            aria-label={name}
            onPress={() => setActiveEntryId(e.id)}
            className={cn(
              "size-10 rounded-[10px]",
              "transition-all duration-150",
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
  );
}
