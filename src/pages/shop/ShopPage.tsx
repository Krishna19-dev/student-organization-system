import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, Sparkles, Filter, Search, Tag, 
  CheckCircle2, ArrowRight, ShieldCheck, AlertCircle 
} from "lucide-react";
import { MERCH_PRODUCTS, MerchProduct } from "@/data/merchData";
import { getDemoUser } from "@/lib/auth-demo";

export default function ShopPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDemoUser().then(setCurrentUser);
  }, []);

  const isMember = currentUser?.role === "MEMBER" || currentUser?.role === "PRESIDENT" || currentUser?.role === "TREASURER" || currentUser?.role === "VOLUNTEER";

  const categories = ["ALL", "Apparel", "Gear", "Drinkware", "Headwear", "Stationery", "Footwear"];

  const filteredProducts = MERCH_PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A1942] to-[#2B0E26] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-wider text-teal-300 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Official Skyline Campus Merch Store
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Wear Your Association Pride
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Premium apparel, stationery, and drinkware. All purchases are directly tracked in the association's auditable ledger.
          </p>
        </div>

        {/* Member Discount Prompt Banner */}
        <div className="z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-5 max-w-sm w-full">
          {isMember ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Active Member Tier Active!</span>
              </div>
              <p className="text-xs text-white/90">
                You receive <strong>20% off</strong> on all merchandise items at checkout automatically!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Tag className="w-4 h-4" />
                <span>Guest Notice: Non-member Pricing</span>
              </div>
              <p className="text-xs text-white/80">
                Sign up as a verified Skyline member to unlock <strong>20% discount</strong> and direct pickup orders.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#017E84] hover:bg-[#016368] px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
              >
                <span>Sign up to order with discount</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#4A1942] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchandise..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Image & Category */}
              <div className="relative h-60 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-gray-800 shadow-xs border border-gray-100">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  In Stock
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                {/* Available Sizes & Stock pills */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Sizes & Inventory
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <span
                        key={s.size}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          s.available
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-50 text-red-400 line-through"
                        }`}
                      >
                        {s.size} ({s.stock})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Action Footer */}
            <div className="p-5 pt-0">
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                <div>
                  <div className="text-base font-black font-mono text-gray-900">
                    {isMember ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[#017E84]">₹{product.memberPrice}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                      </div>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {isMember ? "Verified Member Rate" : "Standard Guest Rate"}
                  </span>
                </div>

                <Link
                  to={`/shop/${product.id}`}
                  className="px-4 py-2 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>View Item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!currentUser && (
                <div className="text-[11px] text-gray-400 text-center">
                  <Link to="/signup" className="text-[#017E84] hover:underline font-bold">Sign up to order</Link> or pick up at club booth
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
