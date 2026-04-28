"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSidebar } from "@heroui-pro/react";

import type { RouteConfig, RailMenuItem } from "./types";

type SidebarState = ReturnType<typeof useSidebar>;

export type LayoutBaseValue = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  route?: RouteConfig;
  activeEntryId?: string;
  activeEntry?: RailMenuItem;
  setActiveEntryId: (id: string) => void;
};

export type LayoutContextValue = LayoutBaseValue & SidebarState;

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayoutContext(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (ctx == null) {
    throw new Error(
      "Layout subcomponents (Rail, Sidebar, Content, etc.) must be used inside <Layout>.",
    );
  }
  return ctx;
}

export function useLayout() {
  return useLayoutContext();
}

export type LayoutRailContextValue = {
  /** Rail 在移动端填入 Sheet：由 `<Layout.Rail>` 注册，Sidebar 并排展示 */
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

const LayoutRailContext = createContext<LayoutRailContextValue | null>(null);

export function useLayoutRail(): LayoutRailContextValue {
  const ctx = useContext(LayoutRailContext);
  if (ctx == null) {
    throw new Error("Layout rail outlet is only available inside <Layout>.");
  }
  return ctx;
}

export function LayoutRailOutletBridge({ children }: { children: ReactNode }) {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);
  const outlet = useMemo<LayoutRailContextValue>(
    () => ({ mobileRailSlot, setMobileRailSlot }),
    [mobileRailSlot],
  );
  return (
    <LayoutRailContext.Provider value={outlet}>
      {children}
    </LayoutRailContext.Provider>
  );
}

export function LayoutContextBridge({
  base,
  children,
}: {
  base: LayoutBaseValue;
  children: ReactNode;
}) {
  const sidebar = useSidebar();

  const value = useMemo<LayoutContextValue>(
    () => ({ ...base, ...sidebar }),
    [base, sidebar],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
