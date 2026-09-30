import Link from "next/link";
import { ArrowRight, BrainCircuit, Code2, Gauge, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { title: "AI-powered interviews", description: "Adaptive technical conversations tailored to your target role." },
  { title: "Adaptive follow-up questions", description: "Refine your answers dynamically based on your responses." },
  { title: "DSA coding challenges", description: "Practice algorithmic thinking in a realistic IDE environment." },
  { title: "Detailed performance analysis", description: "Review strengths, weaknesses, and recommended practice topics." },
  { title: "Personalized weak-topic tracking", description: "Spot your gaps and improve with focused recommendations." },
];

const steps = [
  "Choose your role",
  "Start your interview",
  "Answer AI questions",
  "Get detailed feedback",
];

const roles = [
  { name: "Java Developer", icon: "☕", blurb: "Java + Spring" },
  { name: "SDE", icon: "💻", blurb: "DSA + CS Core" },
  { name: "Full Stack Developer", icon: "🌐", blurb: "Frontend + Backend" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">AI</div>
            <div>
              <div className="font-semibold">Interview Simulator</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Start Interview</Button>
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">
              <Sparkles className="mr-2 h-4 w-4" /> AI-Powered Technical Interview Practice
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-slate-50">
              Practice realistic software engineering interviews with an adaptive AI interviewer.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Simulate real interview loops for Java, SDE, and full stack roles — with follow-up questions, coding tasks, and scorecards.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/sign-in">
                <Button size="lg" className="gap-2">
                  Start Interview <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">View Demo</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/10">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Live Session</div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">Online</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-sm text-indigo-300">
                  <BrainCircuit className="h-4 w-4" /> AI Interviewer
                </div>
                <p className="mt-3 text-base text-slate-100">What is the difference between HashMap and ConcurrentHashMap in Java?</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                  <div className="text-sm text-slate-400">Topic</div>
                  <div className="mt-2 text-lg font-semibold text-slate-50">Java Collections</div>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                  <div className="text-sm text-slate-400">Difficulty</div>
                  <div className="mt-2 text-lg font-semibold text-slate-50">Medium</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-50">Everything you need to ace your next technical interview</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full border-slate-700 bg-slate-900/80">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    {feature.title.includes("AI") ? <BrainCircuit className="h-5 w-5" /> : feature.title.includes("DSA") ? <Code2 className="h-5 w-5" /> : <Gauge className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-50">{feature.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-50">How it works</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
                <div className="mb-4 text-3xl font-bold text-indigo-300">0{index + 1}</div>
                <p className="text-lg font-medium text-slate-50">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-50">Supported roles</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.name} className="border-slate-700 bg-slate-900/80">
                <CardContent className="p-6">
                  <div className="text-3xl">{role.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-50">{role.name}</h3>
                  <p className="mt-2 text-slate-400">{role.blurb}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-slate-900 p-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-50">Ready for your next interview?</h2>
            <Link href="/sign-up" className="mt-6 inline-block">
              <Button size="lg">Start Practicing</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
