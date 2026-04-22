import { WorkspaceLayout } from "@/components/workspace-layout";
import { homeBreadcrumbRoute } from "@/lib/breadcrumb-example";

export default function Home() {
  return <WorkspaceLayout breadcrumbRoute={homeBreadcrumbRoute} />;
}
