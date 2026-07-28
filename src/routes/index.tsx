import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, Brain, Building2, LineChart, Rocket, ShieldCheck, Sparkles, Star, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placiora — Intelligent Placement Platform for Students" },
      { name: "description", content: "Placiora helps students land the right roles with AI-powered company matches, aptitude & technical tests, and a personalized placement readiness score." },
      { property: "og:title", content: "Placiora — Intelligent Placement Platform" },
      { property: "og:description", content: "AI-powered placements: recommendations, tests, and readiness scoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[radial-gradient(closest-side,oklch(0.72_0.16_235/0.35),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Placement season 2026 — matching now live
        </div>
        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
          Your career, <span className="text-gradient">intelligently placed.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Placiora blends AI-powered recommendations, adaptive tests, and readiness analytics — so students land offers, and campuses hit their numbers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/register" className="btn-cyan rounded-xl px-6 py-3 font-medium inline-flex items-center gap-2">
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="btn-ghost rounded-xl px-6 py-3 font-medium">
            Live demo
          </Link>
        </div>

        {/* Preview card */}
        <div className="relative mt-16 mx-auto max-w-5xl">
          <div className="absolute inset-0 -z-10 bg-[var(--gradient-cyan)] opacity-30 blur-3xl rounded-[3rem]" />
          <div className="glass-strong rounded-3xl p-3 sm:p-4">
            <div className="rounded-2xl bg-[color:var(--navy-deep)] p-6 sm:p-8 grid md:grid-cols-3 gap-4">
              {[
                { icon: Target, k: "Readiness", v: "86%", s: "+12 this week" },
                { icon: Building2, k: "Matches", v: "24", s: "6 new invites" },
                { icon: LineChart, k: "Rank", v: "#128", s: "Top 4% of batch" },
              ].map((c, i) => (
                <div key={i} className="glass rounded-2xl p-5 text-left animate-float" style={{ animationDelay: `${i * 0.6}s` }}>
                  <c.icon className="h-5 w-5 text-primary" />
                  <div className="mt-3 text-3xl font-semibold">{c.v}</div>
                  <div className="text-sm text-muted-foreground">{c.k}</div>
                  <div className="mt-2 text-xs text-primary">{c.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const logos = ["Google", "Microsoft", "Stripe", "Amazon", "Linear", "Airbnb", "Meta"];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">Trusted by students placed at</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4 opacity-70">
          {logos.map((l) => (
            <span key={l} className="text-lg font-semibold text-muted-foreground">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Brain, title: "AI Recommendations", desc: "Get matched to companies and roles that fit your skills, interests, and readiness score." },
    { icon: Zap, title: "Adaptive Tests", desc: "Aptitude and technical assessments that adapt to your level and pinpoint weak spots." },
    { icon: LineChart, title: "Readiness Score", desc: "A live indicator of how prepared you are — updated after every quiz and practice session." },
    { icon: ShieldCheck, title: "Verified Profiles", desc: "Shareable, verified student profiles that recruiters actually trust." },
    { icon: Building2, title: "Company Pipeline", desc: "Track upcoming drives, deadlines, and interview rounds in one calm view." },
    { icon: Rocket, title: "Career Boosters", desc: "Curated resources, mock interviews, and mentor connects — surfaced just when you need them." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-primary">Features</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">Everything you need to get placed.</h2>
          <p className="mt-4 text-muted-foreground">A calm, unified workspace that replaces spreadsheets, prep apps, and endless notifications.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/40 transition group">
              <div className="h-11 w-11 rounded-xl grid place-items-center bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)] group-hover:scale-105 transition-transform">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your profile", desc: "Add your academics, skills, and interests. It takes under two minutes." },
    { n: "02", title: "Take smart assessments", desc: "Adaptive aptitude and technical tests calibrate your readiness score." },
    { n: "03", title: "Get matched", desc: "Receive ranked company and role recommendations tuned to you." },
    { n: "04", title: "Land the offer", desc: "Prepare with targeted resources and track every round to the finish." },
  ];
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-primary">How it works</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">From sign-up to offer, in four steps.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6 relative overflow-hidden">
              <div className="text-6xl font-semibold text-primary/20">{s.n}</div>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Aarav Mehta", role: "SDE @ Stripe", quote: "Placiora turned prep from chaos into a plan. The readiness score kept me honest, and the matches were spot-on." },
    { name: "Ishita Rao", role: "PM @ Microsoft", quote: "I stopped juggling five apps. Everything from mock tests to shortlists lives here — and it just feels premium." },
    { name: "Karan Shah", role: "Analyst @ Goldman", quote: "The adaptive tests exposed my weak areas fast. Two weeks later, I cleared three interviews back to back." },
  ];
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-primary">Testimonials</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">Students. Real offers.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {items.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6 flex flex-col">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[var(--gradient-cyan)] grid place-items-center text-[color:var(--primary-foreground)] text-sm font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass-strong rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40 bg-[var(--gradient-cyan)] blur-3xl" />
          <Sparkles className="h-8 w-8 mx-auto text-primary" />
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">Ready to place with intent?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands of students turning preparation into offers.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn-cyan rounded-xl px-6 py-3 font-medium">Create free account</Link>
            <Link to="/login" className="btn-ghost rounded-xl px-6 py-3 font-medium">I have an account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
