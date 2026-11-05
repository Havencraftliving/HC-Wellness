import type { Metadata } from "next";
import { TemperatureHeader } from "@/components/brand/temperature-line";
import { PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/product/product-card";
import { listPublishedColdPlunges } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Cold plunges",
  description: "The published HC Wellness cold plunge.",
};

export default function ColdPlungesPage() {
  const products = listPublishedColdPlunges();

  return (
    <PageShell>
      <div className="border-t-2 border-lake bg-lake/10 px-6">
        <TemperatureHeader ritual="cold" detail="3–40 degrees" title="Cold plunges">
          <p>A plunge for the deck or the garage. Set the temperature, step in, step out cold and clear.</p>
          <p className="text-sm">
            Stainless interior, wood cladding, and a chiller included. It can sit
            indoors or outdoors, with drainage and ventilation. Price is CAD, plus tax.
          </p>
        </TemperatureHeader>
      </div>
      {products.length === 0 ? (
        <p>No cold plunge is published.</p>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
