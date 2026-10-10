import React from "react";
import Link from "next/link";
import { 
  Compass, 
  LogIn, 
  Lock, 
  Mail, 
  Info
} from "lucide-react";

export const metadata = {
  title: "Portal Sign In | Skyline Student Association",
  description: "Sign into the Skyline Student Association member & officer operations portal.",
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6 text-secondary-light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-body tracking-tight">
          Skyline Portal Sign In
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Access your member pass, officer desk, or volunteer task board.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-subtle shadow-md space-y-6">
        {/* Info Callout */}
        <div className="p-3.5 rounded-xl bg-primary-light border border-primary/20 flex items-start gap-2.5 text-xs text-primary">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <div>
            <span className="font-semibold block mb-0.5">Task 1 Public Preview:</span>
            Authentication credentials and JWT sessions with Neon DB will be activated in Task 2.
          </div>
        </div>

        <form className="space-y-4">
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
                type="email"
                placeholder="student@skyline.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                disabled
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-body block" htmlFor="password">
                Password
              </label>
              <span className="text-[11px] text-muted cursor-not-allowed">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-border bg-page text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                disabled
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Ready in Task 2)</span>
            </button>
          </div>
        </form>

      </div>

      {/* Bottom Switcher */}
      <div className="text-center text-xs text-muted space-y-2">
        <p>
          Don&apos;t have an account yet?{" "}
          <Link href="/membership" className="font-semibold text-secondary hover:underline">
            Choose a Membership Tier &rarr;
          </Link>
        </p>
        <p>
          <Link href="/" className="text-primary hover:underline font-medium">
            &larr; Return to Skyline Home
          </Link>
        </p>
      </div>
    </div>
  );
}
