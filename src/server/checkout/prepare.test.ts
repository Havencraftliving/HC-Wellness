import { describe, expect, it } from "vitest";
import { defaultSelections } from "@/domain/catalog/price";
import { getPublishedProductById } from "@/domain/catalog/products";
import { unconfiguredPaymentProvider } from "@/server/payments/types";
import { prepareCheckout } from "./prepare";

const infrared = getPublishedProductById("indoor-infrared");
if (!infrared) {
  throw new Error("indoor-infrared is missing from the catalog");
}

describe("prepareCheckout", () => {
  it("returns payments_not_configured and does not use a client total", async () => {
    const result = await prepareCheckout(
      [
        {
          productId: "indoor-infrared",
          selections: defaultSelections(infrared),
          quantity: 1,
          totalCadCents: 1,
        },
      ],
      unconfiguredPaymentProvider,
    );

    expect(result).toEqual({ ok: false, code: "payments_not_configured" });
  });

  it("passes the recomputed catalog total to the payment provider", async () => {
    let charged = 0;
    const result = await prepareCheckout(
      [
        {
          productId: "cold-plunge",
          selections: {},
          quantity: 2,
          totalCadCents: 1,
        },
      ],
      {
        configured: true,
        async createCheckout(input) {
          charged = input.totalCadCents;
          return { ok: true, url: "https://checkout.stripe.test/session" };
        },
      },
    );

    expect(charged).toBe(2_400_000);
    expect(result).toEqual({
      ok: true,
      redirectUrl: "https://checkout.stripe.test/session",
    });
  });

  it("rejects a hidden product before payment", async () => {
    const result = await prepareCheckout(
      [{ productId: "ember-2", selections: {}, quantity: 1 }],
      {
        configured: true,
        async createCheckout() {
          throw new Error("payment should not run");
        },
      },
    );

    expect(result).toEqual({ ok: false, code: "unknown_product" });
  });
});
