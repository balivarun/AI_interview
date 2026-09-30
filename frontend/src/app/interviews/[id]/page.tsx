"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getInterview } from "@/lib/api";

export default function InterviewSummaryPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const { data: interview, isLoading, isError, refetch } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
    enabled: Boolean(id),
  });

  if (isError) return <AppShell><ErrorState onRetry={() => refetch()} /></AppShell>;
  if (isLoading || !interview) return <AppShell><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-0">
          <CardContent className="space-y-4 p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Interview Session</div>
            <h1 className="text-3xl font-semibold text-slate-50">{interview.role}</h1>
            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700 px-2 py-1">{interview.type}</span>
              <span className="rounded-full border border-slate-700 px-2 py-1">{interview.difficulty}</span>
              <span className="rounded-full border border-slate-700 px-2 py-1">{interview.totalQuestions} questions</span>
            </div>
            <p className="text-slate-400">This interview will cover {interview.topic} and is designed for {interview.experience} candidates.</p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={`/interviews/${interview.id}`}>
            <Button variant="outline">View Questions</Button>
          </Link>
          <Link href={interview.status === "completed" ? `/interviews/${interview.id}/report` : `/interviews/${interview.id}/interview`}>
            <Button>{interview.status === "completed" ? "View Report" : interview.status === "active" ? "Continue Interview" : "Start Interview"}</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
