"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft, Upload, Loader2, CheckCircle2, Lock, AlertCircle, Trash2, PackageSearch, Edit3, PlusCircle, Search, TrendingUp, Layers, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    category: number | string;
    stock: number;
    is_available: boolean;
    image?: string;
}

export default function AdminDashboardPage() {
    // --- AUTHENTICATION STATES ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // --- INVENTORY & FILTERING STATES ---
    const [products, setProducts] = useState<Product[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
    
    // --- BULK ADJUSTMENT STATES ---
    const [bulkCategory, setBulkCategory] = useState("1");
    const [bulkPercentage, setBulkPercentage] = useState("");
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    // --- EDIT MODE SYSTEM STATE ---
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // --- FORMULATION MATRIX STATES ---
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("1");
    const [stock, setStock] = useState("100");
    const [isAvailable, setIsAvailable] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const token = Cookies.get("admin_access_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchActiveInventory();
        }
    }, [isAuthenticated]);

    // --- HANDLER: FETCH ACTIVE INVENTORY ---
    const fetchActiveInventory = async () => {
        setFetchLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/products/");
            if (response.ok) {
                const data = await response.json();
                // Ensure dynamic fields fallback to typing requirements correctly
                const sanitized = (Array.isArray(data) ? data : data.results || []).map((p: any) => ({
                    ...p,
                    stock: p.stock !== undefined ? Number(p.stock) : 100,
                    is_available: p.is_available !== undefined ? Boolean(p.is_available) : true
                }));
                setProducts(sanitized);
            }
        } catch (err) {
            console.error("Failed to sync storefront inventory:", err);
        } finally {
            setFetchLoading(false);
        }
    };

    // --- DYNAMIC COMPUTATION: ANALYTICS HUB METRICS ---
    const metrics = useMemo(() => {
        const totalItems = products.length;
        const lowStockCount = products.filter(p => p.stock <= 10).length;
        // Mocking estimated storefront metrics based on active structural elements for visual completeness
        const totalEstimatedRevenue = products.reduce((acc, p) => acc + (parseFloat(p.price) * 12), 0);
        return { totalItems, lowStockCount, totalEstimatedRevenue };
    }, [products]);

    // --- CLIENT-SIDE REAL-TIME FILTERING PIPELINE ---
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategoryFilter === "all" || product.category.toString() === selectedCategoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategoryFilter]);

    // --- HANDLER: INLINE QUICK MODIFICATIONS (STOCK/AVAILABILITY) ---
    const handleInlineUpdate = async (productId: number, fieldsToUpdate: Partial<Product>) => {
        const token = Cookies.get("admin_access_token");
        
        // Optimistic UI updates setup
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...fieldsToUpdate } : p));

        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fieldsToUpdate)
            });

            if (!response.ok) throw new Error();
        } catch (err) {
            setStatusMessage({ type: "error", text: "Failed to broadcast inline operational updates. Rolling back changes." });
            fetchActiveInventory(); // Revert to server reality
        }
    };

    // --- HANDLER: GLOBAL BULK PRICE SCALER ---
    const handleBulkPriceAdjustment = async (e: React.FormEvent) => {
        e.preventDefault();
        const scalar = parseFloat(bulkPercentage);
        if (isNaN(scalar) || scalar === 0) return;

        if (!confirm(`Are you sure you want to adjust all active product prices in this category node by ${scalar}%?`)) return;
        
        setIsBulkProcessing(true);
        const token = Cookies.get("admin_access_token");
        const targets = products.filter(p => p.category.toString() === bulkCategory);
        
        try {
            await Promise.all(targets.map(async (product) => {
                const currentPrice = parseFloat(product.price);
                const computedNewPrice = (currentPrice * (1 + scalar / 100)).toFixed(2);
                
                return fetch(`http://localhost:8000/api/products/${product.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ price: computedNewPrice })
                });
            }));

            setStatusMessage({ type: "success", text: `Successfully processed structural bulk price calibration changes.` });
            setBulkPercentage("");
            fetchActiveInventory();
        } catch (err) {
            setStatusMessage({ type: "error", text: "Errors occurred during bulk price update execution iterations." });
        } finally {
            setIsBulkProcessing(false);
        }
    };

    // --- HANDLER: SET FORM FOR EDIT MODE ---
    const startEditing = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory(product.category.toString());
        setStock(product.stock.toString());
        setIsAvailable(product.is_available);
        setImage(null);
        setImagePreview(product.image || null);
        setStatusMessage(null);
    };

    const resetFormMode = () => {
        setEditingProduct(null);
        setName("");
        setPrice("");
        setDescription("");
        setCategory("1");
        setStock("100");
        setIsAvailable(true);
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- HANDLER: CLIENT-SIDE SOFT DELETE ---
    const handleSoftDelete = async (productId: number, productName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to completely remove "${productName}" from the customer shop view?`)) return;

        setDeletingId(productId);
        const token = Cookies.get("admin_access_token");

        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error();

            setProducts((prev) => prev.filter((p) => p.id !== productId));
            setStatusMessage({ type: "success", text: `"${productName}" successfully pulled off the market.` });
            if (editingProduct?.id === productId) resetFormMode();
        } catch (err) {
            setStatusMessage({ type: "error", text: "Failed to finalize inventory lifecycle conversion." });
        } finally {
            setDeletingId(null);
        }
    };

    // --- HANDLER: LOGIN / AUTHENTICATION ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError(null);

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error("Invalid formulation credentials credentials.");
            const data = await response.json();

            Cookies.set("admin_access_token", data.access, { expires: 1 });
            Cookies.set("admin_refresh_token", data.refresh, { expires: 7 });

            setIsAuthenticated(true);
        } catch (err: any) {
            setAuthError(err.message || "Network transmission failure.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- HANDLER: DUAL FORM DISPATCH ---
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !description || !stock) {
            setStatusMessage({ type: "error", text: "Please populate all mandatory fields." });
            return;
        }
        if (!editingProduct && !image) {
            setStatusMessage({ type: "error", text: "Please select a product image asset file." });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", parseFloat(price).toFixed(2));
        formData.append("stock", parseInt(stock, 10).toString());
        formData.append("is_available", isAvailable ? "1" : "0");
        
        if (image) formData.append("image", image);

        try {
            const token = Cookies.get("admin_access_token");
            const url = editingProduct ? `http://localhost:8000/api/products/${editingProduct.id}/` : "http://localhost:8000/api/products/";
            const method = editingProduct ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error();

            setStatusMessage({ 
                type: "success", 
                text: editingProduct ? "Product configuration parameters successfully synchronized!" : "Product successfully initialized to catalog registry!" 
            });

            resetFormMode();
            fetchActiveInventory();
        } catch (err) {
            setStatusMessage({ type: "error", text: "Database operations record streaming syncing failure." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#1C2B24] text-[#F9F8F3] font-sans flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] mb-4"><Lock className="w-5 h-5" /></div>
                        <h1 className="font-serif text-2xl font-light tracking-tight">Security Clearance</h1>
                        <p className="text-[#F9F8F3]/60 text-xs font-light mt-2">Access restricted to authorized managers.</p>
                    </div>
                    {authError && (
                        <div className="p-4 bg-red-950/40 border border-red-900 rounded-lg text-red-400 flex items-center gap-2 mb-6 text-xs font-light">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {authError}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Manager ID</label>
                            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3 text-sm font-light text-white focus:outline-none focus:border-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Security Passcode</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3 text-sm font-light text-white focus:outline-none focus:border-[#D4AF37]" />
                        </div>
                        <button type="submit" disabled={authLoading} className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1C2B24] disabled:opacity-50 text-xs font-semibold tracking-widest uppercase py-3.5 rounded-full transition-all cursor-pointer">{authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate Clearance"}</button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1C2B24] text-[#F9F8F3] font-sans selection:bg-[#D4AF37] selection:text-[#1C2B24] py-16 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Top Nav Header Block */}
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors duration-200">
                        <ArrowLeft className="w-4 h-4" /> Return To Storefront
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                        <div>
                            <h1 className="font-serif text-4xl font-light tracking-tight">Commercial Administration Matrix</h1>
                            <p className="text-[#F9F8F3]/60 text-sm font-light mt-2">Scale and administer live storefront schema metrics configurations directly.</p>
                        </div>
                        <button onClick={() => { Cookies.remove("admin_access_token"); Cookies.remove("admin_refresh_token"); setIsAuthenticated(false); }} className="text-[10px] font-semibold tracking-wider uppercase border border-white/10 hover:border-red-400 hover:text-red-400 px-4 py-2 rounded-full transition-colors cursor-pointer self-start sm:self-center">Logout</button>
                    </div>
                </div>

                {/* FEATURE 1: HIGH FIDELITY ANALYTICS HUB METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#F9F8F3]/50">Estimated Storefront Value</p>
                            <h3 className="text-2xl font-serif text-[#D4AF37] mt-1">₦{metrics.totalEstimatedRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                        </div>
                        <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]"><TrendingUp className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#F9F8F3]/50">Managed Catalog Instances</p>
                            <h3 className="text-2xl font-serif text-white mt-1">{metrics.totalItems} Active Products</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-white/70"><Layers className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#F9F8F3]/50">Depleting Node Critical Warnings</p>
                            <h3 className={`text-2xl font-serif mt-1 ${metrics.lowStockCount > 0 ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>{metrics.lowStockCount} Flags Raised</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${metrics.lowStockCount > 0 ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"}`}><AlertTriangle className="w-5 h-5" /></div>
                    </div>
                </div>

                {statusMessage && (
                    <div className={`p-4 rounded-lg mb-8 flex items-center gap-3 border ${statusMessage.type === "success" ? "bg-[#2E4A3F]/40 border-[#2E4A3F] text-emerald-400" : "bg-red-950/40 border-red-900 text-red-400"}`}>
                        {statusMessage.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm font-light tracking-wide">{statusMessage.text}</span>
                    </div>
                )}

                {/* Dashboard Operations Grid Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL COLUMN */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* FEATURE 4: BULK PRICE ADJUSTMENT SCALE KNOB */}
                        <form onSubmit={handleBulkPriceAdjustment} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">Bulk Price Calibration Engine</h3>
                                <p className="text-[10px] text-[#F9F8F3]/50 font-light mt-0.5">Scale category prices by a set percentage matrix instantly.</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <select value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)} className="col-span-1 bg-[#1C2B24]/80 border border-white/10 rounded-lg text-xs px-2 text-white/90 focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                                    <option value="1">Teas</option>
                                    <option value="2">Drugs</option>
                                    <option value="3">Seeds</option>
                                </select>
                                <input type="number" step="0.1" required value={bulkPercentage} onChange={(e) => setBulkPercentage(e.target.value)} placeholder="e.g., 10 or -5" className="col-span-1 bg-[#1C2B24]/80 border border-white/10 rounded-lg text-xs px-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]" />
                                <button type="submit" disabled={isBulkProcessing} className="col-span-1 bg-white/10 hover:bg-[#D4AF37] hover:text-[#1C2B24] disabled:opacity-40 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center cursor-pointer">
                                    {isBulkProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="flex items-center gap-1">Scale <ArrowUpRight className="w-3 h-3" /></span>}
                                </button>
                            </div>
                        </form>

                        {/* LIVE SHOWROOM VIEWPORT CATALOG NODE */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">Active Showroom Real-time View</h2>
                                    <p className="text-[11px] text-[#F9F8F3]/50 font-light mt-1">Select any element card instance below to map fields editing parameters data.</p>
                                </div>
                                {editingProduct && (
                                    <button onClick={resetFormMode} className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-white/10 hover:bg-[#D4AF37] hover:text-[#1C2B24] transition-all px-3 py-1.5 rounded-md cursor-pointer self-start sm:self-center"><PlusCircle className="w-3.5 h-3.5" /> New Row</button>
                                )}
                            </div>

                            {/* FEATURE 5: INTERACTIVE LIVE SEARCH & FILTER MATRIX PILLS */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search live parameters names or context keywords..." className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-light text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]" />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {["all", "1", "2", "3"].map((catId) => (
                                        <button key={catId} onClick={() => setSelectedCategoryFilter(catId)} className={`text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-md transition-colors cursor-pointer ${selectedCategoryFilter === catId ? "bg-[#D4AF37] text-[#1C2B24]" : "bg-white/5 hover:bg-white/10 text-white/70"}`}>
                                            {catId === "all" ? "All Instances" : catId === "1" ? "Herbal Teas" : catId === "2" ? "Herbal Drugs" : "Herbal Seeds"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[440px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                                {fetchLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-2 text-[#F9F8F3]/40"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /><span className="text-xs font-light">Loading live catalog...</span></div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-2 text-[#F9F8F3]/30 text-center p-4"><PackageSearch className="w-8 h-8 font-light" /><span className="text-xs font-light">No items matched search matrices filters values parameters.</span></div>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <div key={product.id} onClick={() => startEditing(product)} className={`p-4 bg-[#1C2B24]/40 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col gap-3 group ${editingProduct?.id === product.id ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/5 hover:border-white/15"}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-0.5 truncate max-w-[200px]">
                                                    <span className="text-sm font-light tracking-wide group-hover:text-[#D4AF37] transition-colors truncate">{product.name}</span>
                                                    <span className="text-[11px] font-mono text-[#D4AF37]">₦{parseFloat(product.price).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <div onClick={() => startEditing(product)} className="h-8 w-8 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></div>
                                                    <button type="button" onClick={(e) => handleSoftDelete(product.id, product.name, e)} disabled={deletingId === product.id} className="h-8 w-8 flex items-center justify-center text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer">{deletingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                                                </div>
                                            </div>

                                            {/* FEATURE 2: INLINE STOCK MATRIX ADJUSTMENT CONTROLS */}
                                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-[#F9F8F3]/40 uppercase font-semibold tracking-wider">Quantities Node:</span>
                                                    <div className="flex items-center bg-white/5 border border-white/10 rounded-md">
                                                        <button type="button" onClick={() => handleInlineUpdate(product.id, { stock: Math.max(0, product.stock - 1) })} className="px-2 py-1 text-xs hover:text-[#D4AF37] text-white/60 transition-colors">-</button>
                                                        <span className={`px-2 text-xs font-mono min-w-[30px] text-center ${product.stock <= 10 ? "text-amber-400 font-bold" : "text-white/80"}`}>{product.stock}</span>
                                                        <button type="button" onClick={() => handleInlineUpdate(product.id, { stock: product.stock + 1 })} className="px-2 py-1 text-xs hover:text-[#D4AF37] text-white/60 transition-colors">+</button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-[#F9F8F3]/40 uppercase font-semibold tracking-wider">Visibility Switch:</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleInlineUpdate(product.id, { is_available: !product.is_available })}
                                                        className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded border transition-all ${
                                                            product.is_available 
                                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                                                : "bg-white/5 border-white/10 text-white/40"
                                                        }`}
                                                    >
                                                        {product.is_available ? "Active Store" : "Hidden Context"}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL COLUMN: DUAL MULTI-ARCHETYPE FORM CONTROL */}
                    <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-6 bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl backdrop-blur-sm">
                        <div>
                            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">{editingProduct ? `Updating Context Node: ${editingProduct.name}` : "Addition Matrix Engine"}</h2>
                            <p className="text-[11px] text-[#F9F8F3]/50 font-light mt-1">{editingProduct ? "Modify parameters structural specifications fields data details safely." : "Append structured product records specifications parameters variables cleanly."}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Product Formulation Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Prebiotic Cleansing Nectar" className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Base Operational Price (NGN)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 25000" className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Inventory Category Node Set</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white/90 focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer">
                                    <option value="1" className="bg-[#1C2B24]">Herbal Teas</option>
                                    <option value="2" className="bg-[#1C2B24]">Herbal Drugs</option>
                                    <option value="3" className="bg-[#1C2B24]">Herbal Seeds</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Stock Quantities Registry Node</label>
                                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-[#1C2B24]/40 border border-white/5 rounded-xl p-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#F9F8F3]/80">Initial Deployment Status Visibility</span>
                                <span className="text-[10px] text-[#F9F8F3]/40 font-light">Should this record instance load instantly to customer view routers?</span>
                            </div>
                            <button type="button" onClick={() => setIsAvailable(!isAvailable)} className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border transition-all cursor-pointer ${isAvailable ? "bg-[#D4AF37] text-[#1C2B24] border-[#D4AF37]" : "bg-white/5 border-white/10 text-white/40"}`}>{isAvailable ? "Visible Instance" : "Staged Hidden"}</button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">Formulation Profile Composition Breakdown Description</label>
                            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide clean composition breakdowns descriptions guidelines safely..." className="w-full bg-[#1C2B24]/60 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] resize-none" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold tracking-wider uppercase text-[#F9F8F3]/70">High-Fidelity Media Asset Storage</label>
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-[#D4AF37]/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-[#1C2B24]/40 cursor-pointer transition-all duration-300 group">
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                {imagePreview ? (
                                    <div className="relative w-40 aspect-square rounded-lg overflow-hidden border border-white/10 shadow-xl">
                                        <img src={imagePreview} alt="Asset media node preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><p className="text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider">Overwrite Streaming Asset File</p></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white/5 rounded-full group-hover:scale-105 transition-transform duration-300"><Upload className="w-5 h-5 text-[#F9F8F3]/60 group-hover:text-[#D4AF37]" /></div>
                                        <div className="text-center">
                                            <p className="text-xs font-medium uppercase tracking-widest text-[#F9F8F3]">Select Asset File</p>
                                            <p className="text-[11px] text-[#F9F8F3]/40 font-light mt-1">PNG, JPG, or WebP resolution format standards</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            {editingProduct && (
                                <button type="button" onClick={resetFormMode} className="w-1/3 border border-white/10 text-white/80 hover:bg-white/5 text-xs font-semibold tracking-widest uppercase py-4 rounded-full transition-all cursor-pointer">Cancel</button>
                            )}
                            <button type="submit" disabled={isSubmitting} className={`flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1C2B24] disabled:opacity-50 hover:bg-[#F9F8F3] hover:text-[#1C2B24] text-xs font-semibold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md font-sans cursor-pointer ${editingProduct ? "w-2/3" : "w-full"}`}>
                                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Database Records...</> : editingProduct ? "Save Modifications" : "Commit Specification Matrix"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </main>
    );
}