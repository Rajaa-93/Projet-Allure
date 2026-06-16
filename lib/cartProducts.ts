import { products as catalogueProducts } from "@/lib/products";
import {
  products as tryOnProducts,
  type ProductVariant,
} from "@/lib/tryOnProducts";

const TRY_ON_CART_ID_OFFSET = 1000;

export type CartProduct = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  variants?: ProductVariant[];
  catalogueHref?: string;
};

const catalogueCartProducts: CartProduct[] = catalogueProducts.map((product) => ({
  id: product.id,
  brand: product.brand,
  name: product.name,
  price: product.price,
  image: product.image,
  sizes: product.sizes,
  catalogueHref: `/catalogue/${product.id}`,
}));

const tryOnCartProducts: CartProduct[] = tryOnProducts.map((product) => ({
  id: getCartProductIdForTryOnProduct(product.id),
  brand: product.brand,
  name: product.name,
  price: product.price,
  image: product.image,
  sizes: product.sizes
    .filter((size) => size.available)
    .map((size) => size.label),
  variants: product.variants,
}));

export const cartProducts = [...catalogueCartProducts, ...tryOnCartProducts];

export function getCartProductIdForTryOnProduct(productId: number) {
  return TRY_ON_CART_ID_OFFSET + productId;
}

export function getCartProductById(id: number) {
  return cartProducts.find((product) => product.id === id);
}

export function getCartProductVariant(
  product: CartProduct,
  variantName?: string
) {
  if (!variantName) {
    return null;
  }

  return product.variants?.find((variant) => variant.name === variantName) ?? null;
}

export function getCartProductPrice(
  product: CartProduct,
  variantName?: string
) {
  const variant = getCartProductVariant(product, variantName);
  return product.price + (variant?.priceDelta ?? 0);
}
