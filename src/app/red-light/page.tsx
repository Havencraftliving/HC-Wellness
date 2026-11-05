import type { Metadata } from "next";
import Link from "next/link";
import { TemperatureHeader } from "@/components/brand/temperature-line";
import { PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/product/product-card";
import { listPublishedRedLight } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Red light",
  description:
    "Placeholder red light collection: two panels, a mat, and a face mask.",
};

export default function RedLightPage() {
  const products = listPublishedRedLight();
  const panels = products.filter((product) => product.groupLabel === "Panels");
  const rest = products.filter((product) => product.groupLabel !== "Panels");

  return (
    <PageShell>
      <TemperatureHeader ritual="light" title="Red light">
        <p className="type-micro">Placeholder collection</p>
        <p>
          A daily light ritual, apart from the heat. Two panel sizes, one mat, and one
          face mask. Names, specs, and prices are placeholders.
        </p>
        <p className="text-sm">
          These are separate from the infrared sauna, which uses carbon infrared heat
          and does not publish an EMF measurement.{" "}
          <Link
            href="/saunas/indoor-infrared"
            className="text-bark underline underline-offset-4 hover:opacity-70"
          >
            View the indoor infrared sauna
          </Link>
        </p>
      </TemperatureHeader>
      <section className="space-y-6">
        <h2 className="text-3xl">Panels</h2>
        <ul className="grid gap-10 sm:grid-cols-2">
          {panels.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
      <ul className="grid gap-10 sm:grid-cols-2">
        {rest.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
