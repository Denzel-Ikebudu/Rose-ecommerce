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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { cart } = useCart();

  const totalItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`);
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
        
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/?${params.toString()}`;
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
    <main className="min-h-screen bg-herbal-cream text-herbal-dark font-sans selection:bg-herbal-primary selection:text-herbal-cream py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-herbal-muted hover:text-herbal-primary transition-colors duration-200">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mt-6 text-herbal-dark">The Shop</h1>
            <p className="text-herbal-muted text-sm font-light mt-2">Explore our full ecosystem of premium botanical formulations.</p>
          </div>
          
          <div className="flex items-center gap-4 self-start md:self-auto">
            
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

            <div className="text-xs font-medium uppercase tracking-widest text-herbal-primary bg-herbal-sage border border-herbal-primary/20 px-4 py-2 rounded-full">
              Showing {products.length} products
            </div>
          </div>
        </div>

        {/* --- SYSTEM FILTER AND CONTROLS LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center bg-white border border-herbal-dark/8 p-2 rounded-2xl shadow-sm">
          
          {/* Search Query Input Zone */}
          <div className="lg:col-span-4 relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-herbal-muted/60" />
            <input
              type="text"
              placeholder="Search botanical blends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-herbal-cream border border-herbal-dark/8 rounded-xl pl-11 pr-4 py-3 text-sm font-light text-herbal-dark placeholder-herbal-muted/50 focus:outline-none focus:border-herbal-primary transition-colors duration-200"
            />
          </div>

          {/* Category Filter Pills Row */}
          <div className="lg:col-span-8 flex flex-wrap gap-2 items-center">
            <div className="text-herbal-muted p-2 lg:block hidden">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-herbal-primary text-herbal-cream font-semibold"
                  : "bg-herbal-cream border border-herbal-dark/10 hover:border-herbal-primary/40 text-herbal-dark"
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
                    ? "bg-herbal-primary text-herbal-cream font-semibold"
                    : "bg-herbal-cream border border-herbal-dark/10 hover:border-herbal-primary/40 text-herbal-dark"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* --- DISPLAY TIERS / STATUS MESSAGES --- */}
        {error && (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-600 font-light text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-herbal-primary" />
            <p className="text-xs uppercase tracking-widest text-herbal-muted font-light">Querying Database Server...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-herbal-dark/15 rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-herbal-muted/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-light text-herbal-dark">No formulations matched your filters</h3>
            <p className="text-xs text-herbal-muted mt-2">Try restructuring your input text or choose another inventory segment.</p>
          </div>
        ) : (
          /* --- PRODUCT CATALOG GRID VIEW --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group h-[400px] flex flex-col bg-white border border-herbal-dark/8 rounded-2xl overflow-hidden shadow-sm hover:border-herbal-primary/30 hover:shadow-md transition-all duration-500"
              >
                <Link href={`/shop/${product.id}`} className="cursor-pointer block relative aspect-[4/5] bg-herbal-sage overflow-hidden border-b border-herbal-dark/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>

                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <Link href={`/shop/${product.id}`} className="cursor-pointer block flex items-start justify-between gap-4 mb-2 group/title">
                      <h2 className="font-serif text-xl font-light tracking-tight text-herbal-dark group-hover/title:text-herbal-primary group-hover:text-herbal-primary transition-colors duration-300">
                        {product.name}
                      </h2>
                      <span className="font-serif text-lg text-herbal-gold whitespace-nowrap">
                        ₦{parseFloat(product.price).toLocaleString()}
                      </span>
                    </Link>
                    <p className="text-xs text-herbal-muted font-light line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <Link href={`/shop/${product.id}`}>
                  <button className="w-full bg-herbal-cream text-herbal-dark hover:bg-herbal-primary hover:text-herbal-cream border border-herbal-dark/10 hover:border-herbal-primary text-[11px] font-semibold tracking-widest uppercase py-3 rounded-xl transition-all duration-300 cursor-pointer">
                    Purchase
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
}