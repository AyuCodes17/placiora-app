import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundSearch,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Placiora — Intelligent Placement Platform for Students",
      },
      {
        name: "description",
        content:
          "Placiora turns student profiles, skills and assessment performance into readiness insights, role fits, company matches and personalized next steps.",
      },
      {
        property: "og:title",
        content:
          "Placiora — Intelligent Placement Platform",
      },
      {
        property: "og:description",
        content:
          "Student readiness, assessments, career recommendations and placement intelligence in one platform.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Hero />

      <ProductStrip />

      <Features />

      <HowItWorks />

      <WhyPlaciora />

      <Roadmap />

      <CTA />

      <Footer />
    </div>
  );
}


/* ========================================================= */
/* HERO                                                      */
/* ========================================================= */

function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32">

      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Glow */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.72_0.16_235/0.35),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />

          Placiora Career Intelligence — Live

        </div>

        {/* Heading */}
        <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

          Your career,{" "}

          <span className="text-gradient">
            intelligently placed.
          </span>

        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">

          Placiora transforms your profile, skills and
          assessment performance into readiness insights,
          role fits, company matches and clear next steps
          for your placement journey.

        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">

          <Link
            to="/register"
            className="btn-cyan inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
          >

            Get started

            <ArrowRight className="h-4 w-4" />

          </Link>

          <Link
            to="/dashboard"
            className="btn-ghost rounded-xl px-6 py-3 font-medium"
          >

            Explore Dashboard

          </Link>

        </div>


        {/* ================================================= */}
        {/* PRODUCT PREVIEW                                   */}
        {/* ================================================= */}

        <div className="relative mx-auto mt-16 max-w-5xl">

          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-[var(--gradient-cyan)] opacity-30 blur-3xl" />

          <div className="glass-strong rounded-3xl p-3 sm:p-4">

            <div className="grid gap-4 rounded-2xl bg-[color:var(--navy-deep)] p-6 sm:p-8 md:grid-cols-3">

              <PreviewCard
                icon={Target}
                value="Live"
                label="Readiness Score"
                description="Updates from your assessment performance"
              />

              <PreviewCard
                icon={Brain}
                value="3 Layers"
                label="Assessment Intelligence"
                description="Skill, company and situational assessments"
              />

              <PreviewCard
                icon={Building2}
                value="Personalized"
                label="Career Matches"
                description="Role fits and company opportunities"
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


/* ========================================================= */
/* PRODUCT STRIP                                             */
/* ========================================================= */

