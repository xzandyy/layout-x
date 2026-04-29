export default async function DmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pretty = slug.replace(/-/g, " ");
  return (
    <div className="w-full space-y-4 p-5 text-left">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        Direct messages
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-1">{pretty}</h1>
      <p className="font-mono text-[11px] text-fg-4">/{slug}</p>
      <p className="text-[15px] leading-relaxed text-fg-2">
        DM placeholder — sidebar uses initials avatars for contacts.
      </p>
    </div>
  );
}
