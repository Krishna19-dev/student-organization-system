import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, CheckCircle2, Clock, Search, 
  PackageCheck, ArrowRight, User 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface HandoverOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: string;
  amount: number;
  date: string;
  status: "PAID" | "COLLECTED";
}

const INITIAL_ORDERS: HandoverOrder[] = [
  { id: "ORD-9901", customerName: "Aanya Sharma", customerEmail: "aanya@skyline.test", items: "Classic Odoo Developer T-Shirt (M) x1", amount: 479, date: "Oct 09, 2026", status: "PAID" },
  { id: "ORD-9884", customerName: "Dev Patel", customerEmail: "dev@skyline.test", items: "Official Crest Hoodie (L) x1", amount: 799, date: "Oct 09, 2026", status: "PAID" },
  { id: "ORD-9820", customerName: "Rohan Mehta", customerEmail: "rohan@skyline.test", items: "2x Teal Enamel Crest Pin", amount: 298, date: "Oct 05, 2026", status: "COLLECTED" },
  { id: "ORD-9774", customerName: "Sneha Reddy", customerEmail: "sneha@skyline.test", items: "Insulated Water Bottle (750ml) x1", amount: 399, date: "Oct 04, 2026", status: "COLLECTED" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<HandoverOrder[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState("");

  const handleMarkCollected = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: "COLLECTED" as const } : o))
    );
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Merch Handover" }]}
      title="Merchandise Counter Handover"
      subtitle="Verify student order IDs and execute physical collection handovers."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID or student name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <span className="text-xs text-gray-400">
            {orders.filter((o) => o.status === "PAID").length} Pending Pickups
          </span>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Purchased Items</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Handover Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-900">{order.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-[11px] text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="p-4 text-gray-700">{order.items}</td>
                    <td className="p-4 text-right font-mono font-bold text-gray-900">₹{order.amount}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === "PAID"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.status === "PAID" ? "READY FOR PICKUP" : "COLLECTED"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === "PAID" ? (
                        <button
                          onClick={() => handleMarkCollected(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          Mark COLLECTED
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-bold">Handed Over</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
