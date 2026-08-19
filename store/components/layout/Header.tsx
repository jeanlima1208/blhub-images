"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import StadiumLED from "@/components/home/StadiumLED";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[21px] w-[21px]"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[21px] w-[21px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[22px] w-[22px]"
      aria-hidden="true"
    >
      <path
        d="M4 5h2l1.4 9.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 1.9-1.5L21 8H7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1" />
      <circle cx="18" cy="19" r="1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[24px] w-[24px]"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={
          "fixed left-0 top-0 z-50 w-full transition-all duration-500 " +
          (scrolled
            ? "bg-[#050505]/96 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            : "bg-[#050505]/55 backdrop-blur-md")
        }
      >
        {/* HEADER PRINCIPAL */}
        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* LOGO */}
          <div className="flex shrink-0 items-center">
            <Logo />
          </div>

          {/* MENU */}
          <nav className="hidden items-center gap-9 lg:flex">
            <a
              href="#"
              className="group relative py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition hover:text-white"
            >
              Times
              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="#"
              className="group relative py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition hover:text-white"
            >
              Seleções
              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="#"
              className="group relative py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition hover:text-white"
            >
              Lançamentos
              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="#"
              className="group relative py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition hover:text-white"
            >
              Promoções
              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          {/* AÇÕES */}
          <div className="flex shrink-0 items-center gap-1 text-white sm:gap-2">
            <button
              type="button"
              aria-label="Pesquisar"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-[#FFEA00]"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              aria-label="Minha conta"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-[#FFEA00] sm:flex"
            >
              <UserIcon />
            </button>

            <button
              type="button"
              aria-label="Carrinho"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-[#FFEA00]"
            >
              <CartIcon />

              <span className="absolute right-[2px] top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#FFEA00] px-1 text-[8px] font-black text-black">
                0
              </span>
            </button>

            <button
              type="button"
              aria-label="Menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-[#FFEA00] lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* LINHA SUTIL */}
        <div
          className={
            "h-px w-full transition-opacity duration-500 " +
            (scrolled
              ? "bg-white/[0.08]"
              : "bg-white/[0.04]")
          }
        />

        {/* TICKER */}
        <StadiumLED />
      </header>

      {/* ESPAÇO RESERVADO AO HEADER */}
      <div className="h-[118px] w-full" />
    </>
  );
}
