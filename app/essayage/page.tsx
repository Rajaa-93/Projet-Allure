"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { type ProductVariant } from "@/lib/products";
import { useCart } from "@/lib/useCart";
import {
  avatarViews,
  getAvatarBaseImage,
  slugifyAsset,
  type ViewName,
} from "@/lib/tryOnAssets";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Upload,
} from "lucide-react";

type TryOnProduct = {
  cartProductId: number;
  assetSlug: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  variants: ProductVariant[];
};

type SourcePhoto = {
  id: string;
  url: string;
  view: ViewName;
  objectUrl?: boolean;
};

const tryOnProducts: TryOnProduct[] = [
  {
    cartProductId: 7,
    assetSlug: "1-trench-coat-long",
    brand: "Zara",
    name: "Trench coat long",
    price: 109,
    image: "/catalogue-sia/blazer-marron-hm/42bfb2a0b5294530bdb47e329a7374cd34400c77.jpg.avif",
    sizes: ["34", "36", "38", "40", "42"],
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
  },
  {
    cartProductId: 3,
    assetSlug: "2-robe-midi-a-pois",
    brand: "H&M",
    name: "Robe midi à pois",
    price: 49,
    image: "/catalogue-sia/robe-pois-hm/94269039f99cc8fe97261407aa1fc85da899d002.jpg.avif",
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { name: "Noir pois", kind: "Motif", value: "dots", available: true },
      { name: "Ecru", kind: "Couleur", value: "#e8dbc6", available: true },
      {
        name: "Rouge brique",
        kind: "Couleur",
        value: "#9f4636",
        available: true,
        priceDelta: 4,
      },
    ],
  },
  {
    cartProductId: 5,
    assetSlug: "3-jean-wide",
    brand: "Mango",
    name: "Jean wide",
    price: 59,
    image: "/catalogue-sia/ensemble-jean-zara/01416035407-a2.jpg",
    sizes: ["36", "38", "40", "42", "44"],
    variants: [
      { name: "Bleu clair", kind: "Couleur", value: "#7f9fbd", available: true },
      { name: "Denim brut", kind: "Couleur", value: "#334b66", available: true },
    ],
  },
  {
    cartProductId: 6,
    assetSlug: "4-baskets-city",
    brand: "Uniqlo",
    name: "Baskets city",
    price: 79,
    image: "/catalogue-sia/blazer-leopard-hm/104bcf50e20022ddf00d0ad3737faa3659a71f34.jpg.avif",
    sizes: ["37", "38", "39", "40", "41"],
    variants: [
      { name: "Blanc", kind: "Couleur", value: "#f5f1e8", available: true },
      { name: "Sable", kind: "Couleur", value: "#c4aa78", available: true },
      { name: "Graphite", kind: "Couleur", value: "#3a3936", available: true },
    ],
  },
  {
    cartProductId: 1,
    assetSlug: "5-chemise-satin",
    brand: "C&A",
    name: "Chemise satin",
    price: 39,
    image: "/catalogue-sia/cardigan-vert-zara/05755903933-e3.jpg",
    sizes: ["S", "M", "L", "XL"],
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
  },
  {
    cartProductId: 7,
    assetSlug: "6-escarpins-nude",
    brand: "Kiabi",
    name: "Escarpins nude",
    price: 44,
    image: "/catalogue-sia/blazer-marron-hm/62db3001bbd5f1672ed3a5f8e1b8591d6895f072.jpg.avif",
    sizes: ["36", "37", "38", "39", "40"],
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
  },
];

function buildDemoPhotos(): SourcePhoto[] {
  return avatarViews.map((view) => ({
    id: `demo-${view}`,
    url: getAvatarBaseImage(view),
    view,
  }));
}

function getAvailableSize(product: TryOnProduct) {
  return product.sizes[0] ?? "";
}

function getTryOnAssetImage(
  product: TryOnProduct | undefined,
  variant: ProductVariant | undefined,
  view: ViewName
) {
  if (!product || !variant) {
    return getAvatarBaseImage(view);
  }

  const viewMap: Record<ViewName, string> = {
    Face: "face",
    "Profil droit": "right",
    Dos: "back",
    "Profil gauche": "left",
  };

  return `/models/avatar/looks/${product.assetSlug}/${slugifyAsset(variant.name)}/${viewMap[view]}.jpg`;
}

