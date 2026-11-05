import { parseCartLines } from "@/domain/cart/cart";
import type { AppEnv } from "@/server/env";
import { isOdooConfigured } from "@/server/env";
import { validateCart } from "@/server/checkout/validate-cart";
import type { PaidOrder } from "@/server/orders/types";
import type { VerifiedStripeEvent } from "@/server/payments/types";

export type WebhookResponse = {
  status: number;
  body: {
    ok: boolean;
    code?: string;
    recorded: boolean;
    orderId?: string;
  };
};

export type StripeSignatureVerifier = (
  rawBody: string,
  signature: string,
  webhookSecret: string,
  secretKey: string,
) => Promise<VerifiedStripeEvent>;

/**
 * Verifies Stripe, then records an order only when Odoo is configured too.
 * Without STRIPE_WEBHOOK_SECRET this does not report success.
 */
export async function handleStripeWebhook(input: {
  rawBody: string;
  signature: string | null;
  env: AppEnv;
  verify: StripeSignatureVerifier;
  recordOrder: (order: PaidOrder) => Promise<
    | { ok: true; recorded: true; orderId: string }
    | { ok: false; recorded: false; code: string }
  >;
}): Promise<WebhookResponse> {
  if (!input.env.STRIPE_WEBHOOK_SECRET) {
    return {
      status: 503,
      body: { ok: false, recorded: false, code: "webhook_not_configured" },
    };
  }

  if (!input.env.STRIPE_SECRET_KEY) {
    return {
      status: 503,
      body: { ok: false, recorded: false, code: "stripe_not_configured" },
    };
  }

  if (!input.signature) {
    return {
      status: 400,
      body: { ok: false, recorded: false, code: "invalid_signature" },
    };
  }

  let event: VerifiedStripeEvent;
  try {
    event = await input.verify(
      input.rawBody,
      input.signature,
      input.env.STRIPE_WEBHOOK_SECRET,
      input.env.STRIPE_SECRET_KEY,
    );
  } catch {
    return {
      status: 400,
      body: { ok: false, recorded: false, code: "invalid_signature" },
    };
  }

  if (event.type !== "checkout.session.completed" || !event.session) {
    return { status: 200, body: { ok: true, recorded: false } };
  }

  if (!isOdooConfigured(input.env)) {
    return {
      status: 503,
      body: { ok: false, recorded: false, code: "orders_not_configured" },
    };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(event.session.cartPayload ?? "");
  } catch {
    return {
      status: 400,
      body: { ok: false, recorded: false, code: "invalid_cart" },
    };
  }

  const parsed = parseCartLines(payload);
  if (!parsed.ok) {
    return {
      status: 400,
      body: { ok: false, recorded: false, code: parsed.code },
    };
  }

  const validated = validateCart(parsed.lines);
  if (!validated.ok) {
    return {
      status: 400,
      body: { ok: false, recorded: false, code: validated.code },
    };
  }

  if (event.session.amountTotal !== validated.totalCadCents) {
    return {
      status: 409,
      body: { ok: false, recorded: false, code: "amount_mismatch" },
    };
  }

  const result = await input.recordOrder({
    checkoutSessionId: event.session.id,
    customerEmail: event.session.customerEmail,
    currency: "CAD",
    totalCadCents: validated.totalCadCents,
    lines: validated.lines.map((line) => ({
      productId: line.productId,
      name: line.name,
      quantity: line.quantity,
      unitCadCents: line.unitCadCents,
      selections: line.selections,
    })),
  });

  if (!result.ok) {
    return {
      status: 502,
      body: { ok: false, recorded: false, code: result.code },
    };
  }

  return {
    status: 200,
    body: { ok: true, recorded: true, orderId: result.orderId },
  };
}
