import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

interface ProductDetails {
  id: number;
  name: string;
  category_name: string;
  price: string;
  image: string;
  description: string;
  is_available: boolean;
  // Common medical/herbal extensions in your Django model fields
  dosage_directions?: string;
  ingredients_list?: string[];
}

async function getSingleProduct(id: string): Promise<ProductDetails | null> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch product schema: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Single target pipe breakdown:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await getSingleProduct(id);

  if (!product || product.is_available === false) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(product.price));

  return (
    <main className="min-h-screen bg-herbal-dark text-white antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Back navigational trace line */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs tracking-widest uppercase text-herbal-cream/60 hover:text-herbal-accent transition-colors duration-200 mb-12 group"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 mr-2">←</span> 
          Back to Formulations
        </Link>

        {/* Two-Column Split Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Fixed Media Theater Panel */}
          <div className="lg:col-span-7">
            <div 
              className="w-full aspect-square bg-cover bg-center border border-white/10 bg-herbal-primary/5 shadow-xl"
              style={{ backgroundImage: `url(${product.image || '/placeholder-formula.png'})` }}
            />
          </div>

          {/* Right Column: Editorial Details Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-herbal-accent block mb-3">
                {product.category_name}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-herbal-cream leading-tight mb-4">
                {product.name}
              </h1>
              <p className="font-sans text-2xl font-light text-herbal-cream/90 mb-8">
                {formattedPrice}
              </p>
              
              <div className="h-[1px] w-full bg-white/10 mb-8" />

              <h2 className="text-xs font-medium tracking-widest uppercase text-herbal-cream/40 mb-3">
                Clinical Overview
              </h2>
              <p className="font-sans text-base text-herbal-cream/80 font-light tracking-wide leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Dynamic Accordion Section: Usage/Dosage */}
              <div className="border-t border-b border-white/5 py-6 my-8">
                <h3 className="text-xs font-medium tracking-widest uppercase text-herbal-cream/40 mb-3">
                  Dosage & Administration
                </h3>
                <p className="font-sans text-sm text-herbal-muted font-light tracking-wide leading-relaxed">
                  {product.dosage_directions || "Take 2ml via droplet infusion under ancestral clinical supervision twice daily before primary meals."}
                </p>
              </div>
            </div>

            {/* Checkout Interaction Unit */}
            <div className="mt-8">
              <button className="w-full bg-herbal-cream hover:bg-white text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider py-5 transition-all duration-300 rounded-full shadow-md flex items-center justify-center gap-2">
                Request Formula Prescription
              </button>
              <p className="text-center text-[11px] text-herbal-muted tracking-wide mt-3 font-light">
                Requires validation matching contemporary practitioner diagnostic analysis.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}