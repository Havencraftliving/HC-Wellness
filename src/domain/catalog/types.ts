/**
 * Sell-sheet catalog types.
 * Option groups can carry future CAD price deltas (material, red light, heater,
 * accessories). No deltas are seeded until a price is printed on the sheet.
 */

export type ProductCategory = "sauna" | "cold-plunge" | "shower" | "red-light";

export type Visibility = "published" | "hidden";

/** Indoor, outdoor, or both when the sheet states both. Omit when unset. */
export type Placement = "indoor" | "outdoor";

/**
 * Capacity filter tiers. "4-5" is the four-to-five person tier.
 * "all" is not a product attribute; it is only a filter value.
 */
export type CapacityTier = 1 | 2 | 3 | "4-5";

export type CapacityFilter = "all" | CapacityTier;

export type PlacementFilter = "all" | Placement;

/**
 * Inclusive person range printed on the sheet.
 * Omit on a product when the sheet does not state a capacity.
 */
export type PersonCapacity = {
  readonly minPersons: number;
  readonly maxPersons: number;
};

export type DoorSide = "front" | "left" | "right" | "back";

export type CatalogOption = {
  readonly id: string;
  readonly label: string;
  /** Integer cents added to the CAD base. May be zero. */
  readonly priceDeltaCents: number;
  readonly description?: string;
  /** CSS color for a wood swatch when no photo is published. */
  readonly swatch?: string;
  readonly diagram?: DoorSide;
};

export type OptionGroup = {
  readonly id: string;
  readonly label: string;
  /** Single choice, or several checkboxes. Defaults to single. */
  readonly selectionMode?: "single" | "multiple";
  /** This group is required only when another group has the given option. */
  readonly when?: {
    readonly groupId: string;
    readonly optionId: string;
  };
  /** Shown under the step when the prices or choices are not final. */
  readonly pricingNote?: string;
  readonly options: readonly CatalogOption[];
};

export type ProductStory = {
  readonly tagline: string;
  readonly summary: string;
  readonly features: readonly string[];
  /** Final copy has not arrived. The page labels this as placeholder. */
  readonly copyPlaceholder?: boolean;
};

/** Printed spec strings. Fields the sheet does not state are omitted. */
export type ProductSpecs = {
  readonly dimensions?: string;
  readonly electrical?: string;
  readonly certification?: string;
  /** Heat source. No numeric EMF value unless the sheet prints one. */
  readonly heat?: string;
  readonly cooling?: string;
  readonly materials?: string;
  readonly warranty?: string;
  readonly requirements?: readonly string[];
};

export type Product = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly visibility: Visibility;
  readonly capacity?: PersonCapacity;
  readonly placement?: readonly Placement[];
  /**
   * Canonical price in integer CAD cents. This is the cart base.
   * USD is not added into this number.
   */
  readonly priceCadCents: number;
  /**
   * Printed USD list price in integer cents.
   * Exchange-rate dependent. Not used in cart math.
   */
  readonly listPriceUsdCents: number;
  readonly priceNote?: string;
  readonly specs: ProductSpecs;
  readonly includes: readonly string[];
  readonly optionGroups: readonly OptionGroup[];
  /** Path under /public, when a photo is published for this model. */
  readonly imageSrc?: string;
  readonly gallery?: readonly string[];
  readonly collectionLabel?: string;
  /** Groups products on a collection page, such as a shower category. */
  readonly groupLabel?: string;
  readonly story?: ProductStory;
  /**
   * The whole product — name, category, or price — is not confirmed.
   * The page labels it as a placeholder.
   */
  readonly placeholder?: boolean;
  /** Base price is not confirmed. Option deltas are labelled separately. */
  readonly pricePlaceholder?: boolean;
};

export type SaunaFilters = {
  readonly capacity?: CapacityFilter;
  readonly placement?: PlacementFilter;
};
