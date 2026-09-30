"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    const redirectToLogin = () => router.replace("/sign-in");
    window.addEventListener("interviewai:unauthorized", redirectToLogin);
    return () => window.removeEventListener("interviewai:unauthorized", redirectToLogin);
  }, [router]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
