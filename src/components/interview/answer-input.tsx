import { Textarea } from "@/components/ui/textarea";

export function AnswerInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <label htmlFor="answer" className="text-sm font-medium text-slate-200">
        Candidate Answer
      </label>
      <Textarea
        id="answer"
        value={value}
        placeholder="Type your answer..."
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[180px] resize-none border-slate-700 bg-slate-950/70 text-slate-100"
      />
    </div>
  );
}
