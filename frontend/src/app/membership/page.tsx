import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Gift,
  Users,
  Briefcase,
  Layers,
  FileCheck
} from "lucide-react";

export const metadata = {
  title: "Membership Plans | Club_Hub",
  description: "Join Club_Hub campus student organization. Compare Guest Access (₹0) and Official Club Membership (₹300 one-time fee).",
};

const COMPARISON_FEATURES = [
  { name: "Public Website & Event Exploration", guest: true, official: true },
  { name: "Public Bulletins & Announcements", guest: true, official: true },
  { name: "Official Club_Hub Membership Status", guest: false, official: true },
  { name: "Official Member ID & Verified Account", guest: false, official: true },
  { name: "Express Interest in Open Club Positions", guest: false, official: true },
  { name: "Official Club_Hub Goodies & T-Shirt Eligibility", guest: false, official: true },
  { name: "Member-Only Teamwork & Collaboration Hub", guest: false, official: true },
  { name: "Member-Only Workspaces & Activity Channels", guest: false, official: true },
  { name: "Priority Member Updates from Administration", guest: false, official: true },
  { name: "Voting in Annual Club Elections", guest: false, official: true },
];

const FAQS = [
  {
    q: "Is the ₹300 fee a subscription or a one-time joining fee?",
    a: "The ₹300 fee is a strictly one-time joining fee for Club_Hub membership. There are no recurring monthly or hidden annual charges.",
  },
  {
    q: "Does paying the ₹300 fee guarantee a club position or leadership role?",
    a: "No. Paying the joining fee allows you to express interest in open club positions (such as Web Dev, Design, Event Management, etc.). The Club Administration and President review all applications and appoint candidates based on qualifications.",
  },
  {
    q: "When will I receive my account credentials and member ID?",
    a: "After your payment is verified, your application enters administrative review. Our club administration aims to review your application within one working day. Once approved, you will receive an official Club_Hub Member ID and activation instructions.",
  },
  {
    q: "What is the club's refund policy if an application is rejected?",
    a: "If your membership application cannot be approved, your ₹300 joining fee will be promptly refunded back to your original payment method in full in accordance with Club_Hub's transparent treasury policy.",
  },
  {
    q: "What goodies and merchandise am I eligible for?",
    a: "Official members are eligible for the welcome package including an official Club_Hub T-shirt, crest badge, and stickers subject to seasonal club merchandise distribution schedules.",
  },
  {
    q: "Can I explore the website as a Guest without paying?",
    a: "Absolutely! Guest access is completely free (₹0). You can browse public announcements, explore upcoming events, and view club initiatives without registering or paying any fee.",
  },
];

export default function MembershipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-[#FAF7F9] rounded-3xl p-8 sm:p-12 border border-[#4A1942]/15 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#4A1942]/10 text-[#4A1942] px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4A1942]" />
          <span>Club_Hub Membership Program</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Choose Your Membership Path
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Club_Hub empowers students to build, organize, and lead. Browse freely as a Guest or apply for Official Membership to unlock leadership positions, goodies, and collaborative workspaces.
        </p>
      </div>

      {/* 2-Tier Cards Grid: Guest (₹0) vs Official Membership (₹300) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Plan A: Guest Access */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Plan A
              </span>
              <span className="text-xs text-gray-400 font-medium">Public Access</span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Guest Access</h2>
              <p className="text-xs text-gray-500 mt-1">
                Explore public club pages, events, bulletins, and announcements freely.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">₹0</span>
              <span className="text-xs text-gray-400 ml-1">/ Free Forever</span>
            </div>

            <ul className="space-y-3.5 text-xs text-gray-700 border-t border-gray-100 pt-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Browse public club pages &amp; information</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Explore public events &amp; club announcements</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>No registration or joining fee required</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <span className="w-4 text-center shrink-0 font-bold">✕</span>
                <span>No official Club_Hub membership status</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <span className="w-4 text-center shrink-0 font-bold">✕</span>
                <span>No member ID or member-only portal</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <span className="w-4 text-center shrink-0 font-bold">✕</span>
                <span>No club goodies or T-shirt entitlement</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              to="/events"
              className="w-full block text-center py-3.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Continue as Guest
            </Link>
          </div>
        </div>

        {/* Plan B: Official Club Membership */}
        <div className="bg-white rounded-3xl p-8 border-2 border-[#017E84] shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-6 bg-[#017E84] text-white px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Recommended</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-teal-50 text-[#017E84] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-teal-200">
                Plan B
              </span>
              <span className="text-xs text-[#017E84] font-bold">Official Membership</span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Official Club Membership</h2>
              <p className="text-xs text-gray-500 mt-1">
                Full student membership with leadership position eligibility, goodies, and collaboration hub.
              </p>
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#017E84]">₹300</span>
              <div className="text-xs text-gray-500">
                <div className="font-bold text-gray-700">One-Time Joining Fee</div>
                <div>No recurring subscription</div>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-gray-800 border-t border-gray-100 pt-6">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#017E84] shrink-0" />
                <span className="font-bold text-gray-900">Official Club_Hub membership (subject to review)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Eligibility for official goodies &amp; club T-shirt</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Eligibility to express interest in available club positions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Access to member-only teamwork &amp; collaboration hub</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Official Member ID &amp; account access after approval</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Priority membership updates from administration</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              to="/signup?plan=official"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Apply for Membership — ₹300</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-gray-400 text-center mt-2.5">
              Secure ₹300 Razorpay settlement · Subject to admin review · Full refund if rejected
            </p>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Plan Comparison Matrix</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Compare capabilities between Guest Access and Official Club Membership.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3.5 px-4 font-bold text-gray-900">Feature / Capability</th>
                <th className="py-3.5 px-4 font-bold text-center text-gray-700">Guest Access (₹0)</th>
                <th className="py-3.5 px-4 font-bold text-center text-[#017E84]">Official Membership (₹300)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {COMPARISON_FEATURES.map((feat) => (
                <tr key={feat.name} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-gray-800">{feat.name}</td>
                  <td className="py-3.5 px-4 text-center">
                    {feat.guest ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 inline" />
                    ) : (
                      <span className="text-gray-300 font-bold">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {feat.official ? (
                      <CheckCircle2 className="w-4 h-4 text-[#017E84] inline" />
                    ) : (
                      <span className="text-gray-300 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#4A1942]" />
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F9] border border-gray-100 space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
