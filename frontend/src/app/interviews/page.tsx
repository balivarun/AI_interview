"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getHistory } from "@/lib/api";

export default function InterviewHistoryPage() {
  const { data, isLoading } = useQuery({ queryKey: ["interview-history"], queryFn: getHistory });

  if (isLoading || !data) return <AppShell><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-50">Interview History</h1>
          <div className="flex gap-2 text-sm text-slate-400">
            <span className="rounded-lg border border-slate-700 px-3 py-2">All Roles</span>
            <span className="rounded-lg border border-slate-700 px-3 py-2">All Difficulty</span>
            <span className="rounded-lg border border-slate-700 px-3 py-2">Date</span>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm text-slate-200">
                <thead className="bg-slate-950/70 text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium">Difficulty</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                      <td className="px-5 py-4 font-medium text-slate-100">
                        <Link
                          href={item.status === "completed" ? `/interviews/${item.id}/report` : `/interviews/${item.id}`}
                          className="hover:text-indigo-300"
                        >
                          {item.role}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{item.score.toFixed(1)}</td>
                      <td className="px-5 py-4">{item.difficulty}</td>
                      <td className="px-5 py-4 text-slate-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
