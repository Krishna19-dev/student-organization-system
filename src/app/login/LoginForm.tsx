"use client";

import React, { useState, useTransition } from "react";
import { 
  LogIn, 
  Lock, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  ShieldCheck 
} from "lucide-react";
import { loginAction, loginWithAccountById } from "./actions";
import { ALL_DEMO_ACCOUNTS } from "@/lib/demo-credentials";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFillAccount = (acc: typeof ALL_DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  const handleQuickLogin = (accId: string) => {
    setError(null);
    startTransition(async () => {
      await loginWithAccountById(accId);
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
      {/* Quick 1-Click Role Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Instant Demo Switcher (1-Click)</span>
          </span>
          <span className="text-[11px] text-muted">Ready to test</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin(acc.id)}
              className="text-left p-2.5 rounded-xl border border-gray-200 hover:border-secondary hover:bg-secondary-light/30 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-gray-800 group-hover:text-secondary-dark truncate">
                  {acc.roleName.split(" ")[0]}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${acc.badgeColor}`}>
                  {acc.role}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 truncate block mt-1">
                {acc.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase font-medium">Or Sign In with Form</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Form Error Notice */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              name="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. president@skyline.test"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-700">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Authenticating...
            </span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In to Skyline Portal
            </>
          )}
        </button>
      </form>
    </div>
  );
}
