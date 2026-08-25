// services/products.ts

export type Product = {
  item_code: string;
  item_name: string;
  item_group?: string | null;
  image?: string | null;
  stock?: number;
  actual_qty?: number;
  availableSizes?: string[];
  price?: number;
  total_vendido?: number;

  custom_time_nome?: string | null;
  custom_categoria_time?: string | null;
};

const API_URL = "https://api.blmantos.com.br";

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

    return data.map((item) => ({
      ...item,
      price: Number(item?.price ?? 0),
      stock: Number(item?.stock ?? 0),
      actual_qty: Number(item?.actual_qty ?? 0),
      availableSizes: Array.isArray(item?.availableSizes)
        ? item.availableSizes
        : [],
    }));
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

    // Produto não encontrado
    if (!response.ok) {
      console.error(
        `Produto não encontrado: ${itemCode}`,
        response.status
      );

      return null;
    }

    const data = await response.json();

    // API retornou null
    if (!data) {
      console.error(
        `API retornou null para o produto: ${itemCode}`
      );

      return null;
    }

    return {
      ...data,
      price: Number(data?.price ?? 0),
      stock: Number(data?.stock ?? 0),
      actual_qty: Number(data?.actual_qty ?? 0),
      availableSizes: Array.isArray(
        data?.availableSizes
      )
        ? data.availableSizes
        : [],
    };
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

    return data.map((item) => ({
      ...item,
      price: Number(item?.price ?? 0),
      stock: Number(item?.stock ?? 0),
      actual_qty: Number(item?.actual_qty ?? 0),
      availableSizes: Array.isArray(item?.availableSizes)
        ? item.availableSizes
        : [],
    }));
  } catch (error) {
    console.error(
      "Erro ao buscar mais vendidos:",
      error
    );

    return [];
  }
}
