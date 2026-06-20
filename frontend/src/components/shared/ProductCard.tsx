"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: number;
  name: string;
  categoryName: string;
  price: string;
  image: string;
  description: string;
}

export default function ProductCard({ id, name, categoryName, price, image, description }: ProductCardProps) {
  // Gracefully handle formatting for your local marketplace currency paths
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(price));

  return (
    <Link href={`/shop/${id}`} className="block border border-white/10 bg-herbal-dark/40 group overflow-hidden">
      {/* Animated Image Wrapper Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-herbal-primary/10 border-b border-white/10">
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image || '/placeholder-formula.png'})` }}
        />
        
        {/* Absolute Badging Tag using database field */}
        <span className="absolute top-4 left-4 text-[10px] font-medium tracking-[0.2em] uppercase bg-herbal-dark text-herbal-accent px-3 py-1.5 rounded-full border border-white/5">
          {categoryName}
        </span>
      </div>

      {/* Structural Metadata Typography block */}
      <div className="p-6 flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h3 className="font-serif text-xl font-medium text-herbal-cream tracking-tight group-hover:text-herbal-accent transition-colors duration-300">
              {name}
            </h3>
            <span className="font-sans text-sm font-medium text-herbal-cream/90 whitespace-nowrap">
              {formattedPrice}
            </span>
          </div>
          <p className="font-sans text-sm text-herbal-muted font-light tracking-wide leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Minimal Action Link Trigger */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-medium tracking-widest uppercase text-herbal-cream/60 group-hover:text-white transition-colors duration-200">
            View Formula
          </span>
          <motion.span 
            className="text-herbal-accent text-lg"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </Link>
  );
}