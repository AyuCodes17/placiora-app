import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Placiora" },
      {
        name: "description",
        content: "Sign in to your Placiora account to continue your placement journey.",
      },
      { property: "og:title", content: "Log in — Placiora" },
      { property: "og:description", content: "Sign in to your Placiora account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/students/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "placioraStudent",
        JSON.stringify(response.data)
      );

      alert("Login Successful!");

      await navigate({
        to: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      alert("Invalid email or password!");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Placiora"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          icon={Mail}
          type="email"
          placeholder="you@college.edu"
          label="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <Field
          icon={Lock}
          type="password"
          placeholder="••••••••"
          label="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[color:var(--primary)]"
            />
            Remember me
          </label>

          <a href="#" className="hover:text-foreground">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="btn-cyan w-full rounded-xl px-4 py-3 font-medium inline-flex items-center justify-center gap-2"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  icon: Icon,
  label,
  ...props
}: {
  icon: React.ElementType;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>

      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <input
          {...props}
          required
          className="w-full rounded-xl border bg-background px-10 py-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </label>
  );
}