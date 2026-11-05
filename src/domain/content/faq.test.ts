import { describe, expect, it } from "vitest";
import { buildFaq } from "./faq";

describe("buildFaq", () => {
  const items = buildFaq();
  const text = items.map((item) => `${item.question} ${item.answer}`).join("\n");

  it("uses catalog prices and does not mention the hidden sauna", () => {
    expect(text).toContain("$8,000 CAD");
    expect(text).toContain("$12,500 CAD");
    expect(text).toContain("$12,000 CAD");
    expect(text).toContain("$5,900 USD");
    expect(text.toLowerCase()).not.toContain("ember 2");
    expect(text).not.toContain("ember-2");
  });

  it("does not invent a warranty term", () => {
    const warranty = items.find((item) => /warranty/i.test(item.question));
    expect(warranty?.answer).toMatch(/not published/i);
    expect(warranty?.answer).not.toMatch(/\b\d+[-\s]?year/i);
    expect(warranty?.answer.toLowerCase()).not.toContain("lifetime");
    expect(warranty?.answer).toContain("malik@havencraftliving.com");
  });

  it("states the empty sauna tiers from the filter results", () => {
    expect(text).toMatch(/3 person/);
    expect(text).toMatch(/4–5 person/);
    expect(text).toMatch(/outdoor/);
    expect(text).toMatch(/No published sauna matches/);
  });
});
