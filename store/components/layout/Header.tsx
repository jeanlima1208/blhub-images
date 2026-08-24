"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
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
      <path
        d="M16 16L21 21"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[21px] w-[21px]"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        strokeLinecap="round"
      />
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
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />
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
      <circle
        cx="10"
        cy="19"
        r="1"
      />
      <circle
        cx="18"
        cy="19"
        r="1"
      />
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

function categoryHref(
  category: string
) {
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
  const router = useRouter();

  const [scrolled, setScrolled] =
    useState(false);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [activeMenu, setActiveMenu] =
    useState<
      "times" | "produtos" | null
    >(null);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const closeTimerRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 40
      );
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

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const response =
          await fetch(
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

  const teamsByCategory =
    useMemo(() => {
      const result: Record<
        string,
        string[]
      > = {};

      categories.forEach(
        (category) => {
          result[category.id] = [];
        }
      );

      products.forEach(
        (product) => {
          const category =
            normalizeCategory(
              product.custom_categoria_time
            );

          const team =
            product.custom_time_nome?.trim() ||
            "";

          if (
            !category ||
            !team
          ) {
            return;
          }

          if (
            !result[category]
          ) {
            return;
          }

          if (
            !result[category].includes(
              team
            )
          ) {
            result[category].push(
              team
            );
          }
        }
      );

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
          .toUpperCase() ===
          "CAMISAS" &&
        !String(
          product.item_name || ""
        )
          .toUpperCase()
          .includes(
            "TAILANDESA"
          )
    );

  const hasTailandesa =
    products.some(
      (product) =>
        String(
          product.item_group || ""
        )
          .trim()
          .toUpperCase() ===
          "CAMISAS" &&
        String(
          product.item_name || ""
        )
          .toUpperCase()
          .includes(
            "TAILANDESA"
          )
    );

  function clearCloseTimer() {
    if (
      closeTimerRef.current
    ) {
      clearTimeout(
        closeTimerRef.current
      );

      closeTimerRef.current =
        null;
    }
  }

  function openMenu(
    menu:
      | "times"
      | "produtos"
  ) {
    clearCloseTimer();

    closeTimerRef.current =
      setTimeout(() => {
        setActiveMenu(menu);
      }, 200);
  }

  function closeMenu() {
    clearCloseTimer();

    closeTimerRef.current =
      setTimeout(() => {
        setActiveMenu(null);
      }, 200);
  }

  function openSearch() {
    clearCloseTimer();

    setActiveMenu(null);
    setSearchOpen(true);

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearch("");
  }

  function closeMobile() {
    setMobileOpen(false);
    setActiveMenu(null);
  }

  function submitSearch() {
    const query =
      search.trim();

    if (!query) {
      return;
    }

    setSearchOpen(false);
    setSearch("");
    setActiveMenu(null);
    setMobileOpen(false);

    router.push(
      `/produtos?busca=${encodeURIComponent(
        query
      )}`
    );
  }

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setSearchOpen(false);
        setSearch("");
        setActiveMenu(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      if (
        closeTimerRef.current
      ) {
        clearTimeout(
          closeTimerRef.current
        );
      }
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

        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

          <div className="flex shrink-0 items-center">

            <Link
              href="/"
              onClick={
                closeMobile
              }
            >
              <Logo />
            </Link>

          </div>

          {/* MENU DESKTOP */}

          <nav className="hidden items-center gap-9 lg:flex">

            {/* TIMES */}

            <div
              className="relative"
              onMouseEnter={() =>
                openMenu(
                  "times"
                )
              }
              onMouseLeave={
                closeMenu
              }
            >

              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    (current) =>
                      current ===
                      "times"
                        ? null
                        : "times"
                  )
                }
                className="
                  relative
                  flex
                  items-center
                  gap-1.5
                  py-3
                  text-[12px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-white/65
                  transition
                  hover:text-white
                "
              >
                TIMES

                <ChevronDownIcon />

                <span
                  className={
                    "absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 " +
                    (activeMenu ===
                    "times"
                      ? "w-full"
                      : "w-0")
                  }
                />

              </button>

            </div>

            {/* PRODUTOS */}

            <div
              className="relative"
              onMouseEnter={() =>
                openMenu(
                  "produtos"
                )
              }
              onMouseLeave={
                closeMenu
              }
            >

              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    (current) =>
                      current ===
                      "produtos"
                        ? null
                        : "produtos"
                  )
                }
                className="
                  relative
                  flex
                  items-center
                  gap-1.5
                  py-3
                  text-[12px]
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
                  className={
                    "absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-[#FFEA00] transition-all duration-300 " +
                    (activeMenu ===
                    "produtos"
                      ? "w-full"
                      : "w-0")
                  }
                />

              </button>

            </div>

            {/* LANÇAMENTOS */}

            <Link
              href="/produtos?ordem=LANCAMENTOS"
              className="
                group
                relative
                py-3
                text-[12px]
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
                text-[12px]
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

          {/* AÇÕES */}

          <div className="flex shrink-0 items-center gap-1 text-white sm:gap-2">

            {/* BUSCA */}

            <div className="relative">

              <button
                type="button"
                aria-label={
                  searchOpen
                    ? "Fechar pesquisa"
                    : "Pesquisar"
                }
                onClick={() =>
                  searchOpen
                    ? closeSearch()
                    : openSearch()
                }
                className="
                  relative
                  z-[130]
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
                {searchOpen ? (
                  <CloseIcon />
                ) : (
                  <SearchIcon />
                )}
              </button>

              {searchOpen && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitSearch();
                  }}
                  className="
                    absolute
                    right-0
                    top-[54px]
                    z-[120]
                    w-[320px]
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-[#0d0d0d]
                    p-2
                    shadow-[0_20px_60px_rgba(0,0,0,0.65)]
                  "
                >

                  <div className="relative">

                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
                      <SearchIcon />
                    </div>

                    <input
                      ref={
                        searchInputRef
                      }
                      type="search"
                      value={search}
                      onChange={(
                        event
                      ) =>
                        setSearch(
                          event.target
                            .value
                        )
                      }
                      placeholder="Buscar time, camisa ou SKU..."
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-white/[0.08]
                        bg-[#111111]
                        pl-11
                        pr-3
                        text-[12px]
                        font-bold
                        text-white
                        outline-none
                        placeholder:text-white/25
                        focus:border-[#FFEA00]/60
                      "
                    />

                  </div>

                </form>
              )}

            </div>

            {/* CONTA */}

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

            {/* CARRINHO */}

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
                    text-[9px]
                    font-black
                    leading-none
                    text-black
                  "
                >
                  {totalItems >
                  99
                    ? "99+"
                    : totalItems}
                </span>
              )}

            </Link>

            {/* MOBILE */}

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={
                mobileOpen
              }
              onClick={() =>
                setMobileOpen(
                  (current) =>
                    !current
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

        {/* MEGA MENU */}

        {activeMenu && (
          <div
            className="
              absolute
              left-0
              top-[82px]
              z-[100]
              hidden
              w-full
              border-t
              border-white/[0.08]
              bg-[#0d0d0d]
              shadow-[0_30px_90px_rgba(0,0,0,0.75)]
              lg:block
            "
            onMouseEnter={
              clearCloseTimer
            }
            onMouseLeave={
              closeMenu
            }
          >

            <div className="mx-auto max-w-[1440px] px-8 py-8 lg:px-12">

              {/* =========================
                  TIMES
              ========================== */}

              {activeMenu ===
                "times" && (
                <div>

                  <div className="mb-6 flex items-end justify-between gap-6 border-b border-white/[0.07] pb-5">

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFEA00]">
                        Times
                      </p>

                      <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
                        Escolha seu manto
                      </h3>

                    </div>

                    <Link
                      href="/produtos?tipo=CAMISAS"
                      className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-[#FFEA00]"
                    >
                      Ver todas as camisas
                    </Link>

                  </div>

                  <div className="grid grid-cols-4 gap-8">

                    {/* BRASILEIROS */}

                    <div>

                      <Link
                        href={categoryHref(
                          "Brasileiros"
                        )}
                        className="
                          text-[11px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-white
                          transition-colors
                          duration-200
                          hover:text-[#FFF000]
                        "
                      >
                        BRASILEIROS
                      </Link>

                      <div className="mt-4 space-y-2">

                        {(
                          teamsByCategory[
                            "Brasileiros"
                          ] || []
                        )
                          .slice(
                            0,
                            14
                          )
                          .map(
                            (
                              team
                            ) => (
                              <Link
                                key={`Brasileiros-${team}`}
                                href={teamHref(
                                  "Brasileiros",
                                  team
                                )}
                                className="
                                  block
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.04em]
                                  text-white/45
                                  transition-all
                                  duration-200
                                  hover:translate-x-1
                                  hover:font-black
                                  hover:text-[#FFF000]
                                "
                              >
                                {team}
                              </Link>
                            )
                          )}

                        {(
                          teamsByCategory[
                            "Brasileiros"
                          ] || []
                        ).length >
                          14 && (
                          <Link
                            href={categoryHref(
                              "Brasileiros"
                            )}
                            className="block pt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FFEA00]/70 transition hover:text-[#FFEA00]"
                          >
                            Ver mais
                          </Link>
                        )}

                      </div>

                    </div>

                    {/* EUROPEUS */}

                    <div>

                      <Link
                        href={categoryHref(
                          "Europeus"
                        )}
                        className="
                          text-[11px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-white
                          transition-colors
                          duration-200
                          hover:text-[#FFF000]
                        "
                      >
                        EUROPEUS
                      </Link>

                      <div className="mt-4 space-y-2">

                        {(
                          teamsByCategory[
                            "Europeus"
                          ] || []
                        )
                          .slice(
                            0,
                            14
                          )
                          .map(
                            (
                              team
                            ) => (
                              <Link
                                key={`Europeus-${team}`}
                                href={teamHref(
                                  "Europeus",
                                  team
                                )}
                                className="
                                  block
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.04em]
                                  text-white/45
                                  transition-all
                                  duration-200
                                  hover:translate-x-1
                                  hover:font-black
                                  hover:text-[#FFF000]
                                "
                              >
                                {team}
                              </Link>
                            )
                          )}

                        {(
                          teamsByCategory[
                            "Europeus"
                          ] || []
                        ).length >
                          14 && (
                          <Link
                            href={categoryHref(
                              "Europeus"
                            )}
                            className="block pt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FFEA00]/70 transition hover:text-[#FFEA00]"
                          >
                            Ver mais
                          </Link>
                        )}

                      </div>

                    </div>

                    {/* SELEÇÕES */}

                    <div>

                      <Link
                        href={categoryHref(
                          "Seleções"
                        )}
                        className="
                          text-[11px]
                          font-black
                          uppercase
                          tracking-[0.16em]
                          text-white
                          transition-colors
                          duration-200
                          hover:text-[#FFF000]
                        "
                      >
                        SELEÇÕES
                      </Link>

                      <div className="mt-4 space-y-2">

                        {(
                          teamsByCategory[
                            "Seleções"
                          ] || []
                        )
                          .slice(
                            0,
                            14
                          )
                          .map(
                            (
                              team
                            ) => (
                              <Link
                                key={`Seleções-${team}`}
                                href={teamHref(
                                  "Seleções",
                                  team
                                )}
                                className="
                                  block
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-[0.04em]
                                  text-white/45
                                  transition-all
                                  duration-200
                                  hover:translate-x-1
                                  hover:font-black
                                  hover:text-[#FFF000]
                                "
                              >
                                {team}
                              </Link>
                            )
                          )}

                        {(
                          teamsByCategory[
                            "Seleções"
                          ] || []
                        ).length >
                          14 && (
                          <Link
                            href={categoryHref(
                              "Seleções"
                            )}
                            className="block pt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FFEA00]/70 transition hover:text-[#FFEA00]"
                          >
                            Ver mais
                          </Link>
                        )}

                      </div>

                    </div>

                    {/* DESTAQUE BRASILEIRO */}

                    <div>

                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                        Destaque
                      </p>

                      <Link
                        href="/produtos?tipo=CAMISAS&categoria=Brasileiros"
                        className="
                          group
                          relative
                          mt-4
                          block
                          min-h-[220px]
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#FFEA00]/20
                          bg-[#111111]
                          transition-all
                          duration-300
                          hover:border-[#FFEA00]/50
                        "
                      >

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(255,234,0,0.18),transparent_40%)]" />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-6">

                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
                            Mais vendidos
                          </p>

                          <p className="mt-2 text-xl font-black uppercase leading-[0.95] tracking-tight text-white">
                            Futebol
                            <br />
                            brasileiro
                          </p>

                          <p className="mt-3 text-[11px] font-bold uppercase leading-relaxed tracking-[0.08em] text-white/50">
                            Garanta o manto do seu time do coração.
                          </p>

                          <span className="mt-4 inline-block text-[10px] font-black uppercase tracking-[0.14em] text-white transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#FFF000]">
                            Ver times brasileiros →
                          </span>

                        </div>

                      </Link>

                    </div>

                  </div>

                </div>
              )}

              {/* =========================
                  PRODUTOS
              ========================== */}

              {activeMenu ===
                "produtos" && (
                <div>

                  <div className="mb-6 flex items-end justify-between gap-6 border-b border-white/[0.07] pb-5">

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFEA00]">
                        Produtos
                      </p>

                      <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
                        Encontre sua linha
                      </h3>

                    </div>

                    <Link
                      href="/produtos"
                      className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition hover:text-[#FFEA00]"
                    >
                      Ver todos os produtos
                    </Link>

                  </div>

                  <div className="grid grid-cols-[1fr_1fr_1fr_1.15fr] gap-8">

                    {/* POR CATEGORIA */}

                    <div>

                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                        Por categoria
                      </p>

                      <div className="mt-4 space-y-3">

                        <Link
                          href="/produtos?tipo=CAMISAS"
                          className="block text-[11px] font-bold uppercase tracking-[0.04em] text-white/50 transition hover:text-[#FFEA00]"
                        >
                          Camisas
                        </Link>

                        <Link
                          href="/produtos?tipo=JAQUETAS"
                          className="block text-[11px] font-bold uppercase tracking-[0.04em] text-white/50 transition hover:text-[#FFEA00]"
                        >
                          Jaquetas
                        </Link>

                        <Link
                          href="/produtos?tipo=CONJUNTOS"
                          className="block text-[11px] font-bold uppercase tracking-[0.04em] text-white/50 transition hover:text-[#FFEA00]"
                        >
                          Conjuntos
                        </Link>

                      </div>

                    </div>

                    {/* POR CATEGORIA DE TIMES */}

                    <div>

                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                        Por categoria de times
                      </p>

                      <div className="mt-4 space-y-3">

                        {categories.map(
                          (category) => (
                            <Link
                              key={
                                category.id
                              }
                              href={categoryHref(
                                category.id
                              )}
                              className="block text-[11px] font-bold uppercase tracking-[0.04em] text-white/50 transition hover:text-[#FFEA00]"
                            >
                              {
                                category.label
                              }
                            </Link>
                          )
                        )}

                      </div>

                    </div>

                    {/* POR LINHA */}

                    <div>

                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                        Por linha
                      </p>

                      <div className="mt-4 space-y-3">

                        {hasNacional && (
                          <Link
                            href="/produtos?tipo=CAMISAS&modelo=NACIONAL"
                            className="block text-[11px] font-black uppercase tracking-[0.04em] text-white/55 transition hover:text-[#FFEA00]"
                          >
                            Nacional Premium
                          </Link>
                        )}

                        {hasTailandesa && (
                          <Link
                            href="/produtos?tipo=CAMISAS&modelo=TAILANDESA"
                            className="block text-[11px] font-black uppercase tracking-[0.04em] text-white/55 transition hover:text-[#FFEA00]"
                          >
                            Tailandesa 1:1
                          </Link>
                        )}

                      </div>

                    </div>

                    {/* DESTAQUE NOVOS MANTOS */}

                    <Link
                      href="/produtos?ordem=LANCAMENTOS"
                      className="
                        group
                        relative
                        block
                        min-h-[220px]
                        cursor-pointer
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-[#111111]
                        transition-all
                        duration-300
                        hover:border-[#FFEA00]/40
                      "
                    >

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,234,0,0.14),transparent_38%)]" />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
                          Destaque
                        </p>

                        <p className="mt-2 text-lg font-black uppercase tracking-tight text-white">
                          Novos mantos
                        </p>

                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
                          Confira os últimos lançamentos
                        </p>

                        <span className="mt-4 inline-block text-[10px] font-black uppercase tracking-[0.15em] text-white transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#FFF000]">
                          Ver lançamentos →
                        </span>

                      </div>

                    </Link>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* MOBILE */}

        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-[#0d0d0d] px-5 py-6 lg:hidden">

            <div className="space-y-7">

              <section>

                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#FFEA00]">
                  TIMES
                </p>

                <div className="grid grid-cols-2 gap-6">

                  {categories.map(
                    (category) => (
                      <div
                        key={
                          category.id
                        }
                      >

                        <Link
                          href={categoryHref(
                            category.id
                          )}
                          onClick={
                            closeMobile
                          }
                          className="text-[11px] font-black uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:text-[#FFF000]"
                        >
                          {
                            category.label
                          }
                        </Link>

                        <div className="mt-3 space-y-2">

                          {(
                            teamsByCategory[
                              category.id
                            ] ||
                            []
                          )
                            .slice(
                              0,
                              8
                            )
                            .map(
                              (
                                team
                              ) => (
                                <Link
                                  key={`${category.id}-${team}`}
                                  href={teamHref(
                                    category.id,
                                    team
                                  )}
                                  onClick={
                                    closeMobile
                                  }
                                  className="
                                    block
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    text-white/35
                                    transition-all
                                    duration-200
                                    hover:translate-x-1
                                    hover:font-black
                                    hover:text-[#FFF000]
                                  "
                                >
                                  {team}
                                </Link>
                              )
                            )}

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* DESTAQUE MOBILE */}

                <Link
                  href="/produtos?tipo=CAMISAS&categoria=Brasileiros"
                  onClick={
                    closeMobile
                  }
                  className="
                    group
                    relative
                    mt-6
                    block
                    min-h-[150px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#FFEA00]/20
                    bg-[#111111]
                  "
                >

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,234,0,0.16),transparent_42%)]" />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-5">

                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
                      Mais vendidos
                    </p>

                    <p className="mt-1 text-base font-black uppercase tracking-tight text-white">
                      Futebol brasileiro
                    </p>

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/45">
                      Garanta o manto do seu time do coração.
                    </p>

                    <span className="mt-3 inline-block text-[9px] font-black uppercase tracking-[0.14em] text-white group-hover:text-[#FFF000]">
                      Ver times brasileiros →
                    </span>

                  </div>

                </Link>

              </section>

              <section className="border-t border-white/[0.06] pt-6">

                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#FFEA00]">
                  PRODUTOS
                </p>

                <div className="grid grid-cols-2 gap-4">

                  <Link
                    href="/produtos?tipo=CAMISAS"
                    onClick={
                      closeMobile
                    }
                    className="text-[12px] font-black uppercase tracking-[0.08em] text-white"
                  >
                    Camisas
                  </Link>

                  <Link
                    href="/produtos?tipo=JAQUETAS"
                    onClick={
                      closeMobile
                    }
                    className="text-[12px] font-black uppercase tracking-[0.08em] text-white"
                  >
                    Jaquetas
                  </Link>

                  <Link
                    href="/produtos?tipo=CONJUNTOS"
                    onClick={
                      closeMobile
                    }
                    className="text-[12px] font-black uppercase tracking-[0.08em] text-white"
                  >
                    Conjuntos
                  </Link>

                  {hasNacional && (
                    <Link
                      href="/produtos?tipo=CAMISAS&modelo=NACIONAL"
                      onClick={
                        closeMobile
                      }
                      className="text-[12px] font-black uppercase tracking-[0.08em] text-white/65"
                    >
                      Nacional Premium
                    </Link>
                  )}

                  {hasTailandesa && (
                    <Link
                      href="/produtos?tipo=CAMISAS&modelo=TAILANDESA"
                      onClick={
                        closeMobile
                      }
                      className="text-[12px] font-black uppercase tracking-[0.08em] text-white/65"
                    >
                      Tailandesa 1:1
                    </Link>
                  )}

                </div>

              </section>

              <div className="flex gap-6 border-t border-white/[0.06] pt-6">

                <Link
                  href="/produtos?ordem=LANCAMENTOS"
                  onClick={
                    closeMobile
                  }
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60"
                >
                  LANÇAMENTOS
                </Link>

                <Link
                  href="/produtos?promocao=1"
                  onClick={
                    closeMobile
                  }
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60"
                >
                  PROMOÇÕES
                </Link>

              </div>

              <Link
                href="/carrinho"
                onClick={
                  closeMobile
                }
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.06]
                  pt-6
                  text-[12px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-white
                "
              >
                <span>
                  IR PARA O CARRINHO
                </span>

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

        <div
          className={
            "h-px w-full transition-opacity duration-500 " +
            (scrolled
              ? "bg-white/[0.08]"
              : "bg-white/[0.04]")
          }
        />

        <StadiumLED />

      </header>

      <div className="h-[118px] w-full" />
    </>
  );
}