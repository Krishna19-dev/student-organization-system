"use client";

import React, { useState, useTransition } from "react";
import { 
  LogIn, 
  Lock, 
  Mail, 
  Sparkles, 
  AlertCircle,
} from "lucide-react";
import { loginAction } from "./actions";
import { GUEST_DEMO_CREDENTIALS, ADMIN_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };


  // QUICK DEMO LOGINS section header label
  const DEMO_LOGINS = [
    {
      name: GUEST_DEMO_CREDENTIALS.name,
      role: GUEST_DEMO_CREDENTIALS.role,
      email: GUEST_DEMO_CREDENTIALS.email,
      password: GUEST_DEMO_CREDENTIALS.password,
      id: "SKY-2026-DEMO",
    },
    {
      name: ADMIN_DEMO_CREDENTIALS.name,
      role: ADMIN_DEMO_CREDENTIALS.role,
      email: ADMIN_DEMO_CREDENTIALS.email,
      password: ADMIN_DEMO_CREDENTIALS.password,
      id: "SKY-ADM-0001",
    },
  ];

  return (
    <div className="space-y-6">
      {/* QUICK DEMO LOGINS — compact cards */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-secondary" />
          Quick Demo Logins
        </p>

        {DEMO_LOGINS.map((demo) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => {
              setEmail(demo.email);
              setPassword(demo.password);
              setError(null);
            }}
            className="w-full text-left bg-page hover:bg-secondary-light border border-gray-subtle hover:border-secondary/40 rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-all group"
          >
            {/* Left: Name, Role, Email, ID */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-body">{demo.name}</span>
                <span className="badge-info text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {demo.role}
                </span>
              </div>
              <p className="text-xs text-muted truncate">
                Email: <span className="font-medium text-body">{demo.email}</span>
              </p>
              <p className="text-[11px] font-mono text-secondary font-semibold">
                ID: {demo.id}
              </p>
            </div>

            {/* Right: Password box */}
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-muted mb-1">Password</p>
              <div className="bg-surface border border-gray-subtle rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-body group-hover:border-secondary/50 transition-colors">
                {demo.password}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-3.5 rounded-xl bg-status-danger-light border border-status-danger/30 text-xs text-status-danger-dark flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-danger" />
          <span>{error}</span>
        </div>
      )}

      {/* MANUAL LOGIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="email">
            Campus Email or Member ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. guest@skyline.edu or SKY-001"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="password">
              Password
            </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="guest123"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isPending ? "Verifying..." : "Sign In to Portal"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
