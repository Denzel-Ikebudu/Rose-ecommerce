"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingCart, ShieldCheck, Truck, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}/`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("This formulation does not exist or has been archived.");
          throw new Error("Failed to pull formulation specification profiles.");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Network synchronization failure.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [params?.id]);

  const handleAddToCartAction = async () => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      console.error("Failed to allocate to engine:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNowAction = async () => {
    if (!product) return;
    setIsBuyingNow(true);
    try {
      await addToCart(product.id, quantity);
      router.push("/checkout");
    } catch (err) {
      console.error("Failed to process direct purchase:", err);
      setIsBuyingNow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-herbal-cream flex flex-col items-center justify-center gap-4 text-herbal-dark">
        <Loader2 className="w-8 h-8 animate-spin text-herbal-primary" />
        <p className="text-xs uppercase tracking-widest text-herbal-muted font-light">Loading Formulation Profiles...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-herbal-cream flex flex-col items-center justify-center p-6 text-herbal-dark">
        <div className="max-w-md text-center border border-herbal-dark/8 bg-white p-8 rounded-2xl shadow-sm">
          <h3 className="font-serif text-xl font-light text-red-500 mb-2">Formulation Fetch Error</h3>
          <p className="text-xs text-herbal-muted mb-6">{error || "Instance missing."}</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-herbal-primary text-herbal-cream text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-herbal-dark transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-herbal-cream text-herbal-dark font-sans selection:bg-herbal-primary selection:text-herbal-cream py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb back navigation + Cart trigger */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-herbal-muted hover:text-herbal-primary transition-colors duration-200 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Shop
          </button>

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex gap-1 items-center text-herbal-cream rounded-[30px] transition-colors px-4 py-2 relative bg-herbal-primary hover:bg-herbal-dark border-none cursor-pointer text-xs font-medium uppercase tracking-wider" 
            aria-label="Cart"
          >
            Cart
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-herbal-gold text-herbal-dark text-[10px] font-bold rounded-full flex items-center justify-center scale-90 animate-fade-in">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Master Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Canvas: Product Image Frame */}
          <div className="bg-herbal-sage h-[450px] border border-herbal-dark/8 rounded-2xl overflow-hidden aspect-[4/5] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover animate-fade-in"
            />
          </div>

          {/* Right Canvas: Specification Details and Direct Actions */}
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-herbal-dark">
                {product.name}
              </h1>
              <p className="font-serif text-2xl text-herbal-gold mt-4">
                ₦{parseFloat(product.price).toLocaleString()}
              </p>
            </div>

            <div className="w-full h-[1px] bg-herbal-dark/10" />

            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-herbal-muted">Composition Profile</h3>
              <p className="text-sm text-herbal-dark/70 font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-herbal-dark/10" />

            {/* Interaction Row: Quantity Counter */}
            <div className="flex items-center justify-between border border-herbal-dark/10 bg-white rounded-xl p-1 h-14 sm:w-32">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-full flex items-center justify-center text-lg text-herbal-muted hover:text-herbal-primary transition-colors cursor-pointer bg-transparent border-none"
              >
                -
              </button>
              <span className="text-sm font-medium text-herbal-dark">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-10 h-full flex items-center justify-center text-lg text-herbal-muted hover:text-herbal-primary transition-colors cursor-pointer bg-transparent border-none"
              >
                +
              </button>
            </div>

            {/* Action Buttons: Add to Cart + Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCartAction}
                disabled={isSubmitting || isBuyingNow}
                className="flex-1 h-14 flex items-center justify-center gap-3 border border-herbal-primary/40 text-herbal-primary hover:bg-herbal-sage disabled:bg-herbal-cream disabled:text-herbal-muted/50 disabled:border-herbal-dark/10 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 cursor-pointer bg-transparent"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isSubmitting ? "Adding..." : "Add to Cart"}
              </button>

              <button 
                onClick={handleBuyNowAction}
                disabled={isSubmitting || isBuyingNow}
                className="flex-1 h-14 flex items-center justify-center gap-3 bg-herbal-primary text-herbal-cream hover:bg-herbal-dark disabled:bg-herbal-dark/10 disabled:text-herbal-muted/50 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer border-none"
              >
                {isBuyingNow ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isBuyingNow ? "Processing..." : "Buy Now"}
              </button>
            </div>

            {/* Premium Trust Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-herbal-sage border border-herbal-dark/5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-herbal-primary flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-herbal-dark/80">100% Pure Botanical</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-herbal-sage border border-herbal-dark/5 rounded-xl">
                <Truck className="w-5 h-5 text-herbal-primary flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-herbal-dark/80">Nationwide Logistics</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-herbal-sage border border-herbal-dark/5 rounded-xl">
                <RefreshCw className="w-5 h-5 text-herbal-primary flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-herbal-dark/80">Formulated Fresh</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
}