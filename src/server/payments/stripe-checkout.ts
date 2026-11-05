import type { AppEnv } from "@/server/env";
import {
  CART_METADATA_KEY,
  serializeCartMetadata,
  STRIPE_METADATA_VALUE_LIMIT,
  type PaymentProvider,
  type VerifiedStripeEvent,
} from "@/server/payments/types";

type StripeCheckoutClient = {
  checkout: {
    sessions: {
      create: (params: Record<string, unknown>) => Promise<{ url: string | null }>;
    };
  };
};

export type StripeClientFactory = (secretKey: string) => Promise<StripeCheckoutClient>;

async function loadStripe(secretKey: string) {
  const { default: StripeSdk } = await import("stripe");
  return new StripeSdk(secretKey);
}

function siteOrigin(siteUrl: string | undefined): string | undefined {
  if (!siteUrl) {
    return undefined;
  }

  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return undefined;
    }

    return url.origin;
  } catch {
    return undefined;
  }
}

async function defaultStripeClient(secretKey: string): Promise<StripeCheckoutClient> {
  const stripe = await loadStripe(secretKey);
  return stripe as unknown as StripeCheckoutClient;
}

export function createStripePaymentProvider(
  env: AppEnv,
  createClient: StripeClientFactory = defaultStripeClient,
): PaymentProvider {
  return {
    configured: true,
    async createCheckout(input) {
      const secretKey = env.STRIPE_SECRET_KEY;
      const origin = siteOrigin(env.NEXT_PUBLIC_SITE_URL);
      if (!secretKey || !origin) {
        return { ok: false, code: "payment_failed" };
      }

      const lineSum = input.lines.reduce(
        (sum, line) => sum + line.lineCadCents,
        0,
      );
      if (lineSum !== input.totalCadCents) {
        return { ok: false, code: "payment_failed" };
      }

      const cart = serializeCartMetadata(input.lines);
      if (cart.length > STRIPE_METADATA_VALUE_LIMIT) {
        return { ok: false, code: "payment_failed" };
      }

      const stripe = await createClient(secretKey);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "cad",
        line_items: input.lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "cad",
            unit_amount: line.unitCadCents,
            product_data: {
              name: line.optionSummary
                ? `${line.name} (${line.optionSummary})`
                : line.name,
            },
          },
        })),
        success_url: `${origin}/checkout?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?checkout=cancelled`,
        metadata: {
          [CART_METADATA_KEY]: cart,
        },
      });

      if (!session.url) {
        return { ok: false, code: "payment_failed" };
      }

      return { ok: true, url: session.url };
    },
  };
}

function presentEmail(value: string | null | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

/**
 * Verifies the Stripe signature. Call only when both Stripe secrets are set.
 */
export async function verifyStripeSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string,
  secretKey: string,
): Promise<VerifiedStripeEvent> {
  const stripe = await loadStripe(secretKey);
  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  if (event.type !== "checkout.session.completed") {
    return { type: event.type };
  }

  const session = event.data.object;

  return {
    type: event.type,
    session: {
      id: session.id,
      amountTotal: session.amount_total,
      customerEmail: presentEmail(
        session.customer_details?.email ?? session.customer_email,
      ),
      cartPayload: session.metadata?.[CART_METADATA_KEY],
    },
  };
}
