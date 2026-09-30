"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/api";
import type { User } from "@/lib/types";

export function ProfileForm({ user }: { user: User }) {
  const [form, setForm] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const updated = await updateUser(form);
      setForm(updated);
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

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
            <select
              value={form.experience}
              onChange={(event) => setForm({ ...form, experience: event.target.value as User["experience"] })}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            >
              <option>Fresher</option>
              <option>0–1 Year</option>
              <option>1–3 Years</option>
            </select>
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

        {message && <p role="status" className="text-sm text-slate-300">{message}</p>}
        <Button className="mt-2" onClick={save} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
