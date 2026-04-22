import Link from "next/link";

import { WorkspaceLayout } from "@/components/workspace-layout";
import { productBreadcrumbTree } from "@/lib/breadcrumb-example";

type Props = {
  params: Promise<{ type: string; year: string }>;
};

export default async function ProductPhonesTypeYearPage({ params }: Props) {
  const { type, year } = await params;

  return (
    <WorkspaceLayout
      breadcrumbRoute={productBreadcrumbTree}
      main={
        <div className="space-y-3 p-4 text-sm">
          <p>
            该类型 + 年份 列表/汇总页（<code className="font-mono">/products/phones/[type]/[year]</code>，对应
            面包屑「年份」可点）。
          </p>
          <p>
            动态段：<code className="font-mono">type = {type}</code>，{" "}
            <code className="font-mono">year = {year}</code>
          </p>
          <p>
            进入某条详情：{" "}
            <Link
              className="text-accent underline"
              href={`/products/phones/${encodeURIComponent(type)}/${encodeURIComponent(year)}/42`}
            >
              /products/phones/{type}/{year}/42
            </Link>
          </p>
        </div>
      }
    />
  );
}
