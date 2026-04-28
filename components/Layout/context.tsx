"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSidebar } from "@heroui-pro/react";

import type { MenuConfig, RailMenuItem, SidebarNavItem } from "./types";

/** Root 状态 */
export type RootState = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  menuConfig?: MenuConfig;
  activeRailMenu?: RailMenuItem;
  activeSidebarMenu?: SidebarNavItem;
  setActiveRailMenu: (item: RailMenuItem) => void;
};

/** Sidebar 状态 */
export type SidebarState = Omit<RawSidebarState, "isOpen" | "setOpen"> & {
  isDesktopOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
  isDesktop: boolean;
};

type RawSidebarState = ReturnType<typeof useSidebar>;

/** Rail 状态 */
export type RailState = {
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

/** Slot 状态：自外部覆盖的区域内容；null 时使用对应组件原本声明式的 children */
export type SlotState = {
  sidebarHeaderSlot: ReactNode | null;
  updateSidebarHeader: (node: ReactNode | null) => void;
  contentHeaderSlot: ReactNode | null;
  updateContentHeader: (node: ReactNode | null) => void;
};

export type LayoutContextValue = {
  rootState: RootState;
  sidebarState: SidebarState;
  railState: RailState;
  slotState: SlotState;
};

/** Layout 与子外壳可用的「静态节点」或「`(Layout context)` render prop」 */
export type LayoutChild =
  | ReactNode
  | ((ctx: LayoutContextValue) => ReactNode);

export function renderLayoutChild(
  child: LayoutChild | undefined,
  ctx: LayoutContextValue,
): ReactNode {
  if (child === undefined) return undefined;
  return typeof child === "function" ? child(ctx) : child;
}

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

function mapSidebarState(raw: RawSidebarState): SidebarState {
  const { isOpen, setOpen, ...rest } = raw;
  return {
    ...rest,
    isDesktopOpen: isOpen,
    setDesktopOpen: setOpen,
    isDesktop: !raw.isMobile,
  };
}

export function LayoutContext({
  rootState,
  children,
}: {
  // Root
  rootState: RootState;
  children: ReactNode;
}) {
  // Sidebar
  const rawSidebar = useSidebar();
  const sidebarState = useMemo(() => mapSidebarState(rawSidebar), [rawSidebar]);

  // Rail（移动端适配）
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);

  const railState = useMemo<RailState>(
    () => ({
      mobileRailSlot,
      setMobileRailSlot,
    }),
    [mobileRailSlot, setMobileRailSlot],
  );

  // Slot（覆盖区域）
  const [sidebarHeaderSlot, setSidebarHeaderSlot] = useState<ReactNode | null>(
    null,
  );
  const [contentHeaderSlot, setContentHeaderSlot] = useState<ReactNode | null>(
    null,
  );

  const updateSidebarHeader = useCallback((node: ReactNode | null) => {
    setSidebarHeaderSlot(node);
  }, []);

  const updateContentHeader = useCallback((node: ReactNode | null) => {
    setContentHeaderSlot(node);
  }, []);

  const slotState = useMemo<SlotState>(
    () => ({
      sidebarHeaderSlot,
      updateSidebarHeader,
      contentHeaderSlot,
      updateContentHeader,
    }),
    [
      sidebarHeaderSlot,
      contentHeaderSlot,
      updateSidebarHeader,
      updateContentHeader,
    ],
  );

  // 合并状态
  const value = useMemo<LayoutContextValue>(
    () => ({
      rootState,
      sidebarState,
      railState,
      slotState,
    }),
    [rootState, sidebarState, railState, slotState],
  );

  return <LayoutCtx.Provider value={value}>{children}</LayoutCtx.Provider>;
}
