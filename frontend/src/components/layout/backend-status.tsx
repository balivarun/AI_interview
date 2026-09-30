"use client";

import { useQuery } from "@tanstack/react-query";
import { getBackendHealth } from "@/lib/api";

export function BackendStatus() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["backend-health"],
    queryFn: getBackendHealth,
    refetchInterval: 30_000,
    retry: 1,
  });

  const connected = data?.status === "UP";
  const label = connected ? "Backend connected" : isPending ? "Connecting to backend" : "Backend unavailable";

  return (
    <div className="flex justify-end pb-3" role="status" aria-live="polite">
      <span className="inline-flex items-center gap-2 text-xs text-slate-400">
        <span
          className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : isError ? "bg-red-400" : "bg-amber-400"}`}
          aria-hidden="true"
        />
        {label}
      </span>
    </div>
  );
}