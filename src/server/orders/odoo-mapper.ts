import type { PaidOrder } from "@/server/orders/types";

/**
 * UNCONFIRMED against HavenCraft's existing Odoo setup.
 * sale.order field names, the numeric uid, and the decision to omit
 * product.product ids must be confirmed before credentials are enabled.
 * price_unit is sent in currency units (cents / 100), not as integer cents.
 * The integer CAD cent total on the order remains the amount this shop computed.
 */
export const UNCONFIRMED_ODOO_UID = 1;

export function mapPaidOrderToOdooValues(
  order: PaidOrder,
): Record<string, unknown> {
  const note = [
    order.customerEmail ? `Customer email: ${order.customerEmail}` : undefined,
    `CAD total cents: ${order.totalCadCents}`,
    ...order.lines.map((line) => {
      const options =
        Object.keys(line.selections).length > 0
          ? ` options ${JSON.stringify(line.selections)}`
          : "";
      return `${line.quantity} x ${line.name} (${line.productId})${options} @ ${line.unitCadCents} cents`;
    }),
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n");

  return {
    client_order_ref: order.checkoutSessionId,
    note,
    order_line: order.lines.map((line) => [
      0,
      0,
      {
        name: line.name,
        product_uom_qty: line.quantity,
        price_unit: line.unitCadCents / 100,
      },
    ]),
  };
}
