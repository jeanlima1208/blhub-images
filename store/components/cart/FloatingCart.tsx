"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

export default function FloatingCart() {
  const pathname = usePathname();
  const { items } = useCart();

  // =========================================================
  // NÃO EXIBIR NO CARRINHO OU CHECKOUT
  // =========================================================

  if (
    pathname === "/carrinho" ||
    pathname === "/checkout"
  ) {
    return null;
  }

  // =========================================================
  // TOTAL DE ITENS
  // =========================================================

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totalItems <= 0) {
    return null;
  }

  // =========================================================
  // BOTÃO FLUTUANTE
  // =========================================================

  return (
    <Link
      href="/carrinho"
      aria-label={`Abrir carrinho com ${totalItems} ${
        totalItems === 1 ? "item" : "itens"
      }`}
      className="
        fixed
        bottom-5
        right-5
        z-[100]
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        border
        border-[#FFEA00]/60
        bg-[#080808]
        text-[#FFEA00]
        shadow-[0_10px_35px_rgba(0,0,0,0.55)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#FFEA00]
        hover:bg-[#FFEA00]
        hover:text-black
        sm:bottom-7
        sm:right-7
      "
    >
      {/* =====================================================
          ÍCONE
      ===================================================== */}

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />

        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* =====================================================
          BADGE
      ===================================================== */}

      <span
        className="
          absolute
          -right-1
          -top-1
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          border
          border-[#080808]
          bg-[#FFEA00]
          px-1
          text-[8px]
          font-black
          leading-none
          text-black
        "
      >
        {totalItems}
      </span>
    </Link>
  );
}