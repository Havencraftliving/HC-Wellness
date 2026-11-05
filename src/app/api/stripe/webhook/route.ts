import { NextResponse } from "next/server";
import { createOrderSink } from "@/server/orders/sink";
import { readAppEnv } from "@/server/env";
import { verifyStripeSignature } from "@/server/payments/stripe-checkout";
import { handleStripeWebhook } from "@/server/payments/webhook";

export async function POST(request: Request) {
  const env = readAppEnv();
  const sink = createOrderSink(env);
  const result = await handleStripeWebhook({
    rawBody: await request.text(),
    signature: request.headers.get("stripe-signature"),
    env,
    verify: verifyStripeSignature,
    recordOrder: (order) => sink.recordPaidOrder(order),
  });

  return NextResponse.json(result.body, { status: result.status });
}
