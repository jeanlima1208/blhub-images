import { Suspense } from "react";
import Header from "@/components/layout/Header";
import {
  getProducts,
  getBestSellers,
} from "@/services/products";
import CatalogClient from "./CatalogClient";

export default async function ProductsPage() {
  const products = await getProducts();
  const bestSellers = await getBestSellers();

  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />

      <section className="relative px-4 pb-20 pt-[140px] sm:px-6 lg:pt-[160px]">
        <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
          <div className="absolute left-1/2 top-[15%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#FFEA00]/[0.025] blur-[140px]" />

          <div className="absolute right-[-200px] top-[50%] h-[500px] w-[500px] rounded-full bg-[#00FF66]/[0.015] blur-[140px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,234,0,0.035),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
              BL Mantos
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              Nossas camisas
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Encontre sua camisa, escolha seu tamanho e vista o que te move.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="min-h-[400px]" />
            }
          >
            <CatalogClient
              products={products}
              bestSellers={bestSellers}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}