import Link from "next/link";

import { WorkspaceLayout } from "@/components/workspace-layout";
import { productBreadcrumbTree } from "@/lib/breadcrumb-example";

export default function ProductsPage() {
  return (
    <WorkspaceLayout
      breadcrumbRoute={productBreadcrumbTree}
      main={
        <div className="space-y-3 p-4 text-sm">
          <p>产品列表占位（<code className="font-mono">/products</code>）。</p>
          <p>
            下一级：{" "}
            <Link className="text-accent underline" href="/products/phones">
              /products/phones
            </Link>
          </p>
        </div>
      }
    />
  );
}
