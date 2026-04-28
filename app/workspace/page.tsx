"use client";

export default function WorkspaceHomePage() {
  return (
    <div className="w-full space-y-4 p-5 text-left">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        Workspace
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Home</h1>
      <p className="text-[15px] leading-relaxed text-fg-2">
        EasyX Appkit-style home: Overview in the sidebar and the first rail slot
        for the workspace entry.
      </p>
    </div>
  );
}
