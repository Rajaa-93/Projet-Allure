export type Season = "Printemps" | "Ete" | "Automne" | "Hiver";

export type Category =
  | "Manteau"
  | "Robe"
  | "Jean"
  | "Chaussures"
  | "Chemise"
  | "Veste"
  | "Jupe"
  | "Pull"
  | "Pantalon";

export type ProductStyle = "Streetwear" | "Casual" | "Chic" | "Sport";

export type Brand = {
  id: string;
  label: string;
  logo: string;
};

export type Product = {
  id: number;
  brandId: string;
  brand: string;
  name: string;
  category: Category;
  style: ProductStyle;
  season: Season;
  size: string;
  sizes: string[];
  price: number;
  description: string;
  image: string;
  images: string[];
};

export type ProductVariant = {
  name: string;
  kind: "Couleur" | "Motif";
  value: string;
  available: boolean;
  priceDelta?: number;
};

export const brands: Brand[] = [
  { id: "zara", label: "ZARA", logo: "/catalogue-sia/logos/zara.png" },
  { id: "hm", label: "H&M", logo: "/catalogue-sia/logos/hm.png" },
  { id: "mango", label: "MANGO", logo: "/catalogue-sia/logos/mango.png" },
  { id: "uniqlo", label: "UNIQLO", logo: "/catalogue-sia/logos/uniqlo.png" },
  { id: "ca", label: "C&A", logo: "/catalogue-sia/logos/ca.png" },
  { id: "kiabi", label: "KIABI", logo: "/catalogue-sia/logos/kiabi.png" },
  { id: "asos", label: "ASOS", logo: "/catalogue-sia/logos/asos.png" },
  { id: "zalando", label: "ZALANDO", logo: "/brands/zalando.svg" },
  { id: "stradivarius", label: "STRADIVARIUS", logo: "/catalogue-sia/logos/stradivarius.jpg" },
  { id: "bershka", label: "BERSHKA", logo: "/catalogue-sia/logos/bershka.png" },
];

export const categories: Category[] = [
  "Manteau",
  "Robe",
  "Jean",
  "Chaussures",
  "Chemise",
  "Veste",
  "Jupe",
  "Pull",
  "Pantalon",
];

export const seasons: Season[] = ["Printemps", "Ete", "Automne", "Hiver"];
export const styles: ProductStyle[] = ["Streetwear", "Casual", "Chic", "Sport"];

