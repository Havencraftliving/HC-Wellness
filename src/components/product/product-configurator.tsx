"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { MotionButton } from "@/components/motion/pressable";
import { CatalogPrice } from "@/components/product/catalog-price";
import { primaryButtonClassName } from "@/components/ui/styles";
import { formatDeltaLabel } from "@/domain/catalog/display";
import {
  isOptionGroupActive,
  previewPrice,
  type OptionGroupSelection,
  type OptionSelectionValue,
} from "@/domain/catalog/price";
import type { CatalogOption, DoorSide, OptionGroup, Product } from "@/domain/catalog/types";
import { formatCadFromCents } from "@/domain/money";

type Step = {
  id: string;
  title: string;
  groupIds: readonly string[];
};

const SAUNA_STEPS: readonly Step[] = [
  { id: "wood", title: "Wood type", groupIds: ["wood"] },
  { id: "heater-type", title: "Heater type", groupIds: ["heater-type"] },
  {
    id: "heater-model",
    title: "Heater model",
    groupIds: ["heater-electric", "heater-wood"],
  },
  { id: "door", title: "Door placement", groupIds: ["door"] },
  { id: "addons", title: "Add-ons", groupIds: ["addons"] },
];

function stepsFor(product: Product): Step[] {
  const ids = new Set(product.optionGroups.map((group) => group.id));
  if (ids.has("wood") && ids.has("heater-type")) {
    return SAUNA_STEPS.filter((step) => step.groupIds.some((id) => ids.has(id)));
  }

  return product.optionGroups.map((group) => ({
    id: group.id,
    title: group.label,
    groupIds: [group.id],
  }));
}

function DoorSketch({ side }: { side: DoorSide }) {
  const door = {
    front: { x: 26, y: 58, width: 28, height: 8 },
    back: { x: 26, y: 14, width: 28, height: 8 },
    left: { x: 14, y: 26, width: 8, height: 28 },
    right: { x: 58, y: 26, width: 8, height: 28 },
  }[side];

  return (
    <svg viewBox="0 0 80 80" className="h-14 w-14 text-bark" aria-hidden="true">
      <rect x="18" y="18" width="44" height="44" fill="#e5eef0" stroke="currentColor" strokeWidth="2" />
      <rect {...door} fill="currentColor" />
    </svg>
  );
}

function groupsForStep(
  product: Product,
  step: Step,
  selections: OptionGroupSelection,
): OptionGroup[] {
  return step.groupIds.flatMap((id) => {
    const group = product.optionGroups.find((item) => item.id === id);
    if (!group || !isOptionGroupActive(group, selections)) {
      return [];
    }
    return [group];
  });
}

function choiceLabel(group: OptionGroup, selections: OptionGroupSelection): string {
  const value = selections[group.id];
  if (typeof value === "string") {
    return group.options.find((option) => option.id === value)?.label ?? "Choose one";
  }

  if (Array.isArray(value) && value.length > 0) {
    return value
      .map((id) => group.options.find((option) => option.id === id)?.label)
      .filter((label): label is string => Boolean(label))
      .join(", ");
  }

  return group.selectionMode === "multiple" ? "None selected" : "Choose one";
}

function isChosen(selections: OptionGroupSelection, group: OptionGroup, optionId: string): boolean {
  const value = selections[group.id];
  if (Array.isArray(value)) {
    return value.includes(optionId);
  }
  return value === optionId;
}

export function PurchasePanel({ product }: { product: Product }) {
  const { addLine, ready } = useCart();
  const [added, setAdded] = useState(false);
  const price = previewPrice(product.id, {});

  return (
    <div className="space-y-4 border border-bark/15 bg-parchment p-5">
      {price.ok ? (
        <CatalogPrice
          cadCents={price.totalCadCents}
          listPriceUsdCents={product.listPriceUsdCents}
          placeholder={product.pricePlaceholder}
        />
      ) : (
        <p>Price unavailable.</p>
      )}
      <MotionButton
        type="button"
        className={`${primaryButtonClassName} w-full`}
        disabled={!ready || !price.ok || !price.complete}
        onClick={() => {
          if (!price.ok || !price.complete) {
            return;
          }
          addLine({ productId: product.id, selections: {}, quantity: 1 });
          setAdded(true);
        }}
      >
        Add to cart
      </MotionButton>
      <p aria-live="polite" className="text-sm text-bark-muted">
        {added ? "Added to cart." : "CAD, plus tax. Shipping is not included."}
      </p>
    </div>
  );
}

