import Link from "next/link";
import { TemperatureMark, ritualForCategory } from "@/components/brand/temperature-line";
import { listingPath } from "@/domain/catalog/display";
import { formatCadFromCents } from "@/domain/money";
import type { Product } from "@/domain/catalog/types";
import { primaryButtonClassName } from "@/components/ui/styles";
import { ProductConfigurator, PurchasePanel } from "./product-configurator";
import { SpecBlock } from "./spec-block";

/** Lake owns the cold pages; Slate Tile owns rinse. Everything else stays on Linen. */
const PANEL_CLASS: Record<Product["category"], string> = {
  sauna: "bg-parchment",
  "red-light": "bg-parchment",
  shower: "bg-slate-tile/15",
  "cold-plunge": "bg-lake/15",
};

function featuresFor(product: Product): readonly string[] {
  if (product.story && product.story.features.length > 0) {
    return product.story.features;
  }
  return product.includes.slice(0, 5);
}

export function ProductDetail({ product }: { product: Product }) {
  const listing = listingPath(product);
  const configurable = product.optionGroups.length > 0;
  const features = featuresFor(product);
  const panelClassName = PANEL_CLASS[product.category];
  const summary =
    product.story?.summary ??
    "Product copy is a placeholder until the final description arrives.";

  return (
    <article className="space-y-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className={panelClassName}>
          {product.imageSrc ? (
            <img
              src={product.imageSrc}
              alt={product.name}
              className="aspect-[5/4] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[5/4] items-center justify-center px-6">
              <p className="font-heading text-3xl font-extralight">{product.name}</p>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <nav aria-label="Breadcrumb" className="type-label text-bark-muted">
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href={listing.href} className="underline-offset-4 hover:underline">
              {listing.label}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-bark">{product.name}</span>
          </nav>
          <TemperatureMark
            ritual={ritualForCategory(product.category)}
            detail={product.collectionLabel ?? listing.label}
          />
          <h1 className="text-5xl leading-none font-extralight sm:text-[3.5rem] sm:leading-[3.75rem]">
            {product.name}
          </h1>
          {product.placeholder ? (
            <p className="type-micro text-bark-muted">
              Placeholder product, name and details to be confirmed
            </p>
          ) : null}
          {product.story?.copyPlaceholder ? (
            <p className="type-micro text-bark-muted">Placeholder copy</p>
          ) : null}
          {product.story?.tagline ? (
            <p className="text-lg font-light text-bark-muted">{product.story.tagline}</p>
          ) : null}
          {configurable ? (
            <div className="space-y-1">
              <p className="font-heading text-2xl font-light">
                Starting at {formatCadFromCents(product.priceCadCents)}
              </p>
              <p className="text-sm text-bark-muted">
                CAD. Build your configuration below for the full price.
              </p>
            </div>
          ) : null}
          <p className="max-w-xl leading-[26px]">{summary}</p>
          {features.length > 0 ? (
            <ul className="divide-y divide-bark/15 border-y border-bark/15">
              {features.map((feature) => (
                <li key={feature} className="py-2.5 text-sm leading-6">
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}
          {configurable ? (
            <a href="#build" className={primaryButtonClassName}>
              Configure this build
            </a>
          ) : (
            <PurchasePanel product={product} />
          )}
        </div>
      </div>

      {product.gallery && product.gallery.length > 1 ? (
        <section className="space-y-4">
          <h2 className="type-label">More views</h2>
          <ul className="flex gap-3 overflow-x-auto">
            {product.gallery.map((src) => (
              <li key={src} className={`w-72 shrink-0 ${panelClassName}`}>
                <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {configurable ? <ProductConfigurator product={product} /> : null}
      <SpecBlock product={product} />
      {product.includes.length > 0 ? (
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl">Included</h2>
          <ul className="divide-y divide-bark/15 border-y border-bark/15">
            {product.includes.map((item) => (
              <li key={item} className="py-2.5 leading-[26px]">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
