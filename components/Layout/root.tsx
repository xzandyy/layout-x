"use client";

import { useMemo, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { MenuConfig } from "./types";
import {
  LayoutContext,
  type LayoutChild,
  renderLayoutChild,
  useLayout,
} from "./context";

export type LayoutProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  menuConfig?: MenuConfig;
  children: LayoutChild;
  defaultSidebarOpen?: boolean;
};

export function LayoutRoot({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  defaultSidebarOpen = true,
  className,
  menuConfig,
  children,
}: LayoutProps) {
  const router = useRouter();

  const shellStyle = useMemo(
    () =>
      ({
        "--layout-sidebar-width": `${sidebarWidth}rem`,
      }) as CSSProperties,
    [sidebarWidth],
  );

  return (
    <HeroSidebar.Provider
      navigate={router.push}
      collapsible="offcanvas"
      defaultOpen={defaultSidebarOpen}
    >
      <LayoutContext
        headerHeight={headerHeight}
        railWidth={railWidth}
        sidebarWidth={sidebarWidth}
        menuConfig={menuConfig}
      >
        <LayoutRootBody className={className} style={shellStyle}>
          {children}
        </LayoutRootBody>
      </LayoutContext>
    </HeroSidebar.Provider>
  );
}

function LayoutRootBody({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: LayoutChild;
}) {
  const ctx = useLayout();
  return (
    <div
      className={cn(
        "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row",
        "bg-canvas text-fg-1",
        className,
      )}
      style={style}
    >
      {renderLayoutChild(children, ctx)}
    </div>
  );
}
