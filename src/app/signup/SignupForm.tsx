"use client";

import React, { useState, useTransition } from "react";
import { User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { signupAction } from "../login/actions";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signupAction(null, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-status-danger-light border border-status-danger/30 text-xs text-status-danger-dark flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-danger" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="email">
            Campus or Personal Email
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
              placeholder="you@campus.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="password">
            Password (min. 6 characters)
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
              minLength={6}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body block" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Policy notice */}
        <div className="rounded-xl p-3 bg-secondary-light/40 border border-secondary/20 text-[11px] text-muted flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
          <span>New public registrations are enrolled with default <strong>Member</strong> tier.</span>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <span>{isPending ? "Creating Account..." : "Create Member Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
