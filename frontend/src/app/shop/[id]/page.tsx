"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingCart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

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
  const { addToCart } = useCart();

  // Core Management States
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Formulation Specification Profiles from Django
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/products/${params.id}/`);
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

  // Handle Live Global Database Allocation Call
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C2B24] flex flex-col items-center justify-center gap-4 text-[#F9F8F3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <p className="text-xs uppercase tracking-widest text-[#F9F8F3]/40 font-light">Loading Formulation Profiles...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#1C2B24] flex flex-col items-center justify-center p-6 text-[#F9F8F3]">
        <div className="max-w-md text-center border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm">
          <h3 className="font-serif text-xl font-light text-red-400 mb-2">Formulation Fetch Error</h3>
          <p className="text-xs text-[#F9F8F3]/60 font-light mb-6">{error || "Instance missing."}</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1C2B24] text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#F9F8F3] transition-colors">
            Return to Apothecary Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1C2B24] text-[#F9F8F3] font-sans selection:bg-[#D4AF37] selection:text-[#1C2B24] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb back navigation */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors duration-200 mb-12 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </button>

        {/* Master Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Canvas: Product Image Frame */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm aspect-[4/5] relative">
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
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="font-serif text-2xl text-[#D4AF37] mt-4">
                ₦{parseFloat(product.price).toLocaleString()}
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/10" />

            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Composition Profile & Ritual</h3>
              <p className="text-sm text-[#F9F8F3]/70 font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-white/10" />

            {/* Interaction Row: Quantity Counter and Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              
              {/* Counter Segment */}
              <div className="flex items-center justify-between border border-white/10 bg-[#1C2B24]/40 rounded-xl p-1 h-14 sm:w-32">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-full flex items-center justify-center text-lg text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none"
                >
                  -
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-full flex items-center justify-center text-lg text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none"
                >
                  +
                </button>
              </div>

              {/* Action Button Segment */}
              <button 
                onClick={handleAddToCartAction}
                disabled={isSubmitting}
                className="flex-grow h-14 flex items-center justify-center gap-3 bg-[#D4AF37] text-[#1C2B24] hover:bg-[#F9F8F3] disabled:bg-white/10 disabled:text-white/40 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer border-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isSubmitting ? "Allocating Selection..." : "Initiate Allocation To Selection"}
              </button>
            </div>

            {/* Premium Trust Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#F9F8F3]/80">100% Pure Botanical</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <Truck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#F9F8F3]/80">Nationwide Logistics</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                <RefreshCw className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#F9F8F3]/80">Formulated Fresh</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}