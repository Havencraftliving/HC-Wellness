import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/product/product-card";
import {
  listPublishedColdPlunges,
  listPublishedRedLight,
  listPublishedSaunas,
  listPublishedShowers,
} from "@/domain/catalog/products";
import type { Product } from "@/domain/catalog/types";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Saunas, cold plunges and red light for the home you have. From HavenCraft.",
};

function ProductGrid({ products }: { products: readonly Product[] }) {
  if (products.length === 0) {
    return <p>Nothing is published in this collection yet.</p>;
  }

  return (
    <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

const sections: readonly {
  title: string;
  note?: string;
  products: () => readonly Product[];
}[] = [
  { title: "Saunas", products: listPublishedSaunas },
  { title: "Cold plunges", products: listPublishedColdPlunges },
  {
    title: "Red light",
    note: "Placeholder products. Names, specs, and prices are not confirmed.",
    products: listPublishedRedLight,
  },
  {
    title: "Showers",
    note: "Placeholder categories and products. Names and prices are not confirmed.",
    products: listPublishedShowers,
  },
];

export default function ShopPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-4 py-6 text-center">
        <p className="type-micro text-bark-muted">From HavenCraft</p>
        <h1 className="text-5xl leading-[1.05] font-extralight sm:text-[3.5rem] sm:leading-[3.75rem]">
          Shop all
        </h1>
        <p className="leading-[26px] text-bark-muted">
          Saunas, cold plunges and red light for the home you have.
        </p>
      </div>
      {sections.map((section) => (
        <section key={section.title} className="space-y-6">
          <div className="space-y-2 border-b border-bark/15 pb-4">
            <h2 className="text-[2.25rem] leading-[2.625rem]">{section.title}</h2>
            {section.note ? <p className="text-sm text-bark-muted">{section.note}</p> : null}
          </div>
          <ProductGrid products={section.products()} />
        </section>
      ))}
    </PageShell>
  );
}
