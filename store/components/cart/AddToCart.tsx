"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartProps = {
  itemCode: string;
  itemName: string;
  image: string | null;
  price: number;
  availableSizes: string[];
  stock: number;
};

export default function AddToCart({
  itemCode,
  itemName,
  image,
  price,
  availableSizes,
  stock,
}: AddToCartProps) {
  const { items, addItem } = useCart();

  const [selectedSize, setSelectedSize] =
    useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [addedMessage, setAddedMessage] =
    useState(false);

  // =========================================================
  // TAMANHOS DISPONÍVEIS
  // =========================================================

  const sizeOrder = [
    "P",
    "M",
    "G",
    "GG",
    "G1",
    "G2",
    "G3",
    "G4",
    "XXG",
  ];

  const sizes = availableSizes
    .map((value) => {
      const [size, qty] = value.split("|");

      return {
        name:
          size?.trim().toUpperCase() ?? "",
        stock: Number(qty ?? 0),
      };
    })
    .filter(
      (size) =>
        size.name.length > 0 &&
        size.stock > 0
    )
    .sort((a, b) => {
      const indexA =
        sizeOrder.indexOf(a.name);

      const indexB =
        sizeOrder.indexOf(b.name);

      return (
        (indexA === -1 ? 999 : indexA) -
        (indexB === -1 ? 999 : indexB)
      );
    });

  // =========================================================
  // ESTOQUE DO TAMANHO SELECIONADO
  // =========================================================

  const selectedSizeData = sizes.find(
    (size) => size.name === selectedSize
  );

  const sizeStock =
    selectedSizeData?.stock ?? 0;

  // =========================================================
  // QUANTO JÁ EXISTE NO CARRINHO
  // =========================================================

  const cartQuantityForSize =
    selectedSize
      ? items.find(
          (item) =>
            item.item_code === itemCode &&
            item.size === selectedSize
        )?.quantity ?? 0
      : 0;

  // =========================================================
  // QUANTO AINDA PODE SER ADICIONADO
  // =========================================================

  const remainingStock = Math.max(
    0,
    sizeStock - cartQuantityForSize
  );

  const hasSelectedSize =
    Boolean(selectedSize);

  const canPurchase =
    hasSelectedSize &&
    remainingStock > 0;

  // =========================================================
  // TROCAR TAMANHO
  // =========================================================

  function handleSizeChange(
    size: string
  ) {
    setSelectedSize(size);
    setQuantity(1);
    setAddedMessage(false);
  }

  // =========================================================
  // QUANTIDADE -
  // =========================================================

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  // =========================================================
  // QUANTIDADE +
  // =========================================================

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(
        remainingStock,
        current + 1
      )
    );
  }

  // =========================================================
  // ADICIONAR AO CARRINHO
  // =========================================================

  function handleAddToCart() {
    if (!selectedSize) {
      return;
    }

    if (remainingStock <= 0) {
      return;
    }

    const safeQuantity = Math.min(
      quantity,
      remainingStock
    );

    addItem({
      item_code: itemCode,
      item_name: itemName,
      image,
      price,
      size: selectedSize,
      quantity: safeQuantity,
      maxQuantity: sizeStock,
    });

    setAddedMessage(true);
    setQuantity(1);

    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  }

  // =========================================================
  // COMPRAR AGORA
  // =========================================================

  function handleBuyNow() {
    if (!selectedSize) {
      return;
    }

    if (remainingStock <= 0) {
      return;
    }

    const safeQuantity = Math.min(
      quantity,
      remainingStock
    );

    addItem({
      item_code: itemCode,
      item_name: itemName,
      image,
      price,
      size: selectedSize,
      quantity: safeQuantity,
      maxQuantity: sizeStock,
    });

    window.location.href =
      "/carrinho";
  }

  // =========================================================
  // PRODUTO SEM ESTOQUE
  // =========================================================

  if (
    stock <= 0 ||
    sizes.length === 0
  ) {
    return (
      <div className="mt-8">
        <button
          type="button"
          disabled
          className="
            w-full
            cursor-not-allowed
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.04]
            px-6
            py-4
            text-[10px]
            font-black
            uppercase
            tracking-[0.22em]
            text-white/30
          "
        >
          Produto esgotado
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">

      {/* =====================================================
          TAMANHOS
      ===================================================== */}

      <div>

        <div className="mb-3 flex items-center justify-between gap-4">

          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/60">
            Escolha o tamanho
          </p>

          {!hasSelectedSize && (
            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#FFEA00]/70">
              Obrigatório
            </span>
          )}

        </div>

        <div className="flex flex-wrap gap-2">

          {sizes.map((size) => {

            const alreadyInCart =
              items.find(
                (item) =>
                  item.item_code ===
                    itemCode &&
                  item.size ===
                    size.name
              )?.quantity ?? 0;

            const isFull =
              alreadyInCart >=
              size.stock;

            const isSelected =
              selectedSize ===
              size.name;

            return (
              <button
                key={size.name}
                type="button"
                disabled={isFull}
                onClick={() =>
                  handleSizeChange(
                    size.name
                  )
                }
                className={`min-w-[58px] rounded-lg border px-4 py-3 text-[10px] font-black uppercase tracking-wide transition ${
                  isFull
                    ? "cursor-not-allowed border-white/[0.05] bg-white/[0.02] text-white/20"
                    : isSelected
                    ? "border-[#FFEA00] bg-[#FFEA00] text-black shadow-[0_0_20px_rgba(255,234,0,0.10)]"
                    : "border-white/[0.12] bg-[#0A0A0A] text-white hover:border-[#FFEA00] hover:bg-[#FFEA00] hover:text-black"
                }`}
              >
                {size.name}
              </button>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          ÁREA DE COMPRA
          SEMPRE VISÍVEL
      ===================================================== */}

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-4">

        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* QUANTIDADE */}

          <div>

            <p className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/40">
              Quantidade
            </p>

            <div
              className={`flex h-[42px] overflow-hidden rounded-lg border bg-[#111111] ${
                hasSelectedSize
                  ? "border-white/[0.10]"
                  : "border-white/[0.05] opacity-50"
              }`}
            >

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  !hasSelectedSize ||
                  quantity <= 1 ||
                  remainingStock <= 0
                }
                className="
                  w-11
                  text-lg
                  font-black
                  text-white/60
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-20
                "
              >
                −
              </button>

              <div className="flex w-12 items-center justify-center border-x border-white/[0.08] text-[11px] font-black text-white">
                {quantity}
              </div>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  !hasSelectedSize ||
                  quantity >=
                    remainingStock ||
                  remainingStock <= 0
                }
                className="
                  w-11
                  text-lg
                  font-black
                  text-white/60
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-20
                "
              >
                +
              </button>

            </div>

          </div>

          {/* ESTOQUE */}

          <div className="text-right">

            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
              Disponível
            </p>

            <p
              className={`mt-1 text-[10px] font-black uppercase ${
                !hasSelectedSize
                  ? "text-white/30"
                  : remainingStock > 0
                  ? "text-[#00FF66]"
                  : "text-red-400"
              }`}
            >
              {!hasSelectedSize
                ? "Selecione o tamanho"
                : remainingStock > 0
                ? `${remainingStock} disponível${
                    remainingStock > 1
                      ? "is"
                      : ""
                  }`
                : "Limite atingido"}
            </p>

          </div>

        </div>

        {/* =================================================
            AVISO ANTES DA ESCOLHA
        ================================================= */}

        {!hasSelectedSize && (
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
              Selecione um tamanho para continuar
            </p>
          </div>
        )}

        {/* =================================================
            BOTÕES
        ================================================= */}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">

          {/* ADICIONAR */}

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={!canPurchase}
            className={`rounded-xl border px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] transition ${
              canPurchase
                ? "border-[#FFEA00]/50 bg-[#FFEA00]/[0.08] text-[#FFEA00] hover:border-[#FFEA00] hover:bg-[#FFEA00] hover:text-black"
                : "cursor-not-allowed border-white/[0.06] bg-white/[0.035] text-white/25"
            }`}
          >
            {addedMessage
              ? "Adicionado ✓"
              : !hasSelectedSize
              ? "Selecione um tamanho"
              : "Adicionar ao carrinho"}
          </button>

          {/* COMPRAR AGORA */}

          <button
            type="button"
            onClick={
              handleBuyNow
            }
            disabled={!canPurchase}
            className={`rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] transition ${
              canPurchase
                ? "bg-[#FFEA00] text-black shadow-[0_15px_45px_rgba(255,234,0,0.12)] hover:-translate-y-0.5 hover:bg-white"
                : "cursor-not-allowed bg-white/10 text-white/30"
            }`}
          >
            {!hasSelectedSize
              ? "Selecione um tamanho"
              : "Comprar agora"}
          </button>

        </div>

        {/* =================================================
            AVISO CARRINHO
        ================================================= */}

        {cartQuantityForSize > 0 &&
          remainingStock > 0 && (
            <p className="mt-3 text-center text-[8px] font-bold uppercase tracking-[0.12em] text-white/35">
              Você já possui{" "}
              {cartQuantityForSize}{" "}
              {selectedSize} no carrinho.
              Restam {remainingStock}.
            </p>
          )}

        {cartQuantityForSize > 0 &&
          remainingStock <= 0 && (
            <p className="mt-3 text-center text-[8px] font-black uppercase tracking-[0.12em] text-[#FFEA00]">
              Você já adicionou todo o
              estoque disponível deste
              tamanho.
            </p>
          )}

      </div>

    </div>
  );
}