import { WorkspaceLayout } from "@/components/workspace-layout";
import { productBreadcrumbTree } from "@/lib/breadcrumb-example";

type Props = {
  params: Promise<{ type: string; year: string; id: string }>;
};

export default async function ProductPhoneDetailPage({ params }: Props) {
  const { type, year, id } = await params;

  return (
    <WorkspaceLayout
      breadcrumbRoute={productBreadcrumbTree}
      main={
        <div className="space-y-2 p-4 text-sm">
          <p>
            手机详情（<code className="font-mono">/products/phones/[type]/[year]/[id]</code>）
          </p>
          <p>
            动态段：
            <code className="font-mono"> type = {type}</code>，{" "}
            <code className="font-mono"> year = {year}</code>，{" "}
            <code className="font-mono"> id = {id}</code>
          </p>
        </div>
      }
    />
  );
}
