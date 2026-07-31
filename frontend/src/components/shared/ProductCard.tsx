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
    <Link href={`/shop/${id}`} className="block border border-herbal-dark/8 bg-white group overflow-hidden rounded-xl hover:border-herbal-primary/30 hover:shadow-md transition-all duration-300">
      
      {/* Media Window Container */}
      <div className="aspect-square w-full overflow-hidden bg-herbal-sage relative border-b border-herbal-dark/8">
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
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-herbal-primary">
            {categoryName}
          </span>
          <span className="text-sm font-medium text-herbal-gold font-sans">
            {formattedPrice}
          </span>
        </div>
        <h3 className="font-serif text-lg font-light tracking-tight text-herbal-dark">
          {name}
        </h3>
      </div>

    </Link>
  );
}