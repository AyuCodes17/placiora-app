import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, Building2, Brain, Code2, Shield, Sparkles, LogOut } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recommendations", label: "Companies", icon: Building2 },
  { to: "/aptitude", label: "Aptitude", icon: Brain },
  { to: "/technical", label: "Technical", icon: Code2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col p-4 z-40">
        <div className="glass-strong rounded-3xl flex-1 flex flex-col p-4">
          <Link to="/" className="flex items-center gap-2 font-semibold px-2 py-2">
            <span className="grid place-items-center h-8 w-8 rounded-xl bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]">
              <Sparkles className="h-4 w-4" />
            </span>
            Placiora
          </Link>
          <nav className="mt-6 flex-1 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)] font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden sticky top-0 z-40 glass border-b border-white/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Placiora
          </Link>
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <div className="flex gap-1 px-3 pb-3 overflow-x-auto">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs ${active ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]" : "text-muted-foreground bg-white/5"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {title && <h1 className="text-2xl sm:text-3xl font-semibold mb-6 tracking-tight">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}
