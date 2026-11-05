import { describe, expect, it } from "vitest";
import { parseCartLines } from "@/domain/cart/cart";
import { defaultSelections } from "@/domain/catalog/price";
import { getPublishedProductById } from "@/domain/catalog/products";
import type { Product } from "@/domain/catalog/types";
import { validateCart } from "./validate-cart";

const configurable: Product = {
  id: "test-configurable",
  slug: "test-configurable",
  name: "Test configurable",
  category: "sauna",
  visibility: "published",
  priceCadCents: 1_000_000,
  listPriceUsdCents: 700_000,
  specs: {},
  includes: [],
  optionGroups: [
    {
      id: "material",
      label: "Material",
      options: [
        { id: "hemlock", label: "Hemlock", priceDeltaCents: 0 },
        { id: "cedar", label: "Cedar", priceDeltaCents: 15_000 },
      ],
    },
  ],
};

describe("validateCart", () => {
  it("recomputes the CAD total and ignores a tampered client total", () => {
    const infrared = getPublishedProductById("indoor-infrared");
    expect(infrared).toBeDefined();
    const parsed = parseCartLines([
      {
        productId: "indoor-infrared",
        selections: defaultSelections(infrared!),
        quantity: 2,
        totalCadCents: 1,
      },
    ]);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(validateCart(parsed.lines)).toEqual({
      ok: true,
      totalCadCents: 1_600_000,
      lines: [
        {
          productId: "indoor-infrared",
          name: "Indoor infrared sauna",
          selections: defaultSelections(infrared!),
          optionSummary:
            "Thermo hemlock, Electric, Harvia wall-mounted heater, Front",
          quantity: 2,
          unitCadCents: 800_000,
          lineCadCents: 1_600_000,
        },
      ],
    });
  });

  it("rejects an unknown product, a hidden product, and an illegal option", () => {
    expect(
      validateCart([{ productId: "missing", selections: {}, quantity: 1 }]),
    ).toEqual({ ok: false, code: "unknown_product" });
    expect(
      validateCart([{ productId: "ember-2", selections: {}, quantity: 1 }]),
    ).toEqual({ ok: false, code: "unknown_product" });
    expect(
      validateCart([
        {
          productId: "indoor-infrared",
          selections: { material: "cedar" },
          quantity: 1,
        },
      ]),
    ).toEqual({ ok: false, code: "extra_selection" });
    expect(
      validateCart(
        [{ productId: "test-configurable", selections: {}, quantity: 1 }],
        [configurable],
      ),
    ).toEqual({ ok: false, code: "missing_selection" });
    expect(
      validateCart(
        [
          {
            productId: "test-configurable",
            selections: { material: "marble" },
            quantity: 1,
          },
        ],
        [configurable],
      ),
    ).toEqual({ ok: false, code: "unknown_option" });
  });

  it("rejects an empty cart and a quantity the shop will not sell", () => {
    expect(validateCart([])).toEqual({ ok: false, code: "empty_cart" });
    expect(
      validateCart([
        { productId: "cold-plunge", selections: {}, quantity: 0 },
      ]),
    ).toEqual({ ok: false, code: "invalid_quantity" });
    expect(
      validateCart([
        { productId: "cold-plunge", selections: {}, quantity: 100 },
      ]),
    ).toEqual({ ok: false, code: "invalid_quantity" });
  });

  it("adds a published option delta from the catalog, not from the client", () => {
    const result = validateCart(
      [
        {
          productId: "test-configurable",
          selections: { material: "cedar" },
          quantity: 1,
        },
      ],
      [configurable],
    );

    expect(result).toMatchObject({
      ok: true,
      totalCadCents: 1_015_000,
    });
  });
});
