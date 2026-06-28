"use client";

import React from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, updateQuantity, removeFromCart } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop blur element */}
            <div
                className="absolute inset-0 bg-[#1C2B24]/60 backdrop-blur-sm transition-opacity duration-500"
                onClick={onClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#1C2B24] border-l border-white/10 text-[#F9F8F3] flex flex-col shadow-2xl animate-slide-in">

                    {/* Drawer Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                            <h2 className="font-serif text-xl font-light tracking-tight">Your Allocation</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Drawer Body Items Stack */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {!cart || cart.items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                                <ShoppingBag className="w-12 h-12 mb-4 stroke-[1px]" />
                                <p className="text-xs uppercase tracking-widest font-light">Your selection tier is vacant</p>
                            </div>
                        ) : (
                            cart.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl items-center">
                                    <div className="w-20 h-24 bg-[#1C2B24]/40 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:8000${item.product.image}`}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <h4 className="font-serif text-sm font-light truncate hover:text-[#D4AF37] transition-colors">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-xs text-[#D4AF37]">
                                            ₦{parseFloat(item.product.price).toLocaleString()}
                                        </p>

                                        {/* Quantity Adjustment Controls */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-white/10 bg-[#1C2B24] rounded-lg p-0.5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:text-[#D4AF37] text-xs cursor-pointer bg-transparent border-none"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs px-1 font-medium min-w-[16px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:text-[#D4AF37] text-xs cursor-pointer bg-transparent border-none"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1.5 text-white/40 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Drawer Sticky Footer Summary */}
                    {cart && cart.items.length > 0 && (
                        <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 font-light uppercase tracking-wider text-xs">Subtotal Aggregate</span>
                                <span className="font-serif text-lg text-[#D4AF37]">₦{cart.total_price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-light leading-relaxed">
                                Logistics allocations and structural transaction processing formulas computed relative to checkout coordinates.
                            </p>
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1C2B24] hover:bg-[#F9F8F3] text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                            >
                                Proceed To Checkout Vector <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}