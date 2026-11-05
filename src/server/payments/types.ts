import type { OptionGroupSelection } from "@/domain/catalog/price";
import type { ValidatedCartLine } from "@/server/checkout/validate-cart";

export type CheckoutSessionInput = {
  lines: readonly ValidatedCartLine[];
  totalCadCents: number;
};

export type PaymentResult =
  | { ok: true; url: string }
  | { ok: false; code: "payments_not_configured" | "payment_failed" };

export type PaymentProvider = {
  readonly configured: boolean;
  createCheckout(input: CheckoutSessionInput): Promise<PaymentResult>;
};

export const unconfiguredPaymentProvider: PaymentProvider = {
  configured: false,
  async createCheckout() {
    return { ok: false, code: "payments_not_configured" };
  },
};

/** Stripe metadata value limit. The cart JSON must fit in one value. */
export const STRIPE_METADATA_VALUE_LIMIT = 500;

export const CART_METADATA_KEY = "cart";

export function serializeCartMetadata(
  lines: readonly {
    productId: string;
    selections: OptionGroupSelection;
    quantity: number;
  }[],
): string {
  return JSON.stringify(
    lines.map((line) => ({
      productId: line.productId,
      selections: line.selections,
      quantity: line.quantity,
    })),
  );
}

export type VerifiedStripeEvent = {
  type: string;
  session?: {
    id: string;
    amountTotal: number | null;
    customerEmail?: string;
    cartPayload?: string;
  };
};
