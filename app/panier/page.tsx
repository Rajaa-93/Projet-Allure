import BottomNav from "@/components/BottomNav";
import { Heart } from "lucide-react";
import { products } from "@/lib/products";

export default function PanierPage() {
  return (
    <>
      <main className="px-4 pb-28 pt-14">
        <div className="mb-5">
          <p
            className="text-[15px] tracking-[0.18em] text-[#b79a63]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Allure
          </p>
          <h1 className="text-xl font-semibold text-[#1b1712]">Favoris</h1>
          <p className="text-sm text-[#7a6d5b]">
            Vos pièces enregistrées pour plus tard.
          </p>
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
                <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1b1712] text-[#d8c08a]">
                  <Heart size={16} fill="currentColor" />
                </div>
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
      </main>

      <BottomNav />
    </>
  );
}