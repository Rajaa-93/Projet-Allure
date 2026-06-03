import "server-only";

import type Stripe from "stripe";
import { getProductById } from "@/lib/products";

export type CheckoutCartItemInput = {
  productId: number;
  size: string;
  quantity: number;
};

type NormalizedCheckoutItem = {
  productId: number;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  unitAmount: number;
};

const MAX_QUANTITY_PER_LINE = 10;

function normalizeCartItem(item: unknown): CheckoutCartItemInput | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  const productId = Number(candidate.productId);
  const size = typeof candidate.size === "string" ? candidate.size.trim() : "";
  const quantity = Number(candidate.quantity);

  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || size.length === 0) {
    return null;
  }

  return { productId, size, quantity };
}

export function validateCheckoutCart(input: unknown) {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("Votre panier est vide.");
  }

  const merged = new Map<string, NormalizedCheckoutItem>();

  for (const rawItem of input) {
    const item = normalizeCartItem(rawItem);

    if (!item) {
      throw new Error("Le contenu du panier est invalide.");
    }

    if (item.quantity <= 0 || item.quantity > MAX_QUANTITY_PER_LINE) {
      throw new Error("La quantité demandée n'est pas valide.");
    }

    const product = getProductById(item.productId);
    if (!product) {
      throw new Error("Un produit du panier est introuvable.");
    }

    if (!product.sizes.includes(item.size)) {
      throw new Error(`La taille ${item.size} n'est pas disponible pour ${product.name}.`);
    }

    const key = `${product.id}:${item.size}`;
    const existing = merged.get(key);

    if (existing) {
      const nextQuantity = existing.quantity + item.quantity;
      if (nextQuantity > MAX_QUANTITY_PER_LINE) {
        throw new Error("La quantité maximale par article est dépassée.");
      }
      existing.quantity = nextQuantity;
      continue;
    }

    merged.set(key, {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      size: item.size,
      quantity: item.quantity,
      unitAmount: Math.round(product.price * 100),
    });
  }

  return Array.from(merged.values());
}

export function buildStripeLineItems(
  cartItems: NormalizedCheckoutItem[]
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return cartItems.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "eur",
      unit_amount: item.unitAmount,
      product_data: {
        name: item.productName,
        description: `${item.brand} • Taille ${item.size}`,
      },
    },
  }));
}
