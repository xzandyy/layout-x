import Link from "next/link";

/**
 * 主区内容。全站唯一 `WorkspaceLayout` 与统一 `appBreadcrumbTree` 在
 * `app/layout.tsx`（`route-trees` 已并入该处根为 `/` 的树）。
 */
export default function Home() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <p>首页主区；壳与面包屑由根 <code>layout</code> 提供。</p>
      <p>
        前往{" "}
        <Link className="text-accent underline" href="/products">
          /products
        </Link>
      </p>
    </div>
  );
}
