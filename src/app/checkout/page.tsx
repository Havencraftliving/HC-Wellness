import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PageShell } from "@/components/layout/page-shell";
import { firstQueryValue } from "@/domain/catalog/filters";
import { isStripeConfigured, readAppEnv } from "@/server/env";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout for HC Wellness. Payment stays off until Stripe is configured.",
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const query = await searchParams;
  const checkout = firstQueryValue(query.checkout);
  const paymentsConfigured = isStripeConfigured(readAppEnv());

  return (
    <PageShell>
      <div className="space-y-3">
        <h1 className="text-4xl">Checkout</h1>
        {paymentsConfigured ? (
          checkout === "success" ? (
            <p className="max-w-2xl leading-7">
              You returned from checkout. This page does not confirm that an order
              was recorded.
            </p>
          ) : checkout === "cancelled" ? (
            <p className="max-w-2xl leading-7">
              Checkout was cancelled. No charge was made from this page.
            </p>
          ) : (
            <p className="max-w-2xl leading-7 text-bark-muted">
              The server recalculates every line before payment. Card details are
              collected by Stripe, not on this page.
            </p>
          )
        ) : (
          <p className="max-w-2xl border border-bark px-4 py-3 leading-7">
            Payment is not connected. This page does not collect or charge a card.
          </p>
        )}
      </div>
      <CheckoutForm paymentsConfigured={paymentsConfigured} />
    </PageShell>
  );
}
