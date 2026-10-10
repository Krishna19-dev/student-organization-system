"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket, ShoppingBag, Calendar, ShieldCheck, Compass, ArrowRight } from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function GuestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "orders">("overview");

  useEffect(() => {
    const c = document.cookie.split("; ").find(x => x.startsWith("token="));
    if (c) setToken(c.split("=")[1]);
  }, []);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    fetch(`${API_BASE}/api/tickets/mine`, { headers: h }).then(r => r.json()).then(d => setTickets(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API_BASE}/api/orders/mine`, { headers: h }).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, [token]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "tickets", label: "My Tickets", icon: Ticket, count: tickets.length },
    { id: "orders", label: "My Orders", icon: ShoppingBag, count: orders.length },
  ] as const;

  return (
    <DashboardLayout
      role="GUEST"
      breadcrumb={[{ label: "Guest" }]}
      title="Campus Guest Portal"
      subtitle="Browse events, purchase tickets, and order Skyline merchandise at standard rates."
    >
      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Browse Events", href: "/events", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", desc: "See upcoming campus events and grab tickets" },
          { label: "Merch Store", href: "/merch", icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", desc: "Official Skyline SSA merchandise & apparel" },
          { label: "Join as Member", href: "/membership", icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", desc: "Get 40% merch discount + exclusive perks" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}
              className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 group-hover:text-[#4A1942] transition-colors">{card.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{card.desc}</div>
              </div>
              <div className={`text-xs font-bold ${card.color} flex items-center gap-1 mt-auto`}>
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isActive ? "border-[#4A1942] text-[#4A1942] bg-purple-50/50" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {tab.label}
                {"count" in tab && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? "bg-[#4A1942] text-white" : "bg-gray-200 text-gray-600"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-black text-blue-700">{tickets.length}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Event Tickets</div>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-black text-purple-700">{orders.length}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Shop Orders</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#4A1942] to-[#714B67] rounded-2xl p-5 text-white flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wide mb-1">Unlock More Benefits</div>
                  <div className="font-black text-base">Upgrade to Member for 40% merch discount</div>
                  <div className="text-xs text-white/70 mt-1">Access exclusive events, voting rights & premium QR card</div>
                </div>
                <Link href="/membership"
                  className="shrink-0 px-4 py-2 bg-[#017E84] hover:bg-[#016368] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                  Join Now →
                </Link>
              </div>
            </div>
          )}

          {activeTab === "tickets" && (
            <div>
              {tickets.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No tickets yet. <Link href="/events" className="text-[#4A1942] font-bold hover:underline">Browse Events →</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {tickets.map(t => (
                    <div key={t.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {t.event?.date ? new Date(t.event.date).toLocaleDateString() : "TBD"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === "VALID" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{t.event?.title}</h3>
                      <p className="text-xs text-gray-500">{t.event?.venue}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No orders yet. <Link href="/merch" className="text-[#4A1942] font-bold hover:underline">Visit Merch Store →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map(o => (
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
                            <span key={it.id} className="mr-2">{it.productVariant?.product?.name} ×{it.quantity}</span>
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
