import Link from "next/link";
import Header from "@/components/layout/Header";

type Props = {
  searchParams: Promise<{
    payment_id?: string;
    status?: string;
    external_reference?: string;
  }>;
};

export default async function PagamentoSucessoPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF66]/15 text-[#00FF66]">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    BL Mantos
                  </p>

                  <h1 className="text-lg font-semibold">
                    Pedido confirmado
                  </h1>
                </div>
              </div>
            </div>

            <div className="px-6 py-10 text-center sm:px-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 text-4xl text-[#00FF66]">
                ✓
              </div>

              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-[#FFEA00]">
                Pagamento aprovado
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Seu pedido está confirmado.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/60">
                Recebemos seu pagamento e o pedido já foi registrado.
                Em breve ele seguirá para preparação e envio.
              </p>

              {params.external_reference && (
                <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-black/30 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Número do pedido
                  </p>

                  <p className="mt-1 font-mono text-lg font-semibold text-[#FFEA00]">
                    {params.external_reference}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/produtos"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[#FFEA00] px-6 font-semibold text-black transition hover:brightness-95"
                >
                  Continuar comprando
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Voltar para o início
                </Link>
              </div>

              <p className="mt-8 text-xs text-white/30">
                Status do pagamento:{" "}
                <span className="text-white/50">
                  {params.status || "approved"}
                </span>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            Orgulho de vestir o que nos move.
          </p>
        </div>
      </main>
    </div>
  );
}
