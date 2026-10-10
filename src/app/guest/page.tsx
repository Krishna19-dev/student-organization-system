"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Ticket, ShoppingBag, Sparkles, Shield, ArrowRight } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function GuestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_BASE}/api/tickets/mine`, { headers })
      .then((r) => r.json())
      .then((d) => setTickets(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch(`${API_BASE}/api/orders/mine`, { headers })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-white/10">
            <Compass className="w-6 h-6 text-secondary-light" />
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-secondary-light">
            Campus Guest Pass
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Welcome to Skyline Campus Portal
        </h1>
        <p className="text-xs sm:text-sm text-primary-light/90 max-w-2xl leading-relaxed">
          As a registered guest, you have complete access to purchase tickets for all public association events and order official hoodies and merchandise.
        </p>

        {/* Upgrade Call to action */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/membership"
            className="px-5 py-2.5 bg-secondary hover:bg-secondary-hover text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade to Full Member (Up to 20% Off Merch) &rarr;</span>
          </Link>
          <Link
            href="/events"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            Browse Public Events
          </Link>
        </div>
      </div>

      {/* Guest Purchases */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Guest Tickets */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              <span>My Event Passes ({tickets.length})</span>
            </h3>
            <Link href="/events" className="text-xs text-primary font-bold hover:underline">
              Browse &rarr;
            </Link>
          </div>

          {tickets.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No event tickets reserved yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{t.event?.title}</span>
                    <span className="text-[11px] text-gray-500">{new Date(t.event?.date).toLocaleDateString()}</span>
                  </div>
                  {t.qrDataUrl && (
                    <Image
                      src={t.qrDataUrl}
                      alt="Ticket QR"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guest Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>My Merch Orders ({orders.length})</span>
            </h3>
            <Link href="/merch" className="text-xs text-primary font-bold hover:underline">
              Shop Store &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No store orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">Order #{o.id.slice(0, 8)}</span>
                    <span className="text-[11px] text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
