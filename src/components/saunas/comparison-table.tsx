import { listSpecRows, specValueFor, type SpecId } from "@/domain/catalog/display";
import { listSaunasForComparison } from "@/domain/catalog/products";
import { formatCadFromCents, formatUsdFromCents } from "@/domain/money";

function comparisonSpecIds(
  products: ReturnType<typeof listSaunasForComparison>,
): SpecId[] {
  const ids: SpecId[] = [];

  for (const product of products) {
    for (const row of listSpecRows(product)) {
      if (!ids.includes(row.id)) {
        ids.push(row.id);
      }
    }
  }

  return ids;
}

export function ComparisonTable() {
  const products = listSaunasForComparison();
  const specIds = comparisonSpecIds(products);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="mb-4 text-left text-bark-muted">
          Published saunas. Not stated means that detail is not in the published
          specs.
        </caption>
        <thead>
          <tr className="border-b border-bark/20">
            <th scope="col" className="py-3 pr-4 type-label font-normal">
              Detail
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                scope="col"
                className="px-4 py-3 font-heading text-base"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-bark/15">
            <th scope="row" className="py-3 pr-4 type-label font-normal">
              Price
            </th>
            {products.map((product) => (
              <td key={product.id} className="px-4 py-3">
                {formatCadFromCents(product.priceCadCents)}, plus tax
              </td>
            ))}
          </tr>
          <tr className="border-b border-bark/15">
            <th scope="row" className="py-3 pr-4 type-label font-normal">
              Published list price
            </th>
            {products.map((product) => (
              <td key={product.id} className="px-4 py-3">
                {formatUsdFromCents(product.listPriceUsdCents)}. Exchange-rate
                dependent.
              </td>
            ))}
          </tr>
          {specIds.map((id) => {
            const label = products
              .flatMap((product) => listSpecRows(product))
              .find((row) => row.id === id)?.label;

            return (
              <tr key={id} className="border-b border-bark/15 align-top">
                <th scope="row" className="py-3 pr-4 type-label font-normal">
                  {label}
                </th>
                {products.map((product) => (
                  <td key={product.id} className="px-4 py-3">
                    {specValueFor(product, id) ?? "Not stated"}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr className="align-top">
            <th scope="row" className="py-3 pr-4 type-label font-normal">
              Included
            </th>
            {products.map((product) => (
              <td key={product.id} className="px-4 py-3">
                {product.includes.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-4">
                    {product.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  "Not stated"
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
