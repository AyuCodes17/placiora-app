import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useState } from "react";
import { Brain, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/aptitude")({
  head: () => ({
    meta: [
      { title: "Aptitude Test — Placiora" },
      { name: "description", content: "Adaptive aptitude assessments that calibrate your readiness score." },
      { property: "og:title", content: "Aptitude Test — Placiora" },
      { property: "og:description", content: "Adaptive aptitude assessments." },
    ],
  }),
  component: Aptitude,
});

const QUESTIONS = [
  {
    q: "A train 200m long crosses a pole in 10 seconds. What is its speed in km/h?",
    opts: ["36", "60", "72", "90"],
    a: 2,
  },
  {
    q: "If 3x + 5 = 20, then x =",
    opts: ["3", "5", "7", "15"],
    a: 1,
  },
  {
    q: "Find the next number: 2, 6, 12, 20, 30, ?",
    opts: ["36", "40", "42", "48"],
    a: 2,
  },
];

function Aptitude() {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = QUESTIONS[i];
  const progress = ((i + 1) / QUESTIONS.length) * 100;

  return (
    <AppShell title="Aptitude Test">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Brain className="h-3.5 w-3.5 text-primary" /> Quantitative</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> 12:45</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-[var(--gradient-cyan)] transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-8">
            <div className="text-xs text-muted-foreground">Question {i + 1} of {QUESTIONS.length}</div>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold leading-snug">{q.q}</h2>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {q.opts.map((o, idx) => {
                const active = selected === idx;
                return (
                  <button
                    key={o}
                    onClick={() => setSelected(idx)}
                    className={`text-left glass rounded-2xl px-4 py-3.5 text-sm transition ${
                      active ? "border-primary/60 bg-primary/10" : "hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-lg grid place-items-center text-xs ${active ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]" : "bg-white/10"}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{o}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button className="btn-ghost rounded-xl px-4 py-2 text-sm" onClick={() => setI(Math.max(0, i - 1))}>Previous</button>
              <button
                className="btn-cyan rounded-xl px-5 py-2 text-sm font-medium inline-flex items-center gap-2"
                onClick={() => { setI(Math.min(QUESTIONS.length - 1, i + 1)); setSelected(null); }}
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit">
          <div className="text-sm font-medium">Section overview</div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`aspect-square rounded-lg text-xs font-medium ${
                  idx === i ? "bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]" : "bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between"><span>Attempted</span><span className="text-foreground">{i}</span></div>
            <div className="flex items-center justify-between"><span>Remaining</span><span className="text-foreground">{QUESTIONS.length - i - 1}</span></div>
            <div className="flex items-center justify-between"><span>Accuracy</span><span className="text-foreground">—</span></div>
          </div>
          <button className="mt-6 w-full btn-cyan rounded-xl py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Submit test
          </button>
        </aside>
      </div>
    </AppShell>
  );
}
