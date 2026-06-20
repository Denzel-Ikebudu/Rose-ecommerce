import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import ProductGrid from "@/components/shared/ProductGrid";

async function getProducts() {
  try {
    // Hits your Django running backend endpoint natively over localhost
    const response = await fetch("http://127.0.0.1:8000/api/products/", {
      cache: "no-store", // Ensures data resets instantly when you make admin changes
    });
    
    if (!response.ok) {
      throw new Error(`API fetch exception status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Database connection failure on backend pipe:", error);
    return []; // Return empty array to keep UI stable during server resets
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-herbal-dark antialiased selection:bg-herbal-accent selection:text-herbal-dark">
      <Navbar />
      <Hero />
      <ProductGrid products={products} />
    </main>
  );
}