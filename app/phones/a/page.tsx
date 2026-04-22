import { WorkspaceLayout } from "@/components/workspace-layout";
import { phonesSegmentBreadcrumbTree } from "@/lib/breadcrumb-example";

export default function PhonesAPage() {
  return (
    <WorkspaceLayout
      breadcrumbRoute={phonesSegmentBreadcrumbTree}
      main={
        <p className="p-4 text-sm">
          本页路径为 <code className="font-mono">/phones/a</code>：面包屑中「手机」仅展示、不可点（
          <code>hasPage: false</code>），「首页」可回 <code>/</code>，「A 区」为当前页。
        </p>
      }
    />
  );
}
