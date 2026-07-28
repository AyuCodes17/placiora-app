import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Award, Brain, Building2, Calendar, Code2, FileText, GraduationCap, Rocket, Sparkles, Target, TrendingUp, Zap } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Placiora" },
      { name: "description", content: "Your placement command center: readiness score, matches, upcoming companies and progress." },
      { property: "og:title", content: "Dashboard — Placiora" },
      { property: "og:description", content: "Your placement command center." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-12 gap-4">
        {/* Profile card */}
        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[var(--gradient-cyan)] grid place-items-center text-[color:var(--primary-foreground)] text-lg font-semibold">AJ</div>
            <div className="min-w-0">
              <div className="text-lg font-semibold truncate">Alex Johnson</div>
              <div className="text-xs text-muted-foreground truncate">Computer Science · 3rd Year · 21BCE1234</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6 text-center">
            {[
              { k: "CGPA", v: "8.9" },
              { k: "Skills", v: "24" },
              { k: "Certs", v: "6" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/5 py-3">
                <div className="text-lg font-semibold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
          <Link to="/profile" className="btn-ghost mt-6 w-full rounded-xl px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2">
            View full profile
          </Link>
        </div>

        {/* Readiness score + progress */}
        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Placement Readiness</div>
          <ProgressCircle value={86} />
          <div className="mt-2 text-sm text-muted-foreground">Top 4% of your batch</div>
          <div className="mt-4 grid grid-cols-3 gap-2 w-full text-xs">
            <Pill icon={Brain} label="Aptitude" value="92%" />
            <Pill icon={Code2} label="Technical" value="81%" />
            <Pill icon={Award} label="Soft" value="84%" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Quick actions</div>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: Brain, label: "Aptitude Test", to: "/aptitude" as const },
              { icon: Code2, label: "Technical Test", to: "/technical" as const },
              { icon: Building2, label: "Companies", to: "/recommendations" as const },
              { icon: FileText, label: "Update Resume", to: "/profile" as const },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="glass hover:border-primary/40 rounded-2xl p-4 text-left transition group">
                <a.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 text-sm font-medium">{a.label}</div>
                <div className="text-[11px] text-muted-foreground">Open</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming companies */}
        <div className="col-span-12 lg:col-span-7 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Upcoming companies</div>
              <div className="text-xs text-muted-foreground">Drives scheduled in the next 30 days</div>
            </div>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {[
              { c: "Stripe", role: "Software Engineer Intern", d: "Aug 04", tag: "Shortlisted" },
              { c: "Microsoft", role: "SWE — New Grad", d: "Aug 09", tag: "Applied" },
              { c: "Atlassian", role: "Frontend Engineer", d: "Aug 12", tag: "Recommended" },
              { c: "Zomato", role: "Product Analyst", d: "Aug 17", tag: "Open" },
            ].map((row) => (
              <div key={row.c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--gradient-cyan)] grid place-items-center text-[color:var(--primary-foreground)] text-xs font-semibold">
                    {row.c.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{row.c}</div>
                    <div className="text-xs text-muted-foreground truncate">{row.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[11px] rounded-full px-2 py-0.5 bg-primary/15 text-primary">{row.tag}</span>
                  <span className="text-xs text-muted-foreground">{row.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent quiz scores */}
        <div className="col-span-12 lg:col-span-5 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Recent quiz scores</div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Quant Aptitude", v: 92 },
              { name: "Data Structures", v: 78 },
              { name: "Verbal Reasoning", v: 84 },
              { name: "System Design Basics", v: 71 },
            ].map((q) => (
              <div key={q.name}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{q.name}</span>
                  <span className="font-medium">{q.v}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[var(--gradient-cyan)]" style={{ width: `${q.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended companies */}
        <div className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Recommended companies</div>
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">
            {[
              { c: "Linear", m: 94 },
              { c: "Vercel", m: 91 },
              { c: "Notion", m: 88 },
              { c: "Figma", m: 86 },
            ].map((c) => (
              <div key={c.c} className="glass rounded-2xl p-4 hover:border-primary/40 transition">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center text-xs font-semibold">{c.c.slice(0, 2)}</div>
                  <div>
                    <div className="text-sm font-medium">{c.c}</div>
                    <div className="text-[11px] text-muted-foreground">Match {c.m}%</div>
                  </div>
                </div>
                <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[var(--gradient-cyan)]" style={{ width: `${c.m}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended roles */}
        <div className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Recommended roles</div>
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {[
              { r: "Frontend Engineer", s: "React · TypeScript · Design systems" },
              { r: "Product Analyst", s: "SQL · Python · Storytelling" },
              { r: "ML Engineer", s: "PyTorch · Data pipelines · Deployment" },
              { r: "DevRel Engineer", s: "Communities · Writing · APIs" },
            ].map((r) => (
              <div key={r.r} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.r}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.s}</div>
                </div>
                <button className="text-xs text-primary hover:underline">Explore</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Pill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-xl px-2 py-2 flex flex-col items-center">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <div className="mt-1 font-semibold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function ProgressCircle({ value }: { value: number }) {
  const size = 160;
  const r = 68;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative mt-4" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="pg" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.14 210)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 235)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="12" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#pg)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-semibold">{value}%</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Ready</div>
        </div>
      </div>
    </div>
  );
}
