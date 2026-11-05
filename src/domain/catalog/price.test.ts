import { describe, expect, it } from "vitest";
import {
  filterSaunas,
  getPublishedProductById,
  getPublishedProductBySlug,
  listPublishedColdPlunges,
  listPublishedProducts,
  listPublishedSaunas,
  listSaunasForComparison,
} from "./products";
import {
  calculatePrice,
  calculatePriceFromCatalog,
  defaultSelections,
  previewPrice,
} from "./price";
import type { Product } from "./types";

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
    {
      id: "heater",
      label: "Heater",
      options: [
        { id: "standard", label: "Standard", priceDeltaCents: 0 },
        { id: "upgrade", label: "Upgrade", priceDeltaCents: 25_000 },
      ],
    },
  ],
};

describe("calculatePriceFromCatalog", () => {
  it("adds the base price and exactly one delta per group", () => {
    expect(
      calculatePriceFromCatalog([configurable], "test-configurable", {
        material: "cedar",
        heater: "upgrade",
      }),
    ).toEqual({ ok: true, totalCadCents: 1_040_000 });
  });

  it("rejects an unknown product id", () => {
    expect(
      calculatePriceFromCatalog([configurable], "missing", {
        material: "hemlock",
        heater: "standard",
      }),
    ).toEqual({ ok: false, code: "unknown_product" });
  });

  it("rejects an unknown option id", () => {
    expect(
      calculatePriceFromCatalog([configurable], "test-configurable", {
        material: "marble",
        heater: "standard",
      }),
    ).toEqual({ ok: false, code: "unknown_option" });
  });

  it("rejects an option id used under the wrong group", () => {
    expect(
      calculatePriceFromCatalog([configurable], "test-configurable", {
        material: "upgrade",
        heater: "standard",
      }),
    ).toEqual({ ok: false, code: "unknown_option" });
  });

  it("rejects a missing group selection", () => {
    expect(
      calculatePriceFromCatalog([configurable], "test-configurable", {
        material: "hemlock",
      }),
    ).toEqual({ ok: false, code: "missing_selection" });
  });

  it("rejects an extra group selection", () => {
    expect(
      calculatePriceFromCatalog([configurable], "test-configurable", {
        material: "hemlock",
        heater: "standard",
        "red-light": "tower",
      }),
    ).toEqual({ ok: false, code: "extra_selection" });
  });
});

describe("calculatePrice", () => {
  it("uses the CAD base when a published product has no option groups", () => {
    expect(calculatePrice("cold-plunge", {})).toEqual({
      ok: true,
      totalCadCents: 1_200_000,
    });
  });

  it("prices a sauna from the base when the default build adds nothing", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    const ember = getPublishedProductBySlug("ember-1");
    expect(infrared).toBeDefined();
    expect(ember).toBeDefined();
    expect(calculatePrice("indoor-infrared", defaultSelections(infrared!))).toEqual({
      ok: true,
      totalCadCents: 800_000,
    });
    expect(calculatePrice("ember-1", defaultSelections(ember!))).toEqual({
      ok: true,
      totalCadCents: 1_250_000,
    });
  });

  it("filters heater models by heater type and prices the chosen path", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    expect(infrared).toBeDefined();
    const base = defaultSelections(infrared!);

    expect(
      calculatePrice("indoor-infrared", {
        ...base,
        "heater-type": "wood",
        "heater-electric": "harvia-wall",
      }),
    ).toEqual({ ok: false, code: "extra_selection" });

    const withoutElectric = { ...base };
    delete withoutElectric["heater-electric"];
    expect(
      calculatePrice("indoor-infrared", {
        ...withoutElectric,
        "heater-type": "wood",
        "heater-wood": "huum-hive-13",
      }),
    ).toEqual({ ok: true, totalCadCents: 1_040_000 });

    expect(
      calculatePrice("indoor-infrared", {
        ...base,
        addons: ["towel-hooks", "led-lighting"],
      }),
    ).toEqual({ ok: true, totalCadCents: 826_500 });
  });

  it("previews a partial build without treating it as ready to buy", () => {
    const preview = previewPrice("indoor-infrared", { wood: "clear-cedar" });
    expect(preview).toEqual({
      ok: true,
      complete: false,
      totalCadCents: 980_000,
    });
  });

  it("does not add the printed USD list price into the total", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    expect(infrared?.listPriceUsdCents).toBe(590_000);
    expect(infrared?.priceCadCents).toBe(800_000);
    expect(calculatePrice("indoor-infrared", defaultSelections(infrared!))).toEqual({
      ok: true,
      totalCadCents: 800_000,
    });
  });

  it("rejects a hidden product id and any other unknown id", () => {
    expect(calculatePrice("ember-2", {})).toEqual({
      ok: false,
      code: "unknown_product",
    });
    expect(calculatePrice("not-a-product", {})).toEqual({
      ok: false,
      code: "unknown_product",
    });
  });

  it("rejects a selection on a product that has no option groups", () => {
    expect(calculatePrice("cold-plunge", { material: "cedar" })).toEqual({
      ok: false,
      code: "extra_selection",
    });
  });
});

describe("published shop queries", () => {
  it("does not return hidden Ember 2", () => {
    expect(getPublishedProductBySlug("ember-2")).toBeUndefined();
    expect(getPublishedProductById("ember-2")).toBeUndefined();

    const publishedSlugs = [
      ...listPublishedProducts(),
      ...listPublishedSaunas(),
      ...listPublishedColdPlunges(),
      ...listSaunasForComparison(),
      ...filterSaunas(),
      ...filterSaunas({ capacity: "all", placement: "all" }),
    ].map((product) => product.slug);

    expect(publishedSlugs).not.toContain("ember-2");
  });

  it("lists published saunas and the cold plunge separately", () => {
    expect(listPublishedSaunas().map((product) => product.slug)).toEqual([
      "indoor-infrared",
      "ember-1",
    ]);
    expect(listSaunasForComparison().map((product) => product.slug)).toEqual([
      "indoor-infrared",
      "ember-1",
    ]);
    expect(listPublishedColdPlunges().map((product) => product.slug)).toEqual([
      "cold-plunge",
    ]);
    expect(listPublishedProducts().map((product) => product.slug)).toEqual([
      "indoor-infrared",
      "ember-1",
      "cold-plunge",
      "cedar-outdoor-rinse",
      "indoor-steam-shower",
      "full-body-panel",
      "compact-panel",
      "therapy-mat",
      "face-mask",
    ]);
  });

  it("matches the infrared sauna to 1-person, 2-person, and indoor", () => {
    expect(filterSaunas({ capacity: 1 }).map((product) => product.slug)).toEqual([
      "indoor-infrared",
    ]);
    expect(filterSaunas({ capacity: 2 }).map((product) => product.slug)).toEqual([
      "indoor-infrared",
    ]);
    expect(
      filterSaunas({ placement: "indoor" }).map((product) => product.slug),
    ).toEqual(["indoor-infrared"]);
    expect(
      filterSaunas({ capacity: 2, placement: "indoor" }).map(
        (product) => product.slug,
      ),
    ).toEqual(["indoor-infrared"]);
  });

  it("keeps unset capacity and placement only when that filter is all", () => {
    expect(filterSaunas({ capacity: "all", placement: "all" }).map((product) => product.slug)).toEqual([
      "indoor-infrared",
      "ember-1",
    ]);
    expect(filterSaunas({ capacity: 1 }).map((product) => product.slug)).not.toContain(
      "ember-1",
    );
    expect(
      filterSaunas({ placement: "indoor" }).map((product) => product.slug),
    ).not.toContain("ember-1");
    expect(
      filterSaunas({ placement: "outdoor" }).map((product) => product.slug),
    ).toEqual([]);
    expect(filterSaunas({ capacity: 3 })).toEqual([]);
    expect(filterSaunas({ capacity: "4-5" })).toEqual([]);
  });

  it("does not put the cold plunge in the sauna list", () => {
    expect(
      listPublishedSaunas().some((product) => product.slug === "cold-plunge"),
    ).toBe(false);
    expect(
      filterSaunas({ capacity: "all", placement: "all" }).some(
        (product) => product.slug === "cold-plunge",
      ),
    ).toBe(false);

    const plunge = getPublishedProductBySlug("cold-plunge");
    expect(plunge?.placement).toEqual(["indoor", "outdoor"]);
    expect(plunge?.capacity).toBeUndefined();
  });
});
