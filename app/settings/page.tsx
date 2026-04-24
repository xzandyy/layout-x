import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">账户设置</h1>
      <p>通知、语言与安全项占位（<code className="font-mono">/settings</code>）。</p>
      <p>
        <Link className="text-accent underline" href="/profile">
          返回个人资料
        </Link>
      </p>
    </div>
  );
}
