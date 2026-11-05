export const primaryButtonClassName =
  "type-label inline-flex items-center justify-center bg-bark px-6 py-3.5 text-linen outline-offset-4 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryLinkClassName =
  "inline-flex items-center justify-center px-5 py-3 text-sm tracking-wide text-bark underline-offset-4 outline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

export function optionPillClassName(selected: boolean): string {
  const focus =
    "outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

  if (selected) {
    return `bg-bark px-4 py-2 text-sm text-linen ${focus}`;
  }

  return `bg-parchment px-4 py-2 text-sm text-bark ring-1 ring-inset ring-bark/25 ${focus}`;
}
