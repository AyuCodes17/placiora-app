import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Building2, MapPin, Search, Filter, Star } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Company Recommendations — Placiora" },
      { name: "description", content: "AI-ranked company recommendations tailored to your profile and readiness." },
      { property: "og:title", content: "Company Recommendations — Placiora" },
      { property: "og:description", content: "AI-ranked company matches." },
    ],
  }),
  component: Recommendations,
});

const COMPANIES = [
  { c: "Stripe", role: "SWE Intern", loc: "Bangalore", ctc: "₹28 LPA", match: 96, tag: "Top match" },
  { c: "Linear", role: "Frontend Engineer", loc: "Remote", ctc: "₹32 LPA", match: 94, tag: "Great culture" },
  { c: "Vercel", role: "DX Engineer", loc: "Remote", ctc: "₹30 LPA", match: 91, tag: "New" },
  { c: "Notion", role: "Product Engineer", loc: "Hyderabad", ctc: "₹26 LPA", match: 89, tag: "Rising" },
  { c: "Figma", role: "Design Engineer", loc: "Bangalore", ctc: "₹27 LPA", match: 87, tag: "Design-led" },
  { c: "Atlassian", role: "SWE — New Grad", loc: "Bangalore", ctc: "₹24 LPA", match: 85, tag: "Stable" },
  { c: "Zomato", role: "Product Analyst", loc: "Gurgaon", ctc: "₹18 LPA", match: 82, tag: "Fast-paced" },
  { c: "Razorpay", role: "Backend Engineer", loc: "Bangalore", ctc: "₹22 LPA", match: 80, tag: "Fintech" },
];

function Recommendations() {
  return (
    <AppShell title="Company Recommendations">
      <div className="glass rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search companies, roles, locations…" className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground/70" />
        </div>
        <div className="flex gap-2">
          {["All", "Product", "Design", "Data", "SDE"].map((t, i) => (
            <button key={t} className={`px-3 py-2 rounded-xl text-xs ${i === 0 ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)] font-medium" : "btn-ghost"}`}>{t}</button>
          ))}
          <button className="btn-ghost rounded-xl px-3 py-2 text-xs inline-flex items-center gap-1"><Filter className="h-3.5 w-3.5" /> Filters</button>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPANIES.map((c) => (
          <div key={c.c} className="glass rounded-3xl p-5 flex flex-col hover:border-primary/40 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[var(--gradient-cyan)] grid place-items-center text-[color:var(--primary-foreground)] font-semibold">
                  {c.c.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{c.c}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                </div>
              </div>
              <span className="text-[10px] rounded-full px-2 py-1 bg-primary/15 text-primary">{c.tag}</span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.loc}</span>
              <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {c.ctc}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Match</span>
                <span className="font-medium">{c.match}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[var(--gradient-cyan)]" style={{ width: `${c.match}%` }} />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="btn-cyan rounded-xl px-4 py-2 text-sm font-medium flex-1">Apply</button>
              <button className="btn-ghost rounded-xl px-3 py-2 text-sm inline-flex items-center gap-1"><Star className="h-4 w-4" /> Save</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
