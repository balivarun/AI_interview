import { Card } from "@/components/ui/card";

export function AIMessage({ text }: { text: string }) {
  return (
    <Card className="border-slate-700 bg-slate-900/80 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-300">
        <span>🤖</span>
        <span>AI Interviewer</span>
      </div>
      <p className="whitespace-pre-line text-base leading-7 text-slate-100">{text}</p>
    </Card>
  );
}

export function CandidateMessage({ text }: { text: string }) {
  return (
    <Card className="border-slate-700 bg-slate-800/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-300">
        <span>You</span>
      </div>
      <p className="whitespace-pre-line text-base leading-7 text-slate-100">{text}</p>
    </Card>
  );
}
