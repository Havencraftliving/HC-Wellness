"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { primaryButtonClassName } from "@/components/ui/styles";
import { CartLineImage } from "@/components/cart/cart-line-image";
import { useCart } from "@/components/cart/cart-provider";
import { cartLineKey, type CartLine } from "@/domain/cart/cart";
import { optionSummary } from "@/domain/catalog/display";
import { calculatePrice } from "@/domain/catalog/price";
import { getPublishedProductById } from "@/domain/catalog/products";
import { formatCadFromCents } from "@/domain/money";

function lineTotal(line: CartLine) {
  const price = calculatePrice(line.productId, line.selections);
  if (!price.ok) {
    return price;
  }

  return { ok: true as const, lineCadCents: price.totalCadCents * line.quantity };
}

export function CartDrawer() {
  const { lines, ready, drawerOpen, closeDrawer, removeLine } = useCart();

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const pricedLines = lines.map((line) => {
    const key = cartLineKey(line);
    const product = getPublishedProductById(line.productId);
    const summary = product ? optionSummary(product, line.selections) : "";
    return { key, line, product, summary, priced: lineTotal(line) };
  });
  const subtotal = pricedLines.reduce(
    (total, item) => (item.priced.ok ? total + item.priced.lineCadCents : total),
    0,
  );
  const canCheckout = pricedLines.length > 0 && pricedLines.every((item) => item.priced.ok);

  if (!drawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-bark/40"
        onClick={closeDrawer}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-parchment text-bark shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-bark/10 px-5 py-4">
          <Link href="/" onClick={closeDrawer} className="font-heading text-bark">
            <BrandLogo className="text-sm" />
          </Link>
          <button
            type="button"
            className="type-label"
            onClick={closeDrawer}
          >
            Close
          </button>
        </div>
        <h2 id="cart-drawer-title" className="sr-only">
          Cart
        </h2>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!ready ? <p>Loading cart.</p> : null}
          {ready && lines.length === 0 ? (
            <div className="space-y-4">
              <p>Your cart is empty.</p>
              <Link href="/shop" className={primaryButtonClassName} onClick={closeDrawer}>
                Shop all
              </Link>
            </div>
          ) : null}
          {ready && lines.length > 0 ? (
            <ul className="divide-y divide-bark/10">
              {pricedLines.map(({ key, line, product, summary, priced }) => (
                <li key={key} className="flex gap-4 py-4">
                  <CartLineImage
                    name={product?.name ?? "Unavailable product"}
                    imageSrc={product?.imageSrc}
                  />
                  <div className="min-w-0 space-y-2">
                    <p className="font-heading text-lg">{product?.name ?? "Unavailable product"}</p>
                    {summary ? <p className="text-sm leading-6 text-bark-muted">{summary}</p> : null}
                    <p className="text-sm">Quantity {line.quantity}</p>
                    {priced.ok ? (
                      <p>{formatCadFromCents(priced.lineCadCents)}</p>
                    ) : (
                      <p>This selection is not available.</p>
                    )}
                    <button
                      type="button"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => removeLine(key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {ready && lines.length > 0 ? (
          <div className="space-y-3 border-t border-bark/10 px-5 py-4">
            <p className="flex items-baseline justify-between">
              <span className="type-label">Subtotal</span>
              <span className="font-heading text-2xl">{formatCadFromCents(subtotal)}</span>
            </p>
            <p className="text-sm text-bark-muted">CAD, plus tax. Shipping is not included.</p>
            {canCheckout ? (
              <Link href="/checkout" className={`${primaryButtonClassName} w-full`} onClick={closeDrawer}>
                Checkout
              </Link>
            ) : (
              <p>Remove unavailable lines before checkout.</p>
            )}
            <Link
              href="/cart"
              className="type-label block text-center underline-offset-4 hover:underline"
              onClick={closeDrawer}
            >
              View cart
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
