import Link from "next/link";

export default function ProductsLaptopsPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">笔记本</h1>
      <p>笔记本产品线占位（<code className="font-mono">/products/laptops</code>）。</p>
      <p>
        <Link className="text-accent underline" href="/products">
          产品列表
        </Link>
      </p>
    </div>
  );
}
