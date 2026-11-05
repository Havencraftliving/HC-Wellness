import { describe, expect, it } from "vitest";
import {
  addCartLine,
  cartLineKey,
  parseCartLines,
  parseStoredCart,
  removeCartLine,
  serializeCart,
  setCartQuantity,
} from "./cart";

describe("cartLineKey", () => {
  it("changes when the selected option changes", () => {
    const base = cartLineKey({
      productId: "ember-1",
      selections: { material: "hemlock" },
    });
    const upgraded = cartLineKey({
      productId: "ember-1",
      selections: { material: "cedar" },
    });

    expect(base).not.toBe(upgraded);
  });

  it("treats the same options as the same line regardless of key order", () => {
    expect(
      cartLineKey({
        productId: "ember-1",
        selections: { heater: "standard", material: "hemlock" },
      }),
    ).toBe(
      cartLineKey({
        productId: "ember-1",
        selections: { material: "hemlock", heater: "standard" },
      }),
    );
  });
});

describe("cart edits", () => {
  it("merges quantity when the same product and options are added again", () => {
    const once = addCartLine([], {
      productId: "indoor-infrared",
      selections: {},
      quantity: 1,
    });
    const twice = addCartLine(once, {
      productId: "indoor-infrared",
      selections: {},
      quantity: 1,
    });

    expect(twice).toEqual([
      { productId: "indoor-infrared", selections: {}, quantity: 2 },
    ]);
  });

  it("keeps a separate line when options differ", () => {
    const lines = addCartLine(
      addCartLine([], {
        productId: "ember-1",
        selections: { material: "hemlock" },
        quantity: 1,
      }),
      {
        productId: "ember-1",
        selections: { material: "cedar" },
        quantity: 1,
      },
    );

    expect(lines).toHaveLength(2);
  });

  it("removes a line when quantity drops below 1", () => {
    const lines = addCartLine([], {
      productId: "cold-plunge",
      selections: {},
      quantity: 1,
    });
    const key = cartLineKey(lines[0]);

    expect(setCartQuantity(lines, key, 0)).toEqual([]);
    expect(removeCartLine(lines, key)).toEqual([]);
  });
});

describe("parseCartLines", () => {
  it("ignores a client total and keeps only id, options, and quantity", () => {
    const parsed = parseCartLines([
      {
        productId: "indoor-infrared",
        selections: {},
        quantity: 1,
        totalCadCents: 1,
      },
    ]);

    expect(parsed).toEqual({
      ok: true,
      lines: [{ productId: "indoor-infrared", selections: {}, quantity: 1 }],
    });
  });
});

describe("parseStoredCart", () => {
  it("round-trips a versioned cart", () => {
    const lines = [
      { productId: "cold-plunge", selections: {}, quantity: 1 },
    ];

    expect(parseStoredCart(serializeCart(lines))).toEqual(lines);
  });

  it("drops an unversioned or corrupt payload", () => {
    expect(parseStoredCart("not-json")).toEqual([]);
    expect(parseStoredCart(JSON.stringify({ lines: [] }))).toEqual([]);
  });
});
