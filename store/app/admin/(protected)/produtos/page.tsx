"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Flame,
  ImagePlus,
  Loader2,
  MoreVertical,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Tag,
  X,
} from "lucide-react";

type SiteConfig = {
  site_price: number | null;
  promotional_price: number | null;
  promotion_active: boolean;
  visible: boolean;
  featured: boolean;
  launch: boolean;
};

type Product = {
  item_code: string;
  item_name: string;
  item_group?: string;
  image?: string | null;
  stock?: number;
  price?: number;
  availableSizes?: string[];
  custom_time_nome?: string;
  custom_categoria_time?: string;
  site: SiteConfig;
};

type Tab = "TODOS" | "ATIVOS" | "SEM_ESTOQUE" | "PROMOCAO";

type SaveState = "idle" | "edited" | "saving" | "saved" | "error";

const money = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function parseSizes(values?: string[]) {
  return (values || []).map((value) => {
    const [size, qty] = value.split("|");

    return {
      size: size || "?",
      qty: Number(qty || 0),
    };
  });
}

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkSaving, setBulkSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("TODAS");
  const [stockFilter, setStockFilter] = useState("TODOS");
  const [tab, setTab] = useState<Tab>("TODOS");

  const [selected, setSelected] = useState<Set<string>>(
    new Set()
  );

  const [drawerProduct, setDrawerProduct] =
    useState<Product | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.detail ||
            "Não foi possível carregar os produtos."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function updateProduct(
    product: Product,
    changes: Partial<SiteConfig>
  ) {
    const response = await fetch("/api/admin/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_code: product.item_code,
        ...changes,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.detail ||
          "Não foi possível salvar o produto."
      );
    }

    setProducts((current) =>
      current.map((item) =>
        item.item_code === product.item_code
          ? {
              ...item,
              site: {
                ...item.site,
                ...changes,
              },
            }
          : item
      )
    );

    return data;
  }

  async function bulkUpdate(
    changes: Partial<SiteConfig>
  ) {
    const itemCodes = Array.from(selected);

    if (!itemCodes.length) return;

    try {
      setBulkSaving(true);

      const response = await fetch(
        "/api/admin/products/bulk",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_codes: itemCodes,
            ...changes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.detail ||
            "Não foi possível aplicar a alteração."
        );
      }

      setProducts((current) =>
        current.map((product) =>
          selected.has(product.item_code)
            ? {
                ...product,
                site: {
                  ...product.site,
                  ...changes,
                },
              }
            : product
        )
      );

      setSelected(new Set());
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível aplicar a alteração."
      );
    } finally {
      setBulkSaving(false);
    }
  }

  const categories = useMemo<string[]>(() => {
    return [
      "TODAS",
      ...Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.custom_categoria_time
            )
            .filter(
              (
                value
              ): value is string =>
                Boolean(value)
            )
        )
      ).sort(),
    ];
  }, [products]);

  const counts = useMemo(() => {
    const total = products.length;

    const active = products.filter(
      (product) => product.site.visible
    ).length;

    const empty = products.filter(
      (product) => Number(product.stock || 0) <= 0
    ).length;

    const promotion = products.filter(
      (product) =>
        product.site.promotion_active
    ).length;

    const customPrice = products.filter(
      (product) =>
        product.site.site_price != null &&
        Number(product.site.site_price) !==
          Number(product.price || 0)
    ).length;

    return {
      total,
      active,
      empty,
      promotion,
      customPrice,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.item_code
          .toLowerCase()
          .includes(term) ||
        product.item_name
          .toLowerCase()
          .includes(term) ||
        (
          product.custom_time_nome || ""
        )
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        category === "TODAS" ||
        product.custom_categoria_time ===
          category;

      const stock = Number(
        product.stock || 0
      );

      const matchesStock =
        stockFilter === "TODOS" ||
        (
          stockFilter === "DISPONIVEL" &&
          stock > 0
        ) ||
        (
          stockFilter ===
            "SEM_ESTOQUE" &&
          stock <= 0
        );

      const matchesTab =
        tab === "TODOS" ||
        (
          tab === "ATIVOS" &&
          product.site.visible
        ) ||
        (
          tab === "SEM_ESTOQUE" &&
          stock <= 0
        ) ||
        (
          tab === "PROMOCAO" &&
          product.site.promotion_active
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesTab
      );
    });
  }, [
    products,
    search,
    category,
    stockFilter,
    tab,
  ]);

  const allFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      selected.has(product.item_code)
    );

  function toggleProduct(
    itemCode: string
  ) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(itemCode)) {
        next.delete(itemCode);
      } else {
        next.add(itemCode);
      }

      return next;
    });
  }

  function toggleAllFiltered() {
    setSelected((current) => {
      const next = new Set(current);

      if (allFilteredSelected) {
        filteredProducts.forEach(
          (product) =>
            next.delete(product.item_code)
        );
      } else {
        filteredProducts.forEach(
          (product) =>
            next.add(product.item_code)
        );
      }

      return next;
    });
  }

  function selectOutOfStock() {
    setSelected(
      new Set(
        filteredProducts
          .filter(
            (product) =>
              Number(product.stock || 0) <= 0
          )
          .map(
            (product) => product.item_code
          )
      )
    );
  }

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1680px]">
        <PageHeader
          total={counts.total}
          onRefresh={loadProducts}
          refreshing={loading}
        />

        <Kpis
          counts={counts}
        />

        <StatusTabs
          tab={tab}
          setTab={setTab}
          counts={counts}
        />

        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          categories={categories}
          onSelectOutOfStock={
            selectOutOfStock
          }
        />

        {selected.size > 0 && (
          <BulkActionBar
            count={selected.size}
            loading={bulkSaving}
            onClear={() =>
              setSelected(new Set())
            }
            onHide={() =>
              bulkUpdate({
                visible: false,
              })
            }
            onShow={() =>
              bulkUpdate({
                visible: true,
              })
            }
            onFeatured={() =>
              bulkUpdate({
                featured: true,
              })
            }
            onLaunch={() =>
              bulkUpdate({
                launch: true,
              })
            }
            onPromotion={() =>
              bulkUpdate({
                promotion_active: true,
              })
            }
          />
        )}

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#09090b] shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.018]">
                  <th className="w-12 px-4 py-3">
                    <CheckBox
                      checked={
                        allFilteredSelected
                      }
                      onClick={
                        toggleAllFiltered
                      }
                    />
                  </th>

                  <TableHead>
                    Produto
                  </TableHead>

                  <TableHead>
                    Preço
                  </TableHead>

                  <TableHead>
                    Promoção
                  </TableHead>

                  <TableHead>
                    Estoque
                  </TableHead>

                  <TableHead>
                    Vitrine
                  </TableHead>

                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <LoadingRows />
                ) : filteredProducts.length ===
                  0 ? (
                  <EmptyState />
                ) : (
                  filteredProducts.map(
                    (product) => (
                      <ProductRow
                        key={
                          product.item_code
                        }
                        product={product}
                        selected={selected.has(
                          product.item_code
                        )}
                        onSelect={() =>
                          toggleProduct(
                            product.item_code
                          )
                        }
                        onSave={updateProduct}
                        onOpen={() =>
                          setDrawerProduct(
                            product
                          )
                        }
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="flex min-h-11 items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-zinc-600">
              Exibindo{" "}
              {filteredProducts.length} de{" "}
              {products.length}
            </p>

            {selected.size > 0 && (
              <p className="text-[9px] font-black uppercase tracking-[0.11em] text-[#FFEA00]">
                {selected.size} selecionados
              </p>
            )}
          </div>
        </div>
      </div>

      {drawerProduct && (
        <ProductDrawer
          product={drawerProduct}
          onClose={() =>
            setDrawerProduct(null)
          }
          onSave={updateProduct}
        />
      )}
    </div>
  );
}

function PageHeader({
  total,
  onRefresh,
  refreshing,
}: {
  total: number;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
            Catálogo comercial
          </p>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2 py-0.5 text-[8px] font-black text-zinc-500">
            {total} PRODUTOS
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Produtos
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Controle da vitrine, preços e disponibilidade.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-[9px] font-black uppercase tracking-[0.11em] text-zinc-400 transition hover:border-white/[0.15] hover:text-white disabled:opacity-40"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${
            refreshing ? "animate-spin" : ""
          }`}
        />
        Atualizar
      </button>
    </div>
  );
}

function Kpis({
  counts,
}: {
  counts: {
    total: number;
    active: number;
    empty: number;
    promotion: number;
    customPrice: number;
  };
}) {
  const activePercent =
    counts.total > 0
      ? Math.round(
          (counts.active /
            counts.total) *
            100
        )
      : 0;

  return (
    <div className="mb-5 grid grid-cols-2 gap-2 xl:grid-cols-4">
      <Kpi
        label="Ativos no site"
        value={counts.active}
        detail={`${activePercent}% da base`}
        icon={
          <Eye className="h-4 w-4" />
        }
      />

      <Kpi
        label="Sem estoque"
        value={counts.empty}
        detail="requer atenção"
        alert={counts.empty > 0}
        icon={
          <Package className="h-4 w-4" />
        }
      />

      <Kpi
        label="Preço exclusivo"
        value={counts.customPrice}
        detail="diferente do ERP"
        icon={
          <Tag className="h-4 w-4" />
        }
      />

      <Kpi
        label="Em promoção"
        value={counts.promotion}
        detail="campanhas ativas"
        icon={
          <Flame className="h-4 w-4" />
        }
      />
    </div>
  );
}

function Kpi({
  label,
  value,
  detail,
  icon,
  alert,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#09090b] px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-600">
          {label}
        </p>

        <span
          className={
            alert
              ? "text-red-400"
              : "text-zinc-600"
          }
        >
          {icon}
        </span>
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span
          className={`text-2xl font-black tracking-tight ${
            alert
              ? "text-red-300"
              : "text-white"
          }`}
        >
          {value}
        </span>

        <span className="pb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-700">
          {detail}
        </span>
      </div>
    </div>
  );
}

function StatusTabs({
  tab,
  setTab,
  counts,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  counts: {
    total: number;
    active: number;
    empty: number;
    promotion: number;
  };
}) {
  const tabs: {
    key: Tab;
    label: string;
    count: number;
  }[] = [
    {
      key: "TODOS",
      label: "Todos",
      count: counts.total,
    },
    {
      key: "ATIVOS",
      label: "Ativos",
      count: counts.active,
    },
    {
      key: "SEM_ESTOQUE",
      label: "Sem estoque",
      count: counts.empty,
    },
    {
      key: "PROMOCAO",
      label: "Promoções",
      count: counts.promotion,
    },
  ];

  return (
    <div className="mb-4 flex items-center gap-1 overflow-x-auto border-b border-white/[0.06]">
      {tabs.map((item) => (
        <button
          type="button"
          key={item.key}
          onClick={() =>
            setTab(item.key)
          }
          className={`relative flex h-11 shrink-0 items-center gap-2 px-4 text-[9px] font-black uppercase tracking-[0.11em] transition ${
            tab === item.key
              ? "text-[#FFEA00]"
              : "text-zinc-600 hover:text-zinc-300"
          }`}
        >
          {item.label}

          <span
            className={`rounded-full px-1.5 py-0.5 text-[8px] ${
              tab === item.key
                ? "bg-[#FFEA00]/10 text-[#FFEA00]"
                : "bg-white/[0.04] text-zinc-700"
            }`}
          >
            {item.count}
          </span>

          {tab === item.key && (
            <span className="absolute inset-x-3 bottom-[-1px] h-0.5 rounded-full bg-[#FFEA00]" />
          )}
        </button>
      ))}
    </div>
  );
}

function Filters({
  search,
  setSearch,
  category,
  setCategory,
  stockFilter,
  setStockFilter,
  categories,
  onSelectOutOfStock,
}: {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
  categories: string[];
  onSelectOutOfStock: () => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 xl:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-700" />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Buscar produto, código ou time..."
          className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#09090b] pl-10 pr-4 text-xs text-white outline-none placeholder:text-zinc-700 transition focus:border-[#FFEA00]/40"
        />
      </div>

      <FilterSelect
        value={category}
        onChange={setCategory}
        options={categories}
        width="w-full xl:w-[210px]"
      />

      <FilterSelect
        value={stockFilter}
        onChange={setStockFilter}
        options={[
          "TODOS",
          "DISPONIVEL",
          "SEM_ESTOQUE",
        ]}
        labels={{
          TODOS: "Todo estoque",
          DISPONIVEL: "Com estoque",
          SEM_ESTOQUE: "Sem estoque",
        }}
        width="w-full xl:w-[170px]"
      />

      <button
        type="button"
        onClick={onSelectOutOfStock}
        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 text-[8px] font-black uppercase tracking-[0.1em] text-red-300/60 transition hover:border-red-400/20 hover:text-red-300"
      >
        <EyeOff className="h-3.5 w-3.5" />
        Selecionar sem estoque
      </button>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  labels,
  width,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
  width: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${width}`}>
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex h-11 w-full items-center justify-between rounded-xl border border-white/[0.07] bg-[#09090b] px-4 text-[8px] font-black uppercase tracking-[0.1em] text-zinc-500 outline-none transition hover:border-white/[0.12] hover:text-zinc-300"
      >
        <span>
          {labels?.[value] || value}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 transition ${
            open
              ? "rotate-180 text-[#FFEA00]"
              : "text-zinc-700"
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-white/[0.09] bg-[#111113] p-1 shadow-2xl shadow-black/50">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.1em] transition ${
                option === value
                  ? "bg-[#FFEA00]/10 text-[#FFEA00]"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {labels?.[option] ||
                option}

              {option === value && (
                <Check className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkActionBar({
  count,
  loading,
  onClear,
  onHide,
  onShow,
  onFeatured,
  onLaunch,
  onPromotion,
}: {
  count: number;
  loading: boolean;
  onClear: () => void;
  onHide: () => void;
  onShow: () => void;
  onFeatured: () => void;
  onLaunch: () => void;
  onPromotion: () => void;
}) {
  return (
    <div className="sticky top-2 z-30 mb-3 rounded-xl border border-[#FFEA00]/15 bg-[#111108]/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFEA00] text-black">
            <Check className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-black text-white">
              {count} selecionados
            </p>

            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-600">
              Ações em lote
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <BulkAction
            icon={
              <EyeOff className="h-3.5 w-3.5" />
            }
            label="Ocultar"
            onClick={onHide}
            loading={loading}
          />

          <BulkAction
            icon={
              <Eye className="h-3.5 w-3.5" />
            }
            label="Mostrar"
            onClick={onShow}
            loading={loading}
          />

          <BulkAction
            icon={
              <Star className="h-3.5 w-3.5" />
            }
            label="Destaque"
            onClick={onFeatured}
            loading={loading}
          />

          <BulkAction
            icon={
              <Flame className="h-3.5 w-3.5" />
            }
            label="Lançamento"
            onClick={onLaunch}
            loading={loading}
          />

          <BulkAction
            icon={
              <Tag className="h-3.5 w-3.5" />
            }
            label="Promoção"
            onClick={onPromotion}
            loading={loading}
          />

          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[8px] font-black uppercase tracking-[0.1em] text-zinc-700 transition hover:bg-white/[0.04] hover:text-zinc-400 disabled:opacity-40"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkAction({
  icon,
  label,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 text-[8px] font-black uppercase tracking-[0.09em] text-zinc-500 transition hover:border-[#FFEA00]/20 hover:bg-[#FFEA00]/[0.04] hover:text-[#FFEA00] disabled:opacity-40"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        icon
      )}

      {label}
    </button>
  );
}

function CheckBox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        checked
          ? "Desmarcar todos"
          : "Selecionar todos"
      }
      className={`flex h-4 w-4 items-center justify-center rounded-[5px] border transition ${
        checked
          ? "border-[#FFEA00] bg-[#FFEA00] text-black"
          : "border-white/15 bg-transparent hover:border-white/30"
      }`}
    >
      {checked && (
        <Check className="h-3 w-3" />
      )}
    </button>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-3 py-3 text-left text-[8px] font-black uppercase tracking-[0.15em] text-zinc-700">
      {children}
    </th>
  );
}

function ProductRow({
  product,
  selected,
  onSelect,
  onSave,
  onOpen,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onSave: (
    product: Product,
    changes: Partial<SiteConfig>
  ) => Promise<unknown>;
  onOpen: () => void;
}) {
  const [sitePrice, setSitePrice] =
    useState(
      product.site.site_price != null
        ? String(
            product.site.site_price
          )
        : ""
    );

  const [promoPrice, setPromoPrice] =
    useState(
      product.site.promotional_price !=
        null
        ? String(
            product.site
              .promotional_price
          )
        : ""
    );

  const [
    sitePriceState,
    setSitePriceState,
  ] = useState<SaveState>("idle");

  const [
    promoPriceState,
    setPromoPriceState,
  ] = useState<SaveState>("idle");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const siteTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const promoTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  useEffect(() => {
    return () => {
      if (siteTimer.current)
        clearTimeout(siteTimer.current);

      if (promoTimer.current)
        clearTimeout(
          promoTimer.current
        );
    };
  }, []);

  useEffect(() => {
    setSitePrice(
      product.site.site_price != null
        ? String(
            product.site.site_price
          )
        : ""
    );

    setPromoPrice(
      product.site
        .promotional_price != null
        ? String(
            product.site
              .promotional_price
          )
        : ""
    );
  }, [
    product.site.site_price,
    product.site.promotional_price,
  ]);

  function scheduleSitePriceSave(
    value: string
  ) {
    setSitePrice(value);
    setSitePriceState("edited");

    if (siteTimer.current) {
      clearTimeout(siteTimer.current);
    }

    siteTimer.current = setTimeout(
      async () => {
        try {
          setSitePriceState("saving");

          await onSave(product, {
            site_price:
              value.trim() === ""
                ? null
                : Number(
                    value.replace(
                      ",",
                      "."
                    )
                  ),
          });

          setSitePriceState("saved");

          window.setTimeout(
            () =>
              setSitePriceState(
                "idle"
              ),
            1600
          );
        } catch {
          setSitePriceState(
            "error"
          );
        }
      },
      700
    );
  }

  function schedulePromoSave(
    value: string
  ) {
    setPromoPrice(value);
    setPromoPriceState("edited");

    if (promoTimer.current) {
      clearTimeout(
        promoTimer.current
      );
    }

    promoTimer.current = setTimeout(
      async () => {
        try {
          setPromoPriceState(
            "saving"
          );

          await onSave(product, {
            promotional_price:
              value.trim() === ""
                ? null
                : Number(
                    value.replace(
                      ",",
                      "."
                    )
                  ),
          });

          setPromoPriceState(
            "saved"
          );

          window.setTimeout(
            () =>
              setPromoPriceState(
                "idle"
              ),
            1600
          );
        } catch {
          setPromoPriceState(
            "error"
          );
        }
      },
      700
    );
  }

  const stock = Number(
    product.stock || 0
  );

  const sizes = parseSizes(
    product.availableSizes
  );

  const statusClass =
    stock > 0
      ? "text-[#00FF66]"
      : "text-red-400";

  return (
    <tr
      className={`group border-b border-white/[0.045] transition ${
        selected
          ? "bg-[#FFEA00]/[0.025]"
          : "hover:bg-white/[0.014]"
      }`}
    >
      <td className="px-4 py-3.5 align-middle">
        <CheckBox
          checked={selected}
          onClick={onSelect}
        />
      </td>

      <td className="px-3 py-3.5">
        <div className="flex min-w-[360px] items-center gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="group/photo relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-[#111113]"
          >
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt=""
                className="h-full w-full object-cover transition group-hover/photo:scale-105"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-zinc-700">
                <ImagePlus className="h-4 w-4" />
                <span className="text-[6px] font-black uppercase tracking-[0.08em]">
                  Foto
                </span>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover/photo:opacity-100">
              <ImagePlus className="h-4 w-4 text-white" />
            </div>
          </button>

          <button
            type="button"
            onClick={onOpen}
            className="min-w-0 text-left"
          >
            <p className="font-mono text-[8px] font-bold text-[#FFEA00]/60">
              {product.item_code}
            </p>

            <p className="mt-0.5 max-w-[300px] truncate text-xs font-bold text-white/90">
              {product.item_name}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-zinc-600">
                {product.custom_time_nome ||
                  "Sem time"}
              </span>

              <span className="text-zinc-800">
                •
              </span>

              <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-zinc-700">
                {product.custom_categoria_time ||
                  "Sem categoria"}
              </span>
            </div>
          </button>
        </div>
      </td>

      <td className="px-3 py-3.5">
        <div className="space-y-1.5">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.08em] text-zinc-700">
              ERP
            </p>
            <p className="text-[11px] font-black text-zinc-400">
              {money(product.price)}
            </p>
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.08em] text-[#FFEA00]/50">
              Site
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-700">
                R$
              </span>

              <input
                value={sitePrice}
                onChange={(event) =>
                  scheduleSitePriceSave(
                    event.target.value
                  )
                }
                className="h-8 w-[82px] rounded-md border border-[#27272a] bg-[#111113] px-2 text-[10px] font-black text-white outline-none transition focus:border-yellow-400"
                inputMode="decimal"
              />

              <SaveIndicator
                state={
                  sitePriceState
                }
              />
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.08em] text-zinc-700">
              Promo
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-700">
                R$
              </span>

              <input
                value={promoPrice}
                onChange={(event) =>
                  schedulePromoSave(
                    event.target.value
                  )
                }
                placeholder="0,00"
                className="h-8 w-[82px] rounded-md border border-[#27272a] bg-[#111113] px-2 text-[10px] font-black text-white outline-none transition focus:border-yellow-400 placeholder:text-zinc-800"
                inputMode="decimal"
              />

              <SaveIndicator
                state={
                  promoPriceState
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await onSave(product, {
                  promotion_active:
                    !product.site
                      .promotion_active,
                });
              } catch {
                // O erro já é apresentado pela camada de save.
              }
            }}
            className={`mt-4 h-7 rounded-full px-2.5 text-[7px] font-black uppercase tracking-[0.08em] transition ${
              product.site
                .promotion_active
                ? "bg-[#FFEA00] text-black"
                : "border border-white/[0.07] bg-white/[0.02] text-zinc-600 hover:text-zinc-300"
            }`}
          >
            {product.site
              .promotion_active
              ? "ATIVA"
              : "ATIVAR"}
          </button>
        </div>
      </td>

      <td className="px-3 py-3.5">
        <StockPopover
          stock={stock}
          sizes={sizes}
          className={statusClass}
        />
      </td>

      <td className="px-3 py-3.5">
        <div className="flex items-center gap-1.5">
          <MiniToggle
            title={
              product.site.visible
                ? "Visível no site"
                : "Oculto no site"
            }
            active={
              product.site.visible
            }
            onClick={() =>
              onSave(product, {
                visible:
                  !product.site
                    .visible,
              })
            }
            icon={
              product.site.visible ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )
            }
          />

          <MiniToggle
            title={
              product.site.featured
                ? "Destaque ativo"
                : "Marcar como destaque"
            }
            active={
              product.site.featured
            }
            onClick={() =>
              onSave(product, {
                featured:
                  !product.site
                    .featured,
              })
            }
            icon={
              <Star className="h-3.5 w-3.5" />
            }
          />

          <MiniToggle
            title={
              product.site.launch
                ? "Lançamento ativo"
                : "Marcar como lançamento"
            }
            active={
              product.site.launch
            }
            onClick={() =>
              onSave(product, {
                launch:
                  !product.site
                    .launch,
              })
            }
            icon={
              <Flame className="h-3.5 w-3.5" />
            }
          />
        </div>

        <div
          className="mt-2 inline-flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.08em] text-zinc-600"
          title="Dados deste produto foram carregados do ERPNext"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF66]" />
          ERP
        </div>
      </td>

      <td className="px-3 py-3.5">
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-white/[0.04] hover:text-white"
            aria-label="Ações do produto"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <ProductMenu
              product={product}
              onClose={() =>
                setMenuOpen(false)
              }
              onOpen={onOpen}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function SaveIndicator({
  state,
}: {
  state: SaveState;
}) {
  if (state === "edited") {
    return (
      <span className="text-[7px] font-black uppercase tracking-[0.06em] text-[#FFEA00]/70">
        Editado
      </span>
    );
  }

  if (state === "saving") {
    return (
      <Loader2 className="h-3 w-3 animate-spin text-[#FFEA00]" />
    );
  }

  if (state === "saved") {
    return (
      <Check className="h-3 w-3 text-[#00FF66]" />
    );
  }

  if (state === "error") {
    return (
      <X className="h-3 w-3 text-red-400" />
    );
  }

  return null;
}

