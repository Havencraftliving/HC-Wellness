import { describe, expect, it, vi } from "vitest";
import { defaultSelections } from "@/domain/catalog/price";
import { getPublishedProductById } from "@/domain/catalog/products";
import type { AppEnv } from "@/server/env";
import { handleStripeWebhook } from "./webhook";

function requireInfrared() {
  const product = getPublishedProductById("indoor-infrared");
  if (!product) {
    throw new Error("indoor-infrared is missing from the catalog");
  }
  return product;
}

const infrared = requireInfrared();

const stripeEnv: AppEnv = {
  STRIPE_SECRET_KEY: "sk_test_123",
  STRIPE_WEBHOOK_SECRET: "whsec_123",
};

function completedEvent(amountTotal: number, quantity = 1) {
  return {
    type: "checkout.session.completed",
    session: {
      id: "cs_test_123",
      amountTotal,
      customerEmail: "buyer@example.com",
      cartPayload: JSON.stringify([
        {
          productId: "indoor-infrared",
          selections: defaultSelections(infrared),
          quantity,
          totalCadCents: 1,
        },
      ]),
    },
  };
}

describe("handleStripeWebhook", () => {
  it("does not report success when the webhook secret is missing", async () => {
    const verify = vi.fn();
    const recordOrder = vi.fn();
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: {},
      verify,
      recordOrder,
    });

    expect(result.status).toBe(503);
    expect(result.body).toEqual({
      ok: false,
      recorded: false,
      code: "webhook_not_configured",
    });
    expect(verify).not.toHaveBeenCalled();
    expect(recordOrder).not.toHaveBeenCalled();
  });

  it("does not call Stripe when the secret key is missing", async () => {
    const verify = vi.fn();
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: { STRIPE_WEBHOOK_SECRET: "whsec_123" },
      verify,
      recordOrder: vi.fn(),
    });

    expect(result.body.code).toBe("stripe_not_configured");
    expect(verify).not.toHaveBeenCalled();
  });

  it("does not call the order sink when Odoo is not configured", async () => {
    const recordOrder = vi.fn();
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: stripeEnv,
      verify: async () => completedEvent(800_000),
      recordOrder,
    });

    expect(result.status).toBe(503);
    expect(result.body).toMatchObject({
      ok: false,
      recorded: false,
      code: "orders_not_configured",
    });
    expect(recordOrder).not.toHaveBeenCalled();
  });

  it("records the recomputed catalog total when Stripe and Odoo are both configured", async () => {
    const recordOrder = vi.fn(async () => ({
      ok: true as const,
      recorded: true as const,
      orderId: "42",
    }));
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: {
        ...stripeEnv,
        ODOO_URL: "https://odoo.example",
        ODOO_DB: "haven",
        ODOO_API_KEY: "key",
      },
      verify: async () => completedEvent(800_000),
      recordOrder,
    });

    expect(result).toEqual({
      status: 200,
      body: { ok: true, recorded: true, orderId: "42" },
    });
    expect(recordOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        totalCadCents: 800_000,
        currency: "CAD",
      }),
    );
  });

  it("rejects a Stripe amount that does not match the catalog total", async () => {
    const recordOrder = vi.fn();
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: {
        ...stripeEnv,
        ODOO_URL: "https://odoo.example",
        ODOO_DB: "haven",
        ODOO_API_KEY: "key",
      },
      verify: async () => completedEvent(1),
      recordOrder,
    });

    expect(result.status).toBe(409);
    expect(result.body.code).toBe("amount_mismatch");
    expect(recordOrder).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature", async () => {
    const recordOrder = vi.fn();
    const result = await handleStripeWebhook({
      rawBody: "{}",
      signature: "sig",
      env: stripeEnv,
      verify: async () => {
        throw new Error("bad signature");
      },
      recordOrder,
    });

    expect(result.status).toBe(400);
    expect(result.body.code).toBe("invalid_signature");
    expect(recordOrder).not.toHaveBeenCalled();
  });
});
