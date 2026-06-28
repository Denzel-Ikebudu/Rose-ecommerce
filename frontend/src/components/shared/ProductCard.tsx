"use client";

import Link from "next/link";

export interface ProductCardProps {
  id: number;
  name: string;
  categoryName: string;
  price: string;
  image: string;
  description: string;
}

export default function ProductCard({ id, name, categoryName, price, image, description }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(price));

  return (
    <Link href={`/shop/${id}`} className="block border border-white/5 bg-white/[0.02] group overflow-hidden rounded-xl hover:border-white/10 transition-colors duration-300">
      
      {/* Media Window Container */}
      <div className="aspect-square w-full overflow-hidden bg-white/[0.01] relative border-b border-white/5">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-herbal-muted font-light">
            No Media Available
          </div>
        )}
      </div>

      {/* Meta Text Blocks Content Layout */}
      <div className="p-2">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-herbal-accent">
            {categoryName}
          </span>
          <span className="text-sm font-medium text-herbal-cream font-sans">
            {formattedPrice}
          </span>
        </div>
        <h3 className="font-serif text-lg font-light tracking-tight text-black">
          {name}
        </h3>
      </div>

    </Link>
  );
}