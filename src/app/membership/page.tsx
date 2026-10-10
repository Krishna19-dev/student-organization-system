import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle
} from "lucide-react";

export const metadata = {
  title: "Membership Tiers & Perks | Skyline Student Association",
  description: "Join the Skyline Student Association. Compare Guest, Basic, and Premium membership tiers.",
};

const COMPARISON_FEATURES = [
  { name: "Public Announcements & Bulletins", guest: true, basic: true, premium: true },
  { name: "Event Ticket Booking Access", guest: true, basic: true, premium: true },
  { name: "Discounted Member Ticket Rates", guest: false, basic: true, premium: true },
  { name: "Free Entry to Flagship Tech Summits", guest: false, basic: false, premium: true },
  { name: "Priority Fast-Track QR Gate Line", guest: false, basic: true, premium: true },
  { name: "Annual General Body Voting Voice", guest: false, basic: true, premium: true },
  { name: "Executive Board Voting & Candidacy", guest: false, basic: false, premium: true },
  { name: "Volunteer Task Board Access", guest: false, basic: false, premium: true },
  { name: "Reimbursement Expense Claims", guest: false, basic: false, premium: true },
  { name: "Official Enamel Crest Pin Gift", guest: false, basic: false, premium: true },
  { name: "15% Association Merch Store Discount", guest: false, basic: false, premium: true },
];

const FAQS = [
  {
    q: "How long does a Skyline membership remain active?",
    a: "Memberships run for the full academic year (365 days from the date of dues payment). The platform automatically queues renewal reminder alerts 14 days before your expiry date.",
  },
  {
    q: "How does the single-ledger accounting protect my membership dues?",
    a: "Every rupee received in dues creates an instant, immutable LedgerEntry in our PostgreSQL database. Dues cannot be accepted without a recorded ledger credit, guaranteeing 100% auditable student funds.",
  },
  {
    q: "Can I upgrade from Basic to Premium midway through the semester?",
    a: "Yes! You can upgrade anytime by paying the ₹300 difference. Your renewal anniversary resets to grant you a full year of Premium benefits.",
  },
  {
    q: "How do member ticket discounts work?",
    a: "When signed into your Skyline member account, the checkout system automatically detects your tier and applies your discounted or zero-rupee rate before generating your QR ticket pass.",
  },
];

export default function MembershipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-12 border border-primary/20 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 badge-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Official Membership Program</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight">
          Invest in Your Campus Leadership
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Skyline Student Association is run by students, for students. Choose the tier 
          that fits your journey, access discounted tickets, and build lifelong connections.
        </p>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier: Guest */}
        <div className="bg-surface rounded-3xl p-8 border border-gray-subtle shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="badge-info text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Unregistered
              </span>
              <span className="text-xs text-muted">Tier 0</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-body">Guest</h2>
              <p className="text-xs text-muted mt-1">Open campus student or casual event attendee</p>
            </div>
            <div className="pt-2">
              <span className="text-4xl font-extrabold text-body">₹0</span>
              <span className="text-xs text-muted ml-1">/ year</span>
            </div>

            <ul className="space-y-3 text-xs text-body border-t border-gray-subtle pt-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Browse public events &amp; bulletins</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Purchase standard guest-rate event tickets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Purchase official club apparel</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/events"
              className="w-full block text-center py-3 rounded-xl border border-gray-border text-xs font-semibold text-body hover:bg-page transition-colors"
            >
              Continue as Guest
            </Link>
          </div>
        </div>

        {/* Tier: Basic Member */}
        <div className="bg-surface rounded-3xl p-8 border-2 border-secondary shadow-md flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="badge-basic text-xs font-semibold px-2.5 py-0.5 rounded-full">
                BASIC
              </span>
              <span className="text-xs text-secondary font-medium">Recommended</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-body">Basic Member</h2>
              <p className="text-xs text-muted mt-1">Active participants attending workshops and social mixers</p>
            </div>
            <div className="pt-2">
              <span className="text-4xl font-extrabold text-primary">₹200</span>
              <span className="text-xs text-muted ml-1">/ academic year</span>
            </div>

            <ul className="space-y-3 text-xs text-body border-t border-gray-subtle pt-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span className="font-semibold text-body">Up to 40% discount on event tickets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Priority fast-track QR gate check-in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Annual General Meeting voting voice</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Automated 14-day renewal reminders</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/login"
              className="w-full block text-center py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow transition-colors"
            >
              Enroll as Basic Member
            </Link>
          </div>
        </div>

        {/* Tier: Premium Member */}
        <div className="bg-surface rounded-3xl p-8 border-2 border-status-warning shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-6 badge-premium px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Top Tier
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="badge-premium text-xs font-semibold px-2.5 py-0.5 rounded-full">
                PREMIUM
              </span>
              <span className="text-xs text-status-warning-dark font-medium">Leadership Tier</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-body">Premium Member</h2>
              <p className="text-xs text-muted mt-1">Student leaders, volunteers, organizers, and committee candidates</p>
            </div>
            <div className="pt-2">
              <span className="text-4xl font-extrabold text-secondary">₹500</span>
              <span className="text-xs text-muted ml-1">/ academic year</span>
            </div>

            <ul className="space-y-3 text-xs text-body border-t border-gray-subtle pt-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span className="font-semibold text-body">100% Free entry to all flagship summits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Free Association Enamel Pin gift</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Access to Volunteer Task Board &amp; Fundraisers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Submit expense claims for instant reimbursement</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Full electoral vote for Executive Council</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>15% off all official merchandise</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/login"
              className="w-full block text-center py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold shadow transition-colors"
            >
              Enroll as Premium Member
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-gray-subtle shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-body">Detailed Feature Comparison</h2>
          <p className="text-xs sm:text-sm text-muted">
            See exactly what is included across each membership tier.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-subtle text-muted">
                <th className="py-3 px-4 font-semibold text-body">Platform Capability</th>
                <th className="py-3 px-4 font-semibold text-center text-body">Guest</th>
                <th className="py-3 px-4 font-semibold text-center text-primary">Basic (₹200)</th>
                <th className="py-3 px-4 font-semibold text-center text-secondary">Premium (₹500)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-subtle">
              {COMPARISON_FEATURES.map((feat) => (
                <tr key={feat.name} className="hover:bg-page/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-body">{feat.name}</td>
                  <td className="py-3 px-4 text-center">
                    {feat.guest ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success inline" />
                    ) : (
                      <span className="text-gray-border">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feat.basic ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success inline" />
                    ) : (
                      <span className="text-gray-border">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feat.premium ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success inline" />
                    ) : (
                      <span className="text-gray-border">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-gray-subtle shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-secondary" />
          <h2 className="text-2xl font-bold text-body">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-page border border-gray-subtle space-y-2">
              <h4 className="font-bold text-sm text-body">{faq.q}</h4>
              <p className="text-xs text-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
