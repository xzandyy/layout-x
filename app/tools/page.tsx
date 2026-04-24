import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">工具台</h1>
      <p>快捷工具与操作入口（<code className="font-mono">/tools</code>）。</p>
      <p>
        侧栏可切换到「工作区」查看完整导航，或去{" "}
        <Link className="text-accent underline" href="/docs">
          文档
        </Link>
        、
        <Link className="text-accent underline" href="/support">
          支持
        </Link>
        。
      </p>
    </div>
  );
}
