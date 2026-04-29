"use client";

import { Button } from "@heroui/react";
import { Pencil } from "@gravity-ui/icons";

import { Layout } from "@/components/Layout";
import { ThemeToggle } from "@/components/Theme";
import {
  useWorkspaceMenus,
  workspaceRailSettings,
} from "@/config/workspace-menus";

export function WorkspaceLayoutShell({
  defaultSidebarOpen,
  children,
}: {
  defaultSidebarOpen: boolean;
  children: React.ReactNode;
}) {
  const { menuConfig } = useWorkspaceMenus();

  return (
    <Layout menuConfig={menuConfig} defaultSidebarOpen={defaultSidebarOpen}>
      <Layout.Rail>
        <Layout.RailHeader>
          <div className="mb-2 flex items-center justify-center py-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-linear-to-br from-[#4F8AF7] to-[#2056B3] font-semibold tracking-[-0.01em] text-white"
              title="Brand / Logo"
            >
              X
            </div>
          </div>
        </Layout.RailHeader>
        <Layout.RailMain />
        <Layout.RailFooter>
          <div className="flex flex-col items-center gap-2 px-0 py-3">
            <Layout.RailMenuItem item={workspaceRailSettings} />
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#EFC6A7] to-[#E8763A] font-semibold text-[11px] text-white"
              title="Account"
            >
              LX
            </div>
          </div>
        </Layout.RailFooter>
      </Layout.Rail>
      <Layout.Sidebar>
        <Layout.SidebarHeader>
          {(ctx) => (
            <div className="sb-head flex items-center px-2 py-3">
              <div className="min-w-0 flex-1">
                <div className="sb-title truncate text-[1rem] font-medium text-fg-1">
                  {ctx.rootState.activeRailMenu?.label ?? "Workspace"}
                </div>
                <div className="sb-title-sub truncate text-xs text-fg-4">
                  Workspace · Astrid
                </div>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label="Edit"
                className={
                  "size-7 min-w-7 shrink-0 rounded-md! p-0 text-fg-3 hover:bg-canvas-2! hover:text-fg-1!"
                }
              >
                <Pencil className="size-3.5 text-current" />
              </Button>
              <ThemeToggle className="ml-1" />
            </div>
          )}
        </Layout.SidebarHeader>
        <Layout.SidebarMain />
        <Layout.SidebarFooter>
          <div className="flex items-center gap-2 px-2.5 py-3 text-[12.5px] text-fg-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-[#EFC6A7] to-[#E8763A] text-[11px] font-semibold text-white">
              LX
            </div>
            <div className="flex min-w-0 flex-col leading-tight gap-0.5">
              <span className="truncate font-medium text-fg-1">layout-x</span>
              <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                Workspace
              </span>
            </div>
          </div>
        </Layout.SidebarFooter>
      </Layout.Sidebar>
      <Layout.Content>
        <Layout.ContentHeader />
        <Layout.ContentBody>{children}</Layout.ContentBody>
        <Layout.ContentFooter />
      </Layout.Content>
    </Layout>
  );
}
