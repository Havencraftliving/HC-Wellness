import type { AppEnv } from "@/server/env";
import { isStripeConfigured } from "@/server/env";
import {
  unconfiguredPaymentProvider,
  type PaymentProvider,
} from "@/server/payments/types";

/**
 * Stripe is loaded only when STRIPE_SECRET_KEY is set.
 * The unconfigured provider does not construct a Stripe client.
 */
export async function createPaymentProvider(env: AppEnv): Promise<PaymentProvider> {
  if (!isStripeConfigured(env)) {
    return unconfiguredPaymentProvider;
  }

  const { createStripePaymentProvider } = await import("./stripe-checkout");
  return createStripePaymentProvider(env);
}
