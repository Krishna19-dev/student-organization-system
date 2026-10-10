import React from "react";
import { 
  Compass, 
  Scale, 
  MapPin, 
  Mail, 
  Clock, 
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "About Skyline Student Association | Mission & Governance",
  description: "Learn about the mission, executive structure, and cashless transparency charter of the Skyline Student Association.",
};

const ROLES = [
  {
    role: "ADMIN",
    title: "Executive Leadership & President",
    badge: "badge-primary",
    description: "Responsible for overall club governance, university liaison, event sanctions, official announcements, and member charters.",
  },
  {
    role: "TREASURER",
    title: "Financial Custodian & Ledger Steward",
    badge: "badge-success",
    description: "Oversees the immutable single-entry ledger. Audits ticket and merch cash inflows, reviews volunteer expense claims, and publishes quarterly balances.",
  },
  {
    role: "VOLUNTEER",
    title: "Event Crew & Campaign Coordinators",
    badge: "badge-warning",
    description: "The heartbeat of campus execution. Runs camera QR check-ins at event gates, executes fundraiser tasks, and submits legitimate expense claims.",
  },
  {
    role: "MEMBER",
    title: "Campus Student Citizens",
    badge: "badge-info",
    description: "Enrolled students across Basic and Premium tiers. Casts votes in elections, attends workshops, and shapes the campus community.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero / Mission */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-12 border border-primary/20 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 badge-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>About Skyline Association</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight">
          Empowering 450+ Campus Leaders
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Founded to build a vibrant, transparent, and technology-driven campus community.
          We replace legacy paper processes with modern digital tools built for student clubs.
        </p>
      </div>

      {/* Origin Story & Core Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="badge-secondary text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Our Story
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-body">
            Why We Replaced Spreadsheets &amp; Cash Notebooks
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            For years, student clubs suffered from the same bottlenecks: ticket receipts lost 
            in physical registers, event ticket payments tracked on arbitrary WhatsApp chats, 
            and cash envelopes passing hands without audit trails.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            Skyline was engineered during a 24-hour hackathon to demonstrate what modern, 
            production-grade campus software looks like. By enforcing a single-entry ledger where 
            every rupee is tied to an atomic database transaction, we established total fiscal transparency.
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-gray-subtle shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-body flex items-center gap-2">
            <Scale className="w-5 h-5 text-secondary" />
            <span>The 4 Cardinal Principles</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-body">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
              <span><strong>Radical Financial Transparency:</strong> Every rupee in or out must create a LedgerEntry.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span><strong>Zero-Float Precision:</strong> Money stored solely as integer rupees to prevent rounding flaws.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span><strong>Fair Event Access:</strong> Concurrency locks guard seats and merchandise from overselling.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              <span><strong>Democracy &amp; Service:</strong> Dues-paying members hold verifiable voting voices.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Role Architecture */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-body">Role-Based Governance Structure</h2>
          <p className="text-xs sm:text-sm text-muted">
            The platform enforces strict role-based access control across all operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className={`${r.badge} text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block`}>
                  {r.role}
                </span>
                <h3 className="font-bold text-base text-body">{r.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{r.description}</p>
              </div>
              <div className="text-[11px] text-muted font-medium pt-2 border-t border-gray-subtle">
                Role Verified Server-Side
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Location & Hours */}
      <div className="bg-surface rounded-3xl p-8 border border-gray-subtle shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-body">Headquarters</h4>
            <p className="text-xs text-muted mt-0.5">
              Student Activities Building, Room 304, Main Campus Quad
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-body">Email Inquiries</h4>
            <p className="text-xs text-muted mt-0.5">
              contact@skyline-sa.edu / treasurer@skyline-sa.edu
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-page flex items-center justify-center shrink-0 border border-gray-subtle">
            <Clock className="w-5 h-5 text-muted" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-body">Executive Office Hours</h4>
            <p className="text-xs text-muted mt-0.5">
              Mon – Fri: 9:00 AM – 5:30 PM IST (Drop-ins welcome)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
