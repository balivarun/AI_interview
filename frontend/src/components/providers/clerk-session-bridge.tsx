"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { setSessionTokenProvider, syncClerkUser } from "@/lib/api";

export function ClerkSessionBridge({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [syncState, setSyncState] = useState<{ clerkId: string; failed: boolean } | null>(null);
  const [retry, setRetry] = useState(0);

  setSessionTokenProvider(getToken);

  useEffect(() => {
    if (!isLoaded || !userLoaded || !isSignedIn || !user) return;

    let cancelled = false;
    const name = user.fullName || user.username || "Candidate";
    const email = user.primaryEmailAddress?.emailAddress || `${user.id}@clerk.local`;

    syncClerkUser(name, email)
      .then(() => {
        if (!cancelled) setSyncState({ clerkId: user.id, failed: false });
      })
      .catch(() => {
        if (!cancelled) setSyncState({ clerkId: user.id, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, retry, user, userLoaded]);

  const userSyncPending = Boolean(isSignedIn && user && syncState?.clerkId !== user.id);
  const userSyncFailed = Boolean(isSignedIn && user && syncState?.clerkId === user.id && syncState.failed);

  if (!isLoaded || !userLoaded || userSyncPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-sm text-slate-400" role="status">
        {userSyncFailed ? (
          <button className="text-red-300" onClick={() => setRetry((value) => value + 1)}>
            Could not connect your account. Retry
          </button>
        ) : "Loading account..."}
      </div>
    );
  }

  return children;
}