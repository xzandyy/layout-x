import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">文档中心</h1>
      <p>集中存放说明与快速入口（<code className="font-mono">/docs</code>）。</p>
      <p>
        子页：{" "}
        <Link className="text-accent underline" href="/docs/guide">
          使用指南
        </Link>
      </p>
    </div>
  );
}
