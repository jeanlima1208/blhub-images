"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  Save,
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
  custom_time_nome?: string;
  custom_categoria_time?: string;
  site: SiteConfig;
};

const money = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("TODAS");
  const [stockFilter, setStockFilter] = useState("TODOS");

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.detail || "Não foi possível carregar os produtos."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
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
    try {
      setSaving(product.item_code);

      const nextSite = {
        ...product.site,
        ...changes,
      };

      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_code: product.item_code,
          ...nextSite,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.detail || "Não foi possível salvar."
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
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar."
      );
    } finally {
      setSaving(null);
    }
  }

  const categories = useMemo(() => {
    return [
      "TODAS",
      ...Array.from(
        new Set(
          products
            .map((product) => product.custom_categoria_time)
            .filter(Boolean)
        )
      ).sort(),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.item_code.toLowerCase().includes(term) ||
        product.item_name.toLowerCase().includes(term) ||
        (product.custom_time_nome || "")
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        category === "TODAS" ||
        product.custom_categoria_time === category;

      const matchesStock =
        stockFilter === "TODOS" ||
        (stockFilter === "DISPONIVEL" &&
          Number(product.stock || 0) > 0) ||
        (stockFilter === "SEM_ESTOQUE" &&
          Number(product.stock || 0) <= 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [products, search, category, stockFilter]);

  return (
    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFEA00]">
              Catálogo comercial
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Produtos
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Configure a apresentação comercial do site sem alterar o ERPNext.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
              Produtos carregados
            </p>
            <p className="mt-1 text-lg font-black">
              {products.length}
            </p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por código, produto ou time..."
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#FFEA00]/30"
            />
          </div>

          <label className="relative">
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-10 text-xs font-bold uppercase tracking-[0.08em] text-white/60 outline-none focus:border-[#FFEA00]/30"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-[#111]"
                >
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          </label>

          <label className="relative">
            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value)
              }
              className="h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-10 text-xs font-bold uppercase tracking-[0.08em] text-white/60 outline-none focus:border-[#FFEA00]/30"
            >
              <option value="TODOS" className="bg-[#111]">
                Todo estoque
              </option>
              <option value="DISPONIVEL" className="bg-[#111]">
                Com estoque
              </option>
              <option value="SEM_ESTOQUE" className="bg-[#111]">
                Sem estoque
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.025]">
                  <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Produto
                  </th>
                  <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    ERP
                  </th>
                  <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Site
                  </th>
                  <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Promoção
                  </th>
                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Estoque
                  </th>
                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Site
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center"
                    >
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FFEA00]" />
                      <p className="mt-3 text-xs text-white/30">
                        Carregando produtos...
                      </p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-20 text-center"
                    >
                      <PackageIcon />
                      <p className="mt-3 text-xs text-white/30">
                        Nenhum produto encontrado.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.item_code}
                      product={product}
                      saving={saving === product.item_code}
                      onSave={updateProduct}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/[0.07] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
              Exibindo {filteredProducts.length} de {products.length} produtos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  saving,
  onSave,
}: {
  product: Product;
  saving: boolean;
  onSave: (
    product: Product,
    changes: Partial<SiteConfig>
  ) => void;
}) {
  const [sitePrice, setSitePrice] = useState(
    product.site.site_price?.toString() || ""
  );

  const [promoPrice, setPromoPrice] = useState(
    product.site.promotional_price?.toString() || ""
  );

  const savePrices = () => {
    onSave(product, {
      site_price:
        sitePrice.trim() === ""
          ? null
          : Number(sitePrice.replace(",", ".")),
      promotional_price:
        promoPrice.trim() === ""
          ? null
          : Number(promoPrice.replace(",", ".")),
    });
  };

  return (
    <tr className="border-b border-white/[0.05] align-top transition hover:bg-white/[0.015]">
      <td className="px-5 py-5">
        <div className="flex min-w-[280px] items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-[#111]">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[9px] font-black uppercase tracking-widest text-white/15">
                SEM FOTO
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold text-[#FFEA00]/70">
              {product.item_code}
            </p>

            <p className="mt-1 max-w-[330px] text-sm font-bold leading-5 text-white">
              {product.item_name}
            </p>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/25">
              {product.custom_time_nome || "Sem time"}
              {" · "}
              {product.custom_categoria_time || "Sem categoria"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-5">
        <p className="text-sm font-black text-white/70">
          {money(product.price)}
        </p>

        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
          ERPNext
        </p>
      </td>

      <td className="px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="text-white/40">R$</span>

          <input
            value={sitePrice}
            onChange={(event) =>
              setSitePrice(event.target.value)
            }
            onBlur={savePrices}
            placeholder={
              product.price != null
                ? Number(product.price).toFixed(2)
                : "0,00"
            }
            className="w-24 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#FFEA00]/30"
          />

          {saving && (
            <Loader2 className="h-4 w-4 animate-spin text-[#FFEA00]" />
          )}
        </div>

        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
          Preço exclusivo do site
        </p>
      </td>

      <td className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-[#FFEA00]" />

          <span className="text-white/40">R$</span>

          <input
            value={promoPrice}
            onChange={(event) =>
              setPromoPrice(event.target.value)
            }
            onBlur={savePrices}
            placeholder="0,00"
            className="w-24 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#FFEA00]/30"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            onSave(product, {
              promotion_active:
                !product.site.promotion_active,
            })
          }
          className={`mt-2 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition ${
            product.site.promotion_active
              ? "bg-[#FFEA00] text-black"
              : "bg-white/[0.06] text-white/35"
          }`}
        >
          {product.site.promotion_active
            ? "Promoção ativa"
            : "Ativar promoção"}
        </button>
      </td>

      <td className="px-4 py-5 text-center">
        <p
          className={
            Number(product.stock || 0) > 0
              ? "text-sm font-black text-[#00FF66]"
              : "text-sm font-black text-red-400"
          }
        >
          {Number(product.stock || 0)}
        </p>

        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
          unidades
        </p>
      </td>

      <td className="px-4 py-5">
        <div className="space-y-2">
          <ToggleButton
            label="Visível"
            active={product.site.visible}
            onClick={() =>
              onSave(product, {
                visible: !product.site.visible,
              })
            }
            activeIcon={
              product.site.visible ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )
            }
          />

          <ToggleButton
            label="Destaque"
            active={product.site.featured}
            onClick={() =>
              onSave(product, {
                featured: !product.site.featured,
              })
            }
            activeIcon={
              <Star className="h-3.5 w-3.5" />
            }
          />

          <ToggleButton
            label="Lançamento"
            active={product.site.launch}
            onClick={() =>
              onSave(product, {
                launch: !product.site.launch,
              })
            }
            activeIcon={
              <Star className="h-3.5 w-3.5" />
            }
          />
        </div>
      </td>
    </tr>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
  activeIcon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeIcon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition ${
        active
          ? "border-[#FFEA00]/30 bg-[#FFEA00]/10 text-[#FFEA00]"
          : "border-white/[0.06] bg-white/[0.02] text-white/25 hover:text-white/50"
      }`}
    >
      <span>{label}</span>
      {activeIcon}
    </button>
  );
}

function PackageIcon() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/20">
      ?
    </div>
  );
}
