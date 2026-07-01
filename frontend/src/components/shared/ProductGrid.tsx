"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Variants } from "framer-motion";

interface DBProduct {
  id: number;
  name: string;
  category_name: string;
  price: string;
  image: string;
  description: string;
  is_available: boolean;
}

interface ProductGridProps {
  products: DBProduct[];
}

const CONTAINER_VARIANTS = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 90, damping: 16 } 
  }
};

export default function ProductGrid({ products }: ProductGridProps) {
  // Only display formulations flagged as available in your Django admin panel
  const availableProducts = products.filter(p => p.is_available !== false);

  return (
    <section className="py-24 bg-herbal-dark px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Headings Layout System */}
        <div className="max-w-xl mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-herbal-accent block mb-3">
            Primary Formulations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-herbal-cream">
            Engineered bio-available treatments to balance underlying human physiology.
          </h2>
        </div>

        {/* Empty State Handler */}
        {availableProducts.length === 0 ? (
          <div className="border border-white/5 py-16 text-center rounded-xl bg-white/[0.01]">
            <p className="text-herbal-muted font-light text-sm tracking-wide">
              No live formulations cataloged in database. Add items via admin dashboard.
            </p>
          </div>
        ) : (
          /* Dynamic Responsive 3-Column Element Grid */
          <motion.div 
            variants={CONTAINER_VARIANTS}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {availableProducts.map((formula) => (
              <motion.div key={formula.id} variants={ITEM_VARIANTS}>
                <ProductCard
                  id={formula.id}
                  name={formula.name}
                  categoryName={formula.category_name}
                  price={formula.price}
                  description={formula.description}
                  image={formula.image}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}