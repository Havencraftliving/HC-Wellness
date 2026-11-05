import { listPublishedProducts } from "./products";
import type { OptionGroup, Product } from "./types";

/**
 * Option group id → option id, or a list of option ids for add-ons.
 * A priced product needs one entry for each active single-choice group.
 * Add-on groups may be omitted when nothing is selected.
 */
export type OptionSelectionValue = string | readonly string[];

export type OptionGroupSelection = Readonly<Record<string, OptionSelectionValue>>;

export type PriceErrorCode =
  | "unknown_product"
  | "unknown_option"
  | "missing_selection"
  | "extra_selection";

export type PriceResult =
  | { ok: true; totalCadCents: number }
  | { ok: false; code: PriceErrorCode };

export type PricePreview =
  | { ok: true; totalCadCents: number; complete: boolean }
  | { ok: false; code: PriceErrorCode };

type WalkResult =
  | { ok: false; code: PriceErrorCode }
  | { ok: true; totalCadCents: number; complete: boolean };

export function isOptionGroupActive(
  group: OptionGroup,
  selections: OptionGroupSelection,
): boolean {
  if (!group.when) {
    return true;
  }

  return selections[group.when.groupId] === group.when.optionId;
}

function isMultiple(group: OptionGroup): boolean {
  return group.selectionMode === "multiple";
}

/**
 * First legal choice for each active single-choice group.
 * Add-ons start empty. Used as the priced baseline, not as the page's first paint.
 */
export function defaultSelections(product: Product): OptionGroupSelection {
  const selections: Record<string, OptionSelectionValue> = {};

  for (const group of product.optionGroups) {
    if (!isOptionGroupActive(group, selections)) {
      continue;
    }

    if (isMultiple(group)) {
      continue;
    }

    const first = group.options[0];
    if (first) {
      selections[group.id] = first.id;
    }
  }

  return selections;
}

function walkSelections(
  product: Product,
  selections: OptionGroupSelection,
): WalkResult {
  const groupsById = new Map(product.optionGroups.map((group) => [group.id, group]));

  for (const groupId of Object.keys(selections)) {
    if (!groupsById.has(groupId)) {
      return { ok: false, code: "extra_selection" };
    }
  }

  let totalCadCents = product.priceCadCents;
  let complete = true;

  for (const group of product.optionGroups) {
    const active = isOptionGroupActive(group, selections);
    const present = Object.hasOwn(selections, group.id);
    const value = selections[group.id];

    if (!active) {
      if (present) {
        return { ok: false, code: "extra_selection" };
      }
      continue;
    }

    if (isMultiple(group)) {
      if (!present) {
        continue;
      }

      if (!Array.isArray(value)) {
        return { ok: false, code: "unknown_option" };
      }

      const seen = new Set<string>();
      for (const optionId of value) {
        if (seen.has(optionId)) {
          return { ok: false, code: "unknown_option" };
        }
        seen.add(optionId);

        const option = group.options.find((item) => item.id === optionId);
        if (!option) {
          return { ok: false, code: "unknown_option" };
        }

        totalCadCents += option.priceDeltaCents;
      }
      continue;
    }

    if (!present || typeof value !== "string") {
      complete = false;
      continue;
    }

    const option = group.options.find((item) => item.id === value);
    if (!option) {
      return { ok: false, code: "unknown_option" };
    }

    totalCadCents += option.priceDeltaCents;
  }

  return { ok: true, totalCadCents, complete };
}

/**
 * CAD total for a published catalog product.
 * Base price plus the selected option deltas. There is no total argument:
 * the amount is recomputed from catalog data.
 * Hidden products are not in the published catalog, so their ids are unknown.
 * An unfinished configuration is a missing selection.
 */
export function calculatePrice(
  productId: string,
  selections: OptionGroupSelection,
): PriceResult {
  return calculatePriceFromCatalog(listPublishedProducts(), productId, selections);
}

/**
 * Running total while a customer is still choosing.
 * Illegal options fail. A missing required choice stays incomplete and still
 * totals whatever has already been chosen.
 */
export function previewPrice(
  productId: string,
  selections: OptionGroupSelection,
): PricePreview {
  const product = listPublishedProducts().find((item) => item.id === productId);
  if (!product) {
    return { ok: false, code: "unknown_product" };
  }

  return walkSelections(product, selections);
}

/**
 * Pure total for a caller-supplied catalog snapshot (the sell sheet, or a test fixture).
 * Still ignores any client total: only base price and option deltas are summed.
 */
export function calculatePriceFromCatalog(
  catalog: readonly Product[],
  productId: string,
  selections: OptionGroupSelection,
): PriceResult {
  const product = catalog.find((item) => item.id === productId);
  if (!product) {
    return { ok: false, code: "unknown_product" };
  }

  const walked = walkSelections(product, selections);
  if (!walked.ok) {
    return walked;
  }

  if (!walked.complete) {
    return { ok: false, code: "missing_selection" };
  }

  return { ok: true, totalCadCents: walked.totalCadCents };
}
