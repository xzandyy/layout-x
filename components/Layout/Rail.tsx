"use client";

import { useMemo, type ReactNode } from "react";
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
  const { route, activeEntryId, setActiveEntryId } = useLayoutContext();
  const items = useMemo(
    () => (route ? route.rail.flatMap((b) => b.items) : []),
    [route],
  );
  return (
    <div
      className={cn(
        "w-full min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
    >
      {items.length ? (
        <nav className="flex flex-col items-center gap-1">
          {items.map((e) => {
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
