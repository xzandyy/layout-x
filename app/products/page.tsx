import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <p>
        产品列表占位（<code className="font-mono">/products</code>）。
      </p>
      <p>
        下一级：{" "}
        <Link className="text-accent underline" href="/products/phones">
          /products/phones
        </Link>
      </p>
    </div>
  );
}
