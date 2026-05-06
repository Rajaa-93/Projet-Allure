export type Product = {
  id: number;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
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
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    brand: "H&M",
    name: "Robe midi à pois",
    size: "Taille S",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    brand: "Mango",
    name: "Jean wide",
    size: "Taille 40",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    brand: "Uniqlo",
    name: "Baskets city",
    size: "Pointure 39",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    brand: "C&A",
    name: "Chemise satin",
    size: "Taille M",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    brand: "Kiabi",
    name: "Escarpins nude",
    size: "Pointure 38",
    price: 44,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  },
];