import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  BadgePercent,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { brands, products } from "@/lib/products";

export default function CataloguePage() {
  return (
    <>
      <main className="px-4 pb-28 pt-14">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p
              className="text-[15px] tracking-[0.18em] text-[#b79a63]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Allure
            </p>
            <h1 className="text-sm text-[#7a6d5b]">Recherche & filtres</h1>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9ccb8] bg-[#fbf8f1] text-[#2b241d]">
            <ShoppingBag size={18} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center gap-2 rounded-full border border-[#d8cab2] bg-[#fbf8f1] px-4 text-[#8d806d]">
            <Search size={18} />
            <span className="text-sm">Chercher des articles...</span>
          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cab2] bg-[#fbf8f1] text-[#2b241d]">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {brands.map((brand) => (
            <button
              key={brand}
              className="shrink-0 rounded-full border border-[#d8cab2] bg-[#fbf8f1] px-4 py-2 text-xs font-semibold tracking-wide text-[#3b3127]"
            >
              {brand}
            </button>
          ))}
        </div>

        <div className="mb-4 rounded-[24px] border border-[#d7cab2] bg-[#fbf8f1] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe3ca] text-[#8c6f3c]">
              <BadgePercent size={18} />
            </div>
            <div>
              <p className="font-semibold text-[#1d1813]">Sélection du moment</p>
              <p className="text-sm text-[#7d705e]">
                Pièces adaptées à votre morphologie et à votre style.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[22px] border border-[#d8cab2] bg-[#fbf8f1] shadow-[0_8px_20px_rgba(55,43,28,0.08)]"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-full object-cover"
                />
                <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#fffaf1]/90 text-[#7e6c57]">
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-3">
                <p className="text-sm font-semibold text-[#1d1813]">
                  {product.brand}
                </p>
                <p className="line-clamp-2 text-sm text-[#2d241a]">
                  {product.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#8a7d69]">{product.size}</span>
                  <span className="text-sm font-semibold text-[#1d1813]">
                    {product.price}€
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav />
    </>
  );
}