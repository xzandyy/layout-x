import "server-only";

import { cookies } from "next/headers";

import { LayoutRootClient } from "./root-client";
import type { RootProps } from "./root-client";

export async function LayoutRoot(props: RootProps) {
  const store = await cookies();
  const defaultSidebarOpen = store.get("sidebar_state")?.value !== "false";
  return (
    <LayoutRootClient {...props} defaultSidebarOpen={defaultSidebarOpen} />
  );
}
