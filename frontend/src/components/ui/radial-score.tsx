export function RadialScore({ score, label }: { score: number; label: string }) {
  const percentage = (score / 10) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(#6366f1_0deg,#6366f1_calc(var(--percent)*1%),#1f2937_calc(var(--percent)*1%),#1f2937_360deg)]"
        style={{
          ["--percent" as string]: `${percentage}%`,
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-slate-50">
          {score.toFixed(1)}
        </div>
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
