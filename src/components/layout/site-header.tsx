import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { UnderlineLink } from "@/components/motion/underline-link";
import { CartLink, ShopNav } from "./shop-nav";
import { utilityLinks } from "./site-nav";

const utilityClassName =
  "type-label outline-offset-4 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-linen text-bark">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-linen focus:px-3 focus:py-2 focus:text-bark"
      >
        Skip to content
      </a>
      <div className="hidden bg-bark text-linen sm:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-2">
          <p className="type-micro">From HavenCraft · Ships across Canada</p>
          <nav aria-label="Utility" className="flex gap-5">
            {utilityLinks.map((link) => (
              <UnderlineLink key={link.href} href={link.href} className={utilityClassName}>
                {link.label}
              </UnderlineLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="relative border-b border-bark/15">
        <div className="mx-auto flex w-full max-w-7xl items-center px-2 sm:px-4">
          <Link
            href="/"
            className="px-2 py-4 text-bark outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark"
          >
            <BrandLogo className="text-sm sm:text-base" />
          </Link>
          <ShopNav />
          <div className="ml-auto">
            <CartLink />
          </div>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
