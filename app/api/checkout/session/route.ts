import { NextResponse } from "next/server";
import { buildStripeLineItems, validateCheckoutCart } from "@/lib/checkout";
import { getAppUrl, getStripeServer } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cartItems = validateCheckoutCart(body?.items);
    const stripe = getStripeServer();
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: `${appUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      line_items: buildStripeLineItems(cartItems),
      metadata: {
        source: "allure-panier",
        cart: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          }))
        ),
      },
    });

    if (!session.client_secret) {
      throw new Error("Stripe n'a pas renvoyé de client secret pour cette session.");
    }

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue lors de la création du paiement.";

    const status =
      message === "Votre panier est vide." ||
      message.includes("invalide") ||
      message.includes("introuvable") ||
      message.includes("disponible") ||
      message.includes("maximale")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
