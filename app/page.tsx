import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 py-16 text-center">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        layout-x
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-fg-1 sm:text-4xl">
        Landing
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-fg-2">
        根路径预留为营销 / 落地页；进入应用请打开工作区。
      </p>
      <Link
        href="/workspace"
        className="rounded-lg bg-surface px-5 py-2.5 text-sm font-medium text-fg-1 shadow-(--shadow-card) ring-1 ring-border-hair transition hover:bg-canvas-2"
      >
        进入 Workspace
      </Link>
    </div>
  );
}
