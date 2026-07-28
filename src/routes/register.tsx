import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Mail, Lock, GraduationCap, Hash, ArrowRight } from "lucide-react";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Student Registration — Placiora" },
      { name: "description", content: "Create your Placiora student account and start your placement journey." },
      { property: "og:title", content: "Student Registration — Placiora" },
      { property: "og:description", content: "Create your student account." },
    ],
  }),
  component: Register,
});

function Register() {
  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of students placing with intent">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field icon={User} label="Full name" placeholder="Alex Johnson" />
          <Field icon={Hash} label="Roll number" placeholder="21BCE1234" />
        </div>
        <Field icon={Mail} type="email" label="Email" placeholder="you@college.edu" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field icon={GraduationCap} label="Branch" placeholder="Computer Science" />
          <Field icon={GraduationCap} label="Year" placeholder="3rd Year" />
        </div>
        <Field icon={Lock} type="password" label="Password" placeholder="Create a password" />
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-[color:var(--primary)]" />
          I agree to the Terms and Privacy Policy.
        </label>
        <button className="btn-cyan w-full rounded-xl px-4 py-3 font-medium inline-flex items-center justify-center gap-2">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
        <div className="text-center text-xs text-muted-foreground">
          Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
