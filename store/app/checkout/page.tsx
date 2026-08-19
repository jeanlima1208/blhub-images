"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";

function formatPrice(value: number) {
  return value.toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const {
    items,
    totalItems,
    totalPrice,
  } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatCpf(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value: string) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 11);

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    if (!name.trim()) {
      setError("Informe seu nome.");
      return;
    }

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!cpf.replace(/\D/g, "")) {
      setError("Informe seu CPF.");
      return;
    }

    if (!phone.replace(/\D/g, "")) {
      setError("Informe seu telefone.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        reference_id: `BLM-${Date.now()}`,

        items: items.map((item) => ({
          reference_id: `${item.item_code}-${item.size}`,

          name: `${item.item_name} - ${item.size}`,

          description:
            `Camisa ${item.item_name} tamanho ${item.size}`,

          quantity: item.quantity,

          unit_amount: Math.round(
            item.price * 100
          ),

          ...(item.image
            ? {
                image_url: item.image,
              }
            : {}),
        })),

        customer: {
          name: name.trim(),

          email: email.trim(),

          tax_id: cpf.replace(/\D/g, ""),

          phones: [
            {
              country: "55",

              area: phone
                .replace(/\D/g, "")
                .slice(0, 2),

              number: phone
                .replace(/\D/g, "")
                .slice(2),

              type: "MOBILE",
            },
          ],
        },

        total_amount: Math.round(
          totalPrice * 100
        ),
      };

      const response = await fetch(
        "/api/mercadopago/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Não foi possível iniciar o pagamento."
        );
      }

      const checkout =
        data?.checkout;

      const payLink =
        checkout?.init_point;

      if (!payLink) {
        console.error(
          "Resposta Mercado Pago:",
          data
        );

        throw new Error(
          "O Mercado Pago não retornou o link de pagamento."
        );
      }

      window.location.href = payLink;

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao iniciar pagamento."
      );

      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <Header />

        <section className="px-4 pb-24 pt-[150px] sm:px-6">

          <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-[#090909] px-6 py-20 text-center">

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
              BL Mantos
            </p>

            <h1 className="mt-4 text-2xl font-black uppercase">
              Carrinho vazio
            </h1>

            <p className="mt-3 text-sm text-white/40">
              Adicione uma camisa antes de continuar.
            </p>

            <Link
              href="/produtos"
              className="mt-8 inline-flex rounded-xl bg-[#FFEA00] px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black"
            >
              Ver produtos
            </Link>

          </div>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <Header />

      <section className="px-4 pb-24 pt-[150px] sm:px-6 lg:pt-[175px]">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10">

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
              BL Mantos
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Finalizar pedido
            </h1>

            <p className="mt-3 text-sm text-white/40">
              Informe seus dados para continuar
              com o pagamento seguro.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-6 lg:grid-cols-[1fr_360px]"
          >

            <div className="rounded-2xl border border-white/[0.08] bg-[#090909] p-6 sm:p-8">

              <div className="mb-7">

                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FFEA00]">
                  Seus dados
                </p>

                <h2 className="mt-2 text-xl font-black uppercase">
                  Identificação
                </h2>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                    Nome completo
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/[0.10] bg-[#111111] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FFEA00]/60"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="seuemail@email.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/[0.10] bg-[#111111] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FFEA00]/60"
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                      CPF
                    </label>

                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) =>
                        setCpf(
                          formatCpf(
                            e.target.value
                          )
                        )
                      }
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      autoComplete="off"
                      className="w-full rounded-xl border border-white/[0.10] bg-[#111111] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FFEA00]/60"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                      WhatsApp
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          formatPhone(
                            e.target.value
                          )
                        )
                      }
                      placeholder="(42) 99999-9999"
                      inputMode="tel"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-white/[0.10] bg-[#111111] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FFEA00]/60"
                    />

                  </div>

                </div>

              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-red-400">
                  {error}
                </div>
              )}

            </div>

            <aside className="lg:sticky lg:top-28">

              <div className="rounded-2xl border border-white/[0.08] bg-[#090909] p-6">

                <div className="flex items-center gap-3">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFEA00] shadow-[0_0_10px_#FFEA00]" />

                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FFEA00]">
                    Resumo
                  </p>

                </div>

                <h2 className="mt-3 text-xl font-black uppercase">
                  Pedido
                </h2>

                <div className="mt-6 space-y-3 border-b border-white/[0.08] pb-6">

                  <div className="flex justify-between">

                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Produtos
                    </span>

                    <span className="text-[10px] font-black">
                      {totalItems}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Frete
                    </span>

                    <span className="text-[10px] font-black uppercase text-[#00FF66]">
                      A calcular
                    </span>

                  </div>

                </div>

                <div className="flex items-end justify-between gap-4 py-6">

                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                    Total
                  </span>

                  <span className="text-2xl font-black">
                    R$ {formatPrice(totalPrice)}
                  </span>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#FFEA00] px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-black shadow-[0_15px_45px_rgba(255,234,0,0.10)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Abrindo pagamento..."
                    : "Ir para pagamento"}
                </button>

                <Link
                  href="/carrinho"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/[0.15] bg-white/[0.02] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-[#FFEA00]/50 hover:text-white"
                >
                  Voltar ao carrinho
                </Link>

                <div className="mt-6 border-t border-white/[0.07] pt-5">

                  <p className="text-center text-[9px] font-bold leading-5 text-white/40">
                    Pagamento processado com
                    segurança pelo Mercado Pago.
                  </p>

                </div>

              </div>

            </aside>

          </form>

        </div>

      </section>

    </main>
  );
}