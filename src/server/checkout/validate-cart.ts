import { MAX_LINE_QUANTITY, type CartLine } from "@/domain/cart/cart";
import { optionSummary } from "@/domain/catalog/display";
import {
  calculatePriceFromCatalog,
  type OptionGroupSelection,
  type PriceErrorCode,
} from "@/domain/catalog/price";
import { listPublishedProducts } from "@/domain/catalog/products";
import type { Product } from "@/domain/catalog/types";

export type ValidatedCartLine = {
  productId: string;
  name: string;
  selections: OptionGroupSelection;
  optionSummary: string;
  quantity: number;
  unitCadCents: number;
  lineCadCents: number;
};

export type CartValidationErrorCode =
  | PriceErrorCode
  | "empty_cart"
  | "invalid_quantity";

export type CartValidation =
  | {
      ok: true;
      lines: ValidatedCartLine[];
      totalCadCents: number;
    }
  | { ok: false; code: CartValidationErrorCode };

/**
 * Recomputes every line from the published catalog.
 * A client total is not an argument and cannot change the result.
 * Hidden products are absent from the published catalog, so they are unknown.
 */
export function validateCart(
  lines: readonly CartLine[],
  catalog: readonly Product[] = listPublishedProducts(),
): CartValidation {
  if (lines.length === 0) {
    return { ok: false, code: "empty_cart" };
  }

  const validated: ValidatedCartLine[] = [];
  let totalCadCents = 0;

  for (const line of lines) {
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_LINE_QUANTITY
    ) {
      return { ok: false, code: "invalid_quantity" };
    }

    const price = calculatePriceFromCatalog(
      catalog,
      line.productId,
      line.selections,
    );
    if (!price.ok) {
      return price;
    }

    const product = catalog.find((item) => item.id === line.productId);
    if (!product) {
      return { ok: false, code: "unknown_product" };
    }

    const lineCadCents = price.totalCadCents * line.quantity;
    totalCadCents += lineCadCents;
    validated.push({
      productId: line.productId,
      name: product.name,
      selections: { ...line.selections },
      optionSummary: optionSummary(product, line.selections),
      quantity: line.quantity,
      unitCadCents: price.totalCadCents,
      lineCadCents,
    });
  }

  return { ok: true, lines: validated, totalCadCents };
}
