"use client";

import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import {
  renderLayoutChild,
  useLayout,
  type LayoutChild,
} from "./context";

type SlotProps = {
  /** 静态节点，或 `(ctx) => ReactNode` */
  children?: LayoutChild;
};

/**
 * 将解析后的节点 Portal 到 `SidebarHeader` 挂载点。
 */
export function LayoutSidebarHeaderSlot({ children }: SlotProps) {
  const ctx = useLayout();
  const resolved = renderLayoutChild(children, ctx);
  const { slotState } = ctx;
  const anchor = slotState.sidebarHeaderAnchor;
  const { registerSidebarHeaderPortal, unregisterSidebarHeaderPortal } =
    slotState;

  useLayoutEffect(() => {
    registerSidebarHeaderPortal();
    return () => {
      unregisterSidebarHeaderPortal();
    };
  }, [registerSidebarHeaderPortal, unregisterSidebarHeaderPortal]);

  if (anchor == null) return null;
  return createPortal(resolved ?? null, anchor);
}

/**
 * 将解析后的节点 Portal 到 `ContentHeader` 挂载点。
 */
export function LayoutContentHeaderSlot({ children }: SlotProps) {
  const ctx = useLayout();
  const resolved = renderLayoutChild(children, ctx);
  const { slotState } = ctx;
  const anchor = slotState.contentHeaderAnchor;
  const { registerContentHeaderPortal, unregisterContentHeaderPortal } =
    slotState;

  useLayoutEffect(() => {
    registerContentHeaderPortal();
    return () => {
      unregisterContentHeaderPortal();
    };
  }, [registerContentHeaderPortal, unregisterContentHeaderPortal]);

  if (anchor == null) return null;
  return createPortal(resolved ?? null, anchor);
}
