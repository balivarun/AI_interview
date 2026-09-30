import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 p-0 shadow-2xl shadow-indigo-950/10">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">
              AI
            </div>
            <h1 className="text-3xl font-semibold text-slate-50">{title}</h1>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 text-center text-sm text-slate-400">
            {title === "Welcome Back" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
                  Create account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
