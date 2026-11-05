import type { OptionGroup } from "./types";

/**
 * Five-step sauna builder.
 * Wood, heater, and add-on dollar amounts are placeholders until confirmed.
 * Chimney kits are bundled with each wood heater and shown as included.
 * Door positions are placeholders until confirmed per model.
 */
export const SAUNA_OPTION_GROUPS: readonly OptionGroup[] = [
  {
    id: "wood",
    label: "Wood type",
    pricingNote: "Wood pricing is a placeholder until confirmed.",
    options: [
      {
        id: "thermo-hemlock",
        label: "Thermo hemlock",
        description: "Heat-treated hemlock with a warm, even tone.",
        priceDeltaCents: 0,
        swatch: "#8d6a43",
      },
      {
        id: "thermo-pine",
        label: "Thermo pine",
        description: "Heat-treated pine with a lighter, honey grain.",
        priceDeltaCents: 45_000,
        swatch: "#c4924a",
      },
      {
        id: "cedar",
        label: "Cedar",
        description: "Classic cedar with a warm, characterful grain.",
        priceDeltaCents: 90_000,
        swatch: "#a35a32",
      },
      {
        id: "clear-cedar",
        label: "Clear cedar",
        description: "Premium, knot-free grade.",
        priceDeltaCents: 180_000,
        swatch: "#e0c097",
      },
    ],
  },
  {
    id: "heater-type",
    label: "Heater type",
    options: [
      {
        id: "electric",
        label: "Electric",
        description: "Convenience and a fast heat-up.",
        priceDeltaCents: 0,
      },
      {
        id: "wood",
        label: "Wood-burning",
        description: "A traditional off-grid fire.",
        priceDeltaCents: 0,
      },
    ],
  },
  {
    id: "heater-electric",
    label: "Heater model",
    when: { groupId: "heater-type", optionId: "electric" },
    pricingNote: "Heater pricing is a placeholder until confirmed.",
    options: [
      {
        id: "harvia-wall",
        label: "Harvia wall-mounted heater",
        description: "Wall-mounted electric heater.",
        priceDeltaCents: 0,
      },
      {
        id: "huum-drop",
        label: "HUUM Drop",
        description: "Electric heater with a rounded stone cage.",
        priceDeltaCents: 65_000,
      },
      {
        id: "homecraft-revive",
        label: "HomeCraft Revive",
        description: "Electric heater for a steady, even room.",
        priceDeltaCents: 120_000,
      },
    ],
  },
  {
    id: "heater-wood",
    label: "Heater model",
    when: { groupId: "heater-type", optionId: "wood" },
    pricingNote:
      "Heater pricing is a placeholder until confirmed. The chimney kit is included in the heater price.",
    options: [
      {
        id: "huum-hive-13",
        label: "HUUM HIVE Wood 13",
        description:
          "Entry-level option for a 4 to 6 person sauna, up to about 460 cu ft. HUUM Thru-Ceiling Chimney Kit included (120 mm flue, about 108 in, ceiling plates, flashing for 0 to 20 degree roofs, rain collar and cap).",
        priceDeltaCents: 240_000,
      },
      {
        id: "harvia-m3",
        label: "Harvia M3",
        description:
          "Entry-level option for a 4 to 6 person sauna, about 4.5 to 13 cubic metre rooms. Harvia WHP1500 stainless chimney included (1,500 mm insulated chimney, smoke pipe, ceiling lead-through, rain flange and cap).",
        priceDeltaCents: 280_000,
      },
    ],
  },
  {
    id: "door",
    label: "Door placement",
    pricingNote: "Door positions are placeholders until confirmed for this model.",
    options: [
      {
        id: "front",
        label: "Front",
        description: "Door centered on the front wall.",
        priceDeltaCents: 0,
        diagram: "front",
      },
      {
        id: "left",
        label: "Left side",
        description: "Door on the left wall.",
        priceDeltaCents: 0,
        diagram: "left",
      },
      {
        id: "right",
        label: "Right side",
        description: "Door on the right wall.",
        priceDeltaCents: 0,
        diagram: "right",
      },
      {
        id: "back",
        label: "Back wall",
        description: "Door centered on the back wall.",
        priceDeltaCents: 0,
        diagram: "back",
      },
    ],
  },
  {
    id: "addons",
    label: "Add-ons",
    selectionMode: "multiple",
    pricingNote: "Add-on pricing is a placeholder. More add-ons can be added later.",
    options: [
      {
        id: "towel-hooks",
        label: "Towel hooks",
        description: "Hooks for towels beside the benches.",
        priceDeltaCents: 8_500,
      },
      {
        id: "bluetooth-speakers",
        label: "Bluetooth speakers",
        description: "A speaker pair for the room.",
        priceDeltaCents: 32_000,
      },
      {
        id: "pot-lights",
        label: "Pot lights",
        description: "Recessed lights in the ceiling.",
        priceDeltaCents: 24_000,
      },
      {
        id: "led-lighting",
        label: "LED lighting",
        description: "A dimmable LED run along the benches.",
        priceDeltaCents: 18_000,
      },
    ],
  },
];
