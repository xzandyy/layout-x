import { cookies } from "next/headers";

import { WorkspaceLayoutShell } from "./workspace-layout-shell";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const defaultSidebarOpen = store.get("sidebar_state")?.value !== "false";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <WorkspaceLayoutShell defaultSidebarOpen={defaultSidebarOpen}>
        {children}
      </WorkspaceLayoutShell>
    </div>
  );
}
