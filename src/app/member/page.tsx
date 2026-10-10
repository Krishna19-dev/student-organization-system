"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, Ticket, ShoppingBag, QrCode,
  Sparkles, RefreshCw, CreditCard
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function MemberPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"card" | "tickets" | "orders">("card");
  const [card, setCard] = useState<any | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = document.cookie.split("; ").find(x => x.startsWith("token="));
    if (c) setToken(c.split("=")[1]);
  }, []);

  const loadData = async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [cR, tR, oR] = await Promise.all([
        fetch(`${API_BASE}/api/memberships/card`, { headers: h }),
        fetch(`${API_BASE}/api/tickets/mine`, { headers: h }),
        fetch(`${API_BASE}/api/orders/mine`, { headers: h }),
      ]);
      if (cR.ok) setCard(await cR.json());
      if (tR.ok) { const d = await tR.json(); setTickets(Array.isArray(d) ? d : []); }
      if (oR.ok) { const d = await oR.json(); setOrders(Array.isArray(d) ? d : []); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) loadData(); }, [token]);

  const tabs = [
    { id: "card", label: "Membership Card", icon: CreditCard, count: null },
    { id: "tickets", label: "My Tickets", icon: Ticket, count: tickets.length },
    { id: "orders", label: "My Orders", icon: ShoppingBag, count: orders.length },
  ] as const;

  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member" }]}
      title="Member Passport & Dashboard"
      subtitle="Your verified digital membership card, event passes, and campus merchandise orders."
      actions={
        <button onClick={loadData} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync
        </button>
      }
    >
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{error}</div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-2"><ShieldCheck className="w-4 h-4 text-teal-600" /></div>
          <div className="text-sm font-black text-teal-700">{card?.tier || "—"}</div>
          <div className="text-[11px] text-gray-500">Membership Tier</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2"><Ticket className="w-4 h-4 text-blue-600" /></div>
          <div className="text-2xl font-black text-blue-700">{tickets.length}</div>
          <div className="text-[11px] text-gray-500">Event Tickets</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2"><ShoppingBag className="w-4 h-4 text-purple-600" /></div>
          <div className="text-2xl font-black text-purple-700">{orders.length}</div>
          <div className="text-[11px] text-gray-500">Orders</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isActive ? "border-teal-600 text-teal-700 bg-teal-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Membership Card */}
          {activeTab === "card" && (
            <div className="max-w-sm mx-auto">
              {card ? (
                <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-teal-700/40 space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <Sparkles className="w-40 h-40" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300">Skyline Student Association</span>
                      <h3 className="text-xl font-black tracking-tight mt-1">{card.name}</h3>
                      <span className="text-xs text-teal-200">{card.email}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-500/30 border border-teal-400/40 rounded-full text-xs font-bold uppercase text-teal-200">
                      {card.tier}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2">
                    {card.qrDataUrl ? (
                      <Image src={card.qrDataUrl} alt="Membership QR" width={160} height={160} className="w-40 h-40 object-contain rounded-lg" unoptimized />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Generating QR…</div>
                    )}
                    <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">{card.memberCode}</span>
                  </div>
                  <div className="flex justify-between text-xs text-teal-200 pt-2 border-t border-teal-700/50">
                    <div>
                      <span className="block text-[10px] text-teal-400 uppercase font-semibold">Valid Thru</span>
                      <span className="font-bold">{card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "Active"}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-teal-400 uppercase font-semibold">Status</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> VERIFIED ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl border text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500">No active membership card found.</p>
                  <Link href="/membership" className="inline-block px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800">
                    Apply for Membership →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tickets */}
          {activeTab === "tickets" && (
            <div>
              {tickets.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No tickets yet. <Link href="/events" className="text-teal-700 font-bold hover:underline">Browse Events →</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map((t) => (
                    <div key={t.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {t.event?.date ? new Date(t.event.date).toLocaleDateString() : "TBD"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === "VALID" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{t.event?.title}</h3>
                      <p className="text-xs text-gray-500">{t.event?.venue}</p>
                      {t.qrDataUrl && (
                        <div className="flex justify-center p-3 bg-white rounded-xl border border-gray-100">
                          <Image src={t.qrDataUrl} alt="Ticket QR" width={100} height={100} className="w-24 h-24 object-contain rounded" unoptimized />
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400 font-mono text-center truncate">
                        {t.qrToken?.slice(0, 16)}…
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No orders yet. <Link href="/merch" className="text-teal-700 font-bold hover:underline">Visit Merch Store →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">Order #{o.id.slice(0, 8)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            o.status === "COLLECTED" ? "bg-emerald-100 text-emerald-800"
                            : o.status === "PAID" ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                          }`}>{o.status}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.items?.map((it: any) => (
                            <span key={it.id} className="mr-2">{it.productVariant?.product?.name} ({it.productVariant?.size}) ×{it.quantity}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
