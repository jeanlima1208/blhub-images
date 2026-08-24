"use client";

import Link from "next/link";
import {
useEffect,
useMemo,
useState,
} from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/services/products";

type Props = {
products: Product[];
bestSellers: Product[];
};

type Quality =
| "TODOS"
| "TAILANDESA"
| "NACIONAL";

type SortOption =
| "RELEVANCIA"
| "MENOR_PRECO"
| "MAIOR_PRECO"
| "MAIS_VENDIDOS"
| "LANCAMENTOS";

const sizes = [
"P",
"M",
"G",
"GG",
"G1",
"G2",
"G3",
"G4",
];

const categories = [
{
id: "Brasileiros",
label: "Times Nacionais",
},
{
id: "Europeus",
label: "Times Europeus",
},
{
id: "Seleções",
label: "Seleções",
},
{
id: "Outros",
label: "Outros Continentes",
},
];

const normalizeItemGroup = (
value?: string | null
) => {
return String(value || "")
.trim()
.toUpperCase();
};

const getProductType = (
product: Product
) => {
const group = normalizeItemGroup(
product.item_group
);

if (
group === "CAMISAS" ||
group === "CAMISA"
) {
return "CAMISAS";
}

if (
group === "JAQUETAS" ||
group === "JAQUETA"
) {
return "JAQUETAS";
}

if (
group === "CONJUNTOS" ||
group === "CONJUNTO"
) {
return "CONJUNTOS";
}

return group;
};

const getProductQuality = (
product: Product
): Quality | null => {
if (
getProductType(product) !==
"CAMISAS"
) {
return null;
}

const name =
product.item_name?.toUpperCase() || "";

if (name.includes("TAILANDESA")) {
return "TAILANDESA";
}

return "NACIONAL";
};

