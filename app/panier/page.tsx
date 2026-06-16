"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import AllureLogo from "@/components/AllureLogo";
import BottomNav from "@/components/BottomNav";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCartProductById, getCartProductPrice } from "@/lib/cartProducts";
import { useCart } from "@/lib/useCart";

export default function PanierPage() {
  const router = useRouter();
  const [isNavigatingToPayment, startTransition] = useTransition();
  const { ready, items, itemCount, removeItem, updateQuantity } = useCart();
  const cartLines = items.flatMap((item) => {
    const product = getCartProductById(item.productId);
    if (!product) {
      return [];
    }

    return [
      {
        ...item,
        product,
        unitPrice: getCartProductPrice(product, item.variantName),
      },
    ];
  });
  const total = cartLines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );

  return (
    <>
      <main className="px-4 pb-28 pt-14">
        <div className="mb-5">
          <AllureLogo className="relative mb-2 h-16 w-32" priority />
          <h1 className="text-xl font-semibold text-[#1b1712]">Panier</h1>
          <p className="text-sm text-[#7a6d5b]">
            {itemCount > 0
              ? `${itemCount} article${itemCount > 1 ? "s" : ""} prêt${
                  itemCount > 1 ? "s" : ""
                } à être commandé${itemCount > 1 ? "s" : ""}.`
              : "Ajoutez vos pièces préférées depuis la fiche produit."}
          </p>
        </div>

        {!ready ? (
          <div className="rounded-[22px] border border-[#d8cab2] bg-[#fbf8f1] p-4 text-sm text-[#6a5c49]">
            Chargement de votre panier...
          </div>
        ) : cartLines.length === 0 ? (
          <div className="rounded-[22px] border border-[#d8cab2] bg-[#fbf8f1] p-4 text-sm text-[#6a5c49]">
            Votre panier est vide. Ajoutez des articles depuis le{" "}
            <Link href="/catalogue" className="font-semibold text-[#8f7244]">
              catalogue
            </Link>
            .
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cartLines.map((line) => (
                <article
                  key={`${line.product.id}-${line.size}-${line.variantName ?? ""}`}
                  className="rounded-[22px] border border-[#d8cab2] bg-[#fbf8f1] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#7f6a47]">
                        {line.product.brand}
                      </p>
                      {line.product.catalogueHref ? (
                        <Link
                          href={line.product.catalogueHref}
                          className="text-base font-semibold text-[#1d1813]"
                        >
                          {line.product.name}
                        </Link>
                      ) : (
                        <p className="text-base font-semibold text-[#1d1813]">
                          {line.product.name}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-[#6f6250]">
                        Taille {line.size}
                        {line.variantName ? ` · ${line.variantName}` : ""}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-[#1d1813]">
                      {line.unitPrice * line.quantity}€
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            line.product.id,
                            line.size,
                            line.quantity - 1,
                            line.variantName
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8cab2] bg-white text-[#2b241d]"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-[#1d1813]">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            line.product.id,
                            line.size,
                            line.quantity + 1,
                            line.variantName
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8cab2] bg-white text-[#2b241d]"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(line.product.id, line.size, line.variantName)
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[#e2d0c4] px-3 py-2 text-sm text-[#7b4f42]"
                    >
                      <Trash2 size={14} />
                      Retirer
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <section className="mt-4 rounded-[22px] border border-[#d8cab2] bg-[#fbf8f1] p-4">
              <div className="flex items-center justify-between text-sm text-[#6f6250]">
                <span>Sous-total</span>
                <span className="font-semibold text-[#1d1813]">{total}€</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-[#6f6250]">
                <span>Livraison</span>
                <span className="font-semibold text-[#1d1813]">Offerte</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#eadfcb] pt-4">
                <span className="text-sm font-semibold text-[#1d1813]">Total</span>
                <span className="text-lg font-semibold text-[#1d1813]">{total}€</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  startTransition(() => {
                    router.push("/paiement");
                  })
                }
                disabled={isNavigatingToPayment}
                className="mt-4 w-full rounded-full bg-[#1b1712] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#f6f1e7] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isNavigatingToPayment
                  ? "Redirection vers le paiement..."
                  : "Passer la commande"}
              </button>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </>
  );
}
