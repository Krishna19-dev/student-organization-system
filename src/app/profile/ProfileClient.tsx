"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Ticket, 
  ShoppingBag, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  X, 
  Receipt, 
  ArrowRight,
  Shield,
  PackageCheck
} from "lucide-react";

interface TicketItem {
  id: string;
  code: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  seat: string;
  price: number;
  status: string;
  statusBadge: string;
  qrPayload: string;
}

interface MerchItem {
  id: string;
  orderNumber: string;
  name: string;
  category: string;
  size: string;
  qty: number;
  price: number;
  date: string;
  pickupLocation: string;
  status: string;
  statusBadge: string;
}

const PURCHASED_TICKETS: TicketItem[] = [
  {
    id: "tkt-1",
    code: "TKT-SKY-2026-0428",
    title: "Skyline Tech & Design Summit 2026",
    category: "Workshop & Summit",
    date: "October 24, 2026 • 10:00 AM IST",
    venue: "Auditorium A, Science Complex",
    seat: "Row C, Seat 14",
    price: 250,
    status: "Confirmed & Gate Ready",
    statusBadge: "badge-success",
    qrPayload: "SSA-PASS:TKT-0428:GUEST:TECH-SUMMIT-2026",
  },
  {
    id: "tkt-2",
    code: "TKT-SKY-2026-0912",
    title: "Acoustic Sunset: Campus Open Mic & Jam",
    category: "Cultural & Arts",
    date: "November 02, 2026 • 5:30 PM IST",
    venue: "Student Amphitheater & Terrace",
    seat: "Open General Admission",
    price: 150,
    status: "Confirmed & Gate Ready",
    statusBadge: "badge-success",
    qrPayload: "SSA-PASS:TKT-0912:GUEST:ACOUSTIC-SUNSET",
  },
];

const PURCHASED_MERCH: MerchItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-MCH-8821",
    name: "Skyline Crest Fleece Hoodie (Deep Plum)",
    category: "Apparel",
    size: "L",
    qty: 1,
    price: 799,
    date: "October 09, 2026",
    pickupLocation: "Room 304, Student Activities Building",
    status: "Ready for Pickup",
    statusBadge: "badge-warning",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-MCH-7914",
    name: "Association Teal Enamel Crest Pin",
    category: "Accessory",
    size: "One Size",
    qty: 2,
    price: 298,
    date: "October 05, 2026",
    pickupLocation: "Desk Counter Room 304",
    status: "Collected",
    statusBadge: "badge-success",
  },
];

const LEDGER_HISTORY = [
  {
    txnId: "TXN-LED-9042",
    description: "Event Ticket: Skyline Tech Summit 2026",
    type: "TICKET_SALE",
    amount: 250,
    date: "2026-10-09 16:32 IST",
  },
  {
    txnId: "TXN-LED-8821",
    description: "Merch Purchase: Crest Fleece Hoodie (Size L)",
    type: "MERCH_PURCHASE",
    amount: 799,
    date: "2026-10-09 14:10 IST",
  },
  {
    txnId: "TXN-LED-7914",
    description: "Merch Purchase: 2x Teal Enamel Crest Pins",
    type: "MERCH_PURCHASE",
    amount: 298,
    date: "2026-10-05 11:45 IST",
  },
  {
    txnId: "TXN-LED-6512",
    description: "Event Ticket: Acoustic Sunset Open Mic",
    type: "TICKET_SALE",
    amount: 150,
    date: "2026-10-04 18:20 IST",
  },
];

