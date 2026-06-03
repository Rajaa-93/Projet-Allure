import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: "STRIPE_SECRET_KEY" | "NEXT_PUBLIC_APP_URL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `La variable d'environnement ${name} est manquante. Ajoutez-la dans votre fichier .env.local avant d'utiliser Stripe.`
    );
  }

  return value;
}

export function getStripeServer() {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
  }

  return stripeClient;
}

export function getAppUrl() {
  return getRequiredEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
}

export async function retrieveCheckoutSession(sessionId: string) {
  return getStripeServer().checkout.sessions.retrieve(sessionId);
}
