"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { renderLayoutChild, useLayout, type LayoutChild } from "./context";

export type LayoutHeaderSlotChildren = LayoutChild;

/**
 * 将解析后的节点 Portal 到 `SidebarHeader` 挂载点。
 */
export function useLayoutSidebarHeaderSlot(
  children?: LayoutHeaderSlotChildren,
): ReactNode {
  const ctx = useLayout();
  const resolved = renderLayoutChild(children, ctx);
  const {
    sidebarHeaderAnchor,
    registerSidebarHeaderPortal,
    unregisterSidebarHeaderPortal,
  } = ctx.slotState;

  useLayoutEffect(() => {
    registerSidebarHeaderPortal();
    return () => {
      unregisterSidebarHeaderPortal();
    };
  }, [registerSidebarHeaderPortal, unregisterSidebarHeaderPortal]);

  if (sidebarHeaderAnchor == null) return null;
  return createPortal(resolved ?? null, sidebarHeaderAnchor);
}

/**
 * 将解析后的节点 Portal 到 `ContentHeader` 挂载点。
 */
export function useLayoutContentHeaderSlot(
  children?: LayoutHeaderSlotChildren,
): ReactNode {
  const ctx = useLayout();
  const resolved = renderLayoutChild(children, ctx);
  const {
    contentHeaderAnchor,
    registerContentHeaderPortal,
    unregisterContentHeaderPortal,
  } = ctx.slotState;

  useLayoutEffect(() => {
    registerContentHeaderPortal();
    return () => {
      unregisterContentHeaderPortal();
    };
  }, [registerContentHeaderPortal, unregisterContentHeaderPortal]);

  if (contentHeaderAnchor == null) return null;
  return createPortal(resolved ?? null, contentHeaderAnchor);
}

type SlotProps = {
  /** 静态节点，或 `(ctx) => ReactNode` */
  children?: LayoutChild;
};

// 组件形式
export function LayoutSidebarHeaderSlot({ children }: SlotProps) {
  return useLayoutSidebarHeaderSlot(children);
}

// 组件形式
export function LayoutContentHeaderSlot({ children }: SlotProps) {
  return useLayoutContentHeaderSlot(children);
}
