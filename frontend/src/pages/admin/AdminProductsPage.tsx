import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingBag, Plus, Edit3, Save, CheckCircle2, 
  Trash2, ArrowLeft, PackageCheck 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { MERCH_PRODUCTS, MerchProduct } from "@/data/merchData";

export default function AdminProductsPage() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<MerchProduct[]>(MERCH_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<MerchProduct | null>(
    id ? products.find((p) => p.id === id) || null : null
  );

  const [name, setName] = useState(editingProduct?.name || "");
  const [price, setPrice] = useState(editingProduct?.price || 499);
  const [memberPrice, setMemberPrice] = useState(editingProduct?.memberPrice || 399);
  const [category, setCategory] = useState(editingProduct?.category || "Apparel");
  const [sizes, setSizes] = useState(
    editingProduct?.sizes || [
      { size: "S", stock: 15, available: true },
      { size: "M", stock: 30, available: true },
      { size: "L", stock: 25, available: true },
    ]
  );
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleUpdateStock = (index: number, newStock: number) => {
    const updated = [...sizes];
    updated[index].stock = Math.max(0, newStock);
    updated[index].available = updated[index].stock > 0;
    setSizes(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage("Product inventory saved successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Merch Products" }]}
      title="Merchandise Inventory Management"
      subtitle="Configure product listings, member discount pricing, and size-specific stock balances."
    >
      <div className="space-y-6">
        {savedMessage && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#017E84]" />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List (Left 1 col) */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Catalog Items</h3>
            <div className="space-y-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setEditingProduct(p);
                    setName(p.name);
                    setPrice(p.price);
                    setMemberPrice(p.memberPrice);
                    setCategory(p.category);
                    setSizes(p.sizes);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    editingProduct?.id === p.id
                      ? "bg-purple-50/50 border-[#4A1942] shadow-xs"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">{p.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">₹{p.price} (Member: ₹{p.memberPrice})</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {p.sizes.reduce((acc, s) => acc + s.stock, 0)} units
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form (Right 2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {editingProduct ? `Edit ${editingProduct.name}` : "Product Inventory Editor"}
                  </h3>
                  <span className="text-xs text-gray-400">Manage size variants and physical shelf stock</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-900">{editingProduct?.id || "mch-new"}</span>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Standard Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#017E84] mb-1">Member Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={memberPrice}
                      onChange={(e) => setMemberPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Size Variants Table */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Size Variants &amp; Shelf Inventory</label>
                  <div className="space-y-2">
                    {sizes.map((s, idx) => (
                      <div key={s.size} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-800 w-24">{s.size}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-gray-500">Stock Count:</label>
                          <input
                            type="number"
                            min={0}
                            value={s.stock}
                            onChange={(e) => handleUpdateStock(idx, Number(e.target.value))}
                            className="w-20 text-xs p-1.5 rounded-lg border border-gray-200 bg-white text-center font-mono font-bold"
                          />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${s.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                          {s.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Inventory Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
