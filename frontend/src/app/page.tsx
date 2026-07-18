import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import FeaturedProducts from "@/components/shared/FeaturedProducts";
import TrustStats from "@/components/shared/TrustStats";
import TestimonialsTeaser from "@/components/shared/TestimonialsTeaser";
import LearnCentreTeaser from "@/components/shared/LearnCentreTeaser";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${baseUrl}/api/products/`, { cache: "no-store" });
    if (!response.ok) throw new Error(`API error status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Database connection failure:", error);
    return [];
  }
}

export default async function Home() {
  const allProducts = await getProducts();
  const featuredDbSlice = allProducts.slice(0, 3);

  return (
    <main className="min-h-screen bg-herbal-dark antialiased selection:bg-herbal-accent selection:text-herbal-dark">
      <Navbar />
      <Hero />
      <TrustStats />
      <FeaturedProducts products={featuredDbSlice} />
      <TestimonialsTeaser />
      <LearnCentreTeaser />
    </main>
  );
}