"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { MonthlyOverview } from "@/components/dashboard/monthly-overview";
import { RecentInterviews } from "@/components/dashboard/recent-interviews";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getDashboard } from "@/lib/api";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });

  if (isLoading || !data) return <AppShell><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Overview</div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50">Welcome back, {data.user.name.split(" ")[0]}</h1>
            <p className="mt-2 text-slate-400">Ready for your next interview?</p>
          </div>
          <Link href="/interviews/new">
            <Button size="lg" className="gap-2">
              Start New Interview <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
          ))}
        </div>

        <MonthlyOverview data={data.performance} />

        <RecentInterviews items={data.recentInterviews} />
      </div>
    </AppShell>
  );
}