export default function CatalogClient({
products,
bestSellers,
}: Props) {
const searchParams = useSearchParams();

const CUSTOMER_INSTALLMENT_RATE_3X = 0.11225;



const categoriaParam =
  searchParams.get("categoria");

const tipoParam =
  searchParams.get("tipo");

const modeloParam =
  searchParams.get("modelo");

const timeParam =
  searchParams.get("time");

const buscaParam =
  searchParams.get("busca");

const [search, setSearch] =
useState("");

const [selectedTypes, setSelectedTypes] =
useState<string[]>([]);

const [selectedCategories, setSelectedCategories] =
useState<string[]>([]);

const [selectedTeams, setSelectedTeams] =
useState<string[]>([]);

const [selectedQuality, setSelectedQuality] =
useState<Quality>("TODOS");

const [selectedSizes, setSelectedSizes] =
useState<string[]>([]);

const [selectedGender, setSelectedGender] =
useState<string[]>([]);

const [maxPrice, setMaxPrice] =
useState(200);

const [sort, setSort] =
useState<SortOption>("RELEVANCIA");

const [visibleCount, setVisibleCount] =
useState(20);

const availableTeams = useMemo(() => {
const teams = new Set<string>();

products.forEach((product) => {
  const team =
    product.custom_time_nome?.trim();

  if (team) {
    teams.add(team);
  }
});

return Array.from(teams).sort(
  (a, b) =>
    a.localeCompare(b, "pt-BR")
);

}, [products]);

// ==========================================================
// CATEGORIA RECEBIDA PELA URL
// ==========================================================

useEffect(() => {
if (!categoriaParam) {
setSelectedCategories([]);
return;
}

const categoria = categories.find(
  (item) =>
    item.id.toLowerCase() ===
    categoriaParam.toLowerCase()
);

if (categoria) {
  setSelectedCategories([
    categoria.id,
  ]);
} else {
  setSelectedCategories([]);
}

}, [categoriaParam]);

// ==========================================================
// TIPO RECEBIDO PELA URL
// ==========================================================

useEffect(() => {
if (!tipoParam) {
setSelectedTypes([]);
return;
}

const tipo =
  tipoParam.trim().toUpperCase();

if (
  tipo === "CAMISAS" ||
  tipo === "JAQUETAS" ||
  tipo === "CONJUNTOS"
) {
  setSelectedTypes([tipo]);
} else {
  setSelectedTypes([]);
}

}, [tipoParam]);

// ==========================================================
// MODELO RECEBIDO PELA URL
// ==========================================================

useEffect(() => {
if (!modeloParam) {
setSelectedQuality("TODOS");
return;
}

const modelo =
  modeloParam.trim().toUpperCase();

if (
  modelo === "TAILANDESA" ||
  modelo === "NACIONAL"
) {
  setSelectedQuality(
    modelo as Quality
  );
} else {
  setSelectedQuality("TODOS");
}

}, [modeloParam]);

// ==========================================================
// TIME RECEBIDO PELA URL
// ==========================================================

useEffect(() => {
if (!timeParam) {
setSelectedTeams([]);
return;
}

const team = timeParam.trim();

const exists = availableTeams.some(
  (item) =>
    item.toLowerCase() ===
    team.toLowerCase()
);

if (exists) {
  const realTeam =
    availableTeams.find(
      (item) =>
        item.toLowerCase() ===
        team.toLowerCase()
    );

  setSelectedTeams(
    realTeam ? [realTeam] : []
  );
} else {
  setSelectedTeams([]);
}

}, [
timeParam,
availableTeams,
]);

useEffect(() => {
  setSearch(buscaParam || "");
}, [buscaParam]);
// ==========================================================
// ORDEM DOS MAIS VENDIDOS
// ==========================================================

const bestSellerOrder = useMemo(() => {
const map =
new Map<string, number>();

bestSellers.forEach(
  (product, index) => {
    if (!product.item_code) {
      return;
    }

    map.set(
      product.item_code,
      index
    );
  }
);

return map;

}, [bestSellers]);

// ==========================================================
// FILTROS
// ==========================================================

const toggleType = (
type: string
) => {
setSelectedTypes((current) =>
current.includes(type)
? current.filter(
(item) => item !== type
)
: [...current, type]
);
};

const toggleCategory = (
category: string
) => {
setSelectedCategories(
(current) =>
current.includes(category)
? current.filter(
(item) => item !== category
)
: [...current, category]
);
};

const toggleTeam = (
team: string
) => {
setSelectedTeams((current) =>
current.includes(team)
? current.filter(
(item) => item !== team
)
: [...current, team]
);
};

const toggleSize = (
size: string
) => {
setSelectedSizes((current) =>
current.includes(size)
? current.filter(
(item) => item !== size
)
: [...current, size]
);
};

const toggleGender = (
gender: string
) => {
setSelectedGender(
(current) =>
current.includes(gender)
? current.filter(
(item) => item !== gender
)
: [...current, gender]
);
};

// ==========================================================
// PRODUTOS FILTRADOS
// ==========================================================

const filteredProducts = useMemo(() => {
const query =
search.trim().toUpperCase();

const result = products.filter(
  (product) => {
    // SOMENTE PRODUTOS COM ESTOQUE

    if (
      Number(product.stock || 0) <= 0
    ) {
      return false;
    }

    // BUSCA

    const name =
      product.item_name?.toUpperCase() ||
      "";

    const code =
      product.item_code?.toUpperCase() ||
      "";

    const team =
      product.custom_time_nome?.toUpperCase() ||
      "";

    if (
      query &&
      !name.includes(query) &&
      !code.includes(query) &&
      !team.includes(query)
    ) {
      return false;
    }

    // TIPO

    if (
      selectedTypes.length > 0 &&
      !selectedTypes.includes(
        getProductType(product)
      )
    ) {
      return false;
    }

    // CATEGORIA

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(
        product.custom_categoria_time?.trim() ||
          ""
      )
    ) {
      return false;
    }

    // TIME

    if (
      selectedTeams.length > 0 &&
      !selectedTeams.includes(
        product.custom_time_nome?.trim() ||
          ""
      )
    ) {
      return false;
    }

    // QUALIDADE / MODELO

    if (
      selectedQuality !== "TODOS" &&
      getProductQuality(product) !==
        selectedQuality
    ) {
      return false;
    }

    // TAMANHO

    if (
      selectedSizes.length > 0
    ) {
      const hasSelectedSize =
        product.availableSizes?.some(
          (size) => {
            const parts =
              size.split("|");

            const sizeName =
              parts[0]
                ?.trim()
                .toUpperCase();

            const quantity =
              Number(parts[1] || 0);

            return (
              selectedSizes.includes(
                sizeName
              ) &&
              quantity > 0
            );
          }
        ) || false;

      if (!hasSelectedSize) {
        return false;
      }
    }

    // GÊNERO

    if (
      selectedGender.length > 0 &&
      !selectedGender.includes(
        getGender(product)
      )
    ) {
      return false;
    }

    // PREÇO

    const price = Number(
      product.price || 0
    );

    if (price > maxPrice) {
      return false;
    }

    return true;
  }
);

// ======================================================
// MAIS VENDIDOS
// ======================================================

if (
  sort === "MAIS_VENDIDOS"
) {
  return [...result].sort(
    (a, b) => {
      const positionA =
        bestSellerOrder.get(
          a.item_code
        );

      const positionB =
        bestSellerOrder.get(
          b.item_code
        );

      if (
        positionA !== undefined &&
        positionB !== undefined
      ) {
        return (
          positionA -
          positionB
        );
      }

      if (
        positionA !== undefined
      ) {
        return -1;
      }

      if (
        positionB !== undefined
      ) {
        return 1;
      }

      return String(
        a.item_code
      ).localeCompare(
        String(b.item_code),
        "pt-BR",
        { numeric: true }
      );
    }
  );
}

// ======================================================
// MENOR PREÇO
// ======================================================

if (
  sort === "MENOR_PRECO"
) {
  return [...result].sort(
    (a, b) =>
      Number(a.price || 0) -
      Number(b.price || 0)
  );
}

// ======================================================
// MAIOR PREÇO
// ======================================================

if (
  sort === "MAIOR_PRECO"
) {
  return [...result].sort(
    (a, b) =>
      Number(b.price || 0) -
      Number(a.price || 0)
  );
}

// ======================================================
// LANÇAMENTOS
// ======================================================

if (
  sort === "LANCAMENTOS"
) {
  return [...result].sort(
    (a, b) => {
      const codeA =
        String(
          a.item_code || ""
        );

      const codeB =
        String(
          b.item_code || ""
        );

      return codeB.localeCompare(
        codeA,
        "pt-BR",
        { numeric: true }
      );
    }
  );
}

// ======================================================
// RELEVÂNCIA
// ======================================================

if (
  sort === "RELEVANCIA"
) {
  return [...result].sort(
    (a, b) => {
      const stockA =
        Number(a.stock || 0);

      const stockB =
        Number(b.stock || 0);

      if (stockA !== stockB) {
        return (
          stockB - stockA
        );
      }

      return String(
        a.item_code
      ).localeCompare(
        String(b.item_code),
        "pt-BR",
        { numeric: true }
      );
    }
  );
}

return result;

}, [
products,
bestSellerOrder,
search,
selectedTypes,
selectedCategories,
selectedTeams,
selectedQuality,
selectedSizes,
selectedGender,
maxPrice,
sort,
]);

// ==========================================================
// GÊNERO
// ==========================================================

const getGender = (
product: Product
) => {
const name =
product.item_name?.toUpperCase() || "";

if (
  name.includes("FEMININO") ||
  name.includes("FEMININA")
) {
  return "FEMININO";
}

if (
  name.includes("JUVENIL") ||
  name.includes("INFANTIL") ||
  name.includes("KIDS")
) {
  return "INFANTIL";
}

return "MASCULINO";

};

// ==========================================================
// MOSTRAR SOMENTE 20 POR VEZ
// ==========================================================

const visibleProducts =
filteredProducts.slice(
0,
visibleCount
);

const hasMore =
visibleCount <
filteredProducts.length;

// ==========================================================
// RESETAR PAGINAÇÃO
// ==========================================================

useEffect(() => {
setVisibleCount(20);
}, [
search,
selectedTypes,
selectedCategories,
selectedTeams,
selectedQuality,
selectedSizes,
selectedGender,
maxPrice,
sort,
]);

// ==========================================================
// FILTROS ATIVOS
// ==========================================================

const hasFilters =
search.trim() !== "" ||
selectedTypes.length > 0 ||
selectedCategories.length > 0 ||
selectedTeams.length > 0 ||
selectedQuality !== "TODOS" ||
selectedSizes.length > 0 ||
selectedGender.length > 0 ||
maxPrice < 200;

// ==========================================================
// LIMPAR FILTROS
// ==========================================================

function clearFilters() {
setSearch("");
setSelectedTypes([]);
setSelectedCategories([]);
setSelectedTeams([]);
setSelectedQuality("TODOS");
setSelectedSizes([]);
setSelectedGender([]);
setMaxPrice(200);
setSort("RELEVANCIA");
}

function removeType(
type: string
) {
setSelectedTypes(
(current) =>
current.filter(
(item) => item !== type
)
);
}

function removeCategory(
category: string
) {
setSelectedCategories(
(current) =>
current.filter(
(item) =>
item !== category
)
);
}

function removeTeam(
team: string
) {
setSelectedTeams(
(current) =>
current.filter(
(item) => item !== team
)
);
}

function removeSize(
size: string
) {
setSelectedSizes(
(current) =>
current.filter(
(item) => item !== size
)
);
}

function removeGender(
gender: string
) {
setSelectedGender(
(current) =>
current.filter(
(item) => item !== gender
)
);
}

// ==========================================================
// RENDER
// ==========================================================

const showQuality =
selectedTypes.length === 0 ||
selectedTypes.includes("CAMISAS");

return ( <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
{/* =====================================================
SIDEBAR
===================================================== */}

  <aside className="w-full shrink-0 lg:w-[250px]">
    <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-[#0B0B0B] p-5">
      {/* BUSCA */}

      <div>
        <label className="mb-2 block text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Buscar
        </label>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Buscar time, seleção ou jogador..."
          className="h-11 w-full rounded-lg border border-white/[0.10] bg-[#111111] px-3 text-xs font-bold text-white outline-none placeholder:text-white/25 transition focus:border-[#FFEA00]/60"
        />
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* TIPO */}

      <div>
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Produto
        </p>

        <div className="space-y-3">
          {[
            ["CAMISAS", "Camisas"],
            ["JAQUETAS", "Jaquetas"],
            ["CONJUNTOS", "Conjuntos"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 text-[10px] font-bold text-white/65 transition hover:text-white"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(
                  value
                )}
                onChange={() =>
                  toggleType(value)
                }
                className="h-4 w-4 accent-[#FFEA00]"
              />

              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* CATEGORIA */}

      <div>
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Categoria
        </p>

        <div className="space-y-3">
          {categories.map(
            (category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-3 text-[10px] font-bold text-white/65 transition hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(
                    category.id
                  )}
                  onChange={() =>
                    toggleCategory(
                      category.id
                    )
                  }
                  className="h-4 w-4 accent-[#FFEA00]"
                />

                <span>
                  {
                    category.label
                  }
                </span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* TIME */}

      <div>
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Time / Seleção
        </p>

        <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
          {availableTeams.map(
            (team) => (
              <label
                key={team}
                className="flex cursor-pointer items-center gap-3 text-[10px] font-bold text-white/65 transition hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(
                    team
                  )}
                  onChange={() =>
                    toggleTeam(team)
                  }
                  className="h-4 w-4 accent-[#FFEA00]"
                />

                <span>
                  {team}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {showQuality && (
        <>
          <div className="my-6 h-px bg-white/[0.06]" />

          {/* QUALIDADE */}

          <div>
            <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
              Modelo
            </p>

            <div className="space-y-3">
              {[
                {
                  value:
                    "TAILANDESA" as Quality,
                  label:
                    "Tailandesa 1:1",
                },
                {
                  value:
                    "NACIONAL" as Quality,
                  label:
                    "Nacional Premium",
                },
              ].map(
                (quality) => (
                  <label
                    key={
                      quality.value
                    }
                    className="flex cursor-pointer items-center gap-3 text-[10px] font-bold text-white/65 transition hover:text-white"
                  >
                    <input
                      type="radio"
                      name="quality"
                      checked={
                        selectedQuality ===
                        quality.value
                      }
                      onChange={() =>
                        setSelectedQuality(
                          quality.value
                        )
                      }
                      className="h-4 w-4 accent-[#FFEA00]"
                    />

                    <span>
                      {
                        quality.label
                      }
                    </span>
                  </label>
                )
              )}
            </div>

            {selectedQuality !==
              "TODOS" && (
              <button
                type="button"
                onClick={() =>
                  setSelectedQuality(
                    "TODOS"
                  )
                }
                className="mt-3 text-[8px] font-black uppercase tracking-wider text-[#FFEA00]"
              >
                Limpar modelo
              </button>
            )}
          </div>
        </>
      )}

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* TAMANHO */}

      <div>
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Tamanho
        </p>

        <div className="grid grid-cols-4 gap-2">
          {sizes.map(
            (size) => {
              const active =
                selectedSizes.includes(
                  size
                );

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    toggleSize(
                      size
                    )
                  }
                  className={`h-9 rounded-md border text-[9px] font-black transition ${
                    active
                      ? "border-[#FFEA00] bg-[#FFEA00] text-black"
                      : "border-white/[0.10] bg-[#111111] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* GÊNERO */}

      <div>
        <p className="mb-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Gênero
        </p>

        <div className="space-y-3">
          {[
            [
              "MASCULINO",
              "Masculino",
            ],
            [
              "FEMININO",
              "Feminino",
            ],
            [
              "INFANTIL",
              "Infantil / Kids",
            ],
          ].map(
            ([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 text-[10px] font-bold text-white/65 transition hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedGender.includes(
                    value
                  )}
                  onChange={() =>
                    toggleGender(
                      value
                    )
                  }
                  className="h-4 w-4 accent-[#FFEA00]"
                />

                <span>
                  {label}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-white/[0.06]" />

      {/* PREÇO */}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
            Preço
          </p>

          <span className="text-[9px] font-black text-[#FFEA00]">
            R$ {maxPrice.toFixed(0)}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="200"
          step="10"
          value={maxPrice}
          onChange={(event) =>
            setMaxPrice(
              Number(
                event.target.value
              )
            )
          }
          className="w-full accent-[#FFEA00]"
        />

        <div className="mt-2 flex justify-between text-[8px] font-bold text-white/25">
          <span>R$ 50</span>
          <span>R$ 200</span>
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-7 h-10 w-full rounded-lg border border-[#FFEA00]/40 text-[8px] font-black uppercase tracking-[0.15em] text-[#FFEA00] transition hover:bg-[#FFEA00] hover:text-black"
        >
          Limpar filtros
        </button>
      )}
    </div>
  </aside>

  {/* =====================================================
      CATÁLOGO
  ===================================================== */}

  <section className="min-w-0 flex-1">
    {/* TOP CONTROL BAR */}

    <div className="mb-5 flex flex-col gap-4 border-b border-white/[0.06] pb-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/35">
            Mostrando{" "}
            <span className="text-white/70">
              {
                filteredProducts.length
              }
            </span>{" "}
            mantos
          </p>

          {selectedTypes.map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  removeType(type)
                }
                className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
              >
                {type ===
                "CAMISAS"
                  ? "Camisas"
                  : type ===
                      "JAQUETAS"
                    ? "Jaquetas"
                    : "Conjuntos"}{" "}
                ×
              </button>
            )
          )}

          {selectedCategories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  removeCategory(
                    category
                  )
                }
                className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
              >
                {category} ×
              </button>
            )
          )}

          {selectedTeams.map(
            (team) => (
              <button
                key={team}
                type="button"
                onClick={() =>
                  removeTeam(team)
                }
                className="max-w-[180px] truncate rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
              >
                {team} ×
              </button>
            )
          )}

          {selectedQuality !==
            "TODOS" && (
            <button
              type="button"
              onClick={() =>
                setSelectedQuality(
                  "TODOS"
                )
              }
              className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
            >
              {selectedQuality ===
              "TAILANDESA"
                ? "Tailandesa 1:1"
                : "Nacional Premium"}{" "}
              ×
            </button>
          )}

          {selectedSizes.map(
            (size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  removeSize(
                    size
                  )
                }
                className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
              >
                Tamanho:{" "}
                {size} ×
              </button>
            )
          )}

          {selectedGender.map(
            (gender) => (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  removeGender(
                    gender
                  )
                }
                className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
              >
                {gender} ×
              </button>
            )
          )}

          {search.trim() && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="max-w-[180px] truncate rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
            >
              Busca:{" "}
              {search} ×
            </button>
          )}

          {maxPrice < 200 && (
            <button
              type="button"
              onClick={() =>
                setMaxPrice(
                  200
                )
              }
              className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-white/65 transition hover:border-[#FFEA00]/50 hover:text-[#FFEA00]"
            >
              Até R${" "}
              {
                maxPrice
              } ×
            </button>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-2 py-1.5 text-[8px] font-black uppercase tracking-wide text-[#FFEA00] transition hover:text-white"
            >
              Limpar todos
            </button>
          )}
        </div>
      </div>

      {/* ORDENAÇÃO */}

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/30">
          Ordenar
        </span>

        <select
          value={sort}
          onChange={(event) =>
            setSort(
              event.target
                .value as SortOption
            )
          }
          className="h-10 rounded-lg border border-white/[0.10] bg-[#111111] px-3 text-[9px] font-black uppercase text-white outline-none transition focus:border-[#FFEA00]/60"
        >
          <option value="RELEVANCIA">
            Relevância
          </option>

          <option value="MENOR_PRECO">
            Menor preço
          </option>

          <option value="MAIOR_PRECO">
            Maior preço
          </option>

          <option value="LANCAMENTOS">
            Lançamentos
          </option>

          <option value="MAIS_VENDIDOS">
            Mais vendidos
          </option>
        </select>
      </div>
    </div>

    {/* PRODUTOS */}

    {filteredProducts.length >
    0 ? (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map(
            (product) => {
              const productType =
                getProductType(
                  product
                );

              const productQuality =
                getProductQuality(
                  product
                );

              const isTailandesa =
                productQuality ===
                "TAILANDESA";

              const price =
                Number(
                  product.price ||
                    0
                );

              const stock =
                Number(
                  product.stock ||
                    0
                );

              return (
                <Link
                  key={
                    product.item_code
                  }
                  href={`/produto/${product.item_code}`}
                  className="group"
                >
                  <article className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D0D] transition duration-300 group-hover:-translate-y-1 group-hover:border-white/[0.18]">
                    {/* IMAGEM */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.item_name ||
                            product.item_code
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl font-black text-white/[0.035]">
                            BL
                          </span>
                        </div>
                      )}

                      {/* BADGE */}

                      <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1.5 text-[7px] font-black uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        {productType ===
                        "CAMISAS"
                          ? isTailandesa
                            ? "Tailandesa 1:1"
                            : "Nacional Premium"
                          : productType ===
                              "JAQUETAS"
                            ? "Jaqueta"
                            : productType ===
                                "CONJUNTOS"
                              ? "Conjunto"
                              : productType}
                      </div>
                    </div>

                    {/* INFORMAÇÃ•ES */}

                    <div className="p-3">
                      <p className="line-clamp-2 min-h-[30px] text-[10px] font-black uppercase leading-[15px] tracking-wide text-white/90">
                        {
                          product.item_name
                        }
                      </p>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <p className="text-base font-black text-white">
                          R${" "}
                          {price
                            .toFixed(
                              2
                            )
                            .replace(
                              ".",
                              ","
                            )}
                        </p>

                        {stock >
                          0 && (
                          <span className="text-[7px] font-black uppercase tracking-wider text-[#00FF66]">
                            Disponível
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">
                        3x de R$ {((price * (1 + CUSTOMER_INSTALLMENT_RATE_3X)) / 3).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            }
          )}
        </div>

        {/* MOSTRAR MAIS */}

        {hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
              Mostrando{" "}
              {
                visibleProducts.length
              }{" "}
              de{" "}
              {
                filteredProducts.length
              }
            </p>

            <button
              type="button"
              onClick={() =>
                setVisibleCount(
                  (current) =>
                    current +
                    20
                )
              }
              className="rounded-xl border border-[#FFEA00]/40 bg-[#FFEA00]/[0.04] px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#FFEA00] transition hover:bg-[#FFEA00] hover:text-black"
            >
              Mostrar mais
            </button>
          </div>
        )}
      </>
    ) : (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0A] px-6 py-20 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
          Nenhum resultado
        </p>

        <h2 className="mt-3 text-xl font-black uppercase text-white">
          Não encontramos produtos
        </h2>

        <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-white/40">
          Tente alterar os filtros ou
          fazer uma nova busca.
        </p>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-7 rounded-lg bg-[#FFEA00] px-6 py-3 text-[9px] font-black uppercase tracking-[0.15em] text-black transition hover:bg-white"
        >
          Limpar filtros
        </button>
      </div>
    )}
  </section>
</div>

);
}
