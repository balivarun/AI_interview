import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="p-5">
      <div className="text-3xl font-bold text-slate-50">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
      <div className="mt-1 text-xs text-indigo-300">{detail}</div>
    </Card>
  );
}
