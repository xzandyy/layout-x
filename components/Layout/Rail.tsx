"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
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
      className={cn(
        "z-100 shrink-0 bg-canvas",
        "flex min-h-0 min-w-0",
        "h-auto w-full flex-row border-t border-border-hair",
        "md:h-full md:w-(--rail-width) md:flex-col md:self-stretch md:border-t-0",
        className,
      )}
      style={{ "--rail-width": `${railWidth}rem` } as CSSProperties}
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
  return (
    <div className={cn("hidden shrink-0 md:block", className)}>{children}</div>
  );
}

// -- Rail Footer -- //

export type RailFooterProps = {
  className?: string;
  children?: ReactNode;
};

export function RailFooter({ className, children }: RailFooterProps) {
  return (
    <div className={cn("hidden shrink-0 md:block", className)}>{children}</div>
  );
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
        "min-h-0 min-w-0 flex-1",
        "overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto",
        className,
      )}
    >
      {items.length ? (
        <nav
          className={cn(
            "flex items-center gap-1",
            "flex-row justify-around px-2 py-1",
            "md:flex-col md:justify-start md:px-0 md:py-0",
          )}
        >
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
