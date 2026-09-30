"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProfileForm({ user }: { user: { name: string; email: string; targetRole: string; experience: string; preferredTopics: string[] } }) {
  const [form, setForm] = useState(user);

  return (
    <Card className="p-0">
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Target Role</label>
            <Input value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Experience</label>
            <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Preferred Topics</label>
          <div className="flex flex-wrap gap-2">
            {form.preferredTopics.map((topic) => (
              <span key={topic} className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <Button className="mt-2">Save Changes</Button>
      </CardContent>
    </Card>
  );
}
