import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getPublishedProductBySlug,
  listPublishedSaunas,
} from "@/domain/catalog/products";

type SaunaProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPublishedSaunas().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: SaunaProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "sauna") {
    return { title: "Sauna" };
  }

  return { title: product.name };
}

export default async function SaunaProductPage({ params }: SaunaProductPageProps) {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "sauna") {
    notFound();
  }

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}
