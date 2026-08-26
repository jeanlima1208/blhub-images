import Link from "next/link";
import Header from "@/components/layout/Header";

export default function PagamentoPendentePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEA00]/10 text-[#FFEA00]">
                  …
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    BL Mantos
                  </p>
                  <h1 className="text-lg font-semibold">Pagamento em análise</h1>
                </div>
              </div>
            </div>

            <div className="px-6 py-10 text-center sm:px-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#FFEA00]/30 bg-[#FFEA00]/10 text-3xl text-[#FFEA00]">
                …
              </div>

              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-[#FFEA00]">
                Pagamento pendente
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Estamos aguardando a confirmação.</h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/60">
                O Mercado Pago ainda está processando seu pagamento. Assim que houver uma atualização, o pedido será atualizado.
              </p>

              <div className="mt-8 rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-left">
                <p className="text-sm font-medium text-white">Não é necessário refazer o pedido agora.</p>
                <p className="mt-1 text-sm leading-6 text-white/50">Aguarde a conclusão do processamento antes de tentar uma nova compra.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#FFEA00] px-6 font-semibold text-black transition hover:brightness-95">Voltar para a loja</Link>
                <Link href="/produtos" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 font-semibold text-white transition hover:bg-white/[0.08]">Ver produtos</Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/30">Orgulho de vestir o que nos move.</p>
        </div>
      </main>
    </div>
  );
}
