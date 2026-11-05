import { SAUNA_OPTION_GROUPS } from "./sauna-options";
import type {
  CapacityFilter,
  Placement,
  PlacementFilter,
  Product,
  ProductCategory,
  SaunaFilters,
} from "./types";

/**
 * CAD cents are the cart currency. USD cents are a printed list price and
 * depend on the exchange rate. Display concerns (tax, USD label) are separate.
 */
export const PRICE_NOTE =
  "CAD is the canonical price in integer cents. USD is a printed list price, exchange-rate dependent, and is not used in cart math.";

function freezeProduct(product: Product): Product {
  return Object.freeze({
    ...product,
    capacity: product.capacity
      ? Object.freeze({ ...product.capacity })
      : undefined,
    placement: product.placement
      ? Object.freeze([...product.placement])
      : undefined,
    specs: Object.freeze({
      ...product.specs,
      requirements: product.specs.requirements
        ? Object.freeze([...product.specs.requirements])
        : undefined,
    }),
    includes: Object.freeze([...product.includes]),
    gallery: product.gallery ? Object.freeze([...product.gallery]) : undefined,
    story: product.story
      ? Object.freeze({
          ...product.story,
          features: Object.freeze([...product.story.features]),
        })
      : undefined,
    optionGroups: Object.freeze(
      product.optionGroups.map((group) =>
        Object.freeze({
          ...group,
          when: group.when ? Object.freeze({ ...group.when }) : undefined,
          options: Object.freeze(
            group.options.map((option) => Object.freeze({ ...option })),
          ),
        }),
      ),
    ),
  });
}