function StockPopover({
  stock,
  sizes,
  className,
}: {
  stock: number;
  sizes: {
    size: string;
    qty: number;
  }[];
  className: string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() =>
          setOpen(true)
        }
        onMouseLeave={() =>
          setOpen(false)
        }
        onClick={() =>
          setOpen((current) => !current)
        }
        className="group text-left"
      >
        <p
          className={`text-sm font-black ${className}`}
        >
          {stock}
          <span className="ml-1 text-[8px] font-bold uppercase text-zinc-700">
            UN
          </span>
        </p>

        <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.08em] text-zinc-700 group-hover:text-zinc-500">
          Ver grade
        </p>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[-12px] z-40 w-48 -translate-y-full rounded-xl border border-white/[0.09] bg-[#111113] p-3 shadow-2xl shadow-black/50"
          onMouseEnter={() =>
            setOpen(true)
          }
          onMouseLeave={() =>
            setOpen(false)
          }
        >
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-600">
            Estoque por tamanho
          </p>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {sizes.length > 0 ? (
              sizes.map(
                ({
                  size,
                  qty,
                }) => (
                  <div
                    key={size}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-2 text-center"
                  >
                    <p className="text-[8px] font-black text-zinc-600">
                      {size}
                    </p>

                    <p
                      className={`mt-0.5 text-xs font-black ${
                        qty > 0
                          ? "text-white"
                          : "text-red-400/60"
                      }`}
                    >
                      {qty}
                    </p>
                  </div>
                )
              )
            ) : (
              <div className="col-span-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center">
                <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-zinc-700">
                  Grade indisponível
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-zinc-700">
              Total
            </span>

            <span className="text-[10px] font-black text-white">
              {stock} UN
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniToggle({
  title,
  active,
  onClick,
  icon,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        active
          ? "border-[#FFEA00]/20 bg-[#FFEA00]/[0.08] text-[#FFEA00]"
          : "border-white/[0.06] bg-white/[0.015] text-zinc-700 hover:text-zinc-300"
      }`}
    >
      {icon}
    </button>
  );
}

function ProductMenu({
  product,
  onClose,
  onOpen,
}: {
  product: Product;
  onClose: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-white/[0.09] bg-[#111113] p-1.5 shadow-2xl shadow-black/50">
      <Link
        href={`/produto/${encodeURIComponent(
          product.item_code
        )}`}
        target="_blank"
        onClick={onClose}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[8px] font-black uppercase tracking-[0.08em] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
      >
        <Eye className="h-3.5 w-3.5" />
        Visualizar no site
      </Link>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpen();
        }}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.08em] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
      >
        <Package className="h-3.5 w-3.5" />
        Abrir detalhes
      </button>

      <div className="my-1 border-t border-white/[0.05]" />

      <button
        type="button"
        disabled
        title="Endpoint de duplicação ainda não foi implementado no backend"
        className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.08em] text-zinc-800"
      >
        Duplicar produto
      </button>

      <button
        type="button"
        disabled
        title="Endpoint de re-sync ainda não foi implementado no backend"
        className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[8px] font-black uppercase tracking-[0.08em] text-zinc-800"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Forçar re-sync
      </button>
    </div>
  );
}

function ProductDrawer({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (
    product: Product,
    changes: Partial<SiteConfig>
  ) => Promise<unknown>;
}) {
  const [saving, setSaving] =
    useState(false);

  const sizes = parseSizes(
    product.availableSizes
  );

  async function toggle(
    changes: Partial<SiteConfig>
  ) {
    try {
      setSaving(true);
      await onSave(product, changes);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-white/[0.08] bg-[#09090b] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div>
            <p className="font-mono text-[8px] font-bold text-[#FFEA00]/60">
              {product.item_code}
            </p>

            <h2 className="mt-1 max-w-[340px] text-lg font-black text-white">
              {product.item_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-600 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111113]">
            <div className="aspect-[4/3] bg-black/30">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-700">
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-[8px] font-black uppercase tracking-[0.12em]">
                    Adicionar foto
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <InfoBlock
              label="Time"
              value={
                product.custom_time_nome ||
                "Sem time"
              }
            />

            <InfoBlock
              label="Categoria"
              value={
                product.custom_categoria_time ||
                "Sem categoria"
              }
            />

            <InfoBlock
              label="Grupo"
              value={
                product.item_group ||
                "—"
              }
            />

            <InfoBlock
              label="Estoque"
              value={`${Number(
                product.stock || 0
              )} UN`}
            />
          </div>

          <section className="mt-5">
            <SectionLabel>
              Preços
            </SectionLabel>

            <div className="mt-2 space-y-2">
              <PriceLine
                label="ERPNext"
                value={money(
                  product.price
                )}
              />

              <PriceLine
                label="Site"
                value={
                  product.site
                    .site_price != null
                    ? money(
                        product.site
                          .site_price
                      )
                    : "Não definido"
                }
                highlight
              />

              <PriceLine
                label="Promocional"
                value={
                  product.site
                    .promotional_price !=
                  null
                    ? money(
                        product.site
                          .promotional_price
                      )
                    : "Não definido"
                }
              />
            </div>
          </section>

          <section className="mt-5">
            <SectionLabel>
              Grade
            </SectionLabel>

            <div className="mt-2 grid grid-cols-4 gap-2">
              {sizes.length > 0 ? (
                sizes.map(
                  ({
                    size,
                    qty,
                  }) => (
                    <div
                      key={size}
                      className="rounded-xl border border-white/[0.07] bg-[#111113] p-3 text-center"
                    >
                      <p className="text-[8px] font-black uppercase text-zinc-700">
                        {size}
                      </p>

                      <p
                        className={`mt-1 text-lg font-black ${
                          qty > 0
                            ? "text-white"
                            : "text-red-400/50"
                        }`}
                      >
                        {qty}
                      </p>
                    </div>
                  )
                )
              ) : (
                <div className="col-span-4 rounded-xl border border-white/[0.06] bg-[#111113] p-4 text-center text-[8px] font-black uppercase tracking-[0.1em] text-zinc-700">
                  Grade indisponível
                </div>
              )}
            </div>
          </section>

          <section className="mt-5">
            <SectionLabel>
              Vitrine
            </SectionLabel>

            <div className="mt-2 space-y-2">
              <DrawerToggle
                icon={
                  product.site.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )
                }
                label="Visível no site"
                active={
                  product.site.visible
                }
                loading={saving}
                onClick={() =>
                  toggle({
                    visible:
                      !product.site
                        .visible,
                  })
                }
              />

              <DrawerToggle
                icon={
                  <Star className="h-4 w-4" />
                }
                label="Destaque"
                active={
                  product.site.featured
                }
                loading={saving}
                onClick={() =>
                  toggle({
                    featured:
                      !product.site
                        .featured,
                  })
                }
              />

              <DrawerToggle
                icon={
                  <Flame className="h-4 w-4" />
                }
                label="Lançamento"
                active={
                  product.site.launch
                }
                loading={saving}
                onClick={() =>
                  toggle({
                    launch:
                      !product.site
                        .launch,
                  })
                }
              />

              <DrawerToggle
                icon={
                  <Tag className="h-4 w-4" />
                }
                label="Promoção"
                active={
                  product.site
                    .promotion_active
                }
                loading={saving}
                onClick={() =>
                  toggle({
                    promotion_active:
                      !product.site
                        .promotion_active,
                  })
                }
              />
            </div>
          </section>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-[#00FF66]" />

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-500">
                Integração ERP
              </p>

              <p className="mt-0.5 text-[9px] font-bold text-zinc-700">
                Dados carregados do ERPNext
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111113] px-3 py-3">
      <p className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1 truncate text-[10px] font-bold text-zinc-400">
        {value}
      </p>
    </div>
  );
}

function PriceLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111113] px-4 py-3">
      <span
        className={`text-[8px] font-black uppercase tracking-[0.1em] ${
          highlight
            ? "text-[#FFEA00]/70"
            : "text-zinc-700"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xs font-black ${
          highlight
            ? "text-white"
            : "text-zinc-500"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#FFEA00]/60">
      {children}
    </p>
  );
}

function DrawerToggle({
  icon,
  label,
  active,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
        active
          ? "border-[#FFEA00]/15 bg-[#FFEA00]/[0.05] text-[#FFEA00]"
          : "border-white/[0.06] bg-[#111113] text-zinc-700 hover:text-zinc-300"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.08em]">
          {label}
        </span>
      </span>

      <span
        className={`h-5 w-9 rounded-full p-0.5 ${
          active
            ? "bg-[#FFEA00]"
            : "bg-zinc-800"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full transition ${
            active
              ? "translate-x-4 bg-black"
              : "translate-x-0 bg-zinc-600"
          }`}
        />
      </span>
    </button>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({
        length: 7,
      }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-white/[0.045]"
        >
          <td className="px-4 py-5">
            <div className="h-4 w-4 animate-pulse rounded bg-white/[0.05]" />
          </td>

          <td
            colSpan={6}
            className="px-3 py-5"
          >
            <div className="h-7 animate-pulse rounded bg-white/[0.025]" />
          </td>
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={7}
        className="px-6 py-20 text-center"
      >
        <Package className="mx-auto h-8 w-8 text-zinc-800" />

        <p className="mt-3 text-xs font-bold text-zinc-600">
          Nenhum produto encontrado.
        </p>

        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em] text-zinc-800">
          Tente alterar os filtros.
        </p>
      </td>
    </tr>
  );
}