function OptionCard({
  option,
  selected,
  onSelect,
}: {
  option: CatalogOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-4 border px-4 py-3 text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark ${
        selected ? "border-bark bg-linen ring-1 ring-bark ring-inset" : "border-bark/15 bg-parchment hover:border-bark/35"
      }`}
    >
      {option.swatch ? (
        <span
          className="h-14 w-14 shrink-0 border border-bark/10"
          style={{ backgroundColor: option.swatch }}
          aria-hidden="true"
        />
      ) : null}
      {option.diagram ? <DoorSketch side={option.diagram} /> : null}
      {!option.swatch && !option.diagram ? (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-linen font-heading text-lg font-light text-bark">
          {option.label.slice(0, 1)}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block">{option.label}</span>
        {option.description ? (
          <span className="mt-1 block text-sm leading-5 text-bark-muted">{option.description}</span>
        ) : null}
      </span>
      <span className="shrink-0 font-mono text-xs tracking-[0.1em]">{formatDeltaLabel(option.priceDeltaCents)}</span>
    </button>
  );
}

export function ProductConfigurator({ product }: { product: Product }) {
  const { addLine, ready } = useCart();
  const steps = useMemo(() => stepsFor(product), [product]);
  const [selections, setSelections] = useState<Record<string, OptionSelectionValue>>({});
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [reached, setReached] = useState(0);
  const [added, setAdded] = useState(false);
  const preview = previewPrice(product.id, selections);
  const canAdd = preview.ok && preview.complete && reached >= steps.length;

  function selectSingle(groupId: string, optionId: string) {
    setAdded(false);
    if (groupId === "heater-type") {
      setSelections((current) => {
        const next: Record<string, OptionSelectionValue> = {
          ...current,
          [groupId]: optionId,
        };
        delete next["heater-electric"];
        delete next["heater-wood"];
        return next;
      });
      setReached(1);
      setOpenStep(1);
      return;
    }

    setSelections((current) => ({ ...current, [groupId]: optionId }));
  }

  function toggleAddon(groupId: string, optionId: string) {
    setAdded(false);
    setSelections((current) => {
      const existing = current[groupId];
      const list = Array.isArray(existing) ? [...existing] : [];
      const next = list.includes(optionId)
        ? list.filter((id) => id !== optionId)
        : [...list, optionId];
      return { ...current, [groupId]: next };
    });
  }

  function continueFrom(index: number) {
    const nextIndex = index + 1;
    setReached((current) => Math.max(current, nextIndex));
    if (nextIndex >= steps.length) {
      setOpenStep(null);
      return;
    }
    if (nextIndex > reached) {
      setOpenStep(nextIndex);
      return;
    }
    setOpenStep(null);
  }

  function addToCart() {
    if (!canAdd) {
      return;
    }
    addLine({ productId: product.id, selections, quantity: 1 });
    setAdded(true);
  }

  const summaryRows: { key: string; label: string; amount: string }[] = [
    {
      key: "base",
      label: "Base price",
      amount: formatCadFromCents(product.priceCadCents),
    },
  ];

  for (const group of product.optionGroups) {
    if (!isOptionGroupActive(group, selections)) {
      continue;
    }

    const value = selections[group.id];
    if (group.selectionMode === "multiple") {
      const ids = Array.isArray(value) ? value : [];
      if (ids.length === 0) {
        summaryRows.push({ key: group.id, label: "Add-ons", amount: "None" });
        continue;
      }
      for (const id of ids) {
        const option = group.options.find((item) => item.id === id);
        if (!option) {
          continue;
        }
        summaryRows.push({
          key: `${group.id}-${id}`,
          label: option.label,
          amount: formatDeltaLabel(option.priceDeltaCents),
        });
      }
      continue;
    }

    if (typeof value !== "string") {
      summaryRows.push({ key: group.id, label: group.label, amount: "—" });
      continue;
    }

    const option = group.options.find((item) => item.id === value);
    summaryRows.push({
      key: group.id,
      label: option ? `${group.label}: ${option.label}` : group.label,
      amount: option ? formatDeltaLabel(option.priceDeltaCents) : "—",
    });
  }

  return (
    <div id="build" className="scroll-mt-28 space-y-8 pb-24 lg:pb-0">
      <div className="max-w-xl space-y-3">
        <p className="type-label text-bark-muted">
          Build your sauna
        </p>
        <h2 className="text-4xl">Choose your wood, heater, and finish.</h2>
        <p className="leading-7 text-bark-muted">
          Five steps, one choice at a time. Add-ons can be combined. The total updates
          as you go. Heater, wood, door, and add-on prices are placeholders until confirmed.
        </p>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ol className="space-y-3">
          {steps.map((step, index) => {
            const locked = index > reached && index !== openStep;
            const open = index === openStep;
            const groups = groupsForStep(product, step, selections);
            const summary = groups.map((group) => choiceLabel(group, selections)).join(" · ");
            const note = groups.find((group) => group.pricingNote)?.pricingNote;

            if (locked) {
              return (
                <li key={step.id} className="border border-bark/10 px-4 py-3 opacity-50">
                  <p className="type-label text-bark-muted">
                    Step {index + 1} · {step.title}
                  </p>
                </li>
              );
            }

            if (!open) {
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 border border-bark/10 bg-parchment px-4 py-3 text-left"
                    onClick={() => setOpenStep(index)}
                  >
                    <span>
                      <span className="type-label block text-bark-muted">
                        {step.title}
                      </span>
                      <span className="mt-1 block">{summary || "Choose one"}</span>
                    </span>
                    <span className="type-label text-bark-muted">Edit</span>
                  </button>
                </li>
              );
            }

            const singleMissing = groups.some(
              (group) =>
                group.selectionMode !== "multiple" && typeof selections[group.id] !== "string",
            );

            return (
              <li key={step.id} className="space-y-3 border border-bark/15 bg-parchment p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg">{step.title}</h3>
                  <p className="type-label text-bark-muted">
                    Step {index + 1} of {steps.length}
                  </p>
                </div>
                {groups.length === 0 ? (
                  <p className="text-sm text-bark-muted">Choose a heater type to see models.</p>
                ) : (
                  groups.map((group) => (
                    <div key={group.id} className="space-y-2" role="group" aria-label={group.label}>
                      {groups.length > 1 ? (
                        <p className="type-label">{group.label}</p>
                      ) : null}
                      {group.options.map((option) => (
                        <OptionCard
                          key={option.id}
                          option={option}
                          selected={isChosen(selections, group, option.id)}
                          onSelect={() => {
                            if (group.selectionMode === "multiple") {
                              toggleAddon(group.id, option.id);
                              return;
                            }
                            selectSingle(group.id, option.id);
                          }}
                        />
                      ))}
                    </div>
                  ))
                )}
                {note ? <p className="text-sm text-bark-muted">{note}</p> : null}
                <MotionButton
                  type="button"
                  className={primaryButtonClassName}
                  disabled={singleMissing || groups.length === 0}
                  onClick={() => continueFrom(index)}
                >
                  {index === steps.length - 1 ? "Review build" : "Continue"}
                </MotionButton>
              </li>
            );
          })}
        </ol>
        <aside className="border border-bark/15 bg-parchment p-5 lg:sticky lg:top-28">
          <p className="type-label">Your {product.name}</p>
          <dl className="mt-4 space-y-3 text-sm">
            {summaryRows.map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4">
                <dt className="text-bark-muted">{row.label}</dt>
                <dd className="text-right">{row.amount}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-bark/10 pt-4">
            <p className="text-sm">Product total</p>
            <p className="font-heading text-4xl font-light">
              {preview.ok ? formatCadFromCents(preview.totalCadCents) : "—"}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-bark-muted">
            CAD, plus tax. Shipping is not included. Option prices on this build are
            placeholders until confirmed.
          </p>
          <MotionButton
            type="button"
            className={`${primaryButtonClassName} mt-5 w-full`}
            disabled={!ready || !canAdd}
            onClick={addToCart}
          >
            Add to cart
          </MotionButton>
          <p aria-live="polite" className="mt-3 text-sm text-bark-muted">
            {added ? "Added to cart." : canAdd ? "Ready to add." : "Finish each step to add this build."}
          </p>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bark/10 bg-parchment px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="type-label text-bark-muted">Your build</p>
            <p className="font-heading text-xl">
              {preview.ok ? formatCadFromCents(preview.totalCadCents) : "—"}
            </p>
          </div>
          <MotionButton
            type="button"
            className={primaryButtonClassName}
            disabled={!ready || !canAdd}
            onClick={addToCart}
          >
            Add to cart
          </MotionButton>
        </div>
      </div>
    </div>
  );
}
