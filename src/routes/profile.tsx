import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Award, Github, Globe, Linkedin, Mail, MapPin, Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile — Placiora" },
      { name: "description", content: "Your verified student profile — academics, skills, projects and certifications." },
      { property: "og:title", content: "Student Profile — Placiora" },
      { property: "og:description", content: "Your verified student profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell title="Profile">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 glass rounded-3xl p-6">
          <div className="h-20 w-20 rounded-2xl bg-[var(--gradient-cyan)] grid place-items-center text-2xl font-semibold text-[color:var(--primary-foreground)]">AJ</div>
          <h2 className="mt-4 text-xl font-semibold">Alex Johnson</h2>
          <div className="text-sm text-muted-foreground">Computer Science · 3rd Year</div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> alex@college.edu</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bangalore, IN</div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> alex.dev</div>
          </div>
          <div className="mt-5 flex gap-2">
            <a href="#" className="glass h-9 w-9 grid place-items-center rounded-xl"><Github className="h-4 w-4" /></a>
            <a href="#" className="glass h-9 w-9 grid place-items-center rounded-xl"><Linkedin className="h-4 w-4" /></a>
          </div>
          <button className="mt-6 w-full btn-cyan rounded-xl py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2">
            <Pencil className="h-4 w-4" /> Edit profile
          </button>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Section title="About">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Frontend-leaning full-stack engineer passionate about design systems, developer experience, and shipping polished products. Previously interned at two seed-stage startups.
            </p>
          </Section>

          <Section title="Skills" action="Add">
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Next.js", "TailwindCSS", "Node.js", "Python", "PostgreSQL", "GraphQL", "Figma", "System Design"].map((s) => (
                <span key={s} className="text-xs rounded-full px-3 py-1 bg-white/5 border border-white/10">{s}</span>
              ))}
            </div>
          </Section>

          <Section title="Projects" action="Add">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { n: "Orbit Docs", d: "Realtime collaborative docs with CRDTs." },
                { n: "Klarity", d: "Habit tracker with adaptive reminders." },
              ].map((p) => (
                <div key={p.n} className="glass rounded-2xl p-4">
                  <div className="text-sm font-medium">{p.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.d}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Certifications" action="Add">
            <div className="space-y-2">
              {[
                { n: "AWS Certified Cloud Practitioner", i: "Amazon" },
                { n: "Meta Frontend Developer", i: "Coursera" },
              ].map((c) => (
                <div key={c.n} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{c.n}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.i}</div>
                  </div>
                  <span className="text-[11px] text-primary">Verified</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {action && <button className="btn-ghost rounded-lg px-3 py-1.5 text-xs inline-flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> {action}</button>}
      </div>
      {children}
    </div>
  );
}
