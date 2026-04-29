export default async function AgentTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return (
    <div className="w-full space-y-4 p-5 text-left">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        Agents · Templates
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-1">
        {title}
      </h1>
      <p className="font-mono text-[11px] text-fg-4">/{slug}</p>
      <p className="text-[15px] leading-relaxed text-fg-2">
        Reusable agent template — sidebar · TEMPLATES.
      </p>
    </div>
  );
}
