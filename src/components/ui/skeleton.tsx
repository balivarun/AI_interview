import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return <div className={cn("h-28 animate-pulse rounded-2xl border border-slate-700 bg-slate-800/80", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-56 animate-pulse rounded-xl bg-slate-800" />
      <div className="grid gap-4 md:grid-cols-3">
        <CardSkeleton className="h-36" />
        <CardSkeleton className="h-36" />
        <CardSkeleton className="h-36" />
      </div>
      <CardSkeleton className="h-72" />
    </div>
  );
}

export function InterviewSkeleton() {
  return (
    <div className="space-y-5">
      <CardSkeleton className="h-32" />
      <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
        <CardSkeleton className="h-[380px]" />
        <CardSkeleton className="h-[380px]" />
      </div>
    </div>
  );
}

export function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <CardSkeleton className="h-24" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
      </div>
      <CardSkeleton className="h-60" />
    </div>
  );
}
