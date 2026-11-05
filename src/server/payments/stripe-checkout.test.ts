import { describe, expect, it, vi } from "vitest";
import { validateCart } from "@/server/checkout/validate-cart";
import { defaultSelections } from "@/domain/catalog/price";
import { getPublishedProductById } from "@/domain/catalog/products";
import { createStripePaymentProvider } from "./stripe-checkout";

const infrared = getPublishedProductById("indoor-infrared");
if (!infrared) {
  throw new Error("indoor-infrared is missing from the catalog");
}
const infraredSelections = defaultSelections(infrared);

describe("createStripePaymentProvider", () => {
  it("charges the catalog unit amount and not a client total", async () => {
    const validated = validateCart([
      { productId: "indoor-infrared", selections: infraredSelections, quantity: 1 },
    ]);
    expect(validated.ok).toBe(true);
    if (!validated.ok) {
      return;
    }

    const create = vi.fn(async (_params: Record<string, unknown>) => ({
      url: "https://checkout.stripe.test/pay",
    }));
    const provider = createStripePaymentProvider(
      {
        STRIPE_SECRET_KEY: "sk_test_123",
        NEXT_PUBLIC_SITE_URL: "https://shop.example",
      },
      async () => ({ checkout: { sessions: { create } } }),
    );

    const result = await provider.createCheckout({
      lines: validated.lines,
      totalCadCents: validated.totalCadCents,
    });

    expect(result).toEqual({
      ok: true,
      url: "https://checkout.stripe.test/pay",
    });
    const params = create.mock.calls[0][0] as unknown as {
      currency: string;
      line_items: { price_data: { unit_amount: number } }[];
      metadata: { cart: string };
    };
    expect(params.currency).toBe("cad");
    expect(params.line_items[0].price_data.unit_amount).toBe(800_000);
    expect(JSON.parse(params.metadata.cart)).toEqual([
      { productId: "indoor-infrared", selections: infraredSelections, quantity: 1 },
    ]);
  });

  it("does not call Stripe when the site URL is missing", async () => {
    const create = vi.fn();
    const provider = createStripePaymentProvider(
      { STRIPE_SECRET_KEY: "sk_test_123" },
      async () => ({ checkout: { sessions: { create } } }),
    );
    const result = await provider.createCheckout({ lines: [], totalCadCents: 0 });

    expect(result).toEqual({ ok: false, code: "payment_failed" });
    expect(create).not.toHaveBeenCalled();
  });

  it("does not call Stripe when the cart metadata would exceed Stripe's limit", async () => {
    const validated = validateCart(
      Array.from({ length: 12 }, () => ({
        productId: "indoor-infrared",
        selections: infraredSelections,
        quantity: 1,
      })),
    );
    expect(validated.ok).toBe(true);
    if (!validated.ok) {
      return;
    }

    const create = vi.fn();
    const provider = createStripePaymentProvider(
      {
        STRIPE_SECRET_KEY: "sk_test_123",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      },
      async () => ({ checkout: { sessions: { create } } }),
    );
    const result = await provider.createCheckout({
      lines: validated.lines,
      totalCadCents: validated.totalCadCents,
    });

    expect(result).toEqual({ ok: false, code: "payment_failed" });
    expect(create).not.toHaveBeenCalled();
  });
});
