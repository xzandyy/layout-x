import Link from "next/link";

export default function ProductsAccessoriesPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">配件</h1>
      <p>充电器、保护壳等配件占位（<code className="font-mono">/products/accessories</code>）。</p>
      <p>
        <Link className="text-accent underline" href="/products">
          产品列表
        </Link>
      </p>
    </div>
  );
}
