import type { OptionGroupSelection } from "@/domain/catalog/price";

export type PaidOrderLine = {
  productId: string;
  name: string;
  quantity: number;
  unitCadCents: number;
  selections: OptionGroupSelection;
};

export type PaidOrder = {
  checkoutSessionId: string;
  customerEmail?: string;
  currency: "CAD";
  totalCadCents: number;
  lines: readonly PaidOrderLine[];
};

export type OrderRecordResult =
  | { ok: true; recorded: true; orderId: string }
  | { ok: false; recorded: false; code: "orders_not_configured" | "order_failed" };

export type OrderSink = {
  readonly configured: boolean;
  recordPaidOrder(order: PaidOrder): Promise<OrderRecordResult>;
};
