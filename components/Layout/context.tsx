"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@heroui-pro/react";

import type { MenuConfig, RailMenuItem, SidebarNavItem } from "./types";
import {
  collectRailMenuItems,
  findActiveSidebarNavItem,
  findBestRailMenuForPathname,
  findGlobalActiveLeafNorm,
} from "./utils";

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
  /** 手动注册不在 `menuConfig` 中的 rail 项 */
  registerManualRailItem: (item: RailMenuItem) => void;
  unregisterManualRailItem: (item: RailMenuItem) => void;
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

/** Layout 上下文*/
export type LayoutContextValue = {
  rootState: RootState;
  sidebarState: SidebarState;
  railState: RailState;
  slotState: SlotState;
};

const LayoutCtx = createContext<LayoutContextValue | null>(null);

/** 获取 Layout 上下文 */
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
  headerHeight,
  railWidth,
  sidebarWidth,
  menuConfig,
  children,
}: {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  menuConfig?: MenuConfig;
  children: ReactNode;
}) {
  const rootState = useLayoutRootState({
    headerHeight,
    railWidth,
    sidebarWidth,
    menuConfig,
  });
  const sidebarState = useLayoutSidebarState();
  const railState = useLayoutRailState();
  const slotState = useLayoutSlotState();

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

function useLayoutRootState({
  headerHeight,
  railWidth,
  sidebarWidth,
  menuConfig,
}: {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  menuConfig?: MenuConfig;
}): RootState {
  const pathname = usePathname() ?? "/";

  const [railMenuOverride, setRailMenuOverride] = useState<{
    index: number;
    forPathname: string;
  } | null>(null);

  const [manualRailItems, setManualRailItems] = useState<RailMenuItem[]>([]);

  const registerManualRailItem = useCallback((item: RailMenuItem) => {
    setManualRailItems((prev) =>
      prev.includes(item) ? prev : [...prev, item],
    );
  }, []);

  const unregisterManualRailItem = useCallback((item: RailMenuItem) => {
    setManualRailItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const declaredItems = useMemo(
    () => collectRailMenuItems(menuConfig),
    [menuConfig],
  );

  const effectiveRailItems = useMemo(() => {
    const merged = [...declaredItems];
    for (const m of manualRailItems) {
      if (!merged.includes(m)) merged.push(m);
    }
    return merged;
  }, [declaredItems, manualRailItems]);

  const effectiveMenuConfig = useMemo((): MenuConfig | undefined => {
    if (effectiveRailItems.length === 0) return undefined;
    return { rail: [{ items: effectiveRailItems }] };
  }, [effectiveRailItems]);

  const urlRailMenu = useMemo(
    () =>
      effectiveMenuConfig
        ? findBestRailMenuForPathname(effectiveMenuConfig, pathname)
        : undefined,
    [effectiveMenuConfig, pathname],
  );

  const activeRailMenu = useMemo(() => {
    if (!effectiveMenuConfig) return undefined;
    if (railMenuOverride != null && railMenuOverride.forPathname === pathname) {
      return effectiveRailItems[railMenuOverride.index];
    }
    return urlRailMenu;
  }, [
    effectiveMenuConfig,
    railMenuOverride,
    pathname,
    urlRailMenu,
    effectiveRailItems,
  ]);

  const activeNavItemHref = useMemo(
    () =>
      effectiveMenuConfig
        ? findGlobalActiveLeafNorm(effectiveMenuConfig, pathname)
        : undefined,
    [effectiveMenuConfig, pathname],
  );

  const activeSidebarMenu = useMemo(() => {
    const sidebar = activeRailMenu?.sidebar;
    if (!sidebar) return undefined;
    return findActiveSidebarNavItem(sidebar, activeNavItemHref);
  }, [activeRailMenu, activeNavItemHref]);

  const setActiveRailMenu = useCallback(
    (item: RailMenuItem) => {
      if (!effectiveMenuConfig) return;
      const idx = effectiveRailItems.indexOf(item);
      if (idx < 0) return;
      setRailMenuOverride({ index: idx, forPathname: pathname });
    },
    [effectiveMenuConfig, pathname, effectiveRailItems],
  );

  return useMemo<RootState>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
      activeRailMenu,
      activeSidebarMenu,
      activeNavItemHref,
      setActiveRailMenu,
      registerManualRailItem,
      unregisterManualRailItem,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
      activeRailMenu,
      activeSidebarMenu,
      activeNavItemHref,
      setActiveRailMenu,
      registerManualRailItem,
      unregisterManualRailItem,
    ],
  );
}

function useLayoutSidebarState(): SidebarState {
  const rawSidebar = useSidebar();
  const { isOpen, setOpen, ...rest } = rawSidebar;
  return useMemo(
    () => ({
      ...rest,
      isDesktopOpen: isOpen,
      setDesktopOpen: setOpen,
      isDesktop: !rawSidebar.isMobile,
    }),
    [rawSidebar],
  );
}

function useLayoutRailState(): RailState {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);

  return useMemo<RailState>(
    () => ({
      mobileRailSlot,
      setMobileRailSlot,
    }),
    [mobileRailSlot, setMobileRailSlot],
  );
}

function useLayoutSlotState(): SlotState {
  const [sidebarHeaderAnchor, setSidebarHeaderAnchor] =
    useState<HTMLElement | null>(null);
  const [sidebarHeaderPortalMounts, setSidebarHeaderPortalMounts] = useState(0);

  const [contentHeaderAnchor, setContentHeaderAnchor] =
    useState<HTMLElement | null>(null);
  const [contentHeaderPortalMounts, setContentHeaderPortalMounts] = useState(0);

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

  return useMemo<SlotState>(
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
}

/** Layout 各组件的子节点 */
export type LayoutChild = ReactNode | ((ctx: LayoutContextValue) => ReactNode);

export function renderLayoutChild(
  child: LayoutChild | undefined,
  ctx: LayoutContextValue,
): ReactNode {
  if (child === undefined) return undefined;
  return typeof child === "function" ? child(ctx) : child;
}
