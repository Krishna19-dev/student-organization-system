"use client";

import React, { useState, useTransition } from "react";
import { 
  LogIn, 
  Lock, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check 
} from "lucide-react";
import { loginAction, loginWithGuestDemo } from "./actions";
import { GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFillDemo = () => {
    setEmail(GUEST_DEMO_CREDENTIALS.email);
    setPassword(GUEST_DEMO_CREDENTIALS.password);
    setError(null);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOneClickLogin = () => {
    setError(null);
    startTransition(async () => {
      await loginWithGuestDemo();
    });
  };

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

  return (
    <div className="space-y-6">
      {/* HIGHLIGHTED GUEST DEMO ACCOUNT CARD */}
      <div className="bg-secondary-light border-2 border-secondary/40 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="badge-info text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              <span>GUEST DEMO ACCOUNT</span>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-secondary-dark uppercase tracking-wider">
            Ready to test
          </span>
        </div>

        <p className="text-xs text-body leading-relaxed">
          Yeh platform ka <strong>official Guest Demo Account</strong> hai. Isse login karke aap as a campus guest ticket reservations, announcements, aur merch store bina kisi registration ke test kar sakte hain.
        </p>

        {/* Credentials Display Box */}
        <div className="bg-surface rounded-xl p-3 border border-secondary/30 space-y-2">
          {/* Email row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Demo ID (Email):</span>
            <div className="flex items-center gap-2">
              <code className="font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                {GUEST_DEMO_CREDENTIALS.email}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(GUEST_DEMO_CREDENTIALS.email, "email")}
                className="text-secondary hover:text-secondary-hover p-1 rounded transition-colors"
                title="Copy Email"
              >
                {copiedField === "email" ? (
                  <Check className="w-3.5 h-3.5 text-status-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Password row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Demo Password:</span>
            <div className="flex items-center gap-2">
              <code className="font-mono font-bold text-body bg-page px-2 py-0.5 rounded">
                {GUEST_DEMO_CREDENTIALS.password}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(GUEST_DEMO_CREDENTIALS.password, "pass")}
                className="text-secondary hover:text-secondary-hover p-1 rounded transition-colors"
                title="Copy Password"
              >
                {copiedField === "pass" ? (
                  <Check className="w-3.5 h-3.5 text-status-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-Fill Fields</span>
          </button>

          <button
            type="button"
            onClick={handleOneClickLogin}
            disabled={isPending}
            className="w-full py-2 px-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPending ? "Signing in..." : "1-Click Guest Login"}</span>
          </button>
        </div>
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
            Campus Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@skyline.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-body block" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-secondary hover:underline font-medium"
            >
              Use demo password?
            </button>
          </div>
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
