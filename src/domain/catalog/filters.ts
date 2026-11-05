import type { CapacityFilter, PlacementFilter } from "./types";

export function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parseCapacityParam(value: string | undefined): CapacityFilter {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as 1 | 2 | 3;
  }

  if (value === "4-5") {
    return "4-5";
  }

  return "all";
}

export function parsePlacementParam(value: string | undefined): PlacementFilter {
  if (value === "indoor" || value === "outdoor") {
    return value;
  }

  return "all";
}

export function saunaFilterHref(
  capacity: CapacityFilter,
  placement: PlacementFilter,
): string {
  const params = new URLSearchParams();

  if (capacity !== "all") {
    params.set("capacity", String(capacity));
  }

  if (placement !== "all") {
    params.set("placement", placement);
  }

  const query = params.toString();
  return query.length > 0 ? `/saunas?${query}` : "/saunas";
}
