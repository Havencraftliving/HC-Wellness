import type { Metadata } from "next";
import Link from "next/link";
import { TemperatureHeader } from "@/components/brand/temperature-line";
import { PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/product/product-card";
import { SaunaFilters } from "@/components/saunas/sauna-filters";
import {
  firstQueryValue,
  parseCapacityParam,
  parsePlacementParam,
} from "@/domain/catalog/filters";
import { filterSaunas } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Saunas",
  description: "Published HC Wellness saunas, with capacity and placement filters.",
};

type SaunasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SaunasPage({ searchParams }: SaunasPageProps) {
  const query = await searchParams;
  const capacity = parseCapacityParam(firstQueryValue(query.capacity));
  const placement = parsePlacementParam(firstQueryValue(query.placement));
  const products = filterSaunas({ capacity, placement });

  return (
    <PageShell>
      <TemperatureHeader ritual="heat" title="Saunas">
        <p>From a plug-in for the spare room to a cabin for the garden.</p>
        <p className="text-sm">
          Hemlock and cedar, with ETL listed on the published models. Prices are CAD,
          plus tax.
        </p>
      </TemperatureHeader>
      <SaunaFilters capacity={capacity} placement={placement} />
      <p>
        <Link
          href="/saunas/compare"
          className="type-label underline-offset-4 hover:underline"
        >
          Compare saunas
        </Link>
      </p>
      {products.length === 0 ? (
        <p className="border border-bark/20 px-6 py-8">
          No published sauna matches this capacity and placement.
        </p>
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
