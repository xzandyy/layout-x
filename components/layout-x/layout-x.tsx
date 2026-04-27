"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import { RouteBreadcrumbs } from "./route-breadcrumbs";
import { MenuTree } from "./menu-tree";
import { findBestEntryIdForPathname } from "./sidebar-routing";
import type {
  LayoutXContextValue,
  LayoutXContentHeaderProps,
  LayoutXProps,
  LayoutXRegionProps,
  LayoutXSidebarMainProps,
} from "./types";

// -- Layout Context -- //

const LayoutXContext = createContext<LayoutXContextValue | null>(null);

function useLayoutContext(): LayoutXContextValue {
  const ctx = useContext(LayoutXContext);
  if (ctx == null) {
    throw new Error(
      "LayoutX 子组件（Rail、SidebarHeader、ContentHeader 等）必须放在 <LayoutX> 内使用。",
    );
  }
  return ctx;
}

export function useLayout() {
  return useLayoutContext();
}

// -- Layout Root -- //

export function Root({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  className,
  route,
  children,
}: LayoutXProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railOverride, setRailOverride] = useState<{
    entryId: string;
    forPathname: string;
  } | null>(null);

  const urlEntryId = useMemo(
    () => (route ? findBestEntryIdForPathname(route, pathname) : undefined),
    [route, pathname],
  );

  const fallbackId = useMemo(() => {
    if (!route?.entries.length) return undefined;
    return route.defaultEntryId ?? route.entries[0]!.id;
  }, [route]);

  const activeEntryId = useMemo(() => {
    if (!route) return undefined;
    if (railOverride != null && railOverride.forPathname === pathname) {
      return railOverride.entryId;
    }
    return urlEntryId ?? fallbackId;
  }, [route, railOverride, pathname, urlEntryId, fallbackId]);

  const activeEntry = useMemo(() => {
    if (!route || activeEntryId == null) return undefined;
    return route.entries.find((e) => e.id === activeEntryId);
  }, [route, activeEntryId]);

  const setActiveEntryId = useCallback(
    (id: string) => {
      if (!route) return;
      setRailOverride({ entryId: id, forPathname: pathname });
    },
    [route, pathname],
  );

  const value = useMemo<LayoutXContextValue>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    ],
  );

  return (
    <LayoutXContext.Provider value={value}>
      <HeroSidebar.Provider navigate={router.push} collapsible="none">
        <div
          className={cn(
            "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0",
            "bg-canvas text-fg-1",
            className,
          )}
        >
          {children}
        </div>
      </HeroSidebar.Provider>
    </LayoutXContext.Provider>
  );
}

// -- Layout Rail -- //

export function Rail({ className, children }: LayoutXRegionProps) {
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

export function RailHeader({ className, children }: LayoutXRegionProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>;
}

export function RailFooter({ className, children }: LayoutXRegionProps) {
  return <div className={cn("shrink-0", className)}>{children}</div>;
}

export function RailMain({ className, children }: LayoutXRegionProps) {
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

export function RailRouteNav({ className }: LayoutXRegionProps) {
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

// -- Sidebar -- //

export function Sidebar({ className, children }: LayoutXRegionProps) {
  const { sidebarWidth } = useLayoutContext();
  const sidebarVars = useMemo(
    () =>
      ({
        "--sidebar-width": `${sidebarWidth}rem`,
      }) as CSSProperties,
    [sidebarWidth],
  );
  return (
    <HeroSidebar
      className={cn("bg-canvas border-none shadow-none px-2", className)}
      style={sidebarVars}
    >
      {children}
    </HeroSidebar>
  );
}

export function SidebarHeader({ className, children }: LayoutXRegionProps) {
  return (
    <HeroSidebar.Header className={cn("p-0", className)}>
      {children}
    </HeroSidebar.Header>
  );
}

export function SidebarFooter({ className, children }: LayoutXRegionProps) {
  return (
    <HeroSidebar.Footer className={cn("p-0", className)}>
      {children}
    </HeroSidebar.Footer>
  );
}

export function SidebarMain({ className, children }: LayoutXSidebarMainProps) {
  const pathname = usePathname();
  const { activeEntry } = useLayoutContext();
  const sidebar = activeEntry?.sidebar;
  return (
    <HeroSidebar.Content className={cn("p-0", className)}>
      {sidebar && <MenuTree config={sidebar} pathname={pathname} />}
      {children}
    </HeroSidebar.Content>
  );
}

// -- Content -- //

export function Content({ className, children }: LayoutXRegionProps) {
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

export function ContentHeader({
  className,
  breadcrumbRoute,
  end,
}: LayoutXContentHeaderProps) {
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
          <RouteBreadcrumbs
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

export function ContentBody({ className, children }: LayoutXRegionProps) {
  return (
    <main
      aria-label="Main content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}
    >
      {children}
    </main>
  );
}
