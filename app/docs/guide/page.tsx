import Link from "next/link";

export default function DocsGuidePage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">使用指南</h1>
      <p>
        分步操作与约定说明（<code className="font-mono">/docs/guide</code>）。
      </p>
      <p>
        <Link className="text-accent underline" href="/docs">
          返回文档中心
        </Link>
      </p>
    </div>
  );
}
