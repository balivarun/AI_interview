import type { ReactNode } from "react";

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
      {action}
    </div>
  );
}
