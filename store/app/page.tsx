import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />

      <Hero />

      <Categories />

      <FeaturedProducts />
    </main>
  );
}