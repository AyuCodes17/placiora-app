import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Placiora" },
      { name: "description", content: "Sign in to your Placiora account to continue your placement journey." },
      { property: "og:title", content: "Log in — Placiora" },
      { property: "og:description", content: "Sign in to your Placiora account." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to Placiora">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field icon={Mail} type="email" placeholder="you@college.edu" label="Email" />
        <Field icon={Lock} type="password" placeholder="••••••••" label="Password" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <label className="inline-flex items-center gap-2"><input type="checkbox" className="accent-[color:var(--primary)]" /> Remember me</label>
          <a href="#" className="hover:text-foreground">Forgot password?</a>
        </div>
        <button className="btn-cyan w-full rounded-xl px-4 py-3 font-medium inline-flex items-center justify-center gap-2">
          Sign in <ArrowRight className="h-4 w-4" />
        </button>
        <div className="text-center text-xs text-muted-foreground">
          New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <Link to="/" className="relative flex items-center gap-2 font-semibold">
          <span className="grid place-items-center h-8 w-8 rounded-xl bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]">
            <Sparkles className="h-4 w-4" />
          </span>
          Placiora
        </Link>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold tracking-tight">Your career, intelligently placed.</h2>
          <p className="mt-4 text-muted-foreground">Match to roles, sharpen skills, and track every offer — all in one calm workspace.</p>
        </div>
        <div className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} Placiora</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="glass-strong rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, ...props }: { icon: any; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 glass rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input {...props} className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground/70" />
      </div>
    </label>
  );
}
