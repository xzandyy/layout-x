import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="space-y-3 p-4 text-sm">
      <h1 className="text-base font-semibold">个人资料</h1>
      <p>展示名、邮箱等占位（<code className="font-mono">/profile</code>）。</p>
      <p>
        <Link className="text-accent underline" href="/settings">
          账户设置
        </Link>
      </p>
    </div>
  );
}
