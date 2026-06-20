"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  productId: number;
  productName: string;
  price: string;
}

// Declaring Paystack global layout binding for the TypeScript compiler
declare const PaystackPop: any;

export default function CheckoutButton({ productId, productName, price }: CheckoutButtonProps) {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter a valid email address to receive your confirmation.");
    
    setIsProcessing(true);

    // Convert string base price to Kobo required by API gateway processing layers
    const amountInKobo = Math.round(parseFloat(price) * 100);

    const paystack = PaystackPop.setup({
      key: "pk_test_your_public_key_here", // Swap out for your live/test key from Paystack Dashboard
      email: email,
      amount: amountInKobo,
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Product Name",
            variable_name: "product_name",
            value: productName,
          },
          {
            display_name: "Product ID",
            variable_name: "product_id",
            value: productId.toString(),
          },
        ],
      },
      callback: function (response: any) {
        setIsProcessing(false);
        alert(`Payment Successful! Reference: ${response.reference}. Prescription payload compiled.`);
        // Optional: You can route here to a success screen or fire a webhook back to Django
      },
      onClose: function () {
        setIsProcessing(false);
      },
    });

    paystack.openIframe();
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {/* Minimalist Contact Channel System */}
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-herbal-cream/40 block mb-2">
          Contact Email (For Confirmation Receipt)
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@domain.com"
          className="w-full bg-white/[0.02] border border-white/10 rounded-full px-6 py-4 text-sm text-herbal-cream placeholder:text-herbal-muted focus:outline-none focus:border-herbal-accent transition-colors duration-200"
        />
      </div>

      {/* Primary Checkout Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-herbal-cream hover:bg-white disabled:bg-herbal-muted text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider py-5 transition-all duration-300 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? "Opening Gateway..." : "Purchase Formula Now"}
      </button>
    </form>
  );
}