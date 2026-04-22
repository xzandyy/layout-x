import Link from "next/link";

import { WorkspaceLayout } from "@/components/workspace-layout";
import { productBreadcrumbTree } from "@/lib/breadcrumb-example";

export default function ProductsPhonesPage() {
  return (
    <WorkspaceLayout
      breadcrumbRoute={productBreadcrumbTree}
      main={
        <div className="space-y-3 p-4 text-sm">
          <p>手机分类占位（<code className="font-mono">/products/phones</code>）。</p>
          <p>
            年份层（<code>year</code> 有 page）：
            <Link
              className="ml-1 text-accent underline"
              href="/products/phones/pro/2024"
            >
              /products/phones/pro/2024
            </Link>
          </p>
          <p>
            详情示例：{" "}
            <Link
              className="text-accent underline"
              href="/products/phones/pro/2024/42"
            >
              /products/phones/pro/2024/42
            </Link>{" "}
            （<code>pro</code> / <code>2024</code> / <code>42</code> 为 type / year / id）
          </p>
        </div>
      }
    />
  );
}
