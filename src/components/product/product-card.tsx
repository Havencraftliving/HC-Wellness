"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TemperatureMark, ritualForCategory } from "@/components/brand/temperature-line";
import { cardLiftVariants, hoverTransition } from "@/components/motion/settings";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { formatCapacity, formatPlacement, productPath } from "@/domain/catalog/display";
import type { Product } from "@/domain/catalog/types";
import { CatalogPrice } from "./catalog-price";
import { GalleryPanel } from "./gallery-panel";

export function ProductCard({ product }: { product: Product }) {
  const reduced = usePrefersReducedMotion();
  const facts = [
    product.capacity ? formatCapacity(product.capacity) : null,
    product.placement && product.placement.length > 0 ? formatPlacement(product.placement) : null,
  ].filter(Boolean);

  return (
    <motion.article
      className="flex flex-col gap-4"
      initial={false}
      whileHover={reduced ? undefined : "hover"}
      variants={cardLiftVariants}
      transition={hoverTransition}
    >
      <Link href={productPath(product)} className="group block space-y-4">
        <GalleryPanel name={product.name} imageSrc={product.imageSrc} />
        <TemperatureMark ritual={ritualForCategory(product.category)} />
        <h2 className="text-2xl font-light group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h2>
      </Link>
      {facts.length > 0 ? (
        <p className="text-sm text-bark-muted">{facts.join(" · ")}</p>
      ) : null}
      {product.placeholder ? (
        <p className="type-micro text-bark-muted">Placeholder product</p>
      ) : null}
      {product.optionGroups.length > 0 ? (
        <p className="type-label text-bark-muted">Starting at</p>
      ) : null}
      <CatalogPrice
        cadCents={product.priceCadCents}
        listPriceUsdCents={product.listPriceUsdCents}
        placeholder={product.pricePlaceholder}
      />
    </motion.article>
  );
}
