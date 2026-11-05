import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { getPublishedProductBySlug } from "@/domain/catalog/products";
import { productPath } from "@/domain/catalog/display";

export const metadata: Metadata = {
  title: "Accessories",
  description:
    "The Haven Ember accessory kit is included with the sauna. Further add-ons are chosen on the sauna page.",
};

export default function AccessoriesPage() {
  const ember = getPublishedProductBySlug("ember-1");
  const kit = ember?.includes.find((line) => /accessory kit/i.test(line));

  return (
    <PageShell>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <img
          src="/images/accessories.jpg"
          alt="Placeholder photo of a wooden sauna bucket, ladle, and stones"
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="max-w-xl space-y-4">
        <h1 className="text-4xl">Accessories</h1>
        <p className="leading-7">
          The accessory kit is included with {ember?.name ?? "Haven Ember 1"}. It is
          not a separate priced SKU.
        </p>
        {kit ? <p className="leading-7">{kit}</p> : null}
        {ember ? (
          <p>
            <Link
              href={productPath(ember)}
              className="type-label underline-offset-4 hover:underline"
            >
              View {ember.name}
            </Link>
          </p>
        ) : null}
        </div>
      </div>
      <section className="max-w-3xl space-y-4 border border-bark/20 p-6">
        <h2 className="text-2xl">Chosen on the sauna</h2>
        <p className="leading-7">
          Wood, heater, door placement, and add-ons are chosen on each sauna page.
          Those option prices are placeholders until confirmed. Red light is its own
          collection.
        </p>
        <p>
          <Link href="/red-light" className="type-label underline-offset-4 hover:underline">
            Red light
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
