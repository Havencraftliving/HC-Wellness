import Link from "next/link";
import type { CapacityFilter, PlacementFilter } from "@/domain/catalog/types";
import { saunaFilterHref } from "@/domain/catalog/filters";

const capacities: readonly { value: CapacityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: 1, label: "1 person" },
  { value: 2, label: "2 person" },
  { value: 3, label: "3 person" },
  { value: "4-5", label: "4–5 person" },
];

const placements: readonly { value: PlacementFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
];

function pillClass(selected: boolean): string {
  const focus =
    "outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

  if (selected) {
    return `type-label inline-block border border-bark bg-bark px-3.5 py-2 text-linen ${focus}`;
  }

  return `type-label inline-block border border-bark/25 bg-parchment px-3.5 py-2 text-bark hover:border-bark/60 ${focus}`;
}

export function SaunaFilters({
  capacity,
  placement,
}: {
  capacity: CapacityFilter;
  placement: PlacementFilter;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p id="capacity-filter" className="type-label">
          Capacity
        </p>
        <div className="mt-2 flex flex-wrap gap-2" aria-labelledby="capacity-filter" role="group">
          {capacities.map((option) => {
            const selected = option.value === capacity;
            return (
              <Link
                key={String(option.value)}
                href={saunaFilterHref(option.value, placement)}
                scroll={false}
                aria-current={selected ? "true" : undefined}
                className={pillClass(selected)}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <p id="placement-filter" className="type-label">
          Placement
        </p>
        <div className="mt-2 flex flex-wrap gap-2" aria-labelledby="placement-filter" role="group">
          {placements.map((option) => {
            const selected = option.value === placement;
            return (
              <Link
                key={option.value}
                href={saunaFilterHref(capacity, option.value)}
                scroll={false}
                aria-current={selected ? "true" : undefined}
                className={pillClass(selected)}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
