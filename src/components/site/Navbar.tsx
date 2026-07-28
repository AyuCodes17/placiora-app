import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <nav className="glass rounded-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid place-items-center h-8 w-8 rounded-xl bg-[var(--gradient-cyan)] text-[color:var(--primary-foreground)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base tracking-tight">Placiora</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="hover:text-foreground transition-colors">
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="btn-ghost rounded-xl px-4 py-2 text-sm">Log in</Link>
            <Link to="/register" className="btn-cyan rounded-xl px-4 py-2 text-sm font-medium">Get started</Link>
          </div>

          <button
            className="md:hidden btn-ghost rounded-lg p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass rounded-2xl mt-2 p-4 flex flex-col gap-3 animate-fade-in">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-ghost rounded-xl px-4 py-2 text-sm flex-1 text-center">Log in</Link>
              <Link to="/register" className="btn-cyan rounded-xl px-4 py-2 text-sm font-medium flex-1 text-center">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
