import { describe, expect, it } from "vitest";
import { getPublishedProductBySlug } from "./products";
import {
  describeProduct,
  formatCapacity,
  listSpecRows,
  materialLines,
  productPath,
} from "./display";
import { parseCapacityParam, saunaFilterHref } from "./filters";

describe("listSpecRows", () => {
  it("omits capacity, placement, and heat when the catalog does not state them", () => {
    const ember = getPublishedProductBySlug("ember-1");
    expect(ember).toBeDefined();
    const ids = listSpecRows(ember!).map((row) => row.id);

    expect(ids).toEqual(["dimensions", "electrical", "certification"]);
    expect(ids).not.toContain("capacity");
    expect(ids).not.toContain("placement");
    expect(ids).not.toContain("heat");
  });

  it("includes the infrared capacity, placement, and low-EMF heat line", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    expect(infrared).toBeDefined();
    const rows = listSpecRows(infrared!);

    expect(rows.find((row) => row.id === "capacity")?.value).toBe("1–2 person");
    expect(rows.find((row) => row.id === "placement")?.value).toBe("Indoor");
    expect(rows.find((row) => row.id === "heat")?.value).toBe(
      "Carbon infrared, low-EMF",
    );
  });
});

describe("describeProduct", () => {
  it("does not assign a person count to Haven Ember 1", () => {
    const ember = getPublishedProductBySlug("ember-1");
    expect(ember).toBeDefined();
    expect(describeProduct(ember!)).not.toMatch(/person/i);
  });
});

describe("materialLines", () => {
  it("cites hemlock for the infrared sauna and cedar for Haven Ember 1", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    const ember = getPublishedProductBySlug("ember-1");
    expect(infrared).toBeDefined();
    expect(ember).toBeDefined();

    expect(materialLines(infrared!).join(" ")).toMatch(/hemlock/i);
    expect(materialLines(infrared!).join(" ")).not.toMatch(/cedar/i);
    expect(materialLines(ember!).join(" ")).toMatch(/cedar/i);
    expect(materialLines(ember!).join(" ")).toMatch(/hemlock/i);
  });
});

describe("productPath", () => {
  it("routes published products and does not build an Ember 2 path", () => {
    const infrared = getPublishedProductBySlug("indoor-infrared");
    const plunge = getPublishedProductBySlug("cold-plunge");
    expect(infrared).toBeDefined();
    expect(plunge).toBeDefined();
    expect(productPath(infrared!)).toBe("/saunas/indoor-infrared");
    expect(productPath(plunge!)).toBe("/cold-plunges/cold-plunge");
    expect(getPublishedProductBySlug("ember-2")).toBeUndefined();
  });
});

describe("sauna filter query", () => {
  it("builds a shareable path and treats unknown values as all", () => {
    expect(saunaFilterHref("all", "all")).toBe("/saunas");
    expect(saunaFilterHref(3, "outdoor")).toBe(
      "/saunas?capacity=3&placement=outdoor",
    );
    expect(saunaFilterHref("4-5", "all")).toBe("/saunas?capacity=4-5");
    expect(parseCapacityParam("9")).toBe("all");
    expect(formatCapacity({ minPersons: 1, maxPersons: 2 })).toBe("1–2 person");
  });
});
