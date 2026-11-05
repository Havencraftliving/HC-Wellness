import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getPublishedProductBySlug,
  listPublishedRedLight,
} from "@/domain/catalog/products";

type RedLightProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPublishedRedLight().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: RedLightProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "red-light") {
    return { title: "Red light" };
  }

  return { title: product.name };
}

export default async function RedLightProductPage({ params }: RedLightProductPageProps) {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "red-light") {
    notFound();
  }

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}
