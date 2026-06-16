export type ProductVariant = {
  name: string;
  kind: "Couleur" | "Motif";
  value: string;
  available: boolean;
  priceDelta?: number;
};

export type ProductSize = {
  label: string;
  available: boolean;
};

export type TryOnCategory = "outerwear" | "dress" | "bottom" | "top" | "shoes";

export type Product = {
  id: number;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
  tryOnCategory: TryOnCategory;
  sizes: ProductSize[];
  variants: ProductVariant[];
};

export const brands = [
  "ZARA",
  "H&M",
  "MANGO",
  "UNIQLO",
  "C&A",
  "KIABI",
];

export const products: Product[] = [
  {
    id: 1,
    brand: "Zara",
    name: "Trench coat long",
    size: "Taille 38",
    price: 109,
    tryOnCategory: "outerwear",
    sizes: [
      { label: "34", available: true },
      { label: "36", available: true },
      { label: "38", available: true },
      { label: "40", available: true },
      { label: "42", available: false },
    ],
    variants: [
      { name: "Camel", kind: "Couleur", value: "#b18a53", available: true },
      { name: "Noir", kind: "Couleur", value: "#2d2924", available: true },
      {
        name: "Prince de Galles",
        kind: "Motif",
        value: "check",
        available: true,
        priceDelta: 8,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    brand: "H&M",
    name: "Robe midi à pois",
    size: "Taille S",
    price: 49,
    tryOnCategory: "dress",
    sizes: [
      { label: "XS", available: true },
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: false },
    ],
    variants: [
      { name: "Noir pois", kind: "Motif", value: "dots", available: true },
      { name: "Écru", kind: "Couleur", value: "#e8dbc6", available: true },
      {
        name: "Rouge brique",
        kind: "Couleur",
        value: "#9f4636",
        available: true,
        priceDelta: 4,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    brand: "Mango",
    name: "Jean wide",
    size: "Taille 40",
    price: 59,
    tryOnCategory: "bottom",
    sizes: [
      { label: "36", available: true },
      { label: "38", available: true },
      { label: "40", available: true },
      { label: "42", available: true },
      { label: "44", available: false },
    ],
    variants: [
      { name: "Bleu clair", kind: "Couleur", value: "#7f9fbd", available: true },
      { name: "Denim brut", kind: "Couleur", value: "#334b66", available: true },
      { name: "Rayé", kind: "Motif", value: "stripes", available: false },
    ],
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    brand: "Uniqlo",
    name: "Baskets city",
    size: "Pointure 39",
    price: 79,
    tryOnCategory: "shoes",
    sizes: [
      { label: "37", available: true },
      { label: "38", available: true },
      { label: "39", available: true },
      { label: "40", available: true },
      { label: "41", available: false },
    ],
    variants: [
      { name: "Blanc", kind: "Couleur", value: "#f5f1e8", available: true },
      { name: "Sable", kind: "Couleur", value: "#c4aa78", available: true },
      { name: "Graphite", kind: "Couleur", value: "#3a3936", available: true },
    ],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    brand: "C&A",
    name: "Chemise satin",
    size: "Taille M",
    price: 39,
    tryOnCategory: "top",
    sizes: [
      { label: "XS", available: false },
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
    ],
    variants: [
      { name: "Ivoire", kind: "Couleur", value: "#eee2d0", available: true },
      { name: "Champagne", kind: "Couleur", value: "#d8b982", available: true },
      {
        name: "Rayures fines",
        kind: "Motif",
        value: "stripes",
        available: true,
        priceDelta: 3,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    brand: "Kiabi",
    name: "Escarpins nude",
    size: "Pointure 38",
    price: 44,
    tryOnCategory: "shoes",
    sizes: [
      { label: "36", available: true },
      { label: "37", available: true },
      { label: "38", available: true },
      { label: "39", available: false },
      { label: "40", available: true },
    ],
    variants: [
      { name: "Nude", kind: "Couleur", value: "#c99777", available: true },
      { name: "Noir", kind: "Couleur", value: "#201b18", available: true },
      {
        name: "Vernis",
        kind: "Motif",
        value: "gloss",
        available: true,
        priceDelta: 5,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  },
];
