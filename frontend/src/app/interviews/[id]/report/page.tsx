"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { PageSkeleton } from "@/components/ui/skeleton";
import { RadialScore } from "@/components/ui/radial-score";
import { getReport, retryPendingEvaluations } from "@/lib/api";

export default function InterviewReportPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");
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
  const hasEvaluation = report.evaluatedQuestions > 0;

  const retryEvaluations = async () => {
    setIsRetrying(true);
    setRetryError("");
    try {
      await retryPendingEvaluations(id);
      await refetch();
    } catch (error) {
      setRetryError(error instanceof Error ? error.message : "Evaluation retry failed.");
    } finally {
      setIsRetrying(false);
    }
  };

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
              {hasEvaluation ? `${report.score.toFixed(1)} / 10` : "Pending"}
            </div>
            {hasEvaluation && report.evaluationPending && (
              <div className="mt-1 text-xs text-amber-300">
                {report.evaluatedQuestions}/{report.totalAnswers} evaluated
              </div>
            )}
          </div>
        </div>

        {report.evaluationPending && (
          <Card className="p-0">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <p className="text-sm text-slate-300">
                {hasEvaluation
                  ? `Evaluation is pending for ${report.totalAnswers - report.evaluatedQuestions} answer(s). Existing scores are shown below.`
                  : "Your answers are saved. AI evaluation is pending."}
              </p>
              <Button onClick={retryEvaluations} disabled={isRetrying}>
                {isRetrying ? "Retrying..." : "Retry evaluation"}
              </Button>
              {retryError && <p role="alert" className="w-full text-sm text-red-400">{retryError}</p>}
            </CardContent>
          </Card>
        )}

        {hasEvaluation && (
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