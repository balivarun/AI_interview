import type { ReactNode } from "react";
import { BackendStatus } from "@/components/layout/backend-status";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <BackendStatus />
          {children}
        </main>
      </div>
    </div>
  );
}
