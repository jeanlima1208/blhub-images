"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";

function formatPrice(value: number) {
  return value.toFixed(2).replace(".", ",");
}

const API_URL = "";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    coupon,
    couponLoading,
    couponError,
    applyCoupon,
    removeCoupon,
        discount,
    finalTotal,

    shippingCep,
    shippingOptions,
    selectedShipping,
    shippingLoading,
    shippingError,
    shippingCost,

    setShippingCep,
    calculateShipping,
    selectShipping,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [checkoutError, setCheckoutError] =
    useState<string | null>(null);

  // =========================================================
  // FINALIZAR PEDIDO
  // =========================================================

  async function handleCheckout() {
  if (items.length === 0) {
    return;
  }

  if (checkoutLoading) {
    return;
  }

  if (!selectedShipping) {
    setCheckoutError(
      "Calcule e selecione uma opção de frete antes de finalizar."
    );
    return;
  }

  try {
    setCheckoutLoading(true);
    setCheckoutError(null);
      // =====================================================

      const referenceId =
        `BLMANTOS-${Date.now()}`;

      // =====================================================`r`n      // PRODUTOS PARA O MERCADO PAGO
      // =====================================================

      const originalTotalCents =
        Math.round(totalPrice * 100);

      const finalTotalCents =
        Math.round(finalTotal * 100);

      const discountCents =
        Math.max(
          0,
          originalTotalCents -
            finalTotalCents
        );

      let remainingDiscountCents =
        discountCents;

      let mercadoPagoItems =
        items.map(
          (item, index) => {

            const originalUnitCents =
              Math.round(
                Number(item.price) * 100
              );

            const originalItemCents =
              originalUnitCents *
              item.quantity;

            let itemDiscountCents = 0;

            if (
              discountCents > 0 &&
              originalTotalCents > 0
            ) {

              if (
                index ===
                items.length - 1
              ) {

                itemDiscountCents =
                  remainingDiscountCents;

              } else {

                itemDiscountCents =
                  Math.round(
                    (
                      originalItemCents /
                      originalTotalCents
                    ) *
                    discountCents
                  );

                itemDiscountCents =
                  Math.min(
                    itemDiscountCents,
                    remainingDiscountCents
                  );
              }
            }

            remainingDiscountCents -=
              itemDiscountCents;

            const finalItemCents =
              Math.max(
                0,
                originalItemCents -
                  itemDiscountCents
              );

            const finalUnitCents =
              Math.round(
                finalItemCents /
                  item.quantity
              );

            return {
              reference_id:
                `${item.item_code}-${item.size}`,

              name:
                `${item.item_name} - ${item.size}`,

              quantity:
                item.quantity,

              unit_amount:
                finalUnitCents,

              currency_id:
                "BRL",
            };
          }
        );
      if (
        selectedShipping &&
        shippingCost > 0
      ) {
        mercadoPagoItems.push({
          reference_id:
            `FRETE-${selectedShipping.service_id}`,

          name:
            `Frete - ${selectedShipping.company} ${selectedShipping.name}`,

          quantity: 1,

          unit_amount:
            Math.round(
              shippingCost * 100
            ),

          currency_id:
            "BRL",
        });
      }

      // =====================================================
      // AJUSTE FINAL DE CENTAVOS
      // =====================================================

      const calculatedItemsCents =
        mercadoPagoItems.reduce(
          (total, item) =>
            total +
            item.quantity *
              item.unit_amount,
          0
        );

      const centsDifference =
        finalTotalCents -
        calculatedItemsCents;

      if (
        centsDifference !== 0 &&
        mercadoPagoItems.length > 0
      ) {

        const lastIndex =
          mercadoPagoItems.length - 1;

        const lastItem =
          mercadoPagoItems[lastIndex];

        const adjustedUnitCents =
          lastItem.unit_amount +
          Math.round(
            centsDifference /
              lastItem.quantity
          );

        mercadoPagoItems[lastIndex] = {
          ...lastItem,
          unit_amount:
            adjustedUnitCents,
        };
      }

      // CRIAR PREFERÊNCIA
      // =====================================================

      const response = await fetch(
  "/api/mercadopago/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            reference_id: referenceId,

            total_amount:
              Math.round(
                finalTotal * 100
              ),

            items: mercadoPagoItems,
          }),
        }
      );

      const data = await response.json();

      // =====================================================
      // ERRO DA API
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Não foi possível criar o pagamento."
        );
      }

      // =====================================================
      // LINK DO MERCADO PAGO
      // =====================================================

      const checkoutUrl =
        data?.checkout?.init_point;

      if (!checkoutUrl) {
        throw new Error(
          "O Mercado Pago não retornou o link de pagamento."
        );
      }

      // =====================================================
      // REDIRECIONAR PARA O MERCADO PAGO
      // =====================================================

      window.location.href =
        checkoutUrl;

    } catch (error) {
      console.error(
        "Erro ao finalizar pedido:",
        error
      );

      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o pagamento."
      );

      setCheckoutLoading(false);
    }
  }

     
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <Header />

      {/* =====================================================
          FUNDO
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">

        <div className="absolute left-1/2 top-[18%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#FFEA00]/[0.025] blur-[140px]" />

        <div className="absolute right-[-200px] top-[50%] h-[500px] w-[500px] rounded-full bg-[#00FF66]/[0.015] blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,234,0,0.035),transparent_35%)]" />

      </div>

      {/* =====================================================
          CARRINHO
      ===================================================== */}

      <section className="relative z-10 px-4 pb-24 pt-[150px] sm:px-6 lg:pt-[175px]">

        <div className="mx-auto max-w-6xl">

          {/* =================================================
              CABEÇALHO
          ================================================= */}

          <div className="mb-10">

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
              BL Mantos
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Seu carrinho
            </h1>

            {items.length > 0 && (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "itens"}{" "}
                selecionado
                {totalItems === 1
                  ? ""
                  : "s"}
              </p>
            )}

          </div>

          {/* =================================================
              CARRINHO VAZIO
          ================================================= */}

          {items.length === 0 ? (

            <div className="rounded-3xl border border-white/[0.08] bg-[#090909] px-6 py-20 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">

                <span className="text-3xl font-black text-white/[0.12]">
                  BL
                </span>

              </div>

              <h2 className="mt-6 text-xl font-black uppercase tracking-tight text-white">
                Seu carrinho está vazio
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                Explore nosso catálogo e encontre sua próxima camisa.
              </p>

              <Link
                href="/produtos"
                className="mt-8 inline-flex rounded-xl bg-[#FFEA00] px-7 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explorar catálogo
              </Link>

            </div>

          ) : (

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

              {/* =================================================
                  PRODUTOS
              ================================================= */}

              <div className="space-y-3">

                {items.map((item) => (

                  <div
                    key={`${item.item_code}-${item.size}`}
                    className="rounded-2xl border border-white/[0.08] bg-[#090909] p-4 sm:p-5"
                  >

                    <div className="flex gap-4">

                      {/* IMAGEM */}

                      <Link
                        href={`/produto/${item.item_code}`}
                        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111] sm:h-32 sm:w-28"
                      >

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.item_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-2xl font-black text-white/[0.08]">
                              BL
                            </span>
                          </div>
                        )}

                      </Link>

                      {/* INFORMAÇÕES */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <Link
                              href={`/produto/${item.item_code}`}
                              className="block truncate text-[11px] font-black uppercase tracking-wide text-white transition hover:text-[#FFEA00]"
                            >
                              {item.item_name}
                            </Link>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
                              SKU {item.item_code}
                            </p>

                          </div>

                          {/* REMOVER */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              removeItem(
                                item.item_code,
                                item.size
                              );
                            }}
                            className="shrink-0 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/30 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            Remover
                          </button>

                        </div>

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">

                          <div className="flex gap-3">

                            {/* TAMANHO */}

                            <div>

                              <p className="mb-2 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                                Tamanho
                              </p>

                              <div className="rounded-lg border border-[#FFEA00]/30 bg-[#FFEA00]/[0.06] px-4 py-2.5 text-[10px] font-black uppercase text-[#FFEA00]">
                                {item.size}
                              </div>

                            </div>

                            {/* QUANTIDADE */}

                            <div>

                              <p className="mb-2 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                                Quantidade
                              </p>

                              <div className="flex h-[38px] overflow-hidden rounded-lg border border-white/[0.10] bg-[#111111]">

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.item_code,
                                      item.size,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1
                                  }
                                  className="w-9 text-sm font-black text-white/60 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                >
                                  −
                                </button>

                                <div className="flex w-9 items-center justify-center border-x border-white/[0.08] text-[10px] font-black text-white">
                                  {item.quantity}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.item_code,
                                      item.size,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >=
                                    item.maxQuantity
                                  }
                                  className="w-9 text-sm font-black text-white/60 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                                >
                                  +
                                </button>

                              </div>

                            </div>

                          </div>

                          {/* PREÇO */}

                          <div className="text-right">

                            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/30">
                              Subtotal
                            </p>

                            <p className="mt-1 text-lg font-black text-white">
                              R${" "}
                              {formatPrice(
                                item.price *
                                item.quantity
                              )}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-1 text-[8px] font-bold text-white/30">
                                R${" "}
                                {formatPrice(
                                  item.price
                                )} cada
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

                {/* LIMPAR */}

                <div className="pt-2">

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 transition hover:text-red-400"
                  >
                    Limpar carrinho
                  </button>

                </div>

              </div>

              {/* =================================================
                  RESUMO
              ================================================= */}

              <aside className="lg:sticky lg:top-28">

                <div className="rounded-2xl border border-white/[0.08] bg-[#090909] p-6">

                  <div className="flex items-center gap-3">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFEA00] shadow-[0_0_10px_#FFEA00]" />

                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FFEA00]">
                      Resumo
                    </p>

                  </div>

                  <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-white">
                    Pedido
                  </h2>

                  <div className="mt-6 space-y-3 border-b border-white/[0.08] pb-6">

                    <div className="flex justify-between gap-4">

                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        Produtos
                      </span>

                      <span className="text-[10px] font-black text-white">
                        {totalItems}
                      </span>

                    </div>

                    <div className="space-y-3">

  <div className="flex justify-between gap-4">
    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
      Frete
    </span>

    <span className="text-[10px] font-black text-white">
      {selectedShipping
        ? `R$ ${formatPrice(shippingCost)}`
        : "A calcular"}
    </span>
  </div>

  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
      Calcular entrega
    </p>

    <div className="flex gap-2">

      <input
        type="text"
        inputMode="numeric"
        value={shippingCep}
        onChange={(event) =>
          setShippingCep(
            event.target.value
          )
        }
        placeholder="SEU CEP"
        maxLength={9}
        className="min-w-0 flex-1 rounded-lg border border-white/[0.10] bg-black px-3 py-3 text-[10px] font-bold tracking-wider text-white outline-none placeholder:text-white/20 focus:border-[#FFEA00]/50"
      />

      <button
        type="button"
        onClick={calculateShipping}
        disabled={shippingLoading}
        className="shrink-0 rounded-lg bg-[#FFEA00] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {shippingLoading
          ? "..."
          : "Calcular"}
      </button>

    </div>

    {shippingError && (
      <p className="mt-3 text-[9px] font-bold leading-4 text-red-400">
        {shippingError}
      </p>
    )}

    {shippingOptions.length > 0 && (
      <div className="mt-4 space-y-2">

        {shippingOptions.map(
          (option) => {
            const selected =
              selectedShipping?.id ===
              option.id;

            const range =
              option.delivery_range;

            return (
              <button
                key={`${option.id}-${option.company}`}
                type="button"
                onClick={() =>
                  selectShipping(option)
                }
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-[#FFEA00]/60 bg-[#FFEA00]/[0.06]"
                    : "border-white/[0.08] bg-black hover:border-white/[0.20]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p
                      className={`text-[10px] font-black uppercase ${
                        selected
                          ? "text-[#FFEA00]"
                          : "text-white"
                      }`}
                    >
                      {option.company}
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-white/35">
                      {option.name}
                      {" · "}
                      {range?.min ?? option.delivery_time}
                      {range?.max &&
                      range.max !==
                        range.min
                        ? `–${range.max}`
                        : ""}
                      {" dias"}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs font-black text-white">
                    R$ {formatPrice(option.price)}
                  </span>

                </div>

              </button>
            );
          }
        )}

      </div>
    )}

  </div>

</div>

                  </div>

                  {/* =================================================
                      CUPOM DE DESCONTO
                  ================================================= */}

                  <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                      Cupom de desconto
                    </p>

                    {coupon ? (

                      <div className="flex items-center justify-between gap-3">

                        <div className="min-w-0">

                          <p className="truncate text-xs font-black uppercase text-[#00FF66]">
                            {coupon.code}
                          </p>

                          <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/35">
                            Cupom aplicado
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            removeCoupon();
                            setCouponCode("");
                          }}
                          className="shrink-0 rounded-lg border border-white/[0.10] px-3 py-2 text-[8px] font-black uppercase tracking-wider text-white/50 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          Remover
                        </button>

                      </div>

                    ) : (

                      <div className="flex gap-2">

                        <input
                          type="text"
                          value={couponCode}
                          onChange={(event) =>
                            setCouponCode(
                              event.target.value.toUpperCase()
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();

                              if (!couponLoading) {
                                applyCoupon(couponCode);
                              }
                            }
                          }}
                          placeholder="DIGITE SEU CUPOM"
                          disabled={couponLoading}
                          className="min-w-0 flex-1 rounded-lg border border-white/[0.10] bg-black px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-white outline-none placeholder:text-white/20 focus:border-[#FFEA00]/50 disabled:opacity-50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            applyCoupon(couponCode)
                          }
                          disabled={
                            couponLoading ||
                            !couponCode.trim()
                          }
                          className="shrink-0 rounded-lg bg-white px-4 py-3 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-[#FFEA00] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                        >
                          {couponLoading
                            ? "..."
                            : "Aplicar"}
                        </button>

                      </div>

                    )}

                    {couponError && (
                      <p className="mt-3 text-[9px] font-bold leading-4 text-red-400">
                        {couponError}
                      </p>
                    )}

                  </div>

                  {/* =================================================
                      VALORES
                  ================================================= */}

                  <div className="space-y-3 border-b border-white/[0.08] py-6">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                        Subtotal
                      </span>

                      <span className="text-sm font-black text-white">
                        R$ {formatPrice(totalPrice)}
                      </span>

                    </div>

                    {coupon && discount > 0 && (
                      <div className="flex items-center justify-between gap-4">

                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#00FF66]">
                          Desconto ({coupon.code})
                        </span>

                        <span className="text-sm font-black text-[#00FF66]">
                          - R$ {formatPrice(discount)}
                        </span>

                      </div>
                    )}

                    <div className="flex items-end justify-between gap-4 pt-2">

                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                        Total
                      </span>

                      <span className="text-2xl font-black text-white">
                        R$ {formatPrice(finalTotal)}
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      ERRO
                  ================================================= */}

                  {checkoutError && (
                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">

                      <p className="text-center text-[9px] font-bold leading-5 text-red-400">
                        {checkoutError}
                      </p>

                    </div>
                  )}

                  {/* =================================================
                      FINALIZAR
                  ================================================= */}

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={
                      checkoutLoading ||
                      items.length === 0
                    }
                    className="w-full rounded-xl bg-[#FFEA00] px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-black shadow-[0_15px_45px_rgba(255,234,0,0.10)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
                  >
                    {checkoutLoading
                      ? "Abrindo pagamento..."
                      : "Finalizar pedido"}
                  </button>

                  <Link
                    href="/produtos"
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/[0.15] bg-white/[0.02] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-[#FFEA00]/50 hover:bg-white/[0.04] hover:text-white"
                  >
                    Continuar comprando
                  </Link>

                  <div className="mt-6 border-t border-white/[0.07] pt-5">

                    <p className="text-center text-[9px] font-bold leading-5 text-white/45">
                      Você será direcionado ao Mercado Pago para concluir o pagamento com segurança.
                    </p>

                  </div>

                </div>

              </aside>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}


