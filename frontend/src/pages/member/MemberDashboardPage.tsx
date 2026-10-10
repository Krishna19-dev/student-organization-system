import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Ticket, ShoppingBag, ShieldCheck, Calendar, 
  ArrowRight, Sparkles, Clock, QrCode, Tag, CheckCircle2,
  PackageCheck, MapPin, ExternalLink
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDemoUser } from "@/lib/auth-demo";

const DEFAULT_GUEST_TICKETS = [
  {
    id: "TCK-GST-9102",
    eventId: "EVT-001",
    title: "Skyline Tech & Design Summit 2026",
    date: "Oct 24, 2026",
    time: "10:00 AM IST",
    venue: "Main Auditorium, Central Campus",
    status: "VALID",
    tier: "Standard Guest Pass",
  },
];

const DEFAULT_GUEST_ORDERS = [
  {
    id: "ORD-GST-4410",
    date: "October 10, 2026",
    totalAmount: 799,
    status: "PAID",
    items: [
      { name: "Official Skyline Crest Hoodie", size: "L", quantity: 1, price: 799 },
    ],
    pickupLocation: "Student Council Merchandise Counter, Ground Floor",
  },
];

export default function MemberDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getDemoUser().then((u) => {
      setUser(u);
      const isG = u?.role === "GUEST";
      
      try {
        const storedTickets = localStorage.getItem("user_tickets");
        if (storedTickets) {
          setTickets(JSON.parse(storedTickets));
        } else {
          setTickets(isG ? DEFAULT_GUEST_TICKETS : [
            {
              id: "TCK-9901",
              title: "Skyline Tech & Design Summit 2026",
              date: "Oct 24, 2026",
              time: "10:00 AM IST",
              venue: "Central Auditorium",
              status: "VALID",
              tier: "Member Free Pass",
            },
            {
              id: "TCK-9772",
              title: "Acoustic Sunset Jam & Open Mic",
              date: "Nov 02, 2026",
              venue: "Amphitheatre",
              status: "VALID",
              tier: "Discounted Member Pass",
            },
          ]);
        }

        const storedOrders = localStorage.getItem("user_orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders(isG ? DEFAULT_GUEST_ORDERS : [
            {
              id: "ORD-9884",
              date: "October 09, 2026",
              totalAmount: 799,
              status: "PAID",
              items: [{ name: "Official Odoo Crest Hoodie", size: "L", quantity: 1, price: 799 }],
              pickupLocation: "Merchandise Counter, Ground Floor",
            },
          ]);
        }
      } catch {}
    });
  }, []);

  const isGuest = user?.role === "GUEST";
  const memberStatus = user?.status || "ACTIVE";
  const memberCode = isGuest 
    ? (user?.id ? `GST-${user.id.slice(-6).toUpperCase()}` : "GST-VISITOR") 
    : "SKY-2026-9041";
  const expiryDate = "October 31, 2027";
  const tier = user?.tier || "PREMIUM";

  /* =========================================================
     GUEST-SPECIFIC DASHBOARD VIEW (Orders & Passes ONLY)
     ========================================================= */
  if (isGuest) {
    return (
      <DashboardLayout
        role="GUEST"
        breadcrumb={[{ label: "Guest Hub" }]}
        title="Guest Operations Hub"
        subtitle="Manage your confirmed event passes and merchandise orders without paying membership fees."
      >
        <div className="space-y-6">
          {/* Top Banner Card */}
          <div className="rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-800 via-slate-900 to-[#017E84]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-700 text-slate-200 border border-slate-600">
                  Campus Guest Visitor
                </span>
                <span className="text-xs text-slate-300">ID: {memberCode}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                Welcome, {user?.name || "Guest Explorer"}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                This dashboard strictly manages your event tickets and merchandise orders. No annual membership dues or commitments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/events"
                className="px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#017E84]" />
                <span>Book Event Passes</span>
              </Link>
              <Link
                to="/shop"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Merchandise</span>
              </Link>
              <Link
                to="/membership"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join Member (Save 20%)</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics (Only passes, orders & guest tier) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center mb-2">
                <Ticket className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-xl font-black text-teal-600 font-mono">{tickets.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Event Passes Booked</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-blue-600 font-mono">{orders.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Merch Orders Placed</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-xl font-black text-slate-800 font-mono">₹0</div>
              <div className="text-xs text-gray-500 mt-0.5">Annual Dues (Free)</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center mb-2">
                <Tag className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-600 font-mono">Standard</div>
              <div className="text-xs text-gray-500 mt-0.5">Guest Pricing Rate</div>
            </div>
          </div>

          {/* SECTION 1: GUEST EVENT PASSES ONLY */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#017E84] flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">
                  My Guest Event Passes ({tickets.length})
                </h3>
              </div>
              <Link to="/events" className="text-xs font-bold text-[#017E84] hover:underline flex items-center gap-1">
                <span>Browse All Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF7F9] flex justify-between items-center hover:border-teal-200 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500 font-bold">{t.id}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {t.status || "VALID"}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">{t.title || t.eventTitle}</h4>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <span>{t.date}</span>
                        <span>•</span>
                        <span>{t.venue}</span>
                      </div>
                    </div>
                    <Link
                      to="/me/tickets"
                      className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#017E84] hover:bg-teal-50 transition-colors shadow-xs"
                      title="View Pass & QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 space-y-2">
                <Ticket className="w-8 h-8 text-gray-300 mx-auto" />
                <h4 className="text-xs font-bold text-gray-800">No event passes booked yet</h4>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                  Browse upcoming campus summits, open mics, and festivals to book guest entry passes.
                </p>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#017E84] hover:underline pt-2"
                >
                  <span>Explore Campus Events &rarr;</span>
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 2: GUEST MERCHANDISE ORDERS ONLY */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">
                  My Merchandise Orders ({orders.length})
                </h3>
              </div>
              <Link to="/shop" className="text-xs font-bold text-[#017E84] hover:underline flex items-center gap-1">
                <span>Visit Merch Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF7F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500 font-bold">{o.id}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {o.status || "PAID"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{o.date}</span>
                      </div>
                      <div className="font-bold text-xs text-gray-900">
                        {o.items?.map((it: any) => `${it.name} (${it.size || "Standard"}) × ${it.quantity}`).join(", ")}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{o.pickupLocation}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                      <div className="text-base font-black font-mono text-gray-900">
                        ₹{o.totalAmount}
                      </div>
                      <Link
                        to="/me/orders"
                        className="text-[11px] font-bold text-[#017E84] hover:underline flex items-center gap-0.5"
                      >
                        <span>Receipt &rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 space-y-2">
                <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                <h4 className="text-xs font-bold text-gray-800">No merchandise orders yet</h4>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                  Grab official student association hoodies, enamel pins, and gear at standard guest pricing.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#017E84] hover:underline pt-2"
                >
                  <span>Browse Merch Store &rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     MEMBER DASHBOARD VIEW (Full Member Tier, Card & Perks)
     ========================================================= */
  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member Hub" }]}
      title="Member Operations Hub"
      subtitle="Digital membership status, upcoming event passes, and campus perks."
    >
      <div className="space-y-6">
        {/* Top Banner Card */}
        <div className="bg-gradient-to-r from-[#4A1942] to-[#2E0F29] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                memberStatus === "ACTIVE" ? "bg-emerald-400 text-emerald-950" : "bg-red-400 text-red-950"
              }`}>
                {memberStatus} Member
              </span>
              <span className="text-xs text-purple-200">ID: {memberCode}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{user?.name || "Student Member"}</h2>
            <p className="text-xs text-purple-200">
              {tier === "PREMIUM" ? "Executive Premium Tier" : "Standard Basic Tier"} • Valid until {expiryDate}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/me/card"
              className="px-4 py-2.5 rounded-xl bg-white text-[#4A1942] font-bold text-xs hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#017E84]" />
              <span>Open Digital Card</span>
            </Link>
            <Link
              to="/shop"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Member Shop (20% Off)</span>
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Membership Tier", value: tier, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Valid Event Passes", value: String(tickets.length), icon: Ticket, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Merch Orders", value: String(orders.length), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Expiry Countdown", value: "340 Days", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-xl font-black ${s.color} font-mono`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Event Passes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#017E84]" />
              Upcoming Confirmed Event Tickets
            </h3>
            <Link to="/me/tickets" className="text-xs font-bold text-[#017E84] hover:underline">
              View All ({tickets.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-gray-100 bg-[#FAF7F9] flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-gray-400">{t.id}</span>
                  <h4 className="font-bold text-xs text-gray-900">{t.title}</h4>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>{t.date}</span>
                    <span>•</span>
                    <span>{t.venue}</span>
                  </div>
                </div>
                <Link
                  to="/me/tickets"
                  className="p-2 rounded-lg bg-white border border-gray-200 text-[#4A1942] hover:bg-purple-50 transition-colors"
                  title="View Pass"
                >
                  <QrCode className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
