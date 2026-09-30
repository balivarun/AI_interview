import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export function RecentInterviews({ items }: { items: { id: string; role: string; score: number; difficulty: string; date: string }[] }) {
  return (
    <Card className="p-0">
      <CardContent className="p-5">
        <SectionHeader title="Recent Interviews" />
        <div className="space-y-3">
          {items.map((item) => (
            <Link href={`/interviews/${item.id}/report`} key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/40 p-3 hover:bg-slate-800/70">
              <div>
                <div className="font-medium text-slate-100">{item.role}</div>
                <div className="text-xs text-slate-400">{item.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-indigo-200">{item.score.toFixed(1)}/10</span>
                <span className="text-xs text-slate-400">{item.difficulty}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
