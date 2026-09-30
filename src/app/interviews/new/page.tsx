"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BriefcaseBusiness, Clock3, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createInterview } from "@/lib/api";
import { interviewConfigSchema } from "@/lib/validations";
import { roleOptions } from "@/lib/mock-data";

type ConfigForm = z.infer<typeof interviewConfigSchema>;

const experienceLevels = ["Fresher", "0–1 Year", "1–3 Years"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;
const types = ["Technical", "DSA", "Mixed"] as const;
const questionCounts = [5, 10, 15] as const;
const durations = [15, 30, 45] as const;

export default function NewInterviewPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ConfigForm>({
    resolver: zodResolver(interviewConfigSchema),
    defaultValues: {
      role: "Java Developer",
      experience: "Fresher",
      difficulty: "Medium",
      type: "Technical",
      questionCount: 10,
      duration: 30,
    },
  });

  const values = watch();

  const onSubmit = async (data: ConfigForm) => {
    const response = await createInterview({
      role: data.role,
      experience: data.experience,
      difficulty: data.difficulty,
      type: data.type,
      questionCount: data.questionCount,
      duration: data.duration,
    });
    router.push(`/interviews/${response.id}/interview`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Prepare</div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-50">Start New Interview</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-0">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-300" /> Role
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {roleOptions.map((role) => (
                  <button
                    type="button"
                    key={role.name}
                    onClick={() => setValue("role", role.name)}
                    className={`rounded-2xl border p-5 text-left transition-colors ${
                      values.role === role.name ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-2xl">{role.icon}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-50">{role.name}</div>
                    <div className="mt-1 text-sm text-slate-400">{role.description}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="mt-2 text-sm text-red-400">{errors.role.message}</p>}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="p-0">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Sparkles className="h-4 w-4 text-indigo-300" /> Experience
                </div>
                <div className="space-y-3">
                  {experienceLevels.map((level) => (
                    <label key={level} className="flex items-center gap-3 text-slate-200">
                      <input type="radio" value={level} {...register("experience")} checked={values.experience === level} readOnly />
                      {level}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="p-5">
                <div className="mb-4 text-sm font-semibold text-slate-100">Difficulty</div>
                <div className="space-y-3">
                  {difficulties.map((level) => (
                    <label key={level} className="flex items-center gap-3 text-slate-200">
                      <input type="radio" value={level} {...register("difficulty")} checked={values.difficulty === level} readOnly />
                      {level}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="p-5">
                <div className="mb-4 text-sm font-semibold text-slate-100">Interview Type</div>
                <div className="space-y-3">
                  {types.map((type) => (
                    <label key={type} className="flex items-center gap-3 text-slate-200">
                      <input type="radio" value={type} {...register("type")} checked={values.type === type} readOnly />
                      {type}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Clock3 className="h-4 w-4 text-indigo-300" /> Duration
                </div>
                <div className="space-y-3">
                  {durations.map((mins) => (
                    <label key={mins} className="flex items-center gap-3 text-slate-200">
                      <input type="radio" value={mins} {...register("duration")} checked={values.duration === mins} readOnly />
                      {mins} min
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="p-0">
            <CardContent className="p-6">
              <div className="mb-4 text-lg font-semibold text-slate-100">Interview Settings</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Number of Questions</label>
                  <div className="flex gap-3">
                    {questionCounts.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setValue("questionCount", count)}
                        className={`rounded-xl border px-4 py-2 text-sm ${
                          values.questionCount === count ? "border-indigo-500 bg-indigo-500/10 text-indigo-200" : "border-slate-700 text-slate-300"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Starting..." : "Start Interview"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
