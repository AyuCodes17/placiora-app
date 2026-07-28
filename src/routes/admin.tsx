import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Users, Building2, TrendingUp, DollarSign, Search, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Placiora" },
      { name: "description", content: "Operate placements at scale — students, companies, drives and analytics in one view." },
      { property: "og:title", content: "Admin Dashboard — Placiora" },
      { property: "og:description", content: "Operate placements at scale." },
    ],
  }),
  component: Admin,
});

const STATS = [
  { icon: Users, k: "Total Students", v: "2,438", d: "+124 this month" },
  { icon: Building2, k: "Active Companies", v: "86", d: "+9 this week" },
  { icon: TrendingUp, k: "Placement Rate", v: "78%", d: "+4% vs LY" },
  { icon: DollarSign, k: "Avg CTC", v: "₹14.2L", d: "+₹1.6L vs LY" },
];

const STUDENTS = [
  { n: "Priya Nair", b: "CSE", s: 92, st: "Placed", c: "Stripe" },
  { n: "Rohan Sen", b: "ECE", s: 84, st: "Interview", c: "Microsoft" },
  { n: "Meera Iyer", b: "CSE", s: 88, st: "Shortlisted", c: "Linear" },
  { n: "Vikram Rao", b: "IT", s: 76, st: "Applied", c: "Atlassian" },
  { n: "Sana Kapoor", b: "CSE", s: 95, st: "Placed", c: "Google" },
  { n: "Arjun Das", b: "MECH", s: 70, st: "Applied", c: "TCS" },
];

const statusColor: Record<string, string> = {
  Placed: "bg-emerald-400/15 text-emerald-300",
  Interview: "bg-primary/15 text-primary",
  Shortlisted: "bg-violet-400/15 text-violet-300",
  Applied: "bg-white/10 text-muted-foreground",
};

function Admin() {
  return (
    <AppShell title="Admin Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.k} className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.k}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-semibold">{s.v}</div>
            <div className="mt-1 text-xs text-primary">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Students</div>
              <div className="text-xs text-muted-foreground">Monitor placement status across the batch</div>
            </div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search…" className="bg-transparent text-sm outline-none w-40" />
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="text-xs text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 font-medium">Student</th>
                  <th className="py-2 font-medium">Branch</th>
                  <th className="py-2 font-medium">Score</th>
                  <th className="py-2 font-medium">Company</th>
                  <th className="py-2 font-medium">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s) => (
                  <tr key={s.n} className="border-t border-white/5">
                    <td className="py-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center text-xs font-semibold">{s.n.charAt(0)}</div>
                      {s.n}
                    </td>
                    <td className="py-3 text-muted-foreground">{s.b}</td>
                    <td className="py-3">{s.s}</td>
                    <td className="py-3 text-muted-foreground">{s.c}</td>
                    <td className="py-3"><span className={`text-[11px] rounded-full px-2 py-1 ${statusColor[s.st]}`}>{s.st}</span></td>
                    <td className="py-3 text-right"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="text-sm font-medium">Placements by branch</div>
          <div className="mt-4 space-y-4">
            {[
              { b: "CSE", v: 92 },
              { b: "IT", v: 84 },
              { b: "ECE", v: 71 },
              { b: "MECH", v: 58 },
              { b: "CIVIL", v: 42 },
            ].map((r) => (
              <div key={r.b}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.b}</span>
                  <span className="font-medium">{r.v}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[var(--gradient-cyan)]" style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
