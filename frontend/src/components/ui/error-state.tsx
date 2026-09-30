import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-slate-100">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-8 w-8 text-red-300" />
        </div>
        <h3 className="text-xl font-semibold">{message}</h3>
        <p className="mt-2 text-sm text-red-100/90">We couldn&apos;t load your interview.</p>
        {onRetry && (
          <Button variant="secondary" className="mt-5" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
