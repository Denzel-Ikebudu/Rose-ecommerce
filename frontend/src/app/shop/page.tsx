"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, ShoppingBag, SlidersHorizontal, ArrowLeft } from "lucide-react";
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

interface Category {
  id: number;
  name: string;
}

export default function ShopPage() {
  // Local drawer state matching your navbar's operational pattern
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { cart } = useCart();

  // Compute item count exactly how your navbar does it
  const totalItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Core Inventory & Interaction States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filtering & Query States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Layout Management States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Handle Debouncing for Server Search Lookups
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch Active Inventory Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories/");
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load pipeline categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 3. Coordinate Live Filter Fetch Queries with Django Backend View
  useEffect(() => {
    const fetchFilteredInventory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }
        if (debouncedSearch.trim() !== "") {
          params.append("search", debouncedSearch.trim());
        }
        
        const url = `http://localhost:8000/api/products/?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Transmission error fetching catalog records.");
        
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to synchronize product stream.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredInventory();
  }, [selectedCategory, debouncedSearch]);

  return (
    <main className="min-h-screen bg-[#1C2B24] text-[#F9F8F3] font-sans selection:bg-[#D4AF37] selection:text-[#1C2B24] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors duration-200">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mt-6">The Shop</h1>
            <p className="text-[#F9F8F3]/60 text-sm font-light mt-2">Explore our full ecosystem of premium botanical formulations.</p>
          </div>
          
          {/* Active Counters & Interactive Action Controls */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            
            {/* Implemented Cart Button matching your precise setup specs */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex gap-1 items-center text-black rounded-[30px] transition-colors px-4 py-2 relative bg-white border-none cursor-pointer text-xs font-medium uppercase tracking-wider" 
              aria-label="Cart"
            >
              Cart
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-herbal-accent text-herbal-dark text-[10px] font-bold rounded-full flex items-center justify-center scale-90 animate-fade-in">
                  {totalItemCount}
                </span>
              )}
            </button>

            <div className="text-xs font-medium uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-4 py-2 rounded-full">
              Showing {products.length} products
            </div>
          </div>
        </div>

        {/* --- SYSTEM FILTER AND CONTROLS LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-sm">
          
          {/* Search Query Input Zone */}
          <div className="lg:col-span-4 relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#F9F8F3]/30" />
            <input
              type="text"
              placeholder="Search botanical blends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-light text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
            />
          </div>

          {/* Category Filter Pills Row */}
          <div className="lg:col-span-8 flex flex-wrap gap-2 items-center">
            <div className="text-[#F9F8F3]/40 p-2 lg:block hidden">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#D4AF37] text-[#1C2B24] font-semibold"
                  : "bg-[#1C2B24]/40 border border-white/10 hover:border-white/30 text-[#F9F8F3]"
              }`}
            >
              All Collective
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id.toString()
                    ? "bg-[#D4AF37] text-[#1C2B24] font-semibold"
                    : "bg-[#1C2B24]/40 border border-white/10 hover:border-white/30 text-[#F9F8F3]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* --- DISPLAY TIERS / STATUS MESSAGES --- */}
        {error && (
          <div className="p-8 text-center bg-red-950/20 border border-red-900 rounded-2xl text-red-400 font-light text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            <p className="text-xs uppercase tracking-widest text-[#F9F8F3]/40 font-light">Querying Database Server...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/0">
            <ShoppingBag className="w-8 h-8 text-[#F9F8F3]/20 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-light">No formulations matched your filters</h3>
            <p className="text-xs text-[#F9F8F3]/40 font-light mt-2">Try restructuring your input text or choose another inventory segment.</p>
          </div>
        ) : (
          /* --- PRODUCT CATALOG GRID VIEW --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group h-[400px] flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-[#D4AF37]/30 transition-all duration-500"
              >
                <Link href={`/shop/${product.id}`} className="cursor-pointer block relative aspect-[4/5] bg-[#1C2B24]/40 overflow-hidden border-b border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B24]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <Link href={`/shop/${product.id}`} className="cursor-pointer block flex items-start justify-between gap-4 mb-2 group/title">
                      <h2 className="font-serif text-xl font-light tracking-tight group-hover/title:text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-300">
                        {product.name}
                      </h2>
                      <span className="font-serif text-lg text-[#D4AF37] whitespace-nowrap">
                        ₦{parseFloat(product.price).toLocaleString()}
                      </span>
                    </Link>
                    <p className="text-xs text-[#F9F8F3]/60 font-light line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <Link href={`/shop/${product.id}`}>
                  <button className="w-full bg-[#1C2B24] text-[#F9F8F3] hover:bg-[#D4AF37] hover:text-[#1C2B24] border border-white/10 hover:border-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase py-3 rounded-xl transition-all duration-300 cursor-pointer">
                    Purchase
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Renders your exact global drawer tracking engine */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
}