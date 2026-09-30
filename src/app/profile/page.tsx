"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/api";

export default function ProfilePage() {
  const { data, isLoading } = useQuery({ queryKey: ["user"], queryFn: getUser });

  if (isLoading || !data) return <AppShell><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-indigo-300">Profile</div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-50">{data.name}</h1>
        </div>

        <Card className="p-0">
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-slate-400">Name</div>
              <div className="mt-1 text-lg font-medium text-slate-100">{data.name}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Email</div>
              <div className="mt-1 text-lg font-medium text-slate-100">{data.email}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Target Role</div>
              <div className="mt-1 text-lg font-medium text-slate-100">{data.targetRole}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Experience</div>
              <div className="mt-1 text-lg font-medium text-slate-100">{data.experience}</div>
            </div>
          </CardContent>
        </Card>

        <ProfileForm user={data} />
      </div>
    </AppShell>
  );
}
