"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/ui/Logo";
import StadiumLED from "@/components/home/StadiumLED";
import type { Product } from "@/services/products";
import { useCart } from "@/components/cart/CartProvider";

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
      <path
        d="M4 7h16M4 12h16M4 17h16"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="m9 5 7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path
        d="m7 10 5 5 5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const categories = [
  {
    id: "Brasileiros",
    label: "BRASILEIROS",
  },
  {
    id: "Europeus",
    label: "EUROPEUS",
  },
  {
    id: "Seleções",
    label: "SELEÇÕES",
  },
  {
    id: "Outros",
    label: "OUTROS CONTINENTES",
  },
];

function normalizeCategory(
  value?: string | null
) {
  const category =
    String(value || "").trim();

  if (
    category === "SeleÃ§Ãµes" ||
    category === "SELEÃ‡Ã•ES"
  ) {
    return "Seleções";
  }

  return category;
}

function categoryHref(category: string) {
  return (
    "/produtos?tipo=CAMISAS&categoria=" +
    encodeURIComponent(category)
  );
}

function teamHref(
  category: string,
  team: string
) {
  return (
    "/produtos?tipo=CAMISAS&categoria=" +
    encodeURIComponent(category) +
    "&time=" +
    encodeURIComponent(team)
  );
}

export default function Header() {
  const [scrolled, setScrolled] =
    useState(false);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * Busca pelo próprio Next.js.
   * Não acessa o IP do backend diretamente no navegador.
   */
  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const response = await fetch(
          "/api/items",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          mounted &&
          Array.isArray(data)
        ) {
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar produtos do Header:",
          error
        );
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==========================================================
   * TIMES POR CATEGORIA
   * ==========================================================
   */

  const teamsByCategory = useMemo(() => {
    const result: Record<
      string,
      string[]
    > = {};

    categories.forEach((category) => {
      result[category.id] = [];
    });

    products.forEach((product) => {
      const category =
        normalizeCategory(
          product.custom_categoria_time
        );

      const team =
        product.custom_time_nome?.trim() ||
        "";

      if (!category || !team) {
        return;
      }

      if (!result[category]) {
        return;
      }

      if (!result[category].includes(team)) {
        result[category].push(team);
      }
    });

    Object.keys(result).forEach(
      (category) => {
        result[category].sort(
          (a, b) =>
            a.localeCompare(
              b,
              "pt-BR"
            )
        );
      }
    );

    return result;
  }, [products]);

  const hasNacional =
    products.some(
      (product) =>
        String(
          product.item_group || ""
        )
          .trim()
          .toUpperCase() === "CAMISAS" &&
        !String(
          product.item_name || ""
        )
          .toUpperCase()
          .includes("TAILANDESA")
    );

  const hasTailandesa =
    products.some(
      (product) =>
        String(
          product.item_group || ""
        )
          .trim()
          .toUpperCase() === "CAMISAS" &&
        String(
          product.item_name || ""
        )
          .toUpperCase()
          .includes("TAILANDESA")
    );

  function closeMobile() {
    setMobileOpen(false);
  }

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
        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* LOGO */}

          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              onClick={closeMobile}
            >
              <Logo />
            </Link>
          </div>

          {/* ==================================================
              MENU DESKTOP
          ================================================== */}

          <nav className="hidden items-center gap-9 lg:flex">
            {/* =================================================
                PRODUTOS
            ================================================= */}

            <div className="group relative">
              <button
                type="button"
                className="
                  relative
                  flex
                  items-center
                  gap-1.5
                  py-3
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-white/65
                  transition
                  hover:text-white
                "
              >
                PRODUTOS

                <ChevronDownIcon />

                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-[#FFEA00]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </button>

              {/* NIVEL 1 */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-full
                  z-[70]
                  w-[260px]
                  -translate-x-1/2
                  translate-y-2
                  border
                  border-white/[0.08]
                  bg-[#090909]
                  p-2
                  opacity-0
                  shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                  transition-all
                  duration-200
                  group-hover:pointer-events-auto
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <div className="mb-2 border-b border-white/[0.06] px-4 py-3">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">
                    CATEGORIAS
                  </p>
                </div>

                {/* CAMISAS */}

                <div className="group/camisas relative">
                  <Link
                    href="/produtos?tipo=CAMISAS"
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3.5
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-white/65
                      transition
                      hover:bg-white/[0.045]
                      hover:text-[#FFEA00]
                    "
                  >
                    <span>CAMISAS</span>

                    <ChevronRightIcon />
                  </Link>

                  {/* NIVEL 2: CATEGORIAS DE TIMES */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-full
                      top-0
                      ml-2
                      w-[255px]
                      border
                      border-white/[0.08]
                      bg-[#090909]
                      p-2
                      opacity-0
                      shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                      transition-all
                      duration-150
                      group-hover/camisas:pointer-events-auto
                      group-hover/camisas:opacity-100
                    "
                  >
                    <div className="mb-2 border-b border-white/[0.06] px-4 py-3">
                      <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FFEA00]">
                        CAMISAS
                      </p>
                    </div>

                    {categories.map(
                      (category) => (
                        <div
                          key={category.id}
                          className="group/category relative"
                        >
                          <Link
                            href={categoryHref(
                              category.id
                            )}
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                              px-4
                              py-3
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.08em]
                              text-white/55
                              transition
                              hover:bg-white/[0.045]
                              hover:text-[#FFEA00]
                            "
                          >
                            <span>
                              {category.label}
                            </span>

                            <ChevronRightIcon />
                          </Link>

                          {/* NIVEL 3: TIMES */}

                          <div
                            className="
                              pointer-events-none
                              absolute
                              left-full
                              top-0
                              ml-2
                              w-[250px]
                              border
                              border-white/[0.08]
                              bg-[#090909]
                              p-2
                              opacity-0
                              shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                              transition-all
                              duration-150
                              group-hover/category:pointer-events-auto
                              group-hover/category:opacity-100
                            "
                          >
                            <div className="mb-2 border-b border-white/[0.06] px-4 py-3">
                              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FFEA00]">
                                {
                                  category.label
                                }
                              </p>

                              <Link
                                href={categoryHref(
                                  category.id
                                )}
                                className="mt-1 block text-[7px] font-bold uppercase tracking-[0.15em] text-white/25 transition hover:text-white/60"
                              >
                                VER TODOS
                              </Link>
                            </div>

                            <div className="max-h-[430px] overflow-y-auto">
                              {(
                                teamsByCategory[
                                  category.id
                                ] || []
                              ).length > 0 ? (
                                teamsByCategory[
                                  category.id
                                ].map(
                                  (team) => (
                                    <Link
                                      key={
                                        category.id +
                                        "-" +
                                        team
                                      }
                                      href={teamHref(
                                        category.id,
                                        team
                                      )}
                                      className="
                                        block
                                        px-4
                                        py-2.5
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.04em]
                                        text-white/45
                                        transition
                                        hover:bg-white/[0.045]
                                        hover:text-white
                                      "
                                    >
                                      {team}
                                    </Link>
                                  )
                                )
                              ) : (
                                <span className="block px-4 py-3 text-[8px] font-bold uppercase tracking-wide text-white/20">
                                  NENHUM TIME
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    <div className="my-2 h-px bg-white/[0.06]" />

                    {hasNacional && (
                      <Link
                        href="/produtos?tipo=CAMISAS&modelo=NACIONAL"
                        className="
                          block
                          px-4
                          py-3
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.08em]
                          text-white/50
                          transition
                          hover:bg-white/[0.045]
                          hover:text-[#FFEA00]
                        "
                      >
                        NACIONAL PREMIUM
                      </Link>
                    )}

                    {hasTailandesa && (
                      <Link
                        href="/produtos?tipo=CAMISAS&modelo=TAILANDESA"
                        className="
                          block
                          px-4
                          py-3
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.08em]
                          text-white/50
                          transition
                          hover:bg-white/[0.045]
                          hover:text-[#FFEA00]
                        "
                      >
                        TAILANDESA
                      </Link>
                    )}
                  </div>
                </div>

                {/* JAQUETAS */}

                <Link
                  href="/produtos?tipo=JAQUETAS"
                  className="
                    block
                    px-4
                    py-3.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-white/65
                    transition
                    hover:bg-white/[0.045]
                    hover:text-[#FFEA00]
                  "
                >
                  JAQUETAS
                </Link>

                {/* CONJUNTOS */}

                <Link
                  href="/produtos?tipo=CONJUNTOS"
                  className="
                    block
                    px-4
                    py-3.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-white/65
                    transition
                    hover:bg-white/[0.045]
                    hover:text-[#FFEA00]
                  "
                >
                  CONJUNTOS
                </Link>
              </div>
            </div>

            {/* LANÇAMENTOS */}

            <Link
              href="/produtos?ordem=LANCAMENTOS"
              className="
                group
                relative
                py-3
                text-[11px]
                font-black
                uppercase
                tracking-[0.22em]
                text-white/65
                transition
                hover:text-white
              "
            >
              LANÇAMENTOS

              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-[#FFEA00]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            {/* PROMOÇÕES */}

            <Link
              href="/produtos?promocao=1"
              className="
                group
                relative
                py-3
                text-[11px]
                font-black
                uppercase
                tracking-[0.22em]
                text-white/65
                transition
                hover:text-white
              "
            >
              PROMOÇÕES

              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-[#FFEA00]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>
          </nav>

          {/* ==================================================
              AÇÕES
          ================================================== */}

          <div className="flex shrink-0 items-center gap-1 text-white sm:gap-2">
            <button
              type="button"
              aria-label="Pesquisar"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-white/70
                transition
                hover:bg-white/[0.06]
                hover:text-[#FFEA00]
              "
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              aria-label="Minha conta"
              className="
                hidden
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-white/70
                transition
                hover:bg-white/[0.06]
                hover:text-[#FFEA00]
                sm:flex
              "
            >
              <UserIcon />
            </button>

            <Link
              href="/carrinho"
              aria-label={`Carrinho com ${totalItems} ${
                totalItems === 1
                  ? "item"
                  : "itens"
              }`}
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-white/70
                transition
                hover:bg-white/[0.06]
                hover:text-[#FFEA00]
              "
            >
              <CartIcon />

              {totalItems > 0 && (
                <span
                  className="
                    absolute
                    right-[2px]
                    top-[2px]
                    flex
                    h-[17px]
                    min-w-[17px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFEA00]
                    px-1
                    text-[8px]
                    font-black
                    leading-none
                    text-black
                  "
                >
                  {totalItems > 99
                    ? "99+"
                    : totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-white/70
                transition
                hover:bg-white/[0.06]
                hover:text-[#FFEA00]
                lg:hidden
              "
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* ====================================================
            MOBILE
        ==================================================== */}

        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-[#050505] px-5 py-6 lg:hidden">
            <div className="space-y-7">
              <section>
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.22em] text-[#FFEA00]">
                  PRODUTOS
                </p>

                <div className="space-y-3">
                  <Link
                    href="/produtos?tipo=CAMISAS"
                    onClick={closeMobile}
                    className="block text-[11px] font-black uppercase tracking-[0.1em] text-white"
                  >
                    CAMISAS
                  </Link>

                  {categories.map(
                    (category) => (
                      <div
                        key={category.id}
                        className="pl-4"
                      >
                        <Link
                          href={categoryHref(
                            category.id
                          )}
                          onClick={closeMobile}
                          className="block text-[9px] font-black uppercase tracking-[0.08em] text-white/60"
                        >
                          {category.label}
                        </Link>

                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                          {(
                            teamsByCategory[
                              category.id
                            ] || []
                          ).map(
                            (team) => (
                              <Link
                                key={
                                  category.id +
                                  "-" +
                                  team
                                }
                                href={teamHref(
                                  category.id,
                                  team
                                )}
                                onClick={
                                  closeMobile
                                }
                                className="text-[8px] font-bold uppercase text-white/35"
                              >
                                {team}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}

                  {hasNacional && (
                    <Link
                      href="/produtos?tipo=CAMISAS&modelo=NACIONAL"
                      onClick={closeMobile}
                      className="block pl-4 text-[9px] font-black uppercase tracking-[0.08em] text-white/45"
                    >
                      NACIONAL PREMIUM
                    </Link>
                  )}

                  {hasTailandesa && (
                    <Link
                      href="/produtos?tipo=CAMISAS&modelo=TAILANDESA"
                      onClick={closeMobile}
                      className="block pl-4 text-[9px] font-black uppercase tracking-[0.08em] text-white/45"
                    >
                      TAILANDESA
                    </Link>
                  )}

                  <Link
                    href="/produtos?tipo=JAQUETAS"
                    onClick={closeMobile}
                    className="block text-[11px] font-black uppercase tracking-[0.1em] text-white"
                  >
                    JAQUETAS
                  </Link>

                  <Link
                    href="/produtos?tipo=CONJUNTOS"
                    onClick={closeMobile}
                    className="block text-[11px] font-black uppercase tracking-[0.1em] text-white"
                  >
                    CONJUNTOS
                  </Link>
                </div>
              </section>

              <div className="flex gap-6 border-t border-white/[0.06] pt-6">
                <Link
                  href="/produtos?ordem=LANCAMENTOS"
                  onClick={closeMobile}
                  className="text-[9px] font-black uppercase tracking-[0.15em] text-white/60"
                >
                  LANÇAMENTOS
                </Link>

                <Link
                  href="/produtos?promocao=1"
                  onClick={closeMobile}
                  className="text-[9px] font-black uppercase tracking-[0.15em] text-white/60"
                >
                  PROMOÇÕES
                </Link>
              </div>

              <Link
                href="/carrinho"
                onClick={closeMobile}
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.06]
                  pt-6
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-white
                "
              >
                <span>IR PARA O CARRINHO</span>

                <span className="text-[#FFEA00]">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "ITEM"
                    : "ITENS"}
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* LINHA */}

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

      <div className="h-[118px] w-full" />
    </>
  );
}