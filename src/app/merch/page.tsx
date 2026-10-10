import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  PackageCheck
} from "lucide-react";

export const metadata = {
  title: "Association Merch Store | Skyline Student Association",
  description: "Official Skyline apparel and accessories with live size-wise inventory control.",
};

const SAMPLE_MERCH = [
  {
    id: "mch-1",
    name: "Skyline Crest Fleece Hoodie (Deep Plum)",
    category: "Apparel",
    badge: "badge-primary",
    price: 799,
    memberPrice: 679,
    description: "Heavyweight 380 GSM combed cotton fleece hoodie in signature Skyline plum with embroidered metallic teal crest on chest.",
    sizes: [
      { size: "S", stock: 12, available: true },
      { size: "M", stock: 28, available: true },
      { size: "L", stock: 18, available: true },
      { size: "XL", stock: 6, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-2",
    name: "Association Teal Enamel Lapel Pin",
    category: "Accessory",
    badge: "badge-secondary",
    price: 149,
    memberPrice: 125,
    description: "Die-cast zinc alloy pin with hard enamel teal coloring and gold-plated borders. Features dual butterfly clasps for jackets and backpacks.",
    sizes: [
      { size: "One Size", stock: 42, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-3",
    name: "Skyline Organic Heavy Canvas Tote",
    category: "Gear",
    badge: "badge-info",
    price: 349,
    memberPrice: 295,
    description: "Reinforced 12oz natural cotton canvas tote with 20L carrying volume, interior phone sleeve, and silk-screened association compass emblem.",
    sizes: [
      { size: "Standard", stock: 35, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-4",
    name: "Skyline Member Crewneck Sweatshirt (Heather)",
    category: "Apparel",
    badge: "badge-primary",
    price: 649,
    memberPrice: 550,
    description: "Classic relaxed-fit crewneck sweatshirt featuring ribbed collar, cuffs, and subtle minimal logo print on left wrist.",
    sizes: [
      { size: "S", stock: 4, available: true },
      { size: "M", stock: 14, available: true },
      { size: "L", stock: 0, available: false },
      { size: "XL", stock: 8, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-5",
    name: "Thermal Stainless Steel Water Bottle (750ml)",
    category: "Gear",
    badge: "badge-info",
    price: 499,
    memberPrice: 420,
    description: "Double-walled vacuum insulated bottle in matte finish. Keeps beverages cold for 24 hours or hot for 12 hours.",
    sizes: [
      { size: "750ml", stock: 22, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-6",
    name: "Skyline Sticker Pack & Notebook Bundle",
    category: "Stationery",
    badge: "badge-warning",
    price: 199,
    memberPrice: 169,
    description: "A5 dot-grid hardcover journal paired with 6 die-cut vinyl waterproof stickers celebrating student life and code.",
    sizes: [
      { size: "Bundle", stock: 50, available: true },
    ],
    inStock: true,
  },
];

export default function MerchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-10 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 badge-primary px-3 py-1 rounded-full text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <span>Association Merch Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Official Campus Apparel &amp; Gear
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Represent your student association with premium merchandise. Every order is 
            tracked with atomic size-wise inventory locks and integer ledger accounting.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            href="/membership"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>Premium 15% Discount</span>
          </Link>
        </div>
      </div>

      {/* Policy Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-gray-subtle flex items-start gap-3">
          <PackageCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-body block mb-0.5">Size-Wise Stock Control</span>
            <span className="text-muted">Exact quantities maintained per size. Zero overselling.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-gray-subtle flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-body block mb-0.5">Transparent Single Ledger</span>
            <span className="text-muted">All proceeds fund student scholarships and workshops.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-gray-subtle flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-body block mb-0.5">Pickup at Campus Office</span>
            <span className="text-muted">Collect verified orders from Room 304, Student Activities.</span>
          </div>
        </div>
      </div>

      {/* Merch Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_MERCH.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-2xl border border-gray-subtle shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`${item.badge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                  {item.category}
                </span>
                <span className="badge-success text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Available
                </span>
              </div>

              <h3 className="text-lg font-bold text-body">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                {item.description}
              </p>

              {/* Size Stocks Showcase */}
              <div className="space-y-1.5 pt-2 border-t border-gray-subtle">
                <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                  Live Stock by Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((s) => (
                    <div
                      key={s.size}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                        s.stock > 0
                          ? "bg-page border-gray-subtle text-body"
                          : "bg-gray-subtle border-gray-border text-muted opacity-60"
                      }`}
                    >
                      <span className="font-bold">{s.size}:</span>
                      <span>{s.stock > 0 ? `${s.stock} left` : "Out of stock"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-6 bg-page border-t border-gray-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted block">Standard Price</span>
                  <span className="text-xl font-bold text-body">₹{item.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-primary font-medium block">Member Price</span>
                  <span className="text-sm font-bold text-status-success-dark">₹{item.memberPrice}</span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Select Size &amp; Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
