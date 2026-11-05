import type { OptionGroupSelection, OptionSelectionValue } from "../catalog/price";

/** A cart line stores identity and quantity. Price is never stored. */
export type CartLine = {
  productId: string;
  selections: OptionGroupSelection;
  quantity: number;
};

export const CART_STORAGE_VERSION = 1;
export const MAX_LINE_QUANTITY = 99;

/**
 * Identity is the product id plus the selected option ids.
 * A different option selection is a different line.
 */
function selectionToken(value: OptionSelectionValue): string {
  if (typeof value === "string") {
    return value;
  }

  return [...value].sort().join(",");
}

function copySelections(selections: OptionGroupSelection): OptionGroupSelection {
  const copy: Record<string, OptionSelectionValue> = {};

  for (const [groupId, value] of Object.entries(selections)) {
    copy[groupId] = typeof value === "string" ? value : [...value];
  }

  return copy;
}

export function cartLineKey(
  line: Pick<CartLine, "productId" | "selections">,
): string {
  const selectionKey = Object.keys(line.selections)
    .sort()
    .map((groupId) => {
      const value = line.selections[groupId];
      return `${groupId}=${value === undefined ? "" : selectionToken(value)}`;
    })
    .join("&");

  return `${line.productId}|${selectionKey}`;
}

export function addCartLine(
  lines: readonly CartLine[],
  line: CartLine,
): CartLine[] {
  if (!Number.isInteger(line.quantity) || line.quantity < 1) {
    return [...lines];
  }

  const key = cartLineKey(line);
  const existing = lines.find((item) => cartLineKey(item) === key);
  const nextQuantity = Math.min(
    MAX_LINE_QUANTITY,
    (existing?.quantity ?? 0) + line.quantity,
  );
  const stored: CartLine = {
    productId: line.productId,
    selections: copySelections(line.selections),
    quantity: nextQuantity,
  };

  if (!existing) {
    return [...lines, stored];
  }

  return lines.map((item) => (cartLineKey(item) === key ? stored : item));
}

export function setCartQuantity(
  lines: readonly CartLine[],
  key: string,
  quantity: number,
): CartLine[] {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return lines.filter((line) => cartLineKey(line) !== key);
  }

  const capped = Math.min(quantity, MAX_LINE_QUANTITY);
  return lines.map((line) =>
    cartLineKey(line) === key ? { ...line, quantity: capped } : line,
  );
}

export function removeCartLine(
  lines: readonly CartLine[],
  key: string,
): CartLine[] {
  return lines.filter((line) => cartLineKey(line) !== key);
}

function isSelectionValue(value: unknown): value is OptionSelectionValue {
  if (typeof value === "string") {
    return true;
  }

  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSelectionRecord(value: unknown): value is OptionGroupSelection {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((optionId) => isSelectionValue(optionId));
}

/**
 * Reads a stored or submitted cart.
 * Extra fields, including any client total, are ignored.
 */
export function parseCartLines(
  value: unknown,
): { ok: true; lines: CartLine[] } | { ok: false; code: "invalid_cart" } {
  if (!Array.isArray(value)) {
    return { ok: false, code: "invalid_cart" };
  }

  const lines: CartLine[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { ok: false, code: "invalid_cart" };
    }

    const record = item as Record<string, unknown>;
    if (typeof record.productId !== "string" || record.productId.length === 0) {
      return { ok: false, code: "invalid_cart" };
    }

    if (!isSelectionRecord(record.selections)) {
      return { ok: false, code: "invalid_cart" };
    }

    if (typeof record.quantity !== "number") {
      return { ok: false, code: "invalid_cart" };
    }

    lines.push({
      productId: record.productId,
      selections: copySelections(record.selections),
      quantity: record.quantity,
    });
  }

  return { ok: true, lines };
}

export function serializeCart(lines: readonly CartLine[]): string {
  return JSON.stringify({
    version: CART_STORAGE_VERSION,
    lines: lines.map((line) => ({
      productId: line.productId,
      selections: line.selections,
      quantity: line.quantity,
    })),
  });
}

export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return [];
    }

    const record = parsed as Record<string, unknown>;
    if (record.version !== CART_STORAGE_VERSION) {
      return [];
    }

    const result = parseCartLines(record.lines);
    if (!result.ok) {
      return [];
    }

    return result.lines.flatMap((line) => {
      if (!Number.isInteger(line.quantity) || line.quantity < 1) {
        return [];
      }

      return [
        {
          ...line,
          quantity: Math.min(line.quantity, MAX_LINE_QUANTITY),
        },
      ];
    });
  } catch {
    return [];
  }
}
