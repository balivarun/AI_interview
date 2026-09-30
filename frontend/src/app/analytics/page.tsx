"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { RadarChartPanel } from "@/components/charts/radar-chart";
import { Card, CardContent } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getAnalytics } from "@/lib/api";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });

  if (isLoading || !data) return <AppShell><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-50">Analytics</h1>

        <Card className="p-0">
          <CardContent className="p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-50">Overall Progress</h2>
            <PerformanceChart data={data.performance} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-0">
            <CardContent className="p-5">
              <h2 className="mb-4 text-xl font-semibold text-slate-50">Skill Breakdown</h2>
              <RadarChartPanel data={data.skillBreakdown} />
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="p-5">
              <h2 className="mb-4 text-xl font-semibold text-slate-50">Topic Performance</h2>
              <div className="space-y-4">
                {data.topicPerformance.map((item) => (
                  <div key={item.topic}>
                    <div className="mb-1 flex justify-between text-sm text-slate-300">
                      <span>{item.topic}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0">
          <CardContent className="p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-50">Improvement Areas</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {data.topicPerformance
                .slice()
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((item) => (
                  <span key={item.topic} className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-200">
                    {item.topic} ({item.score}%)
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
