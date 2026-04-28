import { Button } from "@heroui/react";
import { EllipsisVertical, Pencil } from "@gravity-ui/icons";

import { Layout } from "@/components/Layout/layout";
import { cn } from "@/lib/utils";
import { workspaceRoute } from "@/config/workspace-route";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <Layout route={workspaceRoute}>
        <Layout.Rail>
          <Layout.RailHeader>
            <div className="mb-2 flex items-center justify-center py-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-linear-to-br from-[#4F8AF7] to-[#2056B3] text-[11px] font-semibold tracking-[-0.01em] text-white"
                title="Brand / Logo"
              >
                LX
              </div>
            </div>
          </Layout.RailHeader>
          <Layout.RailMain />
          <Layout.RailFooter>
            <div className="flex justify-center py-3">
              <div
                className="h-7 w-7 rounded-full bg-linear-to-br from-[#EFC6A7] to-[#E8763A]"
                title="Account"
              />
            </div>
          </Layout.RailFooter>
        </Layout.Rail>
        <Layout.Sidebar>
          <Layout.SidebarHeader>
            <div className="sb-head flex items-center px-2 py-3">
              <div className="min-w-0 flex-1">
                <div className="sb-title truncate text-[1rem] font-medium text-fg-1">
                  Workspace
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
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label="More"
                className={cn(
                  "size-7 min-w-7 shrink-0 rounded-md! p-0 text-fg-3 hover:bg-canvas-2! hover:text-fg-1!",
                  "ml-1",
                )}
              >
                <EllipsisVertical className="size-3.5 text-current" />
              </Button>
            </div>
          </Layout.SidebarHeader>
          <Layout.SidebarMain />
          <Layout.SidebarFooter>
            <div className="flex items-center gap-2 px-2.5 py-3 text-[12.5px] text-fg-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-[#EFC6A7] to-[#E8763A] text-[11px] font-semibold text-white">
                LX
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-medium text-fg-1">layout-x</span>
                <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-4">
                  Workspace
                </span>
              </div>
            </div>
          </Layout.SidebarFooter>
        </Layout.Sidebar>
        <Layout.Content>
          <Layout.ContentHeader>
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <div className="hidden min-w-40 max-w-xs rounded-lg border border-border-hair bg-canvas px-3 py-1.5 text-left text-[12px] text-fg-4 md:block">
                Search workspace…
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
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label="More"
                className={
                  "size-7 min-w-7 shrink-0 rounded-md! p-0 text-fg-3 hover:bg-canvas-2! hover:text-fg-1!"
                }
              >
                <EllipsisVertical className="size-3.5 text-current" />
              </Button>
            </div>
          </Layout.ContentHeader>
          <Layout.ContentBody>{children}</Layout.ContentBody>
        </Layout.Content>
      </Layout>
    </div>
  );
}
