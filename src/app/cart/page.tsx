import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { CartView } from "@/components/cart/cart-view";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your HC Wellness cart. Prices are calculated in CAD.",
};

export default function CartPage() {
  return (
    <PageShell>
      <div className="space-y-3">
        <Link href="/" className="font-heading inline-flex text-bark">
          <BrandLogo className="text-base" />
        </Link>
        <h1 className="text-4xl">Cart</h1>
        <p className="max-w-2xl leading-7 text-bark-muted">
          The price on each line is calculated from the catalog. Changing options
          on a product starts a separate line.
        </p>
      </div>
      <CartView />
    </PageShell>
  );
}
