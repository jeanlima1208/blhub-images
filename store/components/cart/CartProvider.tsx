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

export type ShippingOption = {
  id: string;
  service_id: string;
  name: string;
  company: string;
  company_id?: number | null;
  price: number;
  delivery_time: number;
  delivery_range?: {
    min?: number;
    max?: number;
  } | null;
  type: "LOCAL" | "MELHOR_ENVIO";
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

  shippingCep: string;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  shippingLoading: boolean;
  shippingError: string | null;

  setShippingCep: (cep: string) => void;
  calculateShipping: () => Promise<boolean>;
  selectShipping: (option: ShippingOption) => void;
  clearShipping: () => void;

  shippingCost: number;
  finalTotal: number;
};

const CartContext =
  createContext<CartContextType | null>(null);

const STORAGE_KEY = "blmantos-cart";
const COUPON_STORAGE_KEY = "blmantos-coupon";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.blmantos.com.br";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [coupon, setCoupon] =
    useState<AppliedCoupon | null>(null);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponError, setCouponError] =
    useState<string | null>(null);

  const [shippingCep, setShippingCepState] =
    useState("");

  const [shippingOptions, setShippingOptions] =
    useState<ShippingOption[]>([]);

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const [shippingLoading, setShippingLoading] =
    useState(false);

  const [shippingError, setShippingError] =
    useState<string | null>(null);

  const [loaded, setLoaded] =
    useState(false);

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed =
          JSON.parse(savedCart);

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

  function addItem(
    item: CartItem
  ): boolean {
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
            maxQuantity:
              item.maxQuantity,
          },
        ];
      }

      const updated = [
        ...currentItems,
      ];

      const existing =
        updated[existingIndex];

      const maxQuantity =
        item.maxQuantity > 0
          ? item.maxQuantity
          : existing.maxQuantity;

      if (
        existing.quantity >=
        maxQuantity
      ) {
        added = false;
        return currentItems;
      }

      const newQuantity =
        Math.min(
          existing.quantity +
            Math.max(
              1,
              item.quantity
            ),
          maxQuantity
        );

      if (
        newQuantity <=
        existing.quantity
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

    clearShipping();
  }

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

        const safeQuantity =
          Math.max(
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

    clearShipping();
  }

  function clearCart() {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
    clearShipping();
  }

  const totalItems =
    useMemo(
      () =>
        items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),
      [items]
    );

  const totalPrice =
    useMemo(
      () =>
        items.reduce(
          (total, item) =>
            total +
            item.price *
              item.quantity,
          0
        ),
      [items]
    );

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

      const response =
        await fetch(
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
        discount: Number(
          data.discount
        ),
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

  function removeCoupon() {
    setCoupon(null);
    setCouponError(null);
  }

  const discount =
    useMemo(() => {
      if (!coupon) {
        return 0;
      }

      return Math.min(
        Math.max(
          0,
          coupon.discount
        ),
        totalPrice
      );
    }, [coupon, totalPrice]);

  function setShippingCep(
    cep: string
  ) {
    const cleanCep =
      cep.replace(/\D/g, "").slice(0, 8);

    setShippingCepState(
      cleanCep
    );

    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingError(null);
  }

  async function calculateShipping(): Promise<boolean> {
    if (
      shippingCep.replace(
        /\D/g,
        ""
      ).length !== 8
    ) {
      setShippingError(
        "Digite um CEP válido."
      );

      return false;
    }

    if (items.length === 0) {
      setShippingError(
        "O carrinho está vazio."
      );

      return false;
    }

    try {
      setShippingLoading(true);
      setShippingError(null);
      setShippingOptions([]);
      setSelectedShipping(null);

      const response =
        await fetch(
          `${API_URL}/api/shipping/calculate`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              postal_code:
                shippingCep,
              items: items.map(
                (item) => ({
                  item_code:
                    item.item_code,
                  price:
                    Number(item.price),
                  quantity:
                    item.quantity,
                })
              ),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Não foi possível calcular o frete."
        );
      }

      const options =
        Array.isArray(data?.options)
          ? data.options
          : [];

      if (options.length === 0) {
        throw new Error(
          "Nenhuma opção de frete disponível para este CEP."
        );
      }

      setShippingOptions(
        options
      );

      setSelectedShipping(
        options[0]
      );

      return true;
    } catch (error) {
      setShippingOptions([]);
      setSelectedShipping(null);

      setShippingError(
        error instanceof Error
          ? error.message
          : "Não foi possível calcular o frete."
      );

      return false;
    } finally {
      setShippingLoading(false);
    }
  }

  function selectShipping(
    option: ShippingOption
  ) {
    setSelectedShipping(
      option
    );
  }

  function clearShipping() {
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingError(null);
  }

  const shippingCost =
    selectedShipping?.price || 0;

  const finalTotal =
    useMemo(
      () =>
        Math.max(
          0,
          totalPrice -
            discount +
            shippingCost
        ),
      [
        totalPrice,
        discount,
        shippingCost,
      ]
    );

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

        shippingCep,
        shippingOptions,
        selectedShipping,
        shippingLoading,
        shippingError,

        setShippingCep,
        calculateShipping,
        selectShipping,
        clearShipping,

        shippingCost,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

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
