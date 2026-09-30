export function Timer({ secondsLeft }: { secondsLeft: number }) {
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Time Remaining</div>
      <div className="mt-2 text-2xl font-semibold text-slate-50">
        {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
    </div>
  );
}
