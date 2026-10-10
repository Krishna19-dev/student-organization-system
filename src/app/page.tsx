import React from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Megaphone,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  QrCode,
  Kanban,
  Receipt,
  Scale,
  MapPin,
  Clock,
  Tag,
  TrendingUp,
  ShieldAlert
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-primary-light border-b border-gray-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>The Skyline Student Association Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-body leading-[1.15]">
                One Digital Hub for{" "}
                <span className="text-primary underline decoration-secondary decoration-4 underline-offset-4">
                  Campus Operations
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                Replacing scattered WhatsApp chats, paper receipt notebooks, cash envelopes, 
                and fragile spreadsheets. Manage club members, live events, apparel merch, 
                and an auditable single-entry ledger in real time.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/events"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <span>Explore Events &amp; Tickets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/membership"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Join the Association</span>
                </Link>
              </div>

              {/* Guarantees Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Zero-Float Integer Accounting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Instant QR Gate Check-ins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Live Stock &amp; Seat Locks</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                      SSA
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-body">Skyline Live Snapshot</h2>
                      <p className="text-xs text-muted">Real-time club health</p>
                    </div>
                  </div>
                  <span className="badge-success text-xs font-semibold px-2.5 py-1 rounded-full">
                    Active Term
                  </span>
                </div>

                {/* Metric Items */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-page border border-gray-subtle">
                    <div className="flex items-center gap-2 text-muted text-xs mb-1">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>Active Members</span>
                    </div>
                    <div className="text-2xl font-bold text-body">450+</div>
                    <div className="text-[11px] text-status-success-dark font-medium mt-0.5">
                      +18 joined this week
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-page border border-gray-subtle">
                    <div className="flex items-center gap-2 text-muted text-xs mb-1">
                      <TrendingUp className="w-4 h-4 text-status-success" />
                      <span>Ledger Balance</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">₹1,84,500</div>
                    <div className="text-[11px] text-muted font-medium mt-0.5">
                      100% Single-entry verified
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-page border border-gray-subtle">
                    <div className="flex items-center gap-2 text-muted text-xs mb-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Events Hosted</span>
                    </div>
                    <div className="text-2xl font-bold text-body">24</div>
                    <div className="text-[11px] text-muted font-medium mt-0.5">
                      3 upcoming this month
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-page border border-gray-subtle">
                    <div className="flex items-center gap-2 text-muted text-xs mb-1">
                      <ShoppingBag className="w-4 h-4 text-status-warning" />
                      <span>Merch Apparel</span>
                    </div>
                    <div className="text-2xl font-bold text-body">140</div>
                    <div className="text-[11px] text-status-info-dark font-medium mt-0.5">
                      Live size-wise stock
                    </div>
                  </div>
                </div>

                {/* Mini Announcement Preview */}
                <div className="p-3.5 rounded-xl bg-secondary-light border border-secondary/20 flex items-start gap-3">
                  <Megaphone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-secondary">Latest Notice:</span>{" "}
                    <span className="text-body">Annual General Body Meeting scheduled for Friday 5 PM at Auditorium B.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 PRODUCT MODULES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-secondary text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-secondary" />
            <span>Complete Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Built for Every Corner of Campus Club Life
          </h2>
          <p className="text-muted text-base">
            Everything your student executive team, treasurer, volunteers, and members need
            in a tightly integrated, role-based platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Members */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-body">1. Members &amp; Tiers</h3>
              <p className="text-sm text-muted leading-relaxed">
                Structured Basic and Premium membership tiers. Automated annual dues calculation, 
                instant expiry date tracking, and automated renewal reminder rosters.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-basic font-medium px-2 py-0.5 rounded">BASIC</span>
              <span className="badge-premium font-medium px-2 py-0.5 rounded">PREMIUM</span>
              <Link href="/membership" className="text-primary font-semibold hover:underline">
                View Perks &rarr;
              </Link>
            </div>
          </div>

          {/* Module 2: Events & Tickets */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-body">2. Events &amp; Tickets</h3>
              <p className="text-sm text-muted leading-relaxed">
                Dual pricing engine for Members vs. Guests. Hard seat capacities guarded by database 
                transactions, QR pass generation, and live camera gate check-in scanning.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-info font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                <span>QR Check-in</span>
              </span>
              <Link href="/events" className="text-primary font-semibold hover:underline">
                Explore Events &rarr;
              </Link>
            </div>
          </div>

          {/* Module 3: Announcements */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-body">3. Announcements</h3>
              <p className="text-sm text-muted leading-relaxed">
                Broadcast official club bulletins once and preserve an unalterable public history. 
                Keep all members and guests aligned without message clutter.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-primary font-medium px-2.5 py-0.5 rounded">
                Public Archive
              </span>
              <Link href="/announcements" className="text-primary font-semibold hover:underline">
                Read Notices &rarr;
              </Link>
            </div>
          </div>

          {/* Module 4: Merch Store */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-body">4. Merch Store</h3>
              <p className="text-sm text-muted leading-relaxed">
                Campus association apparel with granular size-wise stock (S, M, L, XL). 
                Transactional concurrency checks prevent overselling hoodies or pins.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-success font-medium px-2.5 py-0.5 rounded">
                Live Inventory
              </span>
              <Link href="/merch" className="text-primary font-semibold hover:underline">
                Browse Apparel &rarr;
              </Link>
            </div>
          </div>

          {/* Module 5: Fundraiser Board */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Kanban className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-body">5. Fundraiser Task Board</h3>
              <p className="text-sm text-muted leading-relaxed">
                Interactive volunteer task board for campus campaigns. Clear ownership (who does what), 
                milestone statuses, target funds, and transparent progress indicators.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-warning font-medium px-2.5 py-0.5 rounded">
                Volunteers &amp; Tasks
              </span>
              <span className="text-muted font-medium">Officer Auth</span>
            </div>
          </div>

          {/* Module 6: Expense Reimbursement */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Receipt className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-body">6. Expense Claims</h3>
              <p className="text-sm text-muted leading-relaxed">
                Volunteers submit out-of-pocket receipts digitally. Officers and Treasurers approve 
                or reject claims, with instant Ledger debit creation upon disbursement.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gray-subtle flex items-center justify-between text-xs">
              <span className="badge-danger font-medium px-2.5 py-0.5 rounded">
                Expense Audits
              </span>
              <span className="text-muted font-medium">Fast Payouts</span>
            </div>
          </div>

          {/* Module 7: Treasurer Dashboard */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-subtle shadow-sm hover:shadow-md transition-shadow lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-success text-xs font-semibold">
                  <Scale className="w-3.5 h-3.5 text-status-success-dark" />
                  <span>The Single Ledger Architecture</span>
                </div>
                <h3 className="text-2xl font-bold text-body">
                  7. Unified Treasurer Vault &amp; Single-Entry Ledger
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Every single rupee that enters or exits the Skyline Student Association originates
                  from an immutable database transaction with a simultaneous LedgerEntry record. 
                  Zero floating point errors, zero undocumented cash handovers. Complete peace of mind for audit committees.
                </p>
              </div>
              <div className="md:col-span-4 bg-page p-4 rounded-xl border border-gray-subtle space-y-2 text-xs">
                <div className="flex justify-between items-center text-muted">
                  <span>Transactions Audited</span>
                  <span className="font-bold text-body">1,248</span>
                </div>
                <div className="flex justify-between items-center text-muted">
                  <span>Float Discrepancies</span>
                  <span className="font-bold text-status-success-dark">0 (Int Rupees)</span>
                </div>
                <div className="flex justify-between items-center text-muted">
                  <span>Accounting Balance</span>
                  <span className="font-bold text-primary">₹1,84,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED UPCOMING EVENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-primary text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-3xl font-extrabold text-body tracking-tight">
              Upcoming Events &amp; Workshops
            </h2>
            <p className="text-muted text-sm mt-1">
              Member discounts apply automatically. Reserve your seat before capacity fills.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event 1 */}
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-info text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Workshop
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Oct 24, 2026</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-body hover:text-primary transition-colors">
                Skyline Tech &amp; Design Summit 2026
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                A full-day hands-on summit covering product thinking, UI systems, and full-stack architecture with industry alumni.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>Auditorium A, Science Complex</span>
              </div>
            </div>

            <div className="p-6 bg-page border-t border-gray-subtle space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted">Member Price: </span>
                  <span className="font-bold text-status-success-dark">₹0 (Free)</span>
                </div>
                <div>
                  <span className="text-muted">Guest Price: </span>
                  <span className="font-bold text-body">₹250</span>
                </div>
              </div>

              {/* Seat Capacity Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Seats: 180 filled</span>
                  <span>20 left of 200</span>
                </div>
                <div className="w-full bg-gray-subtle rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full w-[90%]" />
                </div>
              </div>

              <Link
                href="/events"
                className="w-full block text-center py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
              >
                Get Tickets
              </Link>
            </div>
          </div>

          {/* Event 2 */}
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-warning text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Cultural &amp; Arts
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Nov 02, 2026</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-body hover:text-primary transition-colors">
                Acoustic Sunset: Campus Open Mic
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Unwind with poetry, acoustic jams, and coffee on the Student Center terrace. Performers and listeners welcome.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>Student Amphitheater</span>
              </div>
            </div>

            <div className="p-6 bg-page border-t border-gray-subtle space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted">Member Price: </span>
                  <span className="font-bold text-status-success-dark">₹50</span>
                </div>
                <div>
                  <span className="text-muted">Guest Price: </span>
                  <span className="font-bold text-body">₹150</span>
                </div>
              </div>

              {/* Seat Capacity Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Seats: 95 filled</span>
                  <span>25 left of 120</span>
                </div>
                <div className="w-full bg-gray-subtle rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full w-[79%]" />
                </div>
              </div>

              <Link
                href="/events"
                className="w-full block text-center py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
              >
                Get Tickets
              </Link>
            </div>
          </div>

          {/* Event 3 */}
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-success text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Networking
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Nov 15, 2026</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-body hover:text-primary transition-colors">
                Alumni Leadership &amp; Career Mixer
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Connect with Skyline graduates leading careers in engineering, design, and business. Roundtable Q&amp;A format.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>Alumni Hall, 2nd Floor</span>
              </div>
            </div>

            <div className="p-6 bg-page border-t border-gray-subtle space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted">Member Price: </span>
                  <span className="font-bold text-status-success-dark">₹100</span>
                </div>
                <div>
                  <span className="text-muted">Guest Price: </span>
                  <span className="font-bold text-body">₹300</span>
                </div>
              </div>

              {/* Seat Capacity Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Seats: 45 filled</span>
                  <span>5 left of 50</span>
                </div>
                <div className="w-full bg-gray-subtle rounded-full h-2 overflow-hidden">
                  <div className="bg-status-warning h-2 rounded-full w-[90%]" />
                </div>
              </div>

              <Link
                href="/events"
                className="w-full block text-center py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="badge-secondary px-3 py-1 rounded-full text-xs font-semibold inline-block">
              Invest In Your Campus Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Membership Tiers &amp; Privileges
            </h2>
            <p className="text-primary-light text-sm sm:text-base">
              Join hundreds of fellow Skyline students. Pay dues with instant digital confirmation
              and enjoy priority access all semester long.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guest Plan */}
            <div className="bg-surface text-body rounded-2xl p-6 border border-gray-subtle flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Guest</h3>
                  <span className="badge-info text-xs font-semibold px-2 py-0.5 rounded">
                    Free
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-body">
                  ₹0
                  <span className="text-xs font-normal text-muted"> / year</span>
                </div>
                <p className="text-xs text-muted">
                  Open access for all campus students attending occasional activities.
                </p>
                <ul className="space-y-2.5 text-xs text-body pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>View public announcements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Standard guest event ticket rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Purchase official club merchandise</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-subtle">
                <Link
                  href="/events"
                  className="w-full block text-center py-2.5 rounded-xl border border-gray-border text-xs font-semibold text-body hover:bg-page transition-colors"
                >
                  Browse as Guest
                </Link>
              </div>
            </div>

            {/* Basic Member */}
            <div className="bg-surface text-body rounded-2xl p-6 border border-secondary shadow-md flex flex-col justify-between relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Basic Member</h3>
                  <span className="badge-basic text-xs font-semibold px-2 py-0.5 rounded">
                    BASIC
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-primary">
                  ₹200
                  <span className="text-xs font-normal text-muted"> / academic year</span>
                </div>
                <p className="text-xs text-muted">
                  The recommended tier for regular participants and active attendees.
                </p>
                <ul className="space-y-2.5 text-xs text-body pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Up to 40% discount on all events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Priority fast-track QR gate check-in</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Annual General Meeting voting voice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Exclusive monthly newsletter digest</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-subtle">
                <Link
                  href="/membership"
                  className="w-full block text-center py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow transition-colors"
                >
                  Join as Basic Member
                </Link>
              </div>
            </div>

            {/* Premium Member */}
            <div className="bg-surface text-body rounded-2xl p-6 border-2 border-status-warning shadow-lg flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 badge-premium px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Most Valued
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Premium Member</h3>
                  <span className="badge-premium text-xs font-semibold px-2 py-0.5 rounded">
                    PREMIUM
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-secondary">
                  ₹500
                  <span className="text-xs font-normal text-muted"> / academic year</span>
                </div>
                <p className="text-xs text-muted">
                  Full association citizenship for student leaders, volunteers, and enthusiasts.
                </p>
                <ul className="space-y-2.5 text-xs text-body pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span className="font-semibold text-body">100% Free entry</span>
                    <span className="text-muted">to all flagship summits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Complimentary club enamel crest pin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Access to volunteer task board &amp; claims</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>Executive board electoral voting rights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    <span>15% off official club merch orders</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-subtle">
                <Link
                  href="/membership"
                  className="w-full block text-center py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold shadow transition-colors"
                >
                  Join as Premium Member
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & MERCH DUAL SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Announcements Spotlight (7 cols) */}
          <div className="lg:col-span-7 bg-surface rounded-2xl p-6 sm:p-8 border border-gray-subtle shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-subtle">
              <div>
                <span className="badge-primary text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Public Board
                </span>
                <h3 className="text-2xl font-bold text-body">Recent Announcements</h3>
              </div>
              <Link
                href="/announcements"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>All Notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Notice 1 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="badge-info font-medium px-2 py-0.5 rounded">
                    Governance
                  </span>
                  <span className="text-muted">October 8, 2026</span>
                </div>
                <h4 className="font-bold text-sm text-body">
                  Fall Semester General Body Meeting &amp; Budget Review
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Join the Executive Council at Auditorium B as we present the semester expense plan
                  and ratify volunteer task coordinators. All members are encouraged to attend.
                </p>
                <div className="text-[11px] text-primary font-medium pt-1">
                  Posted by: Office of the President
                </div>
              </div>

              {/* Notice 2 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="badge-success font-medium px-2 py-0.5 rounded">
                    Finance
                  </span>
                  <span className="text-muted">October 4, 2026</span>
                </div>
                <h4 className="font-bold text-sm text-body">
                  Q2 Financial Audit Statement Published on Public Ledger
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  The Treasurer has posted the closed ledger for the previous quarter. Total revenue: 
                  ₹94,200, expenditures: ₹62,400, net reserve surplus: ₹31,800.
                </p>
                <div className="text-[11px] text-secondary font-medium pt-1">
                  Posted by: Desk of the Treasurer
                </div>
              </div>

              {/* Notice 3 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="badge-warning font-medium px-2 py-0.5 rounded">
                    Volunteers
                  </span>
                  <span className="text-muted">September 29, 2026</span>
                </div>
                <h4 className="font-bold text-sm text-body">
                  Call for Event Crew: Skyline Tech &amp; Design Summit
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  12 volunteer spots are open for logistics, guest reception, and QR gate verification.
                  Sign up via the Volunteer task board once authenticated.
                </p>
                <div className="text-[11px] text-status-warning-dark font-medium pt-1">
                  Posted by: Events &amp; Logistics Directorate
                </div>
              </div>
            </div>
          </div>

          {/* Merch Store Spotlight (5 cols) */}
          <div className="lg:col-span-5 bg-surface rounded-2xl p-6 sm:p-8 border border-gray-subtle shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-subtle">
              <div>
                <span className="badge-secondary text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Association Store
                </span>
                <h3 className="text-2xl font-bold text-body">Campus Apparel</h3>
              </div>
              <Link
                href="/merch"
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
              >
                <span>Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Merch Item 1 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="badge-primary text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Apparel
                  </span>
                  <h4 className="font-bold text-sm text-body">Plum Skyline Crest Hoodie</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span>Sizes: S, M, L, XL</span>
                    <span>•</span>
                    <span className="text-status-success-dark font-medium">In Stock</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-primary">₹799</div>
                  <Link
                    href="/merch"
                    className="text-xs text-secondary hover:underline font-semibold block mt-1"
                  >
                    Order &rarr;
                  </Link>
                </div>
              </div>

              {/* Merch Item 2 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="badge-secondary text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Accessory
                  </span>
                  <h4 className="font-bold text-sm text-body">Association Teal Enamel Pin</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span>Standard Size</span>
                    <span>•</span>
                    <span className="text-status-success-dark font-medium">42 Left</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-secondary">₹149</div>
                  <Link
                    href="/merch"
                    className="text-xs text-secondary hover:underline font-semibold block mt-1"
                  >
                    Order &rarr;
                  </Link>
                </div>
              </div>

              {/* Merch Item 3 */}
              <div className="p-4 rounded-xl bg-page border border-gray-subtle flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="badge-info text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Gear
                  </span>
                  <h4 className="font-bold text-sm text-body">Skyline Heavy Canvas Tote</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span>Natural Cotton</span>
                    <span>•</span>
                    <span className="text-status-success-dark font-medium">In Stock</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-body">₹349</div>
                  <Link
                    href="/merch"
                    className="text-xs text-secondary hover:underline font-semibold block mt-1"
                  >
                    Order &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-primary-light border border-primary/20 flex items-center gap-3">
                <Tag className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-primary">
                  <span className="font-semibold">Member Benefit:</span> Premium members receive an extra 15% discount on all apparel during checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FINANCIAL ARCHITECTURE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-gray-subtle shadow-md">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 badge-danger px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-status-danger" />
              <span>Immutable Transparency Charter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-body">
              How Skyline Guarantees 100% Financial Accountability
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Every financial event in this system—ticket reservations, merchandise checkouts, 
              membership dues, and volunteer reimbursement disbursements—is executed inside an atomic 
              PostgreSQL transaction. Every rupee has a single, verifiable source and destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-subtle">
            <div className="space-y-2">
              <div className="font-bold text-sm text-body flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success" />
                <span>Single-Entry Ledger Record</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                No payment can be marked complete without an accompanying row in the LedgerEntry table.
                Eliminates hidden offline cash handling.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sm text-body flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>Strict Integer Currency</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Money is strictly stored as integer rupees. Floating-point rounding anomalies 
                are eliminated by design across all pricing calculations.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sm text-body flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Race-Free Concurrency</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Limited event seats and merchandise stock sizes are decremented inside database 
                locks so hot drops never oversell a single ticket or hoodie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-light rounded-3xl p-8 sm:p-12 border border-primary/20 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Ready to Experience Modern Campus Governance?
          </h2>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            Whether you are joining as a new member, exploring our flagship tech workshops, 
            or managing club operations, Skyline gives you a modern, reliable home.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/membership"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-md transition-colors"
            >
              Get Your Membership Pass
            </Link>
            <Link
              href="/events"
              className="px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold shadow-md transition-colors"
            >
              Browse Event Calendar
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-surface border border-gray-border text-body hover:bg-page font-semibold transition-colors"
            >
              Officer Portal Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
