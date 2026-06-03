"use client";

import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  size: string;
  quantity: number;
};

const CART_STORAGE_KEY = "allure:cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        setReady(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((item) => ({
            productId: Number(item?.productId),
            size: typeof item?.size === "string" ? item.size : "",
            quantity: Number(item?.quantity),
          }))
          .filter(
            (item) =>
              Number.isInteger(item.productId) &&
              item.size.length > 0 &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0
          );
        setItems(normalized);
      }
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  function addItem(productId: number, size: string) {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, size, quantity: 1 }];
    });
  }

  function removeItem(productId: number, size: string) {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  }

  function updateQuantity(productId: number, size: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }

  function hasProduct(productId: number) {
    return items.some((item) => item.productId === productId);
  }

  function clearCart() {
    setItems([]);
  }

  return {
    ready,
    items,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    hasProduct,
    clearCart,
  };
}
