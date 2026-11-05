"use client";

import { useActionState } from "react";
import { CartView } from "@/components/cart/cart-view";
import { useCart } from "@/components/cart/cart-provider";
import { MotionButton } from "@/components/motion/pressable";
import { primaryButtonClassName } from "@/components/ui/styles";
import { startCheckout } from "@/app/checkout/actions";
import type { PrepareResult } from "@/server/checkout/prepare";
import { calculatePrice } from "@/domain/catalog/price";

const messages: Record<string, string> = {
  invalid_cart: "The cart could not be read.",
  empty_cart: "The cart is empty.",
  invalid_quantity: "A quantity is not valid.",
  unknown_product: "A product in the cart is not for sale.",
  unknown_option: "An option in the cart is not available.",
  missing_selection: "An option selection is missing.",
  extra_selection: "An option selection is not valid for that product.",
  payments_not_configured:
    "Payment is not connected. No card was collected and no charge was made.",
  payment_failed: "Payment could not be started. No charge was made.",
};

export function CheckoutForm({
  paymentsConfigured,
}: {
  paymentsConfigured: boolean;
}) {
  const { lines, ready } = useCart();
  const [state, action, pending] = useActionState<PrepareResult | null, FormData>(
    startCheckout,
    null,
  );
  const payload = lines.map((line) => ({
    productId: line.productId,
    selections: line.selections,
    quantity: line.quantity,
  }));
  const priced = lines.every((line) => calculatePrice(line.productId, line.selections).ok);
  const failure = state && !state.ok ? state.code : null;

  return (
    <form action={action} className="space-y-8">
      <CartView editable={false} />
      <input type="hidden" name="cart" value={JSON.stringify(payload)} />
      {ready && lines.length > 0 ? (
        <MotionButton
          type="submit"
          className={primaryButtonClassName}
          disabled={pending || !priced}
        >
          {pending
            ? "Submitting"
            : paymentsConfigured
              ? "Continue to payment"
              : "Submit order"}
        </MotionButton>
      ) : null}
      <p aria-live="polite">
        {failure ? (messages[failure] ?? "Checkout could not continue.") : null}
      </p>
    </form>
  );
}