const catalog = ([
  {
    id: "indoor-infrared",
    slug: "indoor-infrared",
    name: "Indoor infrared sauna",
    category: "sauna",
    visibility: "published",
    capacity: { minPersons: 1, maxPersons: 2 },
    placement: ["indoor"],
    priceCadCents: 800_000,
    listPriceUsdCents: 590_000,
    priceNote: PRICE_NOTE,
    specs: {
      dimensions: "120×105×190",
      electrical: "120V / 60 amp",
      certification: "ETL (Intertek)",
      heat: "Carbon infrared, low-EMF",
    },
    includes: [
      "Hemlock wood construction",
      "Carbon infrared heating system (low-EMF)",
      "Integrated oxygen bar",
      "Digital control panel",
      "LED interior lighting",
      "Bluetooth audio with built-in speakers",
      "Tempered glass door with premium door handles",
    ],
    optionGroups: SAUNA_OPTION_GROUPS,
    imageSrc: "/images/indoor-infrared.jpg",
    collectionLabel: "Indoor collection",
    story: {
      copyPlaceholder: true,
      tagline: "A quiet infrared room for one or two.",
      summary:
        "Hemlock, carbon infrared heat, and a low-EMF system in a compact indoor cabin. Warm wood and a glass door make the room feel considered, not clinical. Final product copy is still to come.",
      features: [
        "Seats 1–2",
        "Carbon infrared heat, described as low-EMF",
        "Hemlock construction with an oxygen bar",
        "Digital controls, LED lighting, and Bluetooth audio",
        "Tempered glass door",
      ],
    },
  },
  {
    id: "ember-1",
    slug: "ember-1",
    name: "Haven Ember 1",
    category: "sauna",
    visibility: "published",
    priceCadCents: 1_250_000,
    listPriceUsdCents: 925_000,
    priceNote: PRICE_NOTE,
    specs: {
      dimensions: "180×195×210 cm",
      electrical: "60 amp / 120V",
      certification: "ETL (Intertek)",
    },
    includes: [
      "Hemlock exterior cladding",
      "Cedar interior panels, benches, and flooring",
      "Tempered glass door and window",
      "Electric sauna heater",
      "Digital control system",
      "Heat-resistant lighting and waterproof speakers",
      "Fully insulated structure",
      "Adjustable ventilation",
      "Accessory kit (stones, bucket, ladle, thermometer, hygrometer, hourglass)",
      "Export-grade crating",
    ],
    optionGroups: SAUNA_OPTION_GROUPS,
    imageSrc: "/images/ember-1.jpg",
    collectionLabel: "Sauna collection",
    story: {
      copyPlaceholder: true,
      tagline: "Hemlock outside, cedar within.",
      summary:
        "A fully insulated room with cedar benches, a glass door, and an electric heater, built to sit with the rest of the line. The accessory kit ships with the sauna. Final product copy is still to come.",
      features: [
        "Hemlock exterior and cedar interior",
        "Tempered glass door and window",
        "Electric sauna heater and digital controls",
        "Fully insulated structure with adjustable ventilation",
        "Accessory kit included",
      ],
    },
  },
  {
    id: "cold-plunge",
    slug: "cold-plunge",
    name: "Cold plunge",
    category: "cold-plunge",
    visibility: "published",
    placement: ["indoor", "outdoor"],
    priceCadCents: 1_200_000,
    listPriceUsdCents: 925_000,
    priceNote: PRICE_NOTE,
    specs: {
      dimensions: "190(L) × 78(W) × 87 cm(H)",
      electrical: "120V / 12 amp",
      cooling: "3–40 degrees",
      requirements: ["Electrical connection and water source required"],
    },
    includes: [
      "Insulated tub",
      "Stainless steel interior",
      "Exterior wood cladding",
      "Removable insulated lid",
      "Precision cooling/chiller",
      "Circulation pump and filtration",
      "Connection hoses and fittings",
      "Basic setup docs",
    ],
    optionGroups: [],
    imageSrc: "/images/cold-plunge.jpg",
    collectionLabel: "Cold plunges",
    story: {
      copyPlaceholder: true,
      tagline: "Contrast, held at a precise temperature.",
      summary:
        "An insulated plunge with a stainless interior and wood cladding, cooled from 3 to 40 degrees. It can sit indoors or outdoors once water and power are on site. Final product copy is still to come.",
      features: [
        "Indoor or outdoor placement",
        "Cools from 3 to 40 degrees",
        "Stainless interior and wood cladding",
        "Chiller, pump, and filtration included",
        "Removable insulated lid",
      ],
    },
  },
  {
    id: "cedar-outdoor-rinse",
    slug: "cedar-outdoor-rinse",
    name: "Cedar Outdoor Rinse",
    category: "shower",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 480_000,
    listPriceUsdCents: 350_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Outdoor showers",
    groupLabel: "Outdoor showers",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/shower.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "An open-air rinse beside the sauna.",
      summary:
        "A placeholder for the first outdoor shower. The category name, product name, specs, and price are not confirmed. This page is here so the collection can be built before that copy arrives.",
      features: [
        "Placeholder outdoor shower",
        "Category name to be confirmed",
        "Specs to be confirmed",
        "Priced as a placeholder so the page can be reviewed",
      ],
    },
  },
  {
    id: "indoor-steam-shower",
    slug: "indoor-steam-shower",
    name: "Indoor Steam Shower",
    category: "shower",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 720_000,
    listPriceUsdCents: 530_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Indoor showers",
    groupLabel: "Indoor showers",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/shower.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "Steam and water in one enclosure.",
      summary:
        "A placeholder for the first indoor shower. The category name, product name, specs, and price are not confirmed. Nothing here should be treated as final.",
      features: [
        "Placeholder indoor shower",
        "Category name to be confirmed",
        "Specs to be confirmed",
        "Priced as a placeholder so the page can be reviewed",
      ],
    },
  },
  {
    id: "red-light-panel-full",
    slug: "full-body-panel",
    name: "Full-Body Red Light Panel",
    category: "red-light",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 145_000,
    listPriceUsdCents: 105_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Red light",
    groupLabel: "Panels",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/red-light.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "The larger of the two panel sizes.",
      summary:
        "A placeholder for the full-body red light panel. Name, size, power, and price are not confirmed. It is a separate product from the infrared sauna.",
      features: [
        "Placeholder full-body panel",
        "One of two panel tiers",
        "Power and dimensions to be confirmed",
        "Not the infrared sauna heater",
      ],
    },
  },
  {
    id: "red-light-panel-compact",
    slug: "compact-panel",
    name: "Compact Red Light Panel",
    category: "red-light",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 89_000,
    listPriceUsdCents: 65_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Red light",
    groupLabel: "Panels",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/red-light.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "The smaller of the two panel sizes.",
      summary:
        "A placeholder for the compact red light panel. Name, size, power, and price are not confirmed. It sits beside the full-body panel as the second tier.",
      features: [
        "Placeholder compact panel",
        "Second of two panel tiers",
        "Power and dimensions to be confirmed",
        "Not the infrared sauna heater",
      ],
    },
  },
  {
    id: "red-light-mat",
    slug: "therapy-mat",
    name: "Red Light Mat",
    category: "red-light",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 62_000,
    listPriceUsdCents: 45_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Red light",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/red-light.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "A mat for a session on the floor.",
      summary:
        "A placeholder for the red light mat. Name, size, power, and price are not confirmed. Product copy will replace this text.",
      features: [
        "Placeholder red light mat",
        "One mat in the collection",
        "Size and power to be confirmed",
      ],
    },
  },
  {
    id: "red-light-mask",
    slug: "face-mask",
    name: "Red Light Face Mask",
    category: "red-light",
    visibility: "published",
    placeholder: true,
    pricePlaceholder: true,
    priceCadCents: 34_000,
    listPriceUsdCents: 25_000,
    priceNote: "Placeholder price. Not confirmed.",
    collectionLabel: "Red light",
    specs: {
      dimensions: "To be confirmed",
      materials: "To be confirmed",
      electrical: "To be confirmed",
      warranty: "Not yet published",
    },
    includes: [],
    optionGroups: [],
    imageSrc: "/images/red-light.jpg",
    story: {
      copyPlaceholder: true,
      tagline: "A mask for a short facial session.",
      summary:
        "A placeholder for the red light face mask. Name, fit, power, and price are not confirmed. Product copy will replace this text.",
      features: [
        "Placeholder face mask",
        "One mask in the collection",
        "Fit and power to be confirmed",
      ],
    },
  },
  {
    id: "ember-2",
    slug: "ember-2",
    name: "Ember 2",
    category: "sauna",
    visibility: "hidden",
    priceCadCents: 1_250_000,
    listPriceUsdCents: 925_000,
    priceNote: PRICE_NOTE,
    specs: {},
    includes: [],
    optionGroups: [],
  },
] satisfies readonly Product[]).map(freezeProduct);

