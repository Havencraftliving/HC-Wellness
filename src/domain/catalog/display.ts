import { formatCadFromCents } from "../money";
import type { OptionGroupSelection } from "./price";
import type { PersonCapacity, Placement, Product } from "./types";

const SPEC_ORDER = [
  "capacity",
  "placement",
  "dimensions",
  "materials",
  "electrical",
  "certification",
  "heat",
  "cooling",
  "warranty",
  "requirements",
] as const;

export type SpecId = (typeof SPEC_ORDER)[number];

export type SpecRow = {
  id: SpecId;
  label: string;
  value: string;
};

const SPEC_LABELS: Record<SpecId, string> = {
  capacity: "Capacity",
  placement: "Placement",
  dimensions: "Dimensions",
  electrical: "Electrical",
  certification: "Certification",
  heat: "Heat",
  cooling: "Cooling",
  materials: "Materials",
  warranty: "Warranty",
  requirements: "Requirements",
};

export function formatCapacity(capacity: PersonCapacity): string {
  if (capacity.minPersons === capacity.maxPersons) {
    const noun = capacity.minPersons === 1 ? "person" : "people";
    return `${capacity.minPersons} ${noun}`;
  }

  return `${capacity.minPersons}–${capacity.maxPersons} person`;
}

export function formatPlacement(placement: readonly Placement[]): string {
  const labels = placement.map((value) =>
    value === "indoor" ? "Indoor" : "Outdoor",
  );

  return labels.join(" or ");
}

function sentence(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function specValue(product: Product, id: SpecId): string | undefined {
  switch (id) {
    case "capacity":
      return product.capacity ? formatCapacity(product.capacity) : undefined;
    case "placement":
      return product.placement && product.placement.length > 0
        ? formatPlacement(product.placement)
        : undefined;
    case "dimensions":
      return product.specs.dimensions;
    case "electrical":
      return product.specs.electrical;
    case "certification":
      return product.specs.certification;
    case "heat":
      return product.specs.heat;
    case "cooling":
      return product.specs.cooling;
    case "materials":
      return product.specs.materials;
    case "warranty":
      return product.specs.warranty;
    case "requirements":
      return product.specs.requirements && product.specs.requirements.length > 0
        ? product.specs.requirements.join("; ")
        : undefined;
    default:
      return undefined;
  }
}

/** Spec rows the catalog actually has. Missing fields are omitted. */
export function listSpecRows(product: Product): SpecRow[] {
  return SPEC_ORDER.flatMap((id) => {
    const value = specValue(product, id);
    if (!value) {
      return [];
    }

    return [{ id, label: SPEC_LABELS[id], value }];
  });
}

export function specValueFor(product: Product, id: SpecId): string | undefined {
  return specValue(product, id);
}

/** Description assembled from the product name and published specs. */
export function describeProduct(product: Product): string {
  const facts = [product.name];
  if (product.capacity) {
    facts.push(formatCapacity(product.capacity));
  }
  if (product.placement && product.placement.length > 0) {
    facts.push(formatPlacement(product.placement));
  }

  const sentences = [sentence(facts.join(", "))];

  if (product.specs.heat) {
    sentences.push(sentence(product.specs.heat));
  }
  if (product.specs.cooling) {
    sentences.push(sentence(`Cooling ${product.specs.cooling}`));
  }
  if (product.specs.dimensions) {
    sentences.push(sentence(`Dimensions ${product.specs.dimensions}`));
  }
  if (product.specs.electrical) {
    sentences.push(sentence(`Electrical ${product.specs.electrical}`));
  }
  if (product.specs.certification) {
    sentences.push(sentence(product.specs.certification));
  }
  for (const requirement of product.specs.requirements ?? []) {
    sentences.push(sentence(requirement));
  }

  return sentences.join(" ");
}

const CATEGORY_PATH: Record<Product["category"], string> = {
  sauna: "saunas",
  "cold-plunge": "cold-plunges",
  shower: "showers",
  "red-light": "red-light",
};

export function productPath(product: Product): string {
  return `/${CATEGORY_PATH[product.category]}/${product.slug}`;
}

export function listingPath(product: Product): { href: string; label: string } {
  switch (product.category) {
    case "sauna":
      return { href: "/saunas", label: "Saunas" };
    case "cold-plunge":
      return { href: "/cold-plunges", label: "Cold plunges" };
    case "shower":
      return { href: "/showers", label: "Showers" };
    case "red-light":
      return { href: "/red-light", label: "Red light" };
  }
}

/** Zero deltas read as included. Other deltas keep the CAD label. */
export function formatDeltaLabel(cents: number): string {
  if (cents === 0) {
    return "Included";
  }

  const formatted = formatCadFromCents(Math.abs(cents));
  return cents > 0 ? `+${formatted}` : `-${formatted}`;
}

export function optionSummary(
  product: Product,
  selections: OptionGroupSelection,
): string {
  const labels: string[] = [];

  for (const group of product.optionGroups) {
    const value = selections[group.id];
    if (typeof value === "string") {
      const option = group.options.find((item) => item.id === value);
      if (option) {
        labels.push(option.label);
      }
      continue;
    }

    if (!Array.isArray(value)) {
      continue;
    }

    for (const optionId of value) {
      const option = group.options.find((item) => item.id === optionId);
      if (option) {
        labels.push(option.label);
      }
    }
  }

  return labels.join(", ");
}

const MATERIAL_LINE = /hemlock|cedar|stainless|cladding|wood/i;

export function materialLines(product: Product): readonly string[] {
  return product.includes.filter((line) => MATERIAL_LINE.test(line));
}
