"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// This tells Next.js to completely skip building this component on the server side
const CheckoutComponent = dynamic(() => import("./CheckoutComponent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#1C2B24] flex items-center justify-center text-[#F9F8F3]">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
    </div>
  ),
});

export default function CheckoutPage() {
  return <CheckoutComponent />;
}