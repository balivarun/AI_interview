export function InterviewProgress({ current, total }: { current: number; total: number }) {
  const percent = (current / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Progress</span>
        <span>{current}/{total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
