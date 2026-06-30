import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { type ProductCardProps } from "./ProductCard";
import { MotionItem, MotionGridContainer } from "./MotionWrapper";

interface FeaturedProductsProps {
  products: ProductCardProps[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="w-full bg-herbal-cream text-black py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

        {/* LEFT COLUMN: Clean Brand Hook */}
        <MotionItem direction="left">
          <h2 className="font-serif text-4xl font-light tracking-tight leading-tight text-neutral-950">
            Daily wellness essentials for your gut, skin, and immune health.
          </h2>
          <p className="font-sans text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-md">
            Clean, science-backed supplements designed to balance your body from the inside out.
          </p>
          <div className="pt-2 md:pt-22">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-herbal-dark border border-herbal-dark text-herbal-cream hover:bg-black text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-md"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionItem>

        {/* RIGHT COLUMN: Grid cards with global stagger cascades */}
        <MotionGridContainer>
          {products?.map((product) => (
            <MotionItem key={product.id} direction="up">
              {/* Spreading properties perfectly matches ProductCardProps now */}
              <ProductCard {...product} />

              <div className="mt-4">
                <Link
                  href={`/shop/${product.id}`}
                  className="group flex items-center justify-center gap-2 w-full bg-herbal-dark text-herbal-cream hover:bg-black text-xs font-medium tracking-wider uppercase py-4 rounded-full transition-colors duration-200"
                >
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </MotionItem>
          ))}
        </MotionGridContainer>

      </div>
    </section>
  );
}