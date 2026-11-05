import {
  formatCapacity,
  formatPlacement,
  materialLines,
} from "../catalog/display";
import { formatCadFromCents, formatUsdFromCents } from "../money";
import { filterSaunas, listPublishedProducts } from "../catalog/products";
import type { Product } from "../catalog/types";

export type FaqItem = {
  question: string;
  answer: string;
};

function requireProduct(products: readonly Product[], id: string): Product {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`Published product ${id} is missing from the catalog.`);
  }

  return product;
}

function priceAnswer(product: Product): string {
  return `${formatCadFromCents(product.priceCadCents)}, plus tax. Published list price ${formatUsdFromCents(product.listPriceUsdCents)}, exchange-rate dependent.`;
}

/**
 * FAQ answers are built from the published catalog.
 * Hidden products are not included.
 */
export function buildFaq(
  products: readonly Product[] = listPublishedProducts(),
): readonly FaqItem[] {
  const infrared = requireProduct(products, "indoor-infrared");
  const ember = requireProduct(products, "ember-1");
  const plunge = requireProduct(products, "cold-plunge");
  const saunas = products.filter((product) => product.category === "sauna");
  const etlNames = products
    .filter((product) => product.specs.certification?.includes("ETL"))
    .map((product) => product.name);
  const kitLine = ember.includes.find((line) => /accessory kit/i.test(line));
  const emptyTiers = [
    filterSaunas({ capacity: 3 }).length === 0 ? "3 person" : null,
    filterSaunas({ capacity: "4-5" }).length === 0 ? "4–5 person" : null,
    filterSaunas({ placement: "outdoor" }).length === 0 ? "outdoor" : null,
  ].filter((tier): tier is string => tier !== null);

  return [
    {
      question: "Which saunas are published?",
      answer: saunas.map((product) => product.name).join(" and ") + ".",
    },
    {
      question: "What does the indoor infrared sauna cost?",
      answer: priceAnswer(infrared),
    },
    {
      question: "What does Haven Ember 1 cost?",
      answer: priceAnswer(ember),
    },
    {
      question: "What does the cold plunge cost?",
      answer: priceAnswer(plunge),
    },
    {
      question: "How many people does the indoor infrared sauna hold?",
      answer: infrared.capacity
        ? formatCapacity(infrared.capacity) + "."
        : "A person count is not published.",
    },
    {
      question: "Does Haven Ember 1 publish a person count or placement?",
      answer:
        ember.capacity || (ember.placement && ember.placement.length > 0)
          ? [
              ember.capacity ? formatCapacity(ember.capacity) : null,
              ember.placement ? formatPlacement(ember.placement) : null,
            ]
              .filter((value): value is string => value !== null)
              .join(". ") + "."
          : "Haven Ember 1 does not publish a person count or an indoor or outdoor placement.",
    },
    {
      question: "Is a 3-person, 4–5 person, or outdoor sauna listed?",
      answer:
        emptyTiers.length > 0
          ? `No published sauna matches ${emptyTiers.join(", ")}.`
          : "Each of those filters matches a published sauna.",
    },
    {
      question: "Where can the cold plunge be placed?",
      answer: [
        plunge.placement ? formatPlacement(plunge.placement) + "." : null,
        plunge.specs.cooling ? `Cooling ${plunge.specs.cooling}.` : null,
        ...(plunge.specs.requirements ?? []).map((line) =>
          line.endsWith(".") ? line : `${line}.`,
        ),
      ]
        .filter((line): line is string => line !== null)
        .join(" "),
    },
    {
      question: "Which models list ETL?",
      answer:
        etlNames.length > 0
          ? `ETL is listed on ${etlNames.join(" and ")}.`
          : "No published product lists ETL.",
    },
    {
      question: "Where is low-EMF stated?",
      answer: infrared.specs.heat
        ? `${infrared.name}: ${infrared.specs.heat}. No EMF measurement is published. ${ember.name} lists an electric sauna heater and does not state low-EMF.`
        : "No published product states low-EMF.",
    },
    {
      question: "Are accessories sold separately?",
      answer: kitLine
        ? `${ember.name} includes: ${kitLine}. That kit is part of the sauna, not a separate priced SKU. Wood, heater, door, and add-on prices on the sauna builder are placeholders until confirmed.`
        : "No separate accessory price is published.",
    },
    {
      question: "What wood is used?",
      answer: [infrared, ember, plunge]
        .map((product) => {
          const lines = materialLines(product);
          return lines.length > 0
            ? `${product.name}: ${lines.join("; ")}.`
            : null;
        })
        .filter((line): line is string => line !== null)
        .join(" "),
    },
    {
      question: "Are the prices taxed?",
      answer:
        "Published prices are CAD, plus tax. This site does not calculate tax.",
    },
    {
      question: "What warranty is included?",
      answer:
        "A warranty term is not published here. Confirm the warranty with your order, and contact Malik Sayadi at malik@havencraftliving.com or (604) 396-2180.",
    },
  ];
}
