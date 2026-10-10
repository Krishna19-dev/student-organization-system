import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { 
  UserPlus, Loader2, ArrowRight, ShieldCheck, 
  AlertCircle, ShoppingBag, Ticket, CheckCircle2, User 
} from "lucide-react";
import { setDemoUser } from "@/lib/auth-demo";

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isGuestParam = searchParams.get("intent") === "guest" || searchParams.get("type") === "guest";
  const [isGuest, setIsGuest] = useState(isGuestParam);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsGuest(searchParams.get("intent") === "guest" || searchParams.get("type") === "guest");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleMode = (guestMode: boolean) => {
    setIsGuest(guestMode);
    setErrorMsg(null);
    if (guestMode) {
      setSearchParams({ intent: "guest" });
    } else {
      setSearchParams({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      let res: Response;
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        intent: "GUEST", // Base user account
      };

      try {
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        res = await fetch("http://localhost:4000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || data?.message || "Registration failed. Please check your credentials.");
      }

      if (isGuest) {
        // Save guest user session and token
        await setDemoUser(
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: "GUEST",
            status: "NONE",
            positionTitle: null,
            dashboard: "/me",
            token: data.token,
          },
          data.token
        );

        // Immediate redirect to Guest Dashboard
        navigate("/me");
      } else {
        // Save member user session and token
        await setDemoUser(
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.effective?.role || "MEMBER",
            status: data.effective?.status || "ACTIVE",
            positionTitle: data.effective?.positionTitle,
            dashboard: data.dashboard || "/me",
            token: data.token,
          },
          data.token
        );

        // Store pending membership data for dues payment step
        localStorage.setItem(
          "pending_membership",
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            tier: "BASIC",
            duesAmount: 299,
            tierName: "Standard Basic",
          })
        );

        // Navigate to payment checkout
        navigate("/join/pay?tier=basic");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className={`w-12 h-12 rounded-2xl ${isGuest ? "bg-slate-700" : "bg-[#017E84]"} text-white flex items-center justify-center mx-auto shadow-md transition-colors`}>
          {isGuest ? <ShoppingBag className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {isGuest ? "Register as Guest" : "Create Member Account"}
        </h1>
        <p className="text-sm text-gray-500">
          {isGuest 
            ? "Free visitor account to purchase event tickets and merchandise. No membership dues."
            : "Join the Skyline Student Association for full membership benefits, discounts & voting."
          }
        </p>
      </div>

      {/* Account Type Toggle */}
      <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleToggleMode(false)}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            !isGuest 
              ? "bg-white text-gray-900 shadow-xs" 
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#017E84]" />
          <span>Full Member</span>
        </button>
        <button
          type="button"
          onClick={() => handleToggleMode(true)}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            isGuest 
              ? "bg-white text-gray-900 shadow-xs" 
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-slate-700" />
          <span>Guest / Tickets</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isGuest && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Guest Visitor Account Benefits</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Buy event tickets, purchase merchandise, and view receipts. You can upgrade to a full voting membership at any time from your dashboard.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#017E84]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#017E84]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">
            Password (minimum 8 characters)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#017E84]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-xl ${
            isGuest ? "bg-slate-800 hover:bg-slate-900" : "bg-[#017E84] hover:bg-[#016368]"
          } text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account…</span>
            </>
          ) : isGuest ? (
            <>
              <span>Register as Guest &rarr; Guest Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Register &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#017E84] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
