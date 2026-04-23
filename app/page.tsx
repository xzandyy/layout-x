import Link from "next/link";

/** 主区；壳与全站 `appRouter`（`@/config/routes`）由 `app/layout` 提供。 */
export default function Home() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <p>
        首页主区；壳与面包屑由根 <code>layout</code> 提供。
      </p>
      <p>
        前往{" "}
        <Link className="text-accent underline" href="/products">
          /products
        </Link>
      </p>
    </div>
  );
}
