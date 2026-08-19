"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  item_code: string;
  item_name: string;
  image: string | null;
  price: number;
  size: string;
  quantity: number;
  maxQuantity: number;
};

export type AppliedCoupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount: number;
};

type CartContextType = {
  items: CartItem[];

  addItem: (item: CartItem) => boolean;

  removeItem: (
    itemCode: string,
    size: string
  ) => void;

  updateQuantity: (
    itemCode: string,
    size: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  totalItems: number;
  totalPrice: number;

  coupon: AppliedCoupon | null;
  couponLoading: boolean;
  couponError: string | null;

  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  discount: number;
  finalTotal: number;
};

const CartContext =
  createContext<CartContextType | null>(null);

const STORAGE_KEY = "blmantos-cart";
const COUPON_STORAGE_KEY = "blmantos-coupon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://163.176.237.176:8000";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] =
    useState<AppliedCoupon | null>(null);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponError, setCouponError] =
    useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  // =========================================================
  // CARREGAR CARRINHO E CUPOM
  // =========================================================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }

      const savedCoupon =
        localStorage.getItem(
          COUPON_STORAGE_KEY
        );

      if (savedCoupon) {
        const parsedCoupon =
          JSON.parse(savedCoupon);

        if (
          parsedCoupon &&
          typeof parsedCoupon === "object"
        ) {
          setCoupon(parsedCoupon);
        }
      }
    } catch {
      console.error(
        "Não foi possível carregar os dados do carrinho."
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  // =========================================================
  // SALVAR CARRINHO
  // =========================================================

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch {
      console.error(
        "Não foi possível salvar o carrinho."
      );
    }
  }, [items, loaded]);

  // =========================================================
  // SALVAR CUPOM
  // =========================================================

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      if (coupon) {
        localStorage.setItem(
          COUPON_STORAGE_KEY,
          JSON.stringify(coupon)
        );
      } else {
        localStorage.removeItem(
          COUPON_STORAGE_KEY
        );
      }
    } catch {
      console.error(
        "Não foi possível salvar o cupom."
      );
    }
  }, [coupon, loaded]);

  // =========================================================
  // ADICIONAR AO CARRINHO
  // =========================================================

  function addItem(item: CartItem): boolean {
    let added = false;

    setItems((currentItems) => {
      const existingIndex =
        currentItems.findIndex(
          (currentItem) =>
            currentItem.item_code ===
              item.item_code &&
            currentItem.size === item.size
        );

      if (existingIndex === -1) {
        const safeQuantity = Math.min(
          Math.max(1, item.quantity),
          item.maxQuantity
        );

        if (safeQuantity <= 0) {
          return currentItems;
        }

        added = true;

        return [
          ...currentItems,
          {
            ...item,
            quantity: safeQuantity,
            maxQuantity: item.maxQuantity,
          },
        ];
      }

      const updated = [...currentItems];

      const existing =
        updated[existingIndex];

      const maxQuantity =
        item.maxQuantity > 0
          ? item.maxQuantity
          : existing.maxQuantity;

      if (
        existing.quantity >= maxQuantity
      ) {
        added = false;

        return currentItems;
      }

      const newQuantity = Math.min(
        existing.quantity +
          Math.max(1, item.quantity),
        maxQuantity
      );

      if (
        newQuantity <= existing.quantity
      ) {
        added = false;

        return currentItems;
      }

      added = true;

      updated[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        maxQuantity,
        price: item.price,
        item_name: item.item_name,
        image: item.image,
      };

      return updated;
    });

    return added;
  }

  // =========================================================
  // REMOVER
  // =========================================================

  function removeItem(
    itemCode: string,
    size: string
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.item_code === itemCode &&
            item.size === size
          )
      )
    );
  }

  // =========================================================
  // ATUALIZAR QUANTIDADE
  // =========================================================

  function updateQuantity(
    itemCode: string,
    size: string,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.item_code !== itemCode ||
          item.size !== size
        ) {
          return item;
        }

        const safeQuantity = Math.max(
          1,
          Math.min(
            quantity,
            item.maxQuantity
          )
        );

        return {
          ...item,
          quantity: safeQuantity,
        };
      })
    );
  }

  // =========================================================
  // LIMPAR
  // =========================================================

  function clearCart() {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  }

  // =========================================================
  // TOTAL DE PRODUTOS
  // =========================================================

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  // =========================================================
  // SUBTOTAL
  // =========================================================

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [items]
  );

  // =========================================================
  // APLICAR CUPOM
  // =========================================================

  async function applyCoupon(
    code: string
  ): Promise<boolean> {
    const normalizedCode =
      code.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError(
        "Digite um cupom."
      );

      return false;
    }

    if (totalPrice <= 0) {
      setCouponError(
        "O carrinho está vazio."
      );

      return false;
    }

    try {
      setCouponLoading(true);
      setCouponError(null);

      const response = await fetch(
        `${API_URL}/api/coupons/validate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code: normalizedCode,
            subtotal: totalPrice,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Cupom inválido."
        );
      }

      setCoupon({
        code: data.code,
        type: data.type,
        value: Number(data.value),
        discount: Number(data.discount),
      });

      return true;
    } catch (error) {
      setCoupon(null);

      setCouponError(
        error instanceof Error
          ? error.message
          : "Não foi possível validar o cupom."
      );

      return false;
    } finally {
      setCouponLoading(false);
    }
  }

  // =========================================================
  // REMOVER CUPOM
  // =========================================================

  function removeCoupon() {
    setCoupon(null);
    setCouponError(null);
  }

  // =========================================================
  // DESCONTO
  // =========================================================

  const discount = useMemo(() => {
    if (!coupon) {
      return 0;
    }

    return Math.min(
      Math.max(0, coupon.discount),
      totalPrice
    );
  }, [coupon, totalPrice]);

  // =========================================================
  // TOTAL FINAL
  // =========================================================

  const finalTotal = useMemo(
    () =>
      Math.max(
        0,
        totalPrice - discount
      ),
    [totalPrice, discount]
  );

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <CartContext.Provider
      value={{
        items,

        addItem,
        removeItem,
        updateQuantity,
        clearCart,

        totalItems,
        totalPrice,

        coupon,
        couponLoading,
        couponError,

        applyCoupon,
        removeCoupon,

        discount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart deve ser usado dentro de um CartProvider."
    );
  }

  return context;
}