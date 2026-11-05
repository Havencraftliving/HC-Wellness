# Integrations

Stripe and Odoo stay off until their environment variables are set. With no keys, checkout does not collect or charge a card.

Copy `.env.example` to `.env.local`. Next.js reads `.env.local`. `.env*` files are gitignored except `.env.example`. `readAppEnv` in `src/server/env.ts` treats a missing or blank value as unset.

| Variable | Turns on |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe Checkout. Required for the webhook as well. |
| `STRIPE_WEBHOOK_SECRET` | Signature verification on `POST /api/stripe/webhook`. |
| `NEXT_PUBLIC_SITE_URL` | Public origin for Stripe success and cancel URLs, for example `http://localhost:3000`. |
| `ODOO_URL` | Odoo base URL. All three Odoo variables are required. |
| `ODOO_DB` | Odoo database name. |
| `ODOO_API_KEY` | Odoo API key, sent as the JSON-RPC password. |

## Stripe Checkout

`isStripeConfigured` is true when `STRIPE_SECRET_KEY` is non-blank. `createPaymentProvider` then loads `src/server/payments/stripe-checkout.ts`. Otherwise checkout uses `unconfiguredPaymentProvider`.

The checkout page (`src/app/checkout/page.tsx`) reads that flag on the server:

- Unconfigured: the page states “Payment is not connected. This page does not collect or charge a card.” The submit button is labeled “Submit order.” There is no card field. `prepareCheckout` returns `payments_not_configured`, and the form shows “Payment is not connected. No card was collected and no charge was made.” The action does not redirect.
- Configured: the page says card details are collected by Stripe, not on this page. The button is labeled “Continue to payment.”

`createCheckout` still returns `payment_failed` unless `NEXT_PUBLIC_SITE_URL` is an `http` or `https` origin, the line totals match `totalCadCents`, and the cart JSON in Stripe metadata is at most 500 characters. The session is `mode: "payment"`, `currency: "cad"`, with `unit_amount` set to the recomputed CAD cents. Success returns to `/checkout?checkout=success&session_id={CHECKOUT_SESSION_ID}`. Cancel returns to `/checkout?checkout=cancelled`. The success page does not confirm that an order was recorded.

## Webhook

`POST /api/stripe/webhook` (`src/app/api/stripe/webhook/route.ts`) calls `handleStripeWebhook`.

Without `STRIPE_WEBHOOK_SECRET` the route returns **503** and `webhook_not_configured`. Without `STRIPE_SECRET_KEY` it returns **503** and `stripe_not_configured`. A bad or missing `stripe-signature` returns **400** `invalid_signature`.

When both Stripe secrets are set, the handler verifies the signature with `stripe.webhooks.constructEvent`. Events other than `checkout.session.completed` return **200** with `recorded: false`. A completed session is not recorded unless Odoo is configured too; otherwise the response is **503** `orders_not_configured`.

If Odoo is configured, the handler parses the cart from session metadata, runs `validateCart`, and records the order only when `amount_total` equals the recomputed CAD cents. A mismatch is **409** `amount_mismatch`.

## Odoo order sink

`isOdooConfigured` is true only when `ODOO_URL`, `ODOO_DB`, and `ODOO_API_KEY` are all set. `createOrderSink` then POSTs JSON-RPC `execute_kw` to `{ODOO_URL}/jsonrpc`, calling `sale.order` `create`. The unconfigured sink returns `orders_not_configured` and `recorded: false`.

`mapPaidOrderToOdooValues` in `src/server/orders/odoo-mapper.ts` writes `client_order_ref`, `note`, and `order_line` (`name`, `product_uom_qty`, `price_unit`). `price_unit` is the line’s CAD cents divided by 100. The uid sent with the API key is `UNCONFIRMED_ODOO_UID` (`1`).

Those field names, that uid, and the choice to omit `product.product` ids are **unconfirmed** until Michael provides HavenCraft’s existing Odoo mapping. Do not treat a successful-looking payload as a match for the live database. Leave the Odoo variables unset until that mapping and the credentials exist.
