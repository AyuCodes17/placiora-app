import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  Building2,
  Brain,
  Shield,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/recommendations",
    label: "Companies",
    icon: Building2,
  },
  {
    to: "/aptitude",
    label: "Assessments",
    icon: Brain,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/admin",
    label: "Admin",
    icon: Shield,
  },
];

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <div className="min-h-screen">

      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col p-4 z-40">
        <div className="glass-strong rounded-3xl flex-1 flex flex-col p-4">

          {/* Placiora Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold px-2 py-2"
          >
            <img
              src="/placiora-logo.png"
              alt="Placiora logo"
              className="h-9 w-9 object-contain"
            />

            <span className="text-base tracking-tight text-foreground">
              Placiora
            </span>
          </Link>

          {/* Navigation */}
          <nav className="mt-6 flex-1 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    active
                      ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/20 font-semibold shadow-sm"
                      : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-cyan-300" : ""
                    }`}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>

      {/* ================= MOBILE NAV ================= */}

      <div className="lg:hidden sticky top-0 z-40 glass border-b border-white/5">

        <div className="px-4 h-14 flex items-center justify-between">

          {/* Mobile Placiora Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
          >
            <img
              src="/placiora-logo.png"
              alt="Placiora logo"
              className="h-7 w-7 object-contain"
            />

            <span>Placiora</span>
          </Link>

          <span className="text-xs text-muted-foreground">
            {title}
          </span>
        </div>

        {/* Mobile Navigation */}
        <div className="flex gap-1 px-3 pb-3 overflow-x-auto">
          {nav.map((item) => {
            const active = pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/20 font-medium"
                    : "text-muted-foreground bg-white/5 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

          {title && (
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 tracking-tight">
              {title}
            </h1>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}