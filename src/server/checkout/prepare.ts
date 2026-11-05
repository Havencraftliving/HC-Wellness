import { parseCartLines } from "@/domain/cart/cart";
import type { PaymentProvider } from "@/server/payments/types";
import {
  validateCart,
  type CartValidationErrorCode,
} from "@/server/checkout/validate-cart";

export type CheckoutErrorCode =
  | "invalid_cart"
  | CartValidationErrorCode
  | "payments_not_configured"
  | "payment_failed";

export type PrepareResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; code: CheckoutErrorCode };

/**
 * The charged amount is the catalog total from validateCart.
 * payload may contain a client total; parseCartLines drops it.
 */
export async function prepareCheckout(
  payload: unknown,
  payments: PaymentProvider,
): Promise<PrepareResult> {
  const parsed = parseCartLines(payload);
  if (!parsed.ok) {
    return parsed;
  }

  const validated = validateCart(parsed.lines);
  if (!validated.ok) {
    return validated;
  }

  const session = await payments.createCheckout({
    lines: validated.lines,
    totalCadCents: validated.totalCadCents,
  });

  if (!session.ok) {
    return session;
  }

  if (!session.url) {
    return { ok: false, code: "payment_failed" };
  }

  return { ok: true, redirectUrl: session.url };
}
