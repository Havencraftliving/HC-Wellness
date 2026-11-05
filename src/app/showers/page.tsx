import type { Metadata } from "next";
import { TemperatureHeader } from "@/components/brand/temperature-line";
import { PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/product/product-card";
import { listPublishedShowers } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Showers",
  description:
    "Placeholder shower collection for HC Wellness. Categories and products are not confirmed.",
};

export default function ShowersPage() {
  const products = listPublishedShowers();
  const groups = [...new Set(products.map((product) => product.groupLabel ?? "Showers"))];

  return (
    <PageShell>
      <div className="border-t-2 border-slate-tile bg-slate-tile/10 px-6">
        <TemperatureHeader ritual="rinse" title="Showers">
          <p className="type-micro">Placeholder collection</p>
          <p>
            Two categories and two products, so the collection has a shape before the
            names are confirmed. Each product has its own page. There is no configurator.
          </p>
        </TemperatureHeader>
      </div>
      {groups.map((group) => (
        <section key={group} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl">{group}</h2>
            <p className="text-sm text-bark-muted">Placeholder category, name to be confirmed.</p>
          </div>
          <ul className="grid gap-10 sm:grid-cols-2">
            {products
              .filter((product) => (product.groupLabel ?? "Showers") === group)
              .map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </PageShell>
  );
}
