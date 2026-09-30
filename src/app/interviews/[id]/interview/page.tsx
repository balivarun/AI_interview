"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AIMessage, CandidateMessage } from "@/components/interview/ai-message";
import { AnswerInput } from "@/components/interview/answer-input";
import { InterviewProgress } from "@/components/interview/interview-progress";
import { Timer } from "@/components/interview/timer";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { InterviewSkeleton } from "@/components/ui/skeleton";
import { getInterview, submitAnswer } from "@/lib/api";
import { QuestionCard } from "@/components/interview/question-card";
import { CodeEditor, LanguageSelector, TestResults } from "@/components/coding/code-editor";

export default function InterviewScreenPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
    enabled: Boolean(id),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState(`public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = useMemo(() => data?.questions[currentQuestionIndex], [data, currentQuestionIndex]);
  const isCodingInterview = data?.type === "DSA" || data?.type === "Mixed" || currentQuestion?.type === "coding";

  if (isLoading) return <AppShell><InterviewSkeleton /></AppShell>;
  if (isError || !data) return <AppShell><ErrorState onRetry={() => refetch()} /></AppShell>;
  if (!currentQuestion) return <AppShell><ErrorState message="We couldn&apos;t load your interview." onRetry={() => refetch()} /></AppShell>;

  const handleNext = async () => {
    setIsSubmitting(true);
    await submitAnswer({
      interviewId: data.id,
      questionId: currentQuestion.id,
      answer,
      questionType: currentQuestion.type,
    });
    setIsSubmitting(false);

    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswer("");
      return;
    }

    router.push(`/interviews/${data.id}/report`);
  };

  if (isCodingInterview) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">DSA Interview</div>
              <h1 className="mt-1 text-3xl font-semibold text-slate-50">{data.role}</h1>
            </div>
            <div className="text-sm text-slate-300">Question {currentQuestionIndex + 1}/{data.totalQuestions}</div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
            <Card className="p-0">
              <CardContent className="space-y-4 p-5">
                <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Problem</div>
                <h2 className="text-2xl font-semibold text-slate-50">Two Sum</h2>
                <p className="text-slate-300">Given an array of integers and a target value, return the indices of the two numbers that add up to the target.</p>
                <div className="space-y-2">
                  <div className="font-medium text-slate-100">Examples</div>
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
                    Input: [2,7,11,15] <br />
                    Target: 9 <br />
                    Output: [0,1]
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-100">Constraints</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                    <li>2 &lt;= nums.length &lt;= 10^4</li>
                    <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Code Editor</div>
                  <LanguageSelector value={language} onChange={setLanguage} />
                </div>
                <CodeEditor language={language} code={code} onChange={setCode} />
                <div className="flex flex-wrap justify-between gap-3">
                  <Button variant="outline">Run Code</Button>
                  <Button onClick={handleNext} disabled={isSubmitting}>
                    {currentQuestionIndex === data.questions.length - 1 ? "Submit Solution" : "Submit Solution"}
                  </Button>
                </div>
                <TestResults results={[
                  { passed: true, label: "Test Case 1" },
                  { passed: true, label: "Test Case 2" },
                  { passed: true, label: "Test Case 3" },
                  { passed: false, label: "Test Case 4" },
                ]} />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">AI Interviewer</div>
            <h1 className="mt-1 text-3xl font-semibold text-slate-50">{data.role}</h1>
          </div>
          <div className="text-sm text-slate-300">Question {currentQuestionIndex + 1}/{data.totalQuestions}</div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.7fr_0.9fr]">
          <Card className="p-0">
            <CardContent className="space-y-5 p-5">
              <AIMessage text={currentQuestion.prompt} />
              <QuestionCard prompt={currentQuestion.prompt} topic={currentQuestion.topic} difficulty={currentQuestion.difficulty} />
              <AnswerInput value={answer} onChange={setAnswer} />
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={isSubmitting || !answer.trim()}>
                  {currentQuestionIndex === data.questions.length - 1 ? "Submit Interview" : "Submit Answer"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="space-y-5 p-5">
              <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Interview Progress</div>
              <InterviewProgress current={currentQuestionIndex + 1} total={data.totalQuestions} />
              <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Topic</div>
                <div className="text-lg font-medium text-slate-100">{currentQuestion.topic}</div>
              </div>
              <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Difficulty</div>
                <div className="text-lg font-medium text-slate-100">{currentQuestion.difficulty}</div>
              </div>
              <Timer secondsLeft={18 * 60 + 42} />
            </CardContent>
          </Card>
        </div>

        <CandidateMessage text={answer || "Your answer will appear here..."} />
      </div>
    </AppShell>
  );
}
