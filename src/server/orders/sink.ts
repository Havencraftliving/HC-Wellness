import type { AppEnv } from "@/server/env";
import { isOdooConfigured } from "@/server/env";
import {
  mapPaidOrderToOdooValues,
  UNCONFIRMED_ODOO_UID,
} from "@/server/orders/odoo-mapper";
import type { OrderSink, PaidOrder } from "@/server/orders/types";

const unconfiguredOrderSink: OrderSink = {
  configured: false,
  async recordPaidOrder() {
    return { ok: false, recorded: false, code: "orders_not_configured" };
  },
};

function jsonRpcEndpoint(odooUrl: string): string {
  const base = odooUrl.endsWith("/") ? odooUrl : `${odooUrl}/`;
  return new URL("jsonrpc", base).toString();
}

type JsonFetch = (url: string, init?: RequestInit) => Promise<Response>;

async function createOdooSaleOrder(
  env: AppEnv,
  order: PaidOrder,
  fetchImpl: JsonFetch,
): Promise<Awaited<ReturnType<OrderSink["recordPaidOrder"]>>> {
  if (!env.ODOO_URL || !env.ODOO_DB || !env.ODOO_API_KEY) {
    return { ok: false, recorded: false, code: "orders_not_configured" };
  }

  try {
    const response = await fetchImpl(jsonRpcEndpoint(env.ODOO_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        id: 1,
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            env.ODOO_DB,
            UNCONFIRMED_ODOO_UID,
            env.ODOO_API_KEY,
            "sale.order",
            "create",
            [mapPaidOrderToOdooValues(order)],
          ],
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return { ok: false, recorded: false, code: "order_failed" };
    }

    const body = (await response.json()) as {
      result?: unknown;
      error?: unknown;
    };

    if (body.error) {
      return { ok: false, recorded: false, code: "order_failed" };
    }

    if (typeof body.result === "number" || typeof body.result === "string") {
      return { ok: true, recorded: true, orderId: String(body.result) };
    }

    return { ok: false, recorded: false, code: "order_failed" };
  } catch {
    return { ok: false, recorded: false, code: "order_failed" };
  }
}

/**
 * Odoo stays off unless URL, database, and API key are all set.
 * The unconfigured sink does not report that an order was recorded.
 */
export function createOrderSink(
  env: AppEnv,
  fetchImpl: JsonFetch = fetch,
): OrderSink {
  if (!isOdooConfigured(env)) {
    return unconfiguredOrderSink;
  }

  return {
    configured: true,
    recordPaidOrder(order) {
      return createOdooSaleOrder(env, order, fetchImpl);
    },
  };
}
