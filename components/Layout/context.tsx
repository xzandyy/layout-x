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
  /** 菜单配置 */
  menuConfig?: MenuConfig;
  /** 激活的 Rail 菜单 */
  activeRailMenu?: RailMenuItem;
  /** 激活的 Sidebar 菜单 */
  activeSidebarMenu?: SidebarNavItem;
  /** 激活的导航项链接 */
  activeNavItemHref?: string;
  /** 设置激活的 Rail 菜单 */
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

/** Slot 状态：Sidebar / Content Header 均使用 DOM 锚点 + Portal */
export type SlotState = {
  /** Sidebar Header 挂载 */
  sidebarHeaderAnchor: HTMLElement | null;
  setSidebarHeaderAnchor: (el: HTMLElement | null) => void;
  sidebarHeaderPortalMounts: number;
  registerSidebarHeaderPortal: () => void;
  unregisterSidebarHeaderPortal: () => void;
  /** Content Header 挂载 */
  contentHeaderAnchor: HTMLElement | null;
  setContentHeaderAnchor: (el: HTMLElement | null) => void;
  contentHeaderPortalMounts: number;
  registerContentHeaderPortal: () => void;
  unregisterContentHeaderPortal: () => void;
};

export type LayoutContextValue = {
  rootState: RootState;
  sidebarState: SidebarState;
  railState: RailState;
  slotState: SlotState;
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

  // Slot（覆盖区域）：Portal 锚点
  const [sidebarHeaderAnchor, setSidebarHeaderAnchor] =
    useState<HTMLElement | null>(null);
  const [sidebarHeaderPortalMounts, setSidebarHeaderPortalMounts] =
    useState(0);

  const [contentHeaderAnchor, setContentHeaderAnchor] =
    useState<HTMLElement | null>(null);
  const [contentHeaderPortalMounts, setContentHeaderPortalMounts] =
    useState(0);

  const registerSidebarHeaderPortal = useCallback(() => {
    setSidebarHeaderPortalMounts((n) => n + 1);
  }, []);

  const unregisterSidebarHeaderPortal = useCallback(() => {
    setSidebarHeaderPortalMounts((n) => Math.max(0, n - 1));
  }, []);

  const registerContentHeaderPortal = useCallback(() => {
    setContentHeaderPortalMounts((n) => n + 1);
  }, []);

  const unregisterContentHeaderPortal = useCallback(() => {
    setContentHeaderPortalMounts((n) => Math.max(0, n - 1));
  }, []);

  const slotState = useMemo<SlotState>(
    () => ({
      sidebarHeaderAnchor,
      setSidebarHeaderAnchor,
      sidebarHeaderPortalMounts,
      registerSidebarHeaderPortal,
      unregisterSidebarHeaderPortal,
      contentHeaderAnchor,
      setContentHeaderAnchor,
      contentHeaderPortalMounts,
      registerContentHeaderPortal,
      unregisterContentHeaderPortal,
    }),
    [
      sidebarHeaderAnchor,
      sidebarHeaderPortalMounts,
      registerSidebarHeaderPortal,
      unregisterSidebarHeaderPortal,
      contentHeaderAnchor,
      contentHeaderPortalMounts,
      registerContentHeaderPortal,
      unregisterContentHeaderPortal,
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

/** Layout 各组件的子节点类型 */
export type LayoutChild = ReactNode | ((ctx: LayoutContextValue) => ReactNode);

export function renderLayoutChild(
  child: LayoutChild | undefined,
  ctx: LayoutContextValue,
): ReactNode {
  if (child === undefined) return undefined;
  return typeof child === "function" ? child(ctx) : child;
}