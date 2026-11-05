# Catalog

Published products are the records in `src/domain/catalog/products.ts` with `visibility: "published"`. Edit that array. The `Product` shape is in `src/domain/catalog/types.ts`.

Current published records:

| id | Category | CAD cents | USD list cents |
| --- | --- | --- | --- |
| `indoor-infrared` | sauna | `800_000` ($8,000) | `590_000` |
| `ember-1` | sauna | `1_250_000` ($12,500) | `925_000` |
| `cold-plunge` | cold-plunge | `1_200_000` ($12,000) | `925_000` |

CAD cents are the cart base. USD cents are the printed list price, labeled exchange-rate dependent, and are not used in cart math. Every product currently has `optionGroups: []`.

## Add a published model

Add one object to the `catalog` array and keep `freezeProduct` wrapping it. Required fields:

- `id` and `slug`: stable strings. The product URL is `/saunas/{slug}` or `/cold-plunges/{slug}` from `category`.
- `name`
- `category`: `"sauna"` or `"cold-plunge"`
- `visibility`: `"published"`
- `priceCadCents` and `listPriceUsdCents`: integer cents
- `specs`: only fields the source states (`dimensions`, `electrical`, `certification`, `heat`, `cooling`, `requirements`)
- `includes`: string list, or `[]`
- `optionGroups`: `[]` until a group exists

Set `capacity` only when a person range is stated: `{ minPersons, maxPersons }`. Set `placement` to `"indoor"`, `"outdoor"`, or both. Omit either field when it is not stated. `generateStaticParams` on the product routes picks up published slugs in that category.

`getPublishedProductBySlug` returns a published product of any category. The sauna page then requires `category === "sauna"`, and the cold-plunge page requires `category === "cold-plunge"`. A slug that fails either check is a 404.

## Hidden and published

`visibility` is `"published"` or `"hidden"`. Listing, filters, comparison (`listSaunasForComparison`), product pages, and `calculatePrice` use the published list only.

Ember 2 (`id` and `slug` `ember-2`) is `hidden`. It has the same CAD and USD cents as Haven Ember 1, and empty `specs`, `includes`, and `optionGroups`. It is not on `/saunas`, not in `/saunas/compare`, and `/saunas/ember-2` is a 404. Pricing it or showing it waits on specs that are not in the catalog record.

## Add an option group

Put a group on that product’s `optionGroups`. The configurator renders a pill row only when `optionGroups.length > 0`. Empty groups render no pills.

```ts
{
  id: "heater",
  label: "Heater",
  options: [
    { id: "included", label: "Included heater", priceDeltaCents: 0 },
  ],
}
```

`id` values must be unique within the product for groups and within the group for options. Checkout requires exactly one selected option id per group. `calculatePrice` returns:

- `unknown_product` when the id is missing or hidden
- `extra_selection` when the cart names a group the product does not have
- `missing_selection` when a group has no selection
- `unknown_option` when the option id is not in that group

The first option in each group is the configurator’s initial selection.

## Add a CAD price delta

`priceDeltaCents` is an integer number of CAD cents added to `priceCadCents`. Zero is allowed and means the option does not change the total. The charged unit price is:

`priceCadCents +` the `priceDeltaCents` of the one selected option in each group.

No client total is accepted. `validateCart` runs the same sum on the server and multiplies by quantity. A non-zero delta belongs in the catalog only when that CAD amount is already a confirmed price. None of the current products have a non-zero delta. The pill label appends the formatted CAD amount when `priceDeltaCents !== 0`.

Display stays “plus tax.” There is no tax calculation in the catalog.

## Capacity and placement filters

`filterSaunas` in `src/domain/catalog/products.ts` filters published saunas. Query parsing is in `src/domain/catalog/filters.ts`. The sauna page reads `capacity` and `placement`.

Capacity values: `all`, `1`, `2`, `3`, `4-5`. Placement values: `all`, `indoor`, `outdoor`. Anything else, including an omitted param, is `all`.

An unset `capacity` or an empty or omitted `placement` matches only `"all"`. A specific tier or placement does not match a product that leaves that field unset.

When capacity is set, a range matches a tier it overlaps. A product with `minPersons: 1` and `maxPersons: 2` matches both the 1-person and 2-person filters. The `4-5` tier matches when `minPersons <= 5` and `maxPersons >= 4`. A specific placement matches when the product’s `placement` array includes that value.

Haven Ember 1 has no `capacity` and no `placement`, so it appears when both filters are `all` and drops out of every specific capacity or placement. The indoor infrared sauna is 1–2 person and indoor, so it matches `all`, 1 person, 2 person, and indoor, and it does not match 3 person, 4–5 person, or outdoor. A filter with no match renders: “No published sauna matches this capacity and placement.”
