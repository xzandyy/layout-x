import Link from "next/link";

/** 主区；壳与全站 `appRouter`（`@/config/routes`）由 `app/layout` 提供。 */
export default function Home() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <p>
        首页主区；壳与面包屑由根 <code>layout</code> 提供。
      </p>
      <p>
        可前往{" "}
        <Link className="text-accent underline" href="/docs">
          文档
        </Link>
        、
        <Link className="text-accent underline" href="/products">
          产品
        </Link>
        、
        <Link className="text-accent underline" href="/tools">
          工具台
        </Link>
        ；最左 Rail 可切换工作区 / 工具 / 我的，对应不同侧栏。
      </p>
    </div>
  );
}
