"use client";

import { type ReactNode, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import { useLayout } from "./context";

/**
 * 将 `children` Portal 到 `SidebarHeader` 挂载点。
 */
export function LayoutSidebarHeaderSlot({
  children,
}: {
  children: ReactNode;
}) {
  const { slotState } = useLayout();
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
  return createPortal(children, anchor);
}

/**
 * 将 `children` Portal 到 `ContentHeader` 挂载点。
 */
export function LayoutContentHeaderSlot({
  children,
}: {
  children: ReactNode;
}) {
  const { slotState } = useLayout();
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
  return createPortal(children, anchor);
}
