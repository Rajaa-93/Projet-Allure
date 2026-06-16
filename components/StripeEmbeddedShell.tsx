"use client";

import { useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type CheckoutCartItemInput = {
  productId: number;
  size: string;
  quantity: number;
};

type CheckoutCreationState = {
  clientSecret: string | null;
  error: string;
  loading: boolean;
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

export default function StripeEmbeddedShell({
  items,
}: {
  items: CheckoutCartItemInput[];
}) {
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
    return (
      <div className="rounded-[24px] border border-[#e2d0c4] bg-[#fffaf2] p-5 text-sm text-[#6f6250]">
        {state.error || "Impossible d'initialiser Stripe pour le moment."}
      </div>
    );
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
