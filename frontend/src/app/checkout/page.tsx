"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";

export const dynamic = "force-dynamic";
export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const router = useRouter();

  // Submission & Loader States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Field State Values
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    shippingAddress: "",
    city: "",
    state: "Lagos",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Paystack Configuration Properties
  const config = {
    reference: `RST-${new Date().getTime().toString()}`, // Unique tracking string
    email: formData.email,
    amount: cart ? cart.total_price * 100 : 0, // Converted to Kobo for processing engine
    publicKey: "pk_test_677ccc8eac4b2a13e9d5ab8c69d418b90a836826", // Replace with your client's test public key
  };

  // Instantiate verification hook framework
  const initializePayment = usePaystackPayment(config);

  // Separate backend dispatch worker called strictly upon gateway collection success
  const sendOrderToBackend = async (paystackReference: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/cart/checkout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Packages Django's guest sessionid cookies safely
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          shipping_address: formData.shippingAddress,
          city: formData.city,
          state: formData.state,
          payment_reference: paystackReference, // Real token authenticated by payment gateway
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshCart();
        alert(`Order ${data.order_number} processed cleanly!`);
        router.push("/shop"); 
      } else {
        throw new Error(data.error || "Execution dropped across internal gateway validation models.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unresolved network drop occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Launch secure billing iframe container overlay
    initializePayment({
      onSuccess: (reference: any) => {
        // Runs only if the financial clearing layer checks out completely
        sendOrderToBackend(reference.reference);
      },
      onClose: () => {
        setErrorMessage("Payment gateway session closed by user.");
        setIsSubmitting(false);
      }
    });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C2B24] flex flex-col items-center justify-center p-6 text-[#F9F8F3]">
        <div className="max-w-md text-center border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm space-y-6">
          <h3 className="font-serif text-xl font-light text-herbal-cream">Checkout Context Vacant</h3>
          <p className="text-xs text-[#F9F8F3]/60 font-light">Cannot execute logistics orchestration parameters without product instances inside the active selection.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1C2B24] text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#F9F8F3] transition-colors">
            Return to Apothecary Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1C2B24] text-[#F9F8F3] font-sans selection:bg-[#D4AF37] selection:text-[#1C2B24] pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#F9F8F3]/60 hover:text-[#D4AF37] transition-colors duration-200 mb-8">
          <ArrowLeft className="w-4 h-4" /> Cancel Order Vector
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight mb-12">Logistics & Transaction Settlement</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Delivery Profiles & Metadata */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Section 1: Contact Node */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-herbal-accent">01. Contact Verification</h3>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="email" name="email" required placeholder="Email Address for Invoicing"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Section 2: Consignee Particulars */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-herbal-accent">02. Shipping Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" name="firstName" required placeholder="First Name"
                  value={formData.firstName} onChange={handleInputChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <input 
                  type="text" name="lastName" required placeholder="Last Name"
                  value={formData.lastName} onChange={handleInputChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <input 
                type="tel" name="phoneNumber" required placeholder="Contact Mobile Number (e.g. +234...)"
                value={formData.phoneNumber} onChange={handleInputChange}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <textarea 
                name="shippingAddress" required rows={3} placeholder="Complete Operational Delivery Address"
                value={formData.shippingAddress} onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" name="city" required placeholder="City / Local Area"
                  value={formData.city} onChange={handleInputChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <select 
                  name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#D4AF37] text-[#F9F8F3]/80 transition-colors"
                >
                  <option value="Lagos" className="bg-[#1C2B24]">Lagos</option>
                  <option value="Abuja" className="bg-[#1C2B24]">Abuja</option>
                  <option value="Port Harcourt" className="bg-[#1C2B24]">Port Harcourt</option>
                </select>
              </div>
            </div>

            {/* Submission Dispatch Triggers */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 flex items-center justify-center gap-3 bg-[#D4AF37] text-[#1C2B24] hover:bg-[#F9F8F3] disabled:bg-white/10 disabled:text-white/40 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {isSubmitting ? "Processing Transaction Formulas..." : "Authorize Settlement & Dispatches"}
            </button>
          </form>

          {/* Right Block: Fixed Review Breakdown */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6 lg:sticky lg:top-28">
            <h3 className="font-serif text-lg font-light">Allocation Breakdown</h3>
            
            <div className="max-h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center text-sm">
                  <div className="w-12 h-14 bg-[#1C2B24]/40 rounded border border-white/10 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:8000${item.product.image}`} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-light truncate text-white/90">{item.product.name}</h4>
                    <p className="text-xs text-white/40 font-light">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-serif text-[#D4AF37]">
                    ₦{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-[1px] bg-white/10" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60 font-light uppercase">
                <span>Subtotal</span>
                <span>₦{cart.total_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-white/60 font-light uppercase">
                <span>Delivery Logistics</span>
                <span className="text-emerald-400 font-medium text-[10px]">Free Allocation</span>
              </div>
              <div className="w-full h-[1px] bg-white/5 pt-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-wider text-white/80 font-light">Grand Total</span>
                <span className="font-serif text-xl text-[#D4AF37]">₦{cart.total_price.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#1C2B24]/60 rounded-xl p-4 border border-white/5 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/50 leading-relaxed font-light">
                Encrypted secure layer verification active. Order item snapshots are permanently written into system historical balances instantly upon submission authorization.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}