 // services/products.ts

export type Product = {
  item_code: string;
  item_name: string;
  creation?: string | null;
  item_group?: string | null;
  image?: string | null;
  stock?: number;
  actual_qty?: number;
  availableSizes?: string[];
  price?: number;
  site_price?: number | null;
  promotional_price?: number | null;
  promotion_active?: boolean;
  visible?: boolean;
  featured?: boolean;
  launch?: boolean;
  site_category?: string | null;
  total_vendido?: number;

  custom_time_nome?: string | null;
  custom_categoria_time?: string | null;
};

const API_URL = "https://api.blmantos.com.br";

// =========================================================
// NORMALIZAR PRODUTO
// =========================================================

function normalizeProduct(item: any): Product {
  return {
    ...item,
    price: Number(item?.price ?? 0),
    site_price:
      item?.site_price != null
        ? Number(item.site_price)
        : null,
    promotional_price:
      item?.promotional_price != null
        ? Number(item.promotional_price)
        : null,
    promotion_active: Boolean(item?.promotion_active),
    visible: item?.visible !== false,
    featured: Boolean(item?.featured),
    launch: Boolean(item?.launch),
    site_category: item?.site_category ?? null,
    stock: Number(item?.stock ?? 0),
    actual_qty: Number(item?.actual_qty ?? 0),
    availableSizes: Array.isArray(item?.availableSizes)
      ? item.availableSizes
      : [],
  };
}

// =========================================================
// BUSCAR TODOS OS PRODUTOS
// =========================================================

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/items`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Erro ao buscar produtos:",
        response.status
      );

      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(normalizeProduct);
  } catch (error) {
    console.error(
      "Erro ao buscar produtos:",
      error
    );

    return [];
  }
}

// =========================================================
// BUSCAR PRODUTO
// =========================================================

export async function getProduct(
  itemCode: string
): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/items/${encodeURIComponent(itemCode)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Produto não encontrado: ${itemCode}`,
        response.status
      );

      return null;
    }

    const data = await response.json();

    if (!data) {
      console.error(
        `API retornou null para o produto: ${itemCode}`
      );

      return null;
    }

    return normalizeProduct(data);
  } catch (error) {
    console.error(
      `Erro ao buscar produto ${itemCode}:`,
      error
    );

    return null;
  }
}

// =========================================================
// MAIS VENDIDOS
// =========================================================

export async function getBestSellers(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/items/best-sellers`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Erro ao buscar mais vendidos:",
        response.status
      );

      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(normalizeProduct);
  } catch (error) {
    console.error(
      "Erro ao buscar mais vendidos:",
      error
    );

    return [];
  }
}


