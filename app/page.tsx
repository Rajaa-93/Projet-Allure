import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { brands, products } from "@/lib/products";

export default function HomePage() {
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
            <h1 className="text-sm text-[#7a6d5b]">Catalogue personnalisé</h1>
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

          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cab2] bg-[#efe5cf] text-[#2b241d]">
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

        <section className="mb-5 rounded-[28px] border border-[#d7cab2] bg-[linear-gradient(135deg,#e8d4a8_0%,#c9ae72_42%,#f4ead3_100%)] p-5 text-[#1f1a15] shadow-[0_14px_35px_rgba(111,89,44,0.18)]">
          <p className="mb-1 text-lg font-semibold uppercase tracking-wide">
            Essayez virtuellement
          </p>
          <p className="max-w-[270px] text-sm text-[#3c3128]">
            Réduisez les retours, trouvez votre taille idéale grâce à notre IA de modélisation 3D.
          </p>

          <Link
            href="/essayage"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[#16120e] px-5 py-3 text-sm font-medium text-[#f6f1e7]"
          >
            <Sparkles size={16} className="mr-2" />
            Créer mon Avatar
          </Link>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold uppercase tracking-wide text-[#1e1a15]">
              Recommandés pour vous
            </h2>
            <Link
              href="/catalogue"
              className="text-xs font-semibold text-[#9f8657]"
            >
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((product) => (
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
                  <p className="mt-1 text-xs text-[#8a7d69]">{product.size}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}