"use client";

import Link from "next/link";

export default function PagamentoFalhaPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mb-6 text-5xl">✕</div>

        <h1 className="text-3xl font-bold mb-3">
          Pagamento não aprovado
        </h1>

        <p className="text-white/70 mb-8">
          Não foi possível concluir o pagamento. Você pode tentar novamente.
        </p>

        <Link
          href="/carrinho"
          className="inline-flex items-center justify-center rounded-lg bg-[#FFEA00] px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          Voltar ao carrinho
        </Link>
      </div>
    </main>
  );
}
