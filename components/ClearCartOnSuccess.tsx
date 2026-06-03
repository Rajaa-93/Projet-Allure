"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/useCart";

export default function ClearCartOnSuccess() {
  const { ready, clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!ready || clearedRef.current) {
      return;
    }

    clearedRef.current = true;
    clearCart();
  }, [clearCart, ready]);

  return null;
}
