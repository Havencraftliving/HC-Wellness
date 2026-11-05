import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getPublishedProductBySlug,
  listPublishedShowers,
} from "@/domain/catalog/products";

type ShowerProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPublishedShowers().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ShowerProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "shower") {
    return { title: "Shower" };
  }

  return { title: product.name };
}

export default async function ShowerProductPage({ params }: ShowerProductPageProps) {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product || product.category !== "shower") {
    notFound();
  }

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}
