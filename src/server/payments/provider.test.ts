import { describe, expect, it } from "vitest";
import { readAppEnv } from "@/server/env";
import { createPaymentProvider } from "./provider";

describe("createPaymentProvider", () => {
  it("stays unconfigured and does not charge when the Stripe key is unset", async () => {
    const provider = await createPaymentProvider(readAppEnv({}));
    expect(provider.configured).toBe(false);
    await expect(
      provider.createCheckout({ lines: [], totalCadCents: 1 }),
    ).resolves.toEqual({ ok: false, code: "payments_not_configured" });
  });

  it("treats a blank key as unset", async () => {
    const provider = await createPaymentProvider(
      readAppEnv({ STRIPE_SECRET_KEY: "  " }),
    );
    expect(provider.configured).toBe(false);
  });
});
