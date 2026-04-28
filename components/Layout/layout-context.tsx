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

export type SidebarState = ReturnType<typeof useSidebar>;

export type RootState = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  route?: RouteConfig;
  activeEntryId?: string;
  activeEntry?: RailMenuItem;
  setActiveEntryId: (id: string) => void;
};

export type RailState = {
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

export type LayoutContextValue = {
  rootState: RootState;
  sidebarState: SidebarState;
  railState: RailState;
};

const LayoutCtx = createContext<LayoutContextValue | null>(null);

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutCtx);
  if (ctx == null) {
    throw new Error(
      "Layout subcomponents (Rail, Sidebar, Content, etc.) must be used inside <Layout>.",
    );
  }
  return ctx;
}

export function LayoutContext({
  rootState,
  children,
}: {
  rootState: RootState;
  children: ReactNode;
}) {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);
  const sidebar = useSidebar();

  const value = useMemo<LayoutContextValue>(
    () => ({
      rootState,
      sidebarState: sidebar,
      railState: {
        mobileRailSlot,
        setMobileRailSlot,
      },
    }),
    [rootState, sidebar, mobileRailSlot],
  );

  return <LayoutCtx.Provider value={value}>{children}</LayoutCtx.Provider>;
}
