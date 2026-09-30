"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { RadialScore } from "@/components/ui/radial-score";
import { getReport } from "@/lib/api";

export default function InterviewReportPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const { data: report, isLoading, isError, refetch } = useQuery({
    queryKey: ["interview-report", id],
    queryFn: () => getReport(id),
    enabled: Boolean(id),
  });

  if (isError) return <AppShell><ErrorState message="The report is not available yet." onRetry={() => refetch()} /></AppShell>;
  if (isLoading || !report) return <AppShell><PageSkeleton /></AppShell>;

  const scoreCards = [
    { label: "Technical Knowledge", value: report.technicalKnowledge },
    { label: "Problem Solving", value: report.problemSolving },
    { label: "Communication", value: report.communication },
    { label: "Code Quality", value: report.codeQuality },
    { label: "Complexity Analysis", value: report.complexityAnalysis },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">{report.role}</div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50">Interview Completed</h1>
            <p className="mt-2 text-slate-400">Completed {report.completedAt}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Overall Score</div>
            <div className="mt-1 text-3xl font-semibold text-slate-50">
              {report.evaluationPending ? "Pending" : `${report.score.toFixed(1)} / 10`}
            </div>
          </div>
        </div>

        {report.evaluationPending ? (
          <Card className="p-0">
            <CardContent className="p-5 text-sm text-slate-300">
              Your answers are saved. Scores and feedback will appear when AI evaluation is available.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {scoreCards.map((card) => (
              <Card key={card.label} className="p-0">
                <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                  <RadialScore score={card.value} label={card.label} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-0">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-slate-50">Strong Areas</h2>
              <ul className="space-y-3 text-slate-200">
                {report.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="p-0">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-slate-50">Areas to Improve</h2>
              <ul className="space-y-3 text-slate-200">
                {report.weaknesses.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-50">Recommended Practice</h2>
            <div className="space-y-4">
              {report.recommendedTopics.map((topic, index) => (
                <div key={topic.title} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                  <div>
                    <div className="text-lg font-medium text-slate-100">{index + 1}. {topic.title}</div>
                    <div className="text-sm text-slate-400">{topic.difficulty}</div>
                  </div>
                  <Button variant="secondary">{topic.action}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}