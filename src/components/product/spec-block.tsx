import { listSpecRows } from "@/domain/catalog/display";
import type { Product } from "@/domain/catalog/types";

export function SpecBlock({ product }: { product: Product }) {
  const rows = listSpecRows(product);
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl">Specifications</h2>
      <dl>
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-1 border-b border-bark/15 py-3 sm:grid-cols-[12rem_1fr]"
          >
            <dt className="type-label">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
