import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  PackageCheck
} from "lucide-react";

export const metadata = {
  title: "Official Odoo Merch Store | Skyline Student Association",
  description: "Official limited-edition Odoo merchandise collection with live size-wise inventory control.",
};

const SAMPLE_MERCH = [
  {
    id: "mch-0",
    name: "Official Odoo Classic White Campus T-Shirt",
    category: "Apparel",
    badge: "badge-primary",
    image: "/images/merch/odoo-tshirt.jpg",
    price: 499,
    memberPrice: 425,
    description: "Premium 240 GSM 100% combed ringspun cotton crewneck tee featuring front Odoo bold logo and rear nape signature crest. Breathable, pre-shrunk daily wear fit.",
    sizes: [
      { size: "S", stock: 14, available: true },
      { size: "M", stock: 28, available: true },
      { size: "L", stock: 22, available: true },
      { size: "XL", stock: 10, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-1",
    name: "Official Odoo Canvas Tote Bag",
    category: "Gear",
    badge: "badge-primary",
    image: "/images/merch/odoo-tote-bag.jpg",
    price: 399,
    memberPrice: 339,
    description: "Eco-friendly heavy-duty canvas tote bag featuring official embroidered Odoo signature branding. Reinforced handles with ample 18L storage capacity.",
    sizes: [
      { size: "One Size", stock: 35, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-2",
    name: "Odoo Insulated Stainless Steel Water Bottle",
    category: "Drinkware",
    badge: "badge-secondary",
    image: "/images/merch/odoo-water-bottle.jpg",
    price: 499,
    memberPrice: 420,
    description: "Premium double-wall vacuum insulated stainless steel water bottle with ergonomic carry loop lid. Keeps cold for 24h and hot for 12h.",
    sizes: [
      { size: "750ml", stock: 24, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-3",
    name: "Odoo Classic Structured Campus Cap",
    category: "Headwear",
    badge: "badge-info",
    image: "/images/merch/odoo-cap.jpg",
    price: 349,
    memberPrice: 295,
    description: "Clean minimalist 6-panel structured cotton twill cap with embroidered Odoo crest, breathable eyelets, and adjustable brass buckle strap.",
    sizes: [
      { size: "Adjustable", stock: 40, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-4",
    name: "Odoo Executive Hardcover Notebook & Pen Gift Set",
    category: "Stationery",
    badge: "badge-warning",
    image: "/images/merch/odoo-notebook-pen-set.jpg",
    price: 549,
    memberPrice: 465,
    description: "Matte black debossed leatherette A5 notebook with signature magenta ribbon bookmark and pen loop, bundled with premium dual rollerball pens in presentation box.",
    sizes: [
      { size: "Set", stock: 18, available: true },
    ],
    inStock: true,
  },
  {
    id: "mch-5",
    name: "Odoo Signature Colorblock Campus Sneakers",
    category: "Footwear",
    badge: "badge-primary",
    image: "/images/merch/odoo-sneakers.jpg",
    price: 1499,
    memberPrice: 1275,
    description: "Limited collector-edition low-top canvas skate sneakers with custom suede purple accents, emerald toe cap, and vulcanized rubber sole.",
    sizes: [
      { size: "UK 7", stock: 6, available: true },
      { size: "UK 8", stock: 12, available: true },
      { size: "UK 9", stock: 10, available: true },
      { size: "UK 10", stock: 4, available: true },
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
            <span>Official Odoo Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Official Odoo Campus Merchandise
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Exclusive Odoo branded merchandise for Skyline Student Association members. 
            All proceeds support tech events, workshops, and student developer initiatives.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            href="/membership"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>Member 15% Discount</span>
          </Link>
        </div>
      </div>

      {/* Policy Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-gray-subtle flex items-start gap-3">
          <PackageCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-body block mb-0.5">Size-Wise Stock Control</span>
            <span className="text-muted">Exact quantities maintained per item. Zero overselling.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-gray-subtle flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-body block mb-0.5">Transparent Single Ledger</span>
            <span className="text-muted">All proceeds fund student hackathons and workshops.</span>
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
            className="bg-surface rounded-2xl border border-gray-subtle shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            {/* Product Image */}
            <div className="relative w-full h-64 bg-page border-b border-gray-subtle overflow-hidden flex items-center justify-center p-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2 hover:scale-105 transition-transform duration-300"
              />
              <span className={`absolute top-3 left-3 ${item.badge} text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs`}>
                {item.category}
              </span>
              <span className="absolute top-3 right-3 badge-success text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                In Stock
              </span>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-base font-bold text-body leading-snug">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Size Stocks Showcase */}
              <div className="space-y-1.5 pt-2 border-t border-gray-subtle">
                <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                  Live Stock by Variant:
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
                  <span className="text-xl font-bold text-body font-mono">₹{item.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-primary font-medium block">Member Price</span>
                  <span className="text-sm font-bold text-status-success-dark font-mono">₹{item.memberPrice}</span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Select &amp; Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
