"use server";

import { redirect } from "next/navigation";
import { prepareCheckout, type PrepareResult } from "@/server/checkout/prepare";
import { readAppEnv } from "@/server/env";
import { createPaymentProvider } from "@/server/payments/provider";

export async function startCheckout(
  _previous: PrepareResult | null,
  formData: FormData,
): Promise<PrepareResult | null> {
  const raw = formData.get("cart");
  let payload: unknown = [];

  if (typeof raw === "string" && raw.length > 0) {
    try {
      payload = JSON.parse(raw);
    } catch {
      return { ok: false, code: "invalid_cart" };
    }
  }

  const result = await prepareCheckout(
    payload,
    await createPaymentProvider(readAppEnv()),
  );

  if (result.ok) {
    redirect(result.redirectUrl);
  }

  return result;
}
