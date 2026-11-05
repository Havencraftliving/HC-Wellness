import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getPublishedProductBySlug,
  listPublishedColdPlunges,
} from "@/domain/catalog/products";

type ColdPlungePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPublishedColdPlunges().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ColdPlungePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "cold-plunge") {
    return { title: "Cold plunge" };
  }

  return { title: product.name };
}

export default async function ColdPlungeProductPage({
  params,
}: ColdPlungePageProps) {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "cold-plunge") {
    notFound();
  }

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}
