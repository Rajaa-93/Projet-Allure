import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";
import { retrieveCheckoutSession } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function CommandeSuccesPage(
  props: PageProps<"/commande/succes">
) {
  const searchParams = await props.searchParams;
  const sessionId =
    typeof searchParams.session_id === "string" ? searchParams.session_id : null;
  const isDemoMode = searchParams.demo === "1";
  const demoAmountRaw =
    typeof searchParams.amount === "string" ? Number(searchParams.amount) : null;

  let isPaid = isDemoMode;
  let amountTotal: number | null = null;

  if (isDemoMode && demoAmountRaw !== null && Number.isFinite(demoAmountRaw)) {
    amountTotal = demoAmountRaw;
  }

  if (!isDemoMode && sessionId) {
    try {
      const session = await retrieveCheckoutSession(sessionId);
      isPaid =
        session.payment_status === "paid" ||
        (session.status === "complete" && session.payment_status === "no_payment_required");
      amountTotal =
        typeof session.amount_total === "number" ? session.amount_total / 100 : null;
    } catch {
      isPaid = false;
    }
  }

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
          <h1 className="text-xl font-semibold text-[#1b1712]">
            {isPaid ? "Merci pour votre commande" : "Paiement non confirmé"}
          </h1>
          <p className="text-sm text-[#7a6d5b]">
            {isPaid
              ? "Votre commande a bien été validée. Nous préparons déjà vos pièces."
              : "Nous n'avons pas pu confirmer ce paiement. Vous pouvez revenir au panier et réessayer."}
          </p>
        </div>

        <section className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
          {isPaid ? (
            <>
              <ClearCartOnSuccess />
              <div className="rounded-[22px] bg-[linear-gradient(135deg,#f7edd6_0%,#ead4a1_48%,#f8f2e6_100%)] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8f7244]">
                  Confirmation
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1d1813]">
                  Paiement accepté
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5c4d3a]">
                  {amountTotal !== null
                    ? `Montant réglé : ${amountTotal.toFixed(2).replace(".", ",")} €`
                    : "Votre paiement a été validé avec succès."}
                </p>
                {isDemoMode ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                    Confirmation générée en mode démo
                  </p>
                ) : null}
              </div>

              <div className="mt-4">
                <Link
                  href="/catalogue"
                  className="block w-full rounded-full bg-[#1b1712] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide no-underline shadow-[0_12px_24px_rgba(22,17,12,0.24)]"
                >
                  <span
                    className="text-white"
                    style={{
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                    }}
                  >
                    Retour au shopping
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[22px] bg-[#fffaf2] px-4 py-4 text-sm text-[#6f6250]">
                Aucun paiement confirmé n&apos;est associé à cette visite pour le moment.
              </div>
              <Link
                href="/panier"
                className="block w-full rounded-full border border-[#d8cab2] bg-[#fffaf2] px-4 py-3 text-center text-sm font-semibold text-[#1d1813]"
              >
                Retour au panier
              </Link>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </>
  );
}
