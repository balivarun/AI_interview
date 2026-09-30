import { Check, X } from "lucide-react";

export function TestResults({ results }: { results: { passed: boolean; label: string }[] }) {
  const passedCount = results.filter((item) => item.passed).length;

  return (
    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="text-sm font-semibold text-slate-100">Test Results</div>
      <div className="space-y-2">
        {results.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-slate-200">
            {item.passed ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 pt-3 text-sm text-slate-300">
        {passedCount} / {results.length} passed
      </div>
      <div className="text-sm text-slate-300">Runtime: 42 ms</div>
    </div>
  );
}