function ProductStrip() {
  const modules = [
    "Student Profile",
    "Assessments",
    "Readiness",
    "Role Fits",
    "Company Matches",
    "Skill Gaps",
  ];

  return (
    <section className="py-12">

      <div className="mx-auto max-w-6xl px-6">

        <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">

          One connected placement workspace

        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">

          {modules.map((module) => (

            <div
              key={module}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground"
            >

              {module}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* FEATURES                                                  */
/* ========================================================= */

function Features() {
  const features = [
    {
      icon: Building2,
      title: "Career Recommendations",
      desc:
        "Discover company opportunities and role fits matched against your skills, profile and readiness.",
    },

    {
      icon: Brain,
      title: "Three-Layer Assessments",
      desc:
        "Measure technical knowledge, company awareness and workplace judgement through Placiora's assessment center.",
    },

    {
      icon: LineChart,
      title: "Readiness Intelligence",
      desc:
        "Track a live readiness score generated from your latest assessment performance and progress.",
    },

    {
      icon: FileText,
      title: "Smart Student Profile",
      desc:
        "Keep your academics, skills, projects, certifications and professional links together in one profile.",
    },

    {
      icon: Target,
      title: "Skill Gap Analysis",
      desc:
        "See which skills already match your target roles and which areas should become your next priority.",
    },

    {
      icon: ShieldCheck,
      title: "Admin Insights",
      desc:
        "Monitor student readiness, assessment completion and profile progress through a dedicated admin view.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24"
    >

      <div className="mx-auto max-w-6xl px-6">

        <div className="mx-auto max-w-2xl text-center">

          <div className="text-xs uppercase tracking-widest text-primary">

            Platform

          </div>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">

            Placement intelligence in one workspace.

          </h2>

          <p className="mt-4 leading-relaxed text-muted-foreground">

            Placiora connects your profile, assessments,
            readiness and recommendations instead of
            treating them as separate tools.

          </p>

        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="group glass rounded-2xl p-6 transition hover:border-primary/40"
            >

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 transition-transform group-hover:scale-105">

                <feature.icon className="h-5 w-5" />

              </div>

              <h3 className="mt-5 text-lg font-semibold">

                {feature.title}

              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">

                {feature.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* HOW IT WORKS                                              */
/* ========================================================= */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Build your profile",
      desc:
        "Add your academics, skills, projects, certifications and career information.",
    },

    {
      n: "02",
      title: "Complete assessments",
      desc:
        "Take skill, company and situational assessments to establish your readiness.",
    },

    {
      n: "03",
      title: "Explore your matches",
      desc:
        "Placiora converts your data into role fits, company matches and skill-gap insights.",
    },

    {
      n: "04",
      title: "Improve strategically",
      desc:
        "Use your personalized action plan to strengthen the areas that matter for your target roles.",
    },
  ];

  return (
    <section
      id="how"
      className="py-24"
    >

      <div className="mx-auto max-w-6xl px-6">

        <div className="mx-auto max-w-2xl text-center">

          <div className="text-xs uppercase tracking-widest text-primary">

            How it works

          </div>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">

            From profile to placement intelligence.

          </h2>

          <p className="mt-4 text-muted-foreground">

            Every Placiora module contributes to one
            connected understanding of your preparation.

          </p>

        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step) => (

            <div
              key={step.n}
              className="relative overflow-hidden glass rounded-2xl p-6"
            >

              <div className="text-6xl font-semibold text-primary/20">

                {step.n}

              </div>

              <h3 className="mt-2 text-lg font-semibold">

                {step.title}

              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">

                {step.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* WHY PLACIORA                                              */
/* ========================================================= */

function WhyPlaciora() {
  const items = [
    {
      icon: UserRoundSearch,
      title: "Personal, not generic",
      desc:
        "Recommendations are built around your own profile, skills and performance.",
    },

    {
      icon: Zap,
      title: "Actionable next steps",
      desc:
        "Placiora does more than show a score — it highlights skill gaps and what to improve next.",
    },

    {
      icon: CheckCircle2,
      title: "Connected intelligence",
      desc:
        "Profile data, assessments, readiness and company matching work together instead of living in separate apps.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24"
    >

      <div className="mx-auto max-w-6xl px-6">

        <div className="mx-auto max-w-2xl text-center">

          <div className="text-xs uppercase tracking-widest text-primary">

            Why Placiora

          </div>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">

            Built around your actual progress.

          </h2>

          <p className="mt-4 text-muted-foreground">

            No generic placement checklist. Placiora
            turns the information you provide into
            personalized career intelligence.

          </p>

        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">

          {items.map((item) => (

            <div
              key={item.title}
              className="glass rounded-2xl p-6"
            >

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">

                <item.icon className="h-5 w-5" />

              </div>

              <h3 className="mt-5 text-lg font-semibold">

                {item.title}

              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">

                {item.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* ROADMAP                                                   */
/* ========================================================= */

function Roadmap() {
  return (
    <section className="py-10">

      <div className="mx-auto max-w-5xl px-6">

        <div className="relative overflow-hidden glass-strong rounded-3xl border border-cyan-400/10 p-7 sm:p-9">

          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">

                <Code2 className="h-5 w-5" />

              </div>

              <div>

                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">

                  Next on Placiora

                </div>

                <h3 className="mt-2 text-xl font-semibold">

                  Technical Practice

                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">

                  Coding challenges, problem solving,
                  test cases and technical interview
                  preparation are planned as the next
                  major Placiora feature.

                </p>

              </div>

            </div>

            <div className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300">

              Upcoming

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* CTA                                                       */
/* ========================================================= */

function CTA() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-5xl px-6">

        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 text-center sm:p-14">

          <div className="absolute inset-0 -z-10 bg-[var(--gradient-cyan)] opacity-40 blur-3xl" />

          <Sparkles className="mx-auto h-8 w-8 text-primary" />

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">

            Build your placement intelligence.

          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">

            Create your Placiora profile, complete your
            assessments and discover the roles,
            companies and skills that deserve your
            attention next.

          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              to="/register"
              className="btn-cyan inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
            >

              Create account

              <ArrowRight className="h-4 w-4" />

            </Link>

            <Link
              to="/login"
              className="btn-ghost rounded-xl px-6 py-3 font-medium"
            >

              Log in

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ========================================================= */
/* PREVIEW CARD                                              */
/* ========================================================= */

function PreviewCard({
  icon: Icon,
  value,
  label,
  description,
}: {
  icon: any;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 text-left">

      <div className="flex items-center justify-between">

        <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10">

          <Icon className="h-4 w-4 text-cyan-300" />

        </div>

        <Rocket className="h-4 w-4 text-muted-foreground/40" />

      </div>

      <div className="mt-4 text-2xl font-semibold">

        {value}

      </div>

      <div className="mt-1 text-sm font-medium">

        {label}

      </div>

      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">

        {description}

      </div>

    </div>
  );
}