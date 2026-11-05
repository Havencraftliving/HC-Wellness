import { describe, expect, it, vi } from "vitest";
import { mapPaidOrderToOdooValues } from "./odoo-mapper";
import { createOrderSink } from "./sink";
import type { PaidOrder } from "./types";

const order: PaidOrder = {
  checkoutSessionId: "cs_test_123",
  customerEmail: "buyer@example.com",
  currency: "CAD",
  totalCadCents: 800_000,
  lines: [
    {
      productId: "indoor-infrared",
      name: "Indoor infrared sauna",
      quantity: 1,
      unitCadCents: 800_000,
      selections: {},
    },
  ],
};

describe("createOrderSink", () => {
  it("does not pretend an order was recorded when any Odoo value is missing", async () => {
    const fetchImpl = vi.fn();
    const missing = [
      {},
      { ODOO_URL: "https://odoo.example", ODOO_DB: "haven" },
      { ODOO_URL: "https://odoo.example", ODOO_API_KEY: "key" },
      { ODOO_DB: "haven", ODOO_API_KEY: "key" },
    ];

    for (const env of missing) {
      const sink = createOrderSink(env, fetchImpl);
      expect(sink.configured).toBe(false);
      await expect(sink.recordPaidOrder(order)).resolves.toEqual({
        ok: false,
        recorded: false,
        code: "orders_not_configured",
      });
    }

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("creates a sale order from the catalog cent total when all credentials are set", async () => {
    const fetchImpl = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ result: 42 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const sink = createOrderSink(
      {
        ODOO_URL: "https://odoo.example",
        ODOO_DB: "haven",
        ODOO_API_KEY: "secret-key",
      },
      fetchImpl,
    );

    await expect(sink.recordPaidOrder(order)).resolves.toEqual({
      ok: true,
      recorded: true,
      orderId: "42",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://odoo.example/jsonrpc");
    if (!init) {
      throw new Error("Odoo request was missing init");
    }
    const body = JSON.parse(String(init.body)) as {
      params: { args: unknown[] };
    };
    expect(body.params.args[0]).toBe("haven");
    expect(body.params.args[3]).toBe("sale.order");
    expect(body.params.args[4]).toBe("create");
    const values = (body.params.args[5] as Record<string, unknown>[])[0];
    expect(values).toEqual(mapPaidOrderToOdooValues(order));
    const line = (values.order_line as [number, number, { price_unit: number }][])[0];
    expect(line[2].price_unit).toBe(8000);
    expect(JSON.stringify(values)).not.toContain("\"price_unit\":0.01");
  });

  it("returns order_failed when Odoo responds with an error", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ error: { message: "Access Denied" } }), {
        status: 200,
      }),
    );
    const sink = createOrderSink(
      {
        ODOO_URL: "https://odoo.example",
        ODOO_DB: "haven",
        ODOO_API_KEY: "secret-key",
      },
      fetchImpl,
    );

    await expect(sink.recordPaidOrder(order)).resolves.toEqual({
      ok: false,
      recorded: false,
      code: "order_failed",
    });
  });
});
