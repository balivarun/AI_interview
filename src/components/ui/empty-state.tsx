import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        {actionLabel && (
          <Button className="mt-5" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
