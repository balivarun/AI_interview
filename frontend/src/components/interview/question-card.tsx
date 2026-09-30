import { Card } from "@/components/ui/card";

export function QuestionCard({ prompt, topic, difficulty }: { prompt: string; topic: string; difficulty: string }) {
  return (
    <Card className="border-slate-700 bg-slate-900/80 p-5">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-indigo-300">
        <span>{topic}</span>
        <span className="text-slate-500">•</span>
        <span>{difficulty}</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">{prompt}</h2>
    </Card>
  );
}
