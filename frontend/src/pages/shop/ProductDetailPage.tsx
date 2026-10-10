import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, 
  Sparkles, AlertCircle, PackageCheck, CreditCard 
} from "lucide-react";
import { MERCH_PRODUCTS, MerchProduct } from "@/data/merchData";
import { getDemoUser } from "@/lib/auth-demo";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<MerchProduct | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    getDemoUser().then(setCurrentUser);
    const found = MERCH_PRODUCTS.find((p) => p.id === id) || MERCH_PRODUCTS[0];
    setProduct(found);
    if (found?.sizes?.length > 0) {
      const firstAvailable = found.sizes.find(s => s.available);
      setSelectedSize(firstAvailable ? firstAvailable.size : found.sizes[0].size);
    }
  }, [id]);

  if (!product) return null;

  const isMember = currentUser?.role === "MEMBER" || currentUser?.role === "PRESIDENT" || currentUser?.role === "TREASURER" || currentUser?.role === "VOLUNTEER";
  const currentPrice = isMember ? product.memberPrice : product.price;
  const totalPrice = currentPrice * quantity;

  const currentSizeObj = product.sizes.find(s => s.size === selectedSize);
  const isSelectedOutOfStock = currentSizeObj ? !currentSizeObj.available || currentSizeObj.stock === 0 : false;

  const handlePlaceOrder = () => {
    if (!currentUser) {
      navigate("/signup");
      return;
    }
    setIsOrdering(true);
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString("en-IN", { month: "long", day: "2-digit", year: "numeric" }),
        totalAmount: totalPrice,
        status: "PAID",
        items: [
          { name: product.name, size: selectedSize, quantity, price: currentPrice },
        ],
        pickupLocation: "Student Council Merchandise Counter, Ground Floor",
      };
      try {
        const prev = JSON.parse(localStorage.getItem("user_orders") || "[]");
        localStorage.setItem("user_orders", JSON.stringify([newOrder, ...prev]));
      } catch {}
      setIsOrdering(false);
      setIsOrdered(true);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#4A1942] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Merch Catalog
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Left: Product Image */}
        <div className="bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-80 max-w-full object-contain"
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-800 shadow-xs border border-gray-100">
            {product.category}
          </span>
        </div>

        {/* Right: Details & Order Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#017E84] uppercase tracking-wider block">Official Skyline Merchandise</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F9] border border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-gray-900">
                  ₹{currentPrice}
                </span>
                {isMember && (
                  <span className="text-sm text-gray-400 line-through font-mono">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-xs text-gray-500">per unit</span>
              </div>
              <div className="mt-1">
                {isMember ? (
                  <span className="text-xs font-bold text-[#017E84] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Member Privilege: 20% discount applied!
                  </span>
                ) : (
                  <span className="text-xs text-purple-900 font-semibold">
                    Standard guest price. <Link to="/signup" className="text-[#017E84] underline">Join club</Link> for member discount.
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Select Size:</span>
                <span className="text-gray-400 font-mono text-[11px]">
                  {currentSizeObj ? `${currentSizeObj.stock} units available` : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isOutOfStock = !s.available || s.stock === 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isOutOfStock
                          ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-[#4A1942] text-white shadow-xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {s.size} {isOutOfStock ? "(Out of Stock)" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-3 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-xs font-mono font-bold text-gray-500">
                Total: ₹{totalPrice}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100">
            {isOrdered ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order Placed Successfully! (PAID)</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Show your Order ID at the Student Council merchandise desk for instant collection.
                </p>
                <Link
                  to="/me/orders"
                  className="inline-block mt-1 text-xs font-bold text-emerald-900 underline"
                >
                  View in My Orders &rarr;
                </Link>
              </div>
            ) : isSelectedOutOfStock ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed uppercase"
              >
                Size Out of Stock
              </button>
            ) : currentUser ? (
              <button
                type="button"
                disabled={isOrdering}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isOrdering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Order (₹{totalPrice})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/signup"
                  className="w-full py-3.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign up to order</span>
                </Link>
                <div className="text-[11px] text-center text-gray-400">
                  Already registered? <Link to="/login" className="text-[#017E84] font-bold hover:underline">Sign In</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
