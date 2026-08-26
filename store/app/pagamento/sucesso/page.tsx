import Link from "next/link";

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
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mb-6 text-5xl">✓</div>

        <h1 className="text-3xl font-bold mb-3">
          Pagamento aprovado
        </h1>

        <p className="text-white/70 mb-8">
          Seu pagamento foi aprovado com sucesso.
        </p>

        {params.external_reference && (
          <div className="mb-3 text-sm text-white/60">
            Pedido:{" "}
            <span className="text-white font-medium">
              {params.external_reference}
            </span>
          </div>
        )}

        {params.payment_id && (
          <div className="mb-3 text-sm text-white/60">
            Pagamento:{" "}
            <span className="text-white font-medium">
              {params.payment_id}
            </span>
          </div>
        )}

        <div className="mb-8 text-xs text-white/40">
          Status: {params.status || "approved"}
        </div>

        <Link
          href="/produtos"
          className="inline-flex items-center justify-center rounded-lg bg-[#FFEA00] px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          Continuar comprando
        </Link>
      </div>
    </main>
  );
}