export default function EssayagePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadUrlsRef = useRef<string[]>([]);
  const { addItem, itemCount } = useCart();

  const [photos, setPhotos] = useState<SourcePhoto[]>(() => buildDemoPhotos());
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    tryOnProducts[0] ? getAvailableSize(tryOnProducts[0]) : ""
  );
  const [selectedVariantName, setSelectedVariantName] = useState(
    tryOnProducts[0]?.variants[0]?.name ?? ""
  );
  const [message, setMessage] = useState(
    "Choisissez un look, changez de vue et ajoutez directement l’article au panier."
  );

  const selectedEntry =
    tryOnProducts.find((item) => item.cartProductId === selectedProductId) ?? tryOnProducts[0];
  const selectedVariant = selectedEntry?.variants.find(
    (variant) => variant.name === selectedVariantName
  );
  const currentView = avatarViews[currentViewIndex] ?? avatarViews[0];
  const currentAvatarImage = getTryOnAssetImage(selectedEntry, selectedVariant, currentView);

  useEffect(() => {
    return () => {
      uploadUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(event.target.files ?? []).slice(0, avatarViews.length);
    uploadUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    uploadUrlsRef.current = [];

    if (fileList.length === 0) {
      setPhotos(buildDemoPhotos());
      setMessage("Avatar de demonstration restaure.");
      return;
    }

    const nextPhotos = fileList.map((file, index) => {
      const url = URL.createObjectURL(file);
      uploadUrlsRef.current.push(url);
      return {
        id: `${file.name}-${index}`,
        url,
        view: avatarViews[index] ?? avatarViews[0],
        objectUrl: true,
      };
    });

    setPhotos(nextPhotos);
    setCurrentViewIndex(0);
    setMessage("Vos photos ont ete ajoutees comme base de reference.");
  }

  function updatePhotoView(id: string, view: ViewName) {
    setPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, view } : photo)));
  }

  function restoreDemoAvatar() {
    uploadUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    uploadUrlsRef.current = [];
    setPhotos(buildDemoPhotos());
    setCurrentViewIndex(0);
    setMessage("Avatar de demonstration restaure.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function rotate(step: number) {
    setCurrentViewIndex((prev) => (prev + step + avatarViews.length) % avatarViews.length);
  }

  function addToCart() {
    if (!selectedEntry || !selectedSize) {
      setMessage("Selectionne d’abord une taille pour ajouter l’article.");
      return;
    }
    addItem(selectedEntry.cartProductId, selectedSize);
    setMessage(`${selectedEntry.name} a bien ete ajoute au panier.`);
  }

  function selectProduct(entry: TryOnProduct) {
    setSelectedProductId(entry.cartProductId);
    setSelectedSize(getAvailableSize(entry));
    setSelectedVariantName(entry.variants[0]?.name ?? "");
  }

  return (
    <>
      <main className="px-4 pb-28 pt-14">
        <div className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[15px] tracking-[0.18em] text-[#b79a63]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Allure
              </p>
              <h1 className="text-xl font-semibold text-[#1b1712]">
                Avatar et essayage
              </h1>
              <p className="text-sm text-[#7a6d5b]">
                Visualisez vos looks sur un avatar 360° avant d’ajouter l’article au
                panier.
              </p>
            </div>

            <Link
              href="/panier"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8cab2] bg-[#fbf8f1] text-[#2b241d]"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag size={16} />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1b1712] px-1 text-[10px] font-semibold text-[#f6f1e7]">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        <section className="mb-4 rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_30px_rgba(60,45,25,0.1)]">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#efe3ca] text-[#a78953]">
              <Sparkles size={18} />
            </div>
            <h2 className="text-[1.35rem] font-semibold text-[#1d1813]">
              Préparez votre avatar
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6f6250]">
              Ajoutez jusqu’à 4 photos de référence ou gardez l’avatar de démonstration.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#d6c8ae] bg-white shadow-[0_8px_20px_rgba(60,45,25,0.08)]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-3 px-5 py-4 text-left text-base font-medium text-[#1d1813]"
            >
              <Upload size={20} />
              Choisir mes photos
            </button>
            <button
              type="button"
              onClick={restoreDemoAvatar}
              className="flex w-full items-center gap-3 border-t border-[#e2d6bf] bg-[linear-gradient(180deg,#d7b86d_0%,#a8792f_100%)] px-5 py-4 text-left text-base font-semibold text-[#201811]"
            >
              <ImageIcon size={20} />
              Utiliser l’avatar de démo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-[22px] border border-[#d6c8ae] bg-white"
              >
                <img src={photo.url} alt={photo.view} className="h-28 w-full object-cover" />
                <div className="border-t border-[#e2d6bf] p-3">
                  <label className="mb-1 block text-xs font-medium text-[#7a6d5b]">
                    Vue
                  </label>
                  <select
                    value={photo.view}
                    onChange={(event) => updatePhotoView(photo.id, event.target.value as ViewName)}
                    className="w-full rounded-2xl border border-[#d8cab2] bg-[#fbf8f1] px-3 py-2 text-sm text-[#2c241b] outline-none"
                  >
                    {avatarViews.map((view) => (
                      <option key={view} value={view}>
                        {view}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_30px_rgba(60,45,25,0.1)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a48756]">
                Vue active
              </p>
              <h2 className="text-[1.25rem] font-semibold text-[#1d1813]">{currentView}</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => rotate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7cab2] bg-white text-[#2b241d]"
                aria-label="Vue précédente"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => rotate(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7cab2] bg-white text-[#2b241d]"
                aria-label="Vue suivante"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[26px] border border-[#ddcfb8] bg-[radial-gradient(circle_at_top,_#fffdf8_0%,_#f6efdf_48%,_#efe4d0_100%)]">
            <img
              src={currentAvatarImage}
              alt={`${selectedEntry?.name ?? "Avatar"} - ${currentView}`}
              className="h-[430px] w-full object-cover object-top"
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {avatarViews.map((view, index) => (
              <button
                key={view}
                type="button"
                onClick={() => setCurrentViewIndex(index)}
                className={`rounded-[18px] border px-2 py-3 text-center text-xs font-semibold ${
                  currentViewIndex === index
                    ? "border-[#c9ae72] bg-[#f4e7ca] text-[#1d1813]"
                    : "border-[#ddd1bd] bg-white text-[#6f6250]"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_30px_rgba(60,45,25,0.1)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a48756]">
                Look sélectionné
              </p>
              <h2 className="text-[1.3rem] font-semibold text-[#1d1813]">
                {selectedEntry?.brand} - {selectedEntry?.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={restoreDemoAvatar}
              className="flex h-10 items-center gap-2 rounded-full border border-[#d7cab2] bg-white px-4 text-sm font-medium text-[#2b241d]"
            >
              <RotateCcw size={15} />
              Repartir
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {tryOnProducts.map((entry) => {
              const active = entry.cartProductId === selectedProductId;
              return (
                <button
                  key={entry.assetSlug}
                  type="button"
                  onClick={() => selectProduct(entry)}
                  className={`overflow-hidden rounded-[22px] border text-left ${
                    active
                      ? "border-[#c9ae72] bg-[#f7efde] shadow-[0_12px_26px_rgba(163,127,63,0.18)]"
                      : "border-[#ddd1bd] bg-white"
                  }`}
                >
                  <img
                    src={entry.image}
                    alt={entry.name}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9c8050]">
                      {entry.brand}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1d1813]">
                      {entry.name}
                    </p>
                    <p className="mt-1 text-sm text-[#6f6250]">{entry.price},00 €</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] bg-[#f5ecdb] p-4">
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8f7244]">
                  Taille
                </label>
                <div className="flex flex-wrap gap-2">
                {selectedEntry?.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        selectedSize === size
                          ? "bg-[#1b1712] text-[#f5ebd6]"
                          : "bg-white text-[#2b241d]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8f7244]">
                  Variante
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry?.variants.map((variant) => (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setSelectedVariantName(variant.name)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                        selectedVariantName === variant.name
                          ? "border-[#1b1712] bg-[#1b1712] text-[#f5ebd6]"
                          : "border-[#d7cab2] bg-white text-[#2b241d]"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[22px] bg-[#efe4cd] px-4 py-3 text-sm text-[#5f5448]">
            <Check size={16} className="shrink-0 text-[#9a804b]" />
            <span>{message}</span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#d7b86d_0%,#a8792f_100%)] text-sm font-semibold text-[#1a1510]"
          >
            Ajouter au panier
          </button>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
