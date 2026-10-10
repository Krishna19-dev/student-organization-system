"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Ticket, 
  ShoppingBag, 
  QrCode, 
  Calendar, 
  Clock, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function MemberPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"card" | "tickets" | "orders">("card");
  const [card, setCard] = useState<any | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadMemberData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Load card
      const cRes = await fetch(`${API_BASE}/api/memberships/card`, { headers });
      if (cRes.ok) {
        const cData = await cRes.json();
        setCard(cData);
      }

      // Load tickets
      const tRes = await fetch(`${API_BASE}/api/tickets/mine`, { headers });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTickets(Array.isArray(tData) ? tData : []);
      }

      // Load orders
      const oRes = await fetch(`${API_BASE}/api/orders/mine`, { headers });
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(Array.isArray(oData) ? oData : []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadMemberData();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Member Passport & Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access your verified digital membership card, event passes, and campus merchandise orders.
          </p>
        </div>

        <button
          onClick={loadMemberData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { id: "card", label: "Digital Membership Card", icon: QrCode },
          { id: "tickets", label: `My Tickets (${tickets.length})`, icon: Ticket },
          { id: "orders", label: `My Orders (${orders.length})`, icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-teal-700 text-white shadow-md shadow-teal-700/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MEMBERSHIP CARD */}
      {activeTab === "card" && (
        <div className="max-w-md mx-auto">
          {card ? (
            <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-teal-700/40 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-48 h-48" />
              </div>

              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300">
                    SKYLINE STUDENT ASSOCIATION
                  </span>
                  <h3 className="text-xl font-black tracking-tight">{card.name}</h3>
                  <span className="text-xs text-teal-200">{card.email}</span>
                </div>
                <span className="px-3 py-1 bg-teal-500/30 border border-teal-400/40 rounded-full text-xs font-bold uppercase tracking-wider text-teal-200">
                  {card.tier} TIER
                </span>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-inner">
                {card.qrDataUrl ? (
                  <Image
                    src={card.qrDataUrl}
                    alt="Membership QR"
                    width={180}
                    height={180}
                    className="w-44 h-44 object-contain rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    Generating QR...
                  </div>
                )}
                <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">
                  {card.memberCode}
                </span>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end text-xs text-teal-200 pt-2 border-t border-teal-700/50">
                <div>
                  <span className="block text-[10px] text-teal-400 uppercase font-semibold">Valid Thru</span>
                  <span className="font-bold">
                    {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "Active"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-teal-400 uppercase font-semibold">Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    VERIFIED ACTIVE
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border text-center space-y-3">
              <p className="text-sm text-gray-500">No active membership card detected for this account.</p>
              <Link
                href="/membership"
                className="inline-block px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800"
              >
                Apply for Membership &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY TICKETS */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border text-gray-500 text-sm">
              You haven&apos;t reserved any event tickets yet.{" "}
              <Link href="/events" className="text-teal-700 font-bold hover:underline">
                Browse Campus Events &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {new Date(t.event?.date).toLocaleDateString()}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        t.status === "VALID" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900">{t.event?.title}</h3>
                    <p className="text-xs text-gray-500">Venue: {t.event?.venue}</p>

                    {t.qrDataUrl && (
                      <div className="flex justify-center p-3 bg-gray-50 rounded-xl">
                        <Image
                          src={t.qrDataUrl}
                          alt="Ticket QR"
                          width={120}
                          height={120}
                          className="w-28 h-28 object-contain rounded"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono text-center truncate">
                    Token: {t.qrToken.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border text-gray-500 text-sm">
              No store orders placed yet.{" "}
              <Link href="/merch" className="text-teal-700 font-bold hover:underline">
                Visit Merchandise Store &rarr;
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b font-bold text-sm text-gray-800">
                Merchandise Order History ({orders.length})
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">Order #{o.id.slice(0, 8)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === "COLLECTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "PAID"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {o.items?.map((it: any) => (
                          <span key={it.id} className="mr-2">
                            {it.productVariant?.product?.name} ({it.productVariant?.size}) x{it.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