export const products: Product[] = [
  {
    id: 1,
    brandId: "zara",
    brand: "Zara",
    name: "Cardigan vert maille douce",
    category: "Pull",
    style: "Casual",
    season: "Printemps",
    size: "Taille M",
    sizes: ["S", "M", "L"],
    price: 59,
    description:
      "Cardigan vert a col V, maille confortable et coupe courte facile a associer.",
    image: "/catalogue-sia/cardigan-vert-zara/05755903933-e3.jpg",
    images: [
      "/catalogue-sia/cardigan-vert-zara/05755903933-e3.jpg",
      "/catalogue-sia/cardigan-vert-zara/05755903933-e1.jpg",
      "/catalogue-sia/cardigan-vert-zara/05755903933-e2.jpg",
      "/catalogue-sia/cardigan-vert-zara/05755903933-e4.jpg",
      "/catalogue-sia/cardigan-vert-zara/T9725478885-p.jpg",
    ],
  },
  {
    id: 2,
    brandId: "hm",
    brand: "H&M",
    name: "Robe noire collection H&M",
    category: "Robe",
    style: "Chic",
    season: "Ete",
    size: "Taille 36",
    sizes: ["34", "36", "38", "40"],
    price: 79,
    description:
      "Robe noire elegante avec coupe pres du corps et finitions minimalistes.",
    image: "/catalogue-sia/robe-hm/d5aa2b50cf5a7e871f9e2e43acba6114c0544471.jpg.avif",
    images: [
      "/catalogue-sia/robe-hm/d5aa2b50cf5a7e871f9e2e43acba6114c0544471.jpg.avif",
      "/catalogue-sia/robe-hm/2a3886abf84aad131ef0c2ba20c4e2a4f3ced64b.jpg.avif",
      "/catalogue-sia/robe-hm/3b8a784ad7aada08866f1278f6c4dbacfc153eb3.jpg.avif",
      "/catalogue-sia/robe-hm/404890db678b75ee725fa16eea0589b3d83e9de7.jpg.avif",
      "/catalogue-sia/robe-hm/ef4eecbd125ccfc23d9acf8bfeda19000ad1f019.jpg.avif",
      "/catalogue-sia/robe-hm/f5874023010a741f6b59aaf0e0f78c6d999befaf.jpg.avif",
    ],
  },
  {
    id: 3,
    brandId: "hm",
    brand: "H&M",
    name: "Robe a pois H&M",
    category: "Robe",
    style: "Casual",
    season: "Printemps",
    size: "Taille S",
    sizes: ["XS", "S", "M", "L"],
    price: 69,
    description:
      "Robe a pois coupe feminine, ideale pour une tenue de jour.",
    image: "/catalogue-sia/robe-pois-hm/94269039f99cc8fe97261407aa1fc85da899d002.jpg.avif",
    images: [
      "/catalogue-sia/robe-pois-hm/94269039f99cc8fe97261407aa1fc85da899d002.jpg.avif",
      "/catalogue-sia/robe-pois-hm/dc76edb7b8d9454ea08e359b455582c49042a3b0.jpg.avif",
      "/catalogue-sia/robe-pois-hm/34cb10b508820887087693b34e1c8fbb05e6788c.jpg.avif",
      "/catalogue-sia/robe-pois-hm/ad3f16d4867ed7d533f2b57d2a00680d57c97f90.jpg.avif",
      "/catalogue-sia/robe-pois-hm/ce9017aaca749ee0ffd4772ce9be23db29315262.jpg.avif",
    ],
  },
  {
    id: 4,
    brandId: "zara",
    brand: "Zara",
    name: "Bermuda noir taille haute",
    category: "Pantalon",
    style: "Streetwear",
    season: "Ete",
    size: "Taille 38",
    sizes: ["34", "36", "38", "40", "42"],
    price: 45,
    description:
      "Bermuda noir structure, style urbain et coupe droite.",
    image: "/catalogue-sia/bermuda-noir-zara/02333570800-a3.jpg",
    images: [
      "/catalogue-sia/bermuda-noir-zara/02333570800-a3.jpg",
      "/catalogue-sia/bermuda-noir-zara/02333570800-a1.jpg",
      "/catalogue-sia/bermuda-noir-zara/02333570800-e1.jpg",
      "/catalogue-sia/bermuda-noir-zara/02333570800-e3.jpg",
      "/catalogue-sia/bermuda-noir-zara/02333570800-p.jpg",
    ],
  },
  {
    id: 5,
    brandId: "zara",
    brand: "Zara",
    name: "Ensemble jean denim",
    category: "Jean",
    style: "Casual",
    season: "Automne",
    size: "Taille 36",
    sizes: ["34", "36", "38", "40"],
    price: 99,
    description:
      "Set denim complet avec veste et jean assorti pour un look total denim.",
    image: "/catalogue-sia/ensemble-jean-zara/01416035407-a2.jpg",
    images: [
      "/catalogue-sia/ensemble-jean-zara/01416035407-a2.jpg",
      "/catalogue-sia/ensemble-jean-zara/07484045407-e1.jpg",
      "/catalogue-sia/ensemble-jean-zara/07484045407-e3.jpg",
      "/catalogue-sia/ensemble-jean-zara/01416035407-p.jpg",
    ],
  },
  {
    id: 6,
    brandId: "hm",
    brand: "H&M",
    name: "Blazer leopard H&M",
    category: "Veste",
    style: "Chic",
    season: "Automne",
    size: "Taille 38",
    sizes: ["34", "36", "38", "40"],
    price: 89,
    description:
      "Blazer imprime leopard avec coupe tailleur, piece statement de saison.",
    image: "/catalogue-sia/blazer-leopard-hm/104bcf50e20022ddf00d0ad3737faa3659a71f34.jpg.avif",
    images: [
      "/catalogue-sia/blazer-leopard-hm/104bcf50e20022ddf00d0ad3737faa3659a71f34.jpg.avif",
      "/catalogue-sia/blazer-leopard-hm/8c6e11c26318ae3a23407242333db877348dc966.jpg.avif",
      "/catalogue-sia/blazer-leopard-hm/0221dceb950cc2cd13e81586151c3e2d8b46cd77.jpg.avif",
      "/catalogue-sia/blazer-leopard-hm/5f08cf559f9e4123baa6e6862434a303da978d58.jpg.avif",
      "/catalogue-sia/blazer-leopard-hm/a8f0ffd902fee566d5a2c5079a29e3e641828945.jpg.avif",
    ],
  },
  {
    id: 7,
    brandId: "hm",
    brand: "H&M",
    name: "Blazer marron H&M",
    category: "Veste",
    style: "Chic",
    season: "Automne",
    size: "Taille 36",
    sizes: ["34", "36", "38", "40"],
    price: 84,
    description:
      "Blazer marron coupe droite, look chic et polyvalent pour bureau ou sortie.",
    image: "/catalogue-sia/blazer-marron-hm/42bfb2a0b5294530bdb47e329a7374cd34400c77.jpg.avif",
    images: [
      "/catalogue-sia/blazer-marron-hm/42bfb2a0b5294530bdb47e329a7374cd34400c77.jpg.avif",
      "/catalogue-sia/blazer-marron-hm/62db3001bbd5f1672ed3a5f8e1b8591d6895f072.jpg.avif",
      "/catalogue-sia/blazer-marron-hm/c1c2c9ddf6ff0e792ef62d6c67d6ebc5228c7220.jpg.avif",
      "/catalogue-sia/blazer-marron-hm/5a3db3eeb0a3515db7933ea1c15d79324888de8e.jpg.avif",
      "/catalogue-sia/blazer-marron-hm/1d47b1a675f0368e29a93086726607a64989d02e.jpg.avif",
      "/catalogue-sia/blazer-marron-hm/cc8eed826b30240467d641e4b4e90e6530ec90a4.jpg.avif",
    ],
  },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}

export function getSimilarProducts(product: Product, limit = 4) {
  return products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const scoreA =
        Number(a.category === product.category) * 3 +
        Number(a.style === product.style) * 2 +
        Number(a.brandId === product.brandId);
      const scoreB =
        Number(b.category === product.category) * 3 +
        Number(b.style === product.style) * 2 +
        Number(b.brandId === product.brandId);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
