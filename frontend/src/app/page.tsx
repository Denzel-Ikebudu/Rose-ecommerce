import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import FeaturedProducts from "@/components/shared/FeaturedProducts";

async function getProducts() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/products/", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`API error status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Database connection failure:", error);
    return [];
  }
}

export default async function Home() {
  const allProducts = await getProducts();
  
  // Slice the database payload to strictly grab just the first 3 items
  const featuredDbSlice = allProducts.slice(0, 3);

  return (
    <main className="min-h-screen bg-herbal-dark antialiased selection:bg-herbal-accent selection:text-herbal-dark">
      <Navbar />
      <Hero />
      <FeaturedProducts products={featuredDbSlice} />
    </main>
  );
}