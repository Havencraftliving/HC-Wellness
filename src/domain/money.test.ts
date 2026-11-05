import { describe, expect, it } from "vitest";
import { formatCadFromCents, formatUsdFromCents } from "./money";

describe("formatCadFromCents", () => {
  it("prints whole CAD dollars from integer cents", () => {
    expect(formatCadFromCents(800_000)).toBe("$8,000 CAD");
    expect(formatCadFromCents(1_250_000)).toBe("$12,500 CAD");
    expect(formatCadFromCents(1_200_000)).toBe("$12,000 CAD");
  });

  it("keeps a cent remainder when the amount is not a whole dollar", () => {
    expect(formatCadFromCents(1_040_050)).toBe("$10,400.50 CAD");
  });
});

describe("formatUsdFromCents", () => {
  it("prints the published USD list price from integer cents", () => {
    expect(formatUsdFromCents(590_000)).toBe("$5,900 USD");
    expect(formatUsdFromCents(925_000)).toBe("$9,250 USD");
  });
});
