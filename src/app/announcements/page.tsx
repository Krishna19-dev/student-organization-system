import React from "react";
import Link from "next/link";
import { 
  Megaphone, 
  Calendar, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Bell
} from "lucide-react";

export const metadata = {
  title: "Official Announcements | Skyline Student Association",
  description: "Public history of official notices, financial reports, executive decrees, and event updates.",
};

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Fall Semester General Body Meeting & Budget Ratification",
    date: "October 8, 2026",
    author: "Office of the President",
    category: "Governance",
    badge: "badge-info",
    summary: "The Executive Council cordially invites all enrolled students to attend the semester kickoff assembly. We will present the allocated event budgets, vote on volunteer committee leads, and review upcoming club charters.",
    content: "Agenda includes: (1) Welcome remarks by President R. Sharma, (2) Presentation of Q3 Treasury ledger and cash reserves, (3) Ratification of 4 new project teams, (4) Open floor for student concerns regarding campus facilities.",
    pin: true,
  },
  {
    id: "ann-2",
    title: "Q2 Financial Audit Statement & Reserve Balance Published",
    date: "October 4, 2026",
    author: "Desk of the Treasurer",
    category: "Finance & Audit",
    badge: "badge-success",
    summary: "In accordance with Skyline's Single-Ledger Policy, all transactions from July to September 2026 have been reconciled with zero float discrepancy. The complete transaction log is available for member review.",
    content: "Total incoming revenues reached ₹94,200 (primarily through merchandise pre-orders and basic membership dues). Total disbursements for supplies and guest speakers amounted to ₹62,400, leaving our net operating surplus at ₹31,800.",
    pin: false,
  },
  {
    id: "ann-3",
    title: "Volunteer Task Roster Open for Skyline Tech & Design Summit",
    date: "September 29, 2026",
    author: "Events & Logistics Directorate",
    category: "Volunteers",
    badge: "badge-warning",
    summary: "We are recruiting 12 dedicated student volunteers for our flagship technology summit. Roles include attendee check-in via QR camera scanners, stage tech, guest hospitality, and live photo coverage.",
    content: "Volunteers receive official Skyline commemorative crew badges, complimentary summit access, and volunteer meal vouchers. Sign up via the member portal task board.",
    pin: false,
  },
  {
    id: "ann-4",
    title: "New Association Apparel Drop: Plum Hoodies & Enamel Crest Pins",
    date: "September 20, 2026",
    author: "Merchandise Committee",
    category: "Store",
    badge: "badge-secondary",
    summary: "The official Skyline Autumn 2026 apparel collection is now available for direct online reservation. Featuring heavyweight plum fleece hoodies and brushed teal metal lapel pins.",
    content: "All apparel inventory is managed in real-time by size. Premium members enjoy a 15% discount applied at checkout. Pick up orders at Room 304, Student Activities Building.",
    pin: false,
  },
  {
    id: "ann-5",
    title: "Constitution Amendment on Cashless Operations Ratified",
    date: "September 12, 2026",
    author: "Association Governance Board",
    category: "Governance",
    badge: "badge-primary",
    summary: "The student senate has voted unanimously to ban unrecorded cash transactions. All association ticket sales, merchandise, and volunteer reimbursement claims must run through our single-entry ledger.",
    content: "This policy protects student fees from misappropriation and provides real-time auditability to all dues-paying members. Read the updated constitution in the club charter.",
    pin: false,
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-10 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 badge-primary px-3 py-1 rounded-full text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5 text-primary" />
            <span>Public Bulletin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Official Announcements &amp; Records
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            The immutable public archive of Skyline Student Association. Published once,
            accessible forever to members, faculty, and student body.
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-2 text-xs text-secondary-dark bg-secondary-light px-3.5 py-2.5 rounded-xl border border-secondary/20">
            <Bell className="w-4 h-4 text-secondary shrink-0" />
            <span>Public broadcast feed • No login required</span>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {SAMPLE_ANNOUNCEMENTS.map((item) => (
          <article
            key={item.id}
            className={`bg-surface rounded-2xl p-6 sm:p-8 border ${
              item.pin ? "border-primary/40 shadow-md" : "border-gray-subtle shadow-sm"
            } hover:shadow-md transition-shadow space-y-4`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`${item.badge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                  {item.category}
                </span>
                {item.pin && (
                  <span className="badge-primary text-[11px] font-semibold px-2 py-0.5 rounded">
                    Pinned Announcement
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <span>{item.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{item.author}</span>
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-body hover:text-primary transition-colors">
              {item.title}
            </h2>

            <p className="text-sm sm:text-base text-body/90 leading-relaxed font-normal">
              {item.summary}
            </p>

            <div className="p-4 rounded-xl bg-page border border-gray-subtle text-xs sm:text-sm text-muted leading-relaxed">
              <span className="font-semibold text-body block mb-1">Details &amp; Context:</span>
              {item.content}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                <span>Verified by Skyline Executive Board</span>
              </div>
              <span className="font-mono text-[11px] text-muted">ID: {item.id}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="bg-surface rounded-2xl p-6 border border-gray-subtle text-center space-y-2">
        <h3 className="font-bold text-base text-body">Have an announcement request?</h3>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          Registered campus clubs and student volunteer heads can submit notices to the executive board for approval.
        </p>
        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Learn about association submission bylaws</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