export default function ProfileClient({
  userName = "Demo Guest Explorer",
  userEmail = "guest@skyline.edu",
  userRole = "GUEST",
}: {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}) {
  const [activeTab, setActiveTab] = useState<"tickets" | "merch" | "ledger">("tickets");
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* USER PROFILE HEADER CARD */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          {/* Avatar Circle */}
          <div className="w-16 h-16 rounded-2xl bg-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-body">{userName}</h1>
              <span className="badge-info text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {userRole} ACCESS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted">{userEmail}</p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted pt-1">
              <span className="font-mono text-[11px] bg-page px-2 py-0.5 rounded border border-gray-subtle">
                ID: SKY-2026-DEMO
              </span>
              <span>•</span>
              <span className="text-status-success-dark font-medium">Session Active</span>
              <span>•</span>
              <span>Campus Guest Explorer</span>
            </div>
          </div>
        </div>

        {/* Upgrade Callout */}
        <div className="bg-secondary-light rounded-2xl p-4 border border-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:max-w-xs">
          <div className="text-xs">
            <span className="font-bold text-secondary-dark block">Guest Rate Active</span>
            <span className="text-muted text-[11px]">Save up to 40% on tickets with Basic/Premium membership.</span>
          </div>
          <Link
            href="/membership"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            Upgrade Tier
          </Link>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-subtle pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "tickets"
              ? "bg-primary text-white shadow-sm"
              : "text-body hover:bg-page"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Purchased Event Tickets ({PURCHASED_TICKETS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("merch")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "merch"
              ? "bg-secondary text-white shadow-sm"
              : "text-body hover:bg-page"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Merch Orders ({PURCHASED_MERCH.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "ledger"
              ? "bg-primary-hover text-white shadow-sm"
              : "text-body hover:bg-page"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Ledger Receipts ({LEDGER_HISTORY.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: EVENT TICKETS */}
      {activeTab === "tickets" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-body">Your Confirmed Event Tickets</h2>
              <p className="text-xs text-muted">Show your digital QR pass at the entrance gate scanner.</p>
            </div>
            <Link href="/events" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Browse More Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PURCHASED_TICKETS.map((tkt) => (
              <div
                key={tkt.id}
                className="bg-surface rounded-2xl border border-gray-subtle shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between">
                  <span className={`${tkt.statusBadge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    {tkt.status}
                  </span>
                  <span className="font-mono text-xs text-muted">{tkt.code}</span>
                </div>

                <div className="space-y-2">
                  <span className="badge-primary text-[10px] font-semibold px-2 py-0.5 rounded">
                    {tkt.category}
                  </span>
                  <h3 className="font-bold text-base text-body">{tkt.title}</h3>

                  <div className="space-y-1.5 text-xs text-muted pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{tkt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{tkt.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Details & Button */}
                <div className="pt-4 border-t border-gray-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted block">Assigned Seat:</span>
                    <span className="font-bold text-xs text-body">{tkt.seat}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-muted block">Paid Amount:</span>
                    <span className="font-bold text-sm text-primary">₹{tkt.price}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(tkt)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Digital QR Gate Pass</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MERCHANDISE ORDERS */}
      {activeTab === "merch" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-body">Your Merchandise Orders</h2>
              <p className="text-xs text-muted">Pick up ready orders from Room 304, Student Activities Building.</p>
            </div>
            <Link href="/merch" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>Browse Merch Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PURCHASED_MERCH.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-gray-subtle shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className={`${item.statusBadge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    {item.status}
                  </span>
                  <span className="font-mono text-xs text-muted">{item.orderNumber}</span>
                </div>

                <div className="space-y-2">
                  <span className="badge-secondary text-[10px] font-semibold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-base text-body">{item.name}</h3>

                  <div className="space-y-1.5 text-xs text-muted pt-1">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>Size: <strong>{item.size}</strong> • Qty: <strong>{item.qty}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Ordered: {item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{item.pickupLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted block">Pickup Pin:</span>
                    <span className="font-mono font-bold text-xs text-body">PIN-9021</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-muted block">Total Paid:</span>
                    <span className="font-bold text-sm text-primary">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEDGER AUDIT RECEIPTS */}
      {activeTab === "ledger" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-body">Single-Ledger Transparency Receipts</h2>
            <p className="text-xs text-muted">
              Every single rupee spent creates an immutable LedgerEntry in the exact same database transaction.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-subtle text-muted bg-page">
                    <th className="py-3 px-4 font-semibold text-body">Transaction ID</th>
                    <th className="py-3 px-4 font-semibold text-body">Description</th>
                    <th className="py-3 px-4 font-semibold text-body">Date &amp; Time</th>
                    <th className="py-3 px-4 font-semibold text-right text-body">Rupees (Int)</th>
                    <th className="py-3 px-4 font-semibold text-center text-body">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-subtle">
                  {LEDGER_HISTORY.map((txn) => (
                    <tr key={txn.txnId} className="hover:bg-page/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-primary">
                        {txn.txnId}
                      </td>
                      <td className="py-3.5 px-4 text-body font-medium">
                        {txn.description}
                      </td>
                      <td className="py-3.5 px-4 text-muted text-xs">
                        {txn.date}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-body">
                        ₹{txn.amount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="badge-success text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-status-success" />
                          <span>Ledger Verified</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QR PASS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-subtle relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-muted hover:text-body p-1.5 rounded-full hover:bg-page transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <span className="badge-info text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Official Digital Gate Pass
              </span>
              <h3 className="font-bold text-lg text-body">{selectedTicket.title}</h3>
              <p className="text-xs text-muted">{selectedTicket.date}</p>
            </div>

            {/* Visual QR Code Display */}
            <div className="bg-page p-6 rounded-2xl border border-gray-subtle flex flex-col items-center justify-center space-y-3">
              {/* QR Pattern visual box */}
              <div className="w-44 h-44 bg-white p-3 rounded-xl border-2 border-primary shadow-inner flex flex-col items-center justify-center relative">
                <QrCode className="w-36 h-36 text-body" />
              </div>
              <div className="text-center space-y-0.5">
                <span className="font-mono text-xs font-bold text-primary block">
                  {selectedTicket.code}
                </span>
                <span className="text-[10px] text-muted block">
                  Present this QR to Volunteer Gate Scanner
                </span>
              </div>
            </div>

            {/* Ticket Info Details */}
            <div className="space-y-2 text-xs bg-page p-3.5 rounded-xl border border-gray-subtle">
              <div className="flex justify-between text-muted">
                <span>Attendee:</span>
                <span className="font-bold text-body">{userName}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Seat Allocation:</span>
                <span className="font-bold text-body">{selectedTicket.seat}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Venue:</span>
                <span className="font-bold text-body text-right">{selectedTicket.venue}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Security Hash:</span>
                <span className="font-mono text-[10px] text-secondary font-bold">SHA-256 #8B4A</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