function isPublished(product: Product): boolean {
  return product.visibility === "published";
}

/** Purchasable products. Hidden records such as Ember 2 are omitted. */
export function listPublishedProducts(): readonly Product[] {
  return catalog.filter(isPublished);
}

export function listPublishedSaunas(): readonly Product[] {
  return catalog.filter(
    (product) => isPublished(product) && product.category === "sauna",
  );
}

export function listPublishedColdPlunges(): readonly Product[] {
  return listPublishedByCategory("cold-plunge");
}

export function listPublishedShowers(): readonly Product[] {
  return listPublishedByCategory("shower");
}

export function listPublishedRedLight(): readonly Product[] {
  return listPublishedByCategory("red-light");
}

function listPublishedByCategory(category: ProductCategory): readonly Product[] {
  return catalog.filter(
    (product) => isPublished(product) && product.category === category,
  );
}

/** Published saunas for the comparison table. Cold plunges and hidden models are omitted. */
export function listSaunasForComparison(): readonly Product[] {
  return listPublishedSaunas();
}

/**
 * Published product with this slug.
 * A hidden product, including Ember 2, is not found.
 */
export function getPublishedProductBySlug(slug: string): Product | undefined {
  return catalog.find(
    (product) => isPublished(product) && product.slug === slug,
  );
}

/** Published product with this id. A hidden product is not found. */
export function getPublishedProductById(id: string): Product | undefined {
  return catalog.find((product) => isPublished(product) && product.id === id);
}

/**
 * Published saunas matching capacity and placement.
 * Omitted filters, or "all", keep products whose capacity or placement is unset.
 * A specific capacity or placement does not match an unset value.
 * A 1–2 person range matches both the 1-person and 2-person tiers.
 */
export function filterSaunas(filters: SaunaFilters = {}): readonly Product[] {
  const capacity = filters.capacity ?? "all";
  const placement = filters.placement ?? "all";

  return listPublishedSaunas().filter(
    (product) =>
      matchesCapacity(product, capacity) && matchesPlacement(product, placement),
  );
}

function matchesCapacity(product: Product, filter: CapacityFilter): boolean {
  if (filter === "all") {
    return true;
  }

  const capacity = product.capacity;
  if (!capacity) {
    return false;
  }

  if (filter === "4-5") {
    return capacity.minPersons <= 5 && capacity.maxPersons >= 4;
  }

  return capacity.minPersons <= filter && capacity.maxPersons >= filter;
}

function matchesPlacement(product: Product, filter: PlacementFilter): boolean {
  if (filter === "all") {
    return true;
  }

  return includesPlacement(product.placement, filter);
}

function includesPlacement(
  placement: readonly Placement[] | undefined,
  value: Placement,
): boolean {
  if (!placement || placement.length === 0) {
    return false;
  }

  return placement.includes(value);
}
