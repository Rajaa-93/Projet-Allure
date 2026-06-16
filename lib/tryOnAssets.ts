import { type Product, type ProductVariant } from "@/lib/tryOnProducts";

export type ViewName = "Face" | "Profil droit" | "Dos" | "Profil gauche";

export const avatarViews: ViewName[] = [
  "Face",
  "Profil droit",
  "Dos",
  "Profil gauche",
];

const viewAssetNames: Record<ViewName, string> = {
  Face: "face",
  "Profil droit": "right",
  Dos: "back",
  "Profil gauche": "left",
};

export function slugifyAsset(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAvatarBaseImage(view: ViewName) {
  return `/models/avatar/base/${viewAssetNames[view]}.png`;
}

export function getTryOnImage(
  product: Product | null,
  variant: ProductVariant | undefined,
  view: ViewName
) {
  if (!product || !variant) {
    return getAvatarBaseImage(view);
  }

  const productSlug = `${product.id}-${slugifyAsset(product.name)}`;
  const variantSlug = slugifyAsset(variant.name);

  return `/models/avatar/looks/${productSlug}/${variantSlug}/${viewAssetNames[view]}.jpg`;
}
