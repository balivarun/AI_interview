"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BriefcaseBusiness, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interviews", label: "Interviews", icon: BriefcaseBusiness },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const secondaryItems = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/login", label: "Logout", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <div className="flex h-full flex-col bg-slate-950/90 p-4 text-slate-100">
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">AI</div>
        <div>
          <div className="text-sm font-semibold text-slate-100">Interview</div>
          <div className="text-xs text-slate-400">Simulator</div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-slate-800 pt-4">
        {secondaryItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950/90 lg:block">{nav}</aside>

      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="fixed left-4 top-4 z-50 border border-slate-700 bg-slate-950/80 shadow-lg"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm">
            <div className="absolute left-0 top-0 h-full w-72">
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {nav}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
