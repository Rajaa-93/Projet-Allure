"use client";

import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  size: string;
  quantity: number;
  variantName?: string;
};

const CART_STORAGE_KEY = "allure:cart";

function persistCartItems(items: CartItem[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep the UI responsive even if storage is unavailable.
  }
}

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
            variantName:
              typeof item?.variantName === "string" && item.variantName.length > 0
                ? item.variantName
                : undefined,
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
    persistCartItems(items);
  }, [items, ready]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  function updateCartItems(updater: (prev: CartItem[]) => CartItem[]) {
    setItems((prev) => {
      const nextItems = updater(prev);
      persistCartItems(nextItems);
      return nextItems;
    });
  }

  function getCartItemKey(
    item: Pick<CartItem, "productId" | "size" | "variantName">
  ) {
    return `${item.productId}:${item.size}:${item.variantName ?? ""}`;
  }

  function addItem(productId: number, size: string, variantName?: string) {
    updateCartItems((prev) => {
      const nextItem = { productId, size, variantName };
      const existing = prev.find(
        (item) => getCartItemKey(item) === getCartItemKey(nextItem)
      );
      if (existing) {
        return prev.map((item) =>
          getCartItemKey(item) === getCartItemKey(nextItem)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, size, variantName, quantity: 1 }];
    });
  }

  function removeItem(productId: number, size: string, variantName?: string) {
    const itemToRemove = { productId, size, variantName };
    updateCartItems((prev) =>
      prev.filter((item) => getCartItemKey(item) !== getCartItemKey(itemToRemove))
    );
  }

  function updateQuantity(
    productId: number,
    size: string,
    quantity: number,
    variantName?: string
  ) {
    if (quantity <= 0) {
      removeItem(productId, size, variantName);
      return;
    }

    const itemToUpdate = { productId, size, variantName };
    updateCartItems((prev) =>
      prev.map((item) =>
        getCartItemKey(item) === getCartItemKey(itemToUpdate)
          ? { ...item, quantity }
          : item
      )
    );
  }

  function hasProduct(productId: number) {
    return items.some((item) => item.productId === productId);
  }

  function clearCart() {
    persistCartItems([]);
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
