"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AIMessage, CandidateMessage } from "@/components/interview/ai-message";
import { AnswerInput } from "@/components/interview/answer-input";
import { InterviewProgress } from "@/components/interview/interview-progress";
import { Timer } from "@/components/interview/timer";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { InterviewSkeleton } from "@/components/ui/skeleton";
import { startInterview, submitAnswer, submitCode } from "@/lib/api";
import { QuestionCard } from "@/components/interview/question-card";
import { CodeEditor, LanguageSelector } from "@/components/coding/code-editor";

export default function InterviewScreenPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => startInterview(id),
    enabled: Boolean(id),
  });

  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState<"Java" | "Python" | "C++">("Java");
  const [code, setCode] = useState(`public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const currentQuestionIndex = Math.max(0, (data?.currentQuestion ?? 1) - 1);
  const currentQuestion = data?.questions[currentQuestionIndex];
  const isCodingInterview = data?.type === "DSA" || data?.type === "Mixed" || currentQuestion?.type === "coding";

  if (isLoading) return <AppShell><InterviewSkeleton /></AppShell>;
  if (isError || !data) return <AppShell><ErrorState onRetry={() => refetch()} /></AppShell>;
  if (!currentQuestion) return <AppShell><ErrorState message="We couldn&apos;t load your interview." onRetry={() => refetch()} /></AppShell>;

  const handleNext = async () => {
    setIsSubmitting(true);
    setSubmissionMessage("");
    try {
      if (isCodingInterview) {
        await submitCode({ interviewId: data.id, questionId: currentQuestion.id, language, code });
      }
      const result = await submitAnswer({
        interviewId: data.id,
        questionId: currentQuestion.id,
        answer: isCodingInterview ? code : answer,
        questionType: currentQuestion.type,
      });
      if (result.completed) {
        router.push(`/interviews/${data.id}/report`);
        return;
      }
      setAnswer("");
      await refetch();
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : "Unable to submit your response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    setIsSubmitting(true);
    setSubmissionMessage("");
    try {
      const result = await submitCode({ interviewId: data.id, questionId: currentQuestion.id, language, code });
      setSubmissionMessage(result.status === "NOT_CONFIGURED"
        ? "Code saved. Sandboxed execution is not configured yet."
        : `${result.passed}/${result.total} tests passed.`);
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : "Unable to submit code.");
    } finally {
      setIsSubmitting(false);
    }
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
                <h2 className="text-2xl font-semibold text-slate-50">{currentQuestion.topic}</h2>
                <p className="text-slate-300">{currentQuestion.prompt}</p>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Code Editor</div>
                  <LanguageSelector
                    value={language}
                    onChange={(value) => {
                      if (value === "Java" || value === "Python" || value === "C++") setLanguage(value);
                    }}
                  />
                </div>
                <CodeEditor language={language} code={code} onChange={setCode} />
                <div className="flex flex-wrap justify-between gap-3">
                  <Button variant="outline" onClick={handleRunCode} disabled={isSubmitting}>Run Code</Button>
                  <Button onClick={handleNext} disabled={isSubmitting}>
                    Submit Solution
                  </Button>
                </div>
                {submissionMessage && <p role="status" className="text-sm text-slate-300">{submissionMessage}</p>}
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
              {submissionMessage && <p role="alert" className="text-sm text-red-400">{submissionMessage}</p>}
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
