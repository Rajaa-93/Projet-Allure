"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useCart } from "@/lib/useCart";
import { getProductById } from "@/lib/products";

type CheckoutCartItemInput = {
  productId: number;
  size: string;
  quantity: number;
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

type CheckoutCreationState = {
  clientSecret: string | null;
  error: string;
  loading: boolean;
};

function MockCheckoutForm({
  items,
}: {
  items: CheckoutCartItemInput[];
}) {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const total = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[#e2d0c4] bg-[#fffaf2] p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full bg-[#efe5cf] px-3 py-2 text-xs font-semibold text-[#8f7244]">
            <CreditCard size={14} className="mr-2" />
            Mode démo
          </div>
          <p className="text-sm font-semibold text-[#1d1813]">
            Total {total.toFixed(2).replace(".", ",")} €
          </p>
        </div>

        <p className="text-sm leading-6 text-[#6f6250]">
          Stripe n&apos;est pas disponible pour le moment. Cette interface simule un
          paiement pour la démo du parcours.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
              Titulaire de la carte
            </span>
            <input
              defaultValue=""
              placeholder="Nom complet"
              className="w-full rounded-[18px] border border-[#d8cab2] bg-white px-4 py-3 text-sm text-[#1d1813] outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
              Numéro de carte
            </span>
            <input
              inputMode="numeric"
              defaultValue=""
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-[18px] border border-[#d8cab2] bg-white px-4 py-3 text-sm text-[#1d1813] outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                Expiration
              </span>
              <input
                inputMode="numeric"
                defaultValue=""
                placeholder="MM/AA"
                className="w-full rounded-[18px] border border-[#d8cab2] bg-white px-4 py-3 text-sm text-[#1d1813] outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                CVC
              </span>
              <input
                inputMode="numeric"
                defaultValue=""
                placeholder="123"
                className="w-full rounded-[18px] border border-[#d8cab2] bg-white px-4 py-3 text-sm text-[#1d1813] outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
              Code postal
            </span>
            <input
              defaultValue=""
              placeholder="75001"
              className="w-full rounded-[18px] border border-[#d8cab2] bg-white px-4 py-3 text-sm text-[#1d1813] outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.push(`/commande/succes?demo=1&amount=${total.toFixed(2)}`);
            })
          }
          disabled={isSubmitting}
          className="mt-5 w-full rounded-full bg-[#1b1712] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_24px_rgba(22,17,12,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Validation en cours..." : "Payer"}
        </button>
      </div>
    </div>
  );
}

function EmbeddedCheckoutShell({ items }: { items: CheckoutCartItemInput[] }) {
  const [state, setState] = useState<CheckoutCreationState>({
    clientSecret: null,
    error: "",
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function createCheckoutSession() {
      setState({ clientSecret: null, error: "", loading: true });

      try {
        const response = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        const data = (await response.json()) as {
          clientSecret?: string;
          error?: string;
        };

        if (!response.ok || !data.clientSecret) {
          throw new Error(
            data.error ?? "Impossible d'initialiser la session de paiement."
          );
        }

        if (!cancelled) {
          setState({ clientSecret: data.clientSecret, error: "", loading: false });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            clientSecret: null,
            error:
              error instanceof Error
                ? error.message
                : "Impossible d'initialiser Stripe pour le moment.",
            loading: false,
          });
        }
      }
    }

    void createCheckoutSession();

    return () => {
      cancelled = true;
    };
  }, [items]);

  if (state.loading) {
    return (
      <div className="rounded-[24px] border border-[#d8cab2] bg-[#fffaf2] p-5 text-sm text-[#6f6250]">
        Initialisation du paiement sécurisé...
      </div>
    );
  }

  if (state.error || !state.clientSecret) {
    return <MockCheckoutForm items={items} />;
  }

  return (
    <EmbeddedCheckoutProvider
      key={state.clientSecret}
      stripe={stripePromise}
      options={{ clientSecret: state.clientSecret }}
    >
      <EmbeddedCheckout className="overflow-hidden rounded-[28px]" />
    </EmbeddedCheckoutProvider>
  );
}

export default function PaymentEmbeddedCheckout() {
  const { ready, items } = useCart();
  const checkoutItems: CheckoutCartItemInput[] = items.map((item) => ({
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
  }));

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="mb-5">
        <p
          className="text-[15px] tracking-[0.18em] text-[#b79a63]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Allure
        </p>
        <h1 className="text-xl font-semibold text-[#1b1712]">Paiement sécurisé</h1>
        <p className="text-sm text-[#7a6d5b]">
          Finalisez votre commande dans une interface sécurisée, directement intégrée
          à l&apos;expérience Allure.
        </p>
      </div>

      <section className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-[#efe5cf] px-3 py-2 text-xs font-semibold text-[#8f7244]">
            <Lock size={14} className="mr-2" />
            Paiement sécurisé par Stripe
          </span>
          <Link
            href="/panier"
            className="text-sm font-semibold text-[#1d1813] underline underline-offset-4"
          >
            Retour au panier
          </Link>
        </div>

        {!ready ? (
          <div className="rounded-[24px] border border-[#d8cab2] bg-[#fffaf2] p-5 text-sm text-[#6f6250]">
            Chargement de votre panier...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] border border-[#d8cab2] bg-[#fffaf2] p-5 text-sm text-[#6f6250]">
            Votre panier est vide. Revenez au{" "}
            <Link href="/panier" className="font-semibold text-[#8f7244]">
              panier
            </Link>{" "}
            pour ajouter des articles avant le paiement.
          </div>
        ) : !publishableKey ? (
          <MockCheckoutForm items={checkoutItems} />
        ) : (
          <EmbeddedCheckoutShell items={checkoutItems} />
        )}
      </section>
    </main>
  );
}
