import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, CheckCircle2, Clock, PackageCheck, 
  MapPin, ArrowRight 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const MY_ORDERS = [
  {
    id: "ORD-9884",
    date: "October 09, 2026",
    totalAmount: 799,
    status: "PAID",
    items: [
      { name: "Official Odoo Crest Hoodie", size: "L", quantity: 1, price: 799 },
    ],
    pickupLocation: "Student Council Merchandise Counter, Ground Floor",
  },
  {
    id: "ORD-9820",
    date: "October 05, 2026",
    totalAmount: 298,
    status: "COLLECTED",
    items: [
      { name: "Teal Enamel Crest Pin", size: "One Size", quantity: 2, price: 149 },
    ],
    pickupLocation: "Collected on Oct 06, 2026",
  },
  {
    id: "ORD-9512",
    date: "September 24, 2026",
    totalAmount: 499,
    status: "COLLECTED",
    items: [
      { name: "Insulated Stainless Steel Water Bottle", size: "750ml", quantity: 1, price: 499 },
    ],
    pickupLocation: "Collected on Sep 25, 2026",
  },
];

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<"ALL" | "PAID" | "COLLECTED">("ALL");

  const filtered = MY_ORDERS.filter((o) => filter === "ALL" || o.status === filter);

  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member Hub", href: "/me" }, { label: "My Orders" }]}
      title="Merchandise Orders"
      subtitle="Track your campus store apparel and pickup status."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["ALL", "PAID", "COLLECTED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === s
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s === "ALL" ? "All Orders" : s === "PAID" ? "Ready for Pickup (PAID)" : "Collected"}
              </button>
            ))}
          </div>

          <Link to="/shop" className="text-xs font-bold text-[#017E84] hover:underline">
            Visit Merch Shop &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-900 font-bold">{order.id}</span>
                  <div className="text-xs text-gray-400">Placed on {order.date}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black font-mono text-gray-900">₹{order.totalAmount}</span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      order.status === "PAID"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {order.status === "PAID" ? "PAID (READY TO COLLECT)" : "COLLECTED"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800">
                      {item.name} <span className="text-gray-400 font-normal">({item.size}) x{item.quantity}</span>
                    </span>
                    <span className="font-mono text-gray-600">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Pickup Note */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>Pickup: <strong>{order.pickupLocation}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
