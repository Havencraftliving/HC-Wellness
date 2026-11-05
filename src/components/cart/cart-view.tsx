"use client";

import { CartLineImage } from "@/components/cart/cart-line-image";
import { useCart } from "@/components/cart/cart-provider";
import { MotionLink } from "@/components/motion/pressable";
import { primaryButtonClassName } from "@/components/ui/styles";
import { cartLineKey, type CartLine } from "@/domain/cart/cart";
import { optionSummary } from "@/domain/catalog/display";
import { getPublishedProductById } from "@/domain/catalog/products";
import { calculatePrice } from "@/domain/catalog/price";
import { formatCadFromCents } from "@/domain/money";

function linePrice(line: CartLine) {
  const price = calculatePrice(line.productId, line.selections);
  if (!price.ok) {
    return price;
  }

  return {
    ok: true as const,
    unitCadCents: price.totalCadCents,
    lineCadCents: price.totalCadCents * line.quantity,
  };
}

export function CartView({ editable = true }: { editable?: boolean }) {
  const { lines, ready, setQuantity, removeLine } = useCart();

  if (!ready) {
    return <p>Loading cart.</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-4">
        <p>Your cart is empty.</p>
        <MotionLink href="/shop" className={primaryButtonClassName}>
          Shop all
        </MotionLink>
      </div>
    );
  }

  let subtotal = 0;
  let canCheckout = true;

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-bark/15 border-y border-bark/15">
        {lines.map((line) => {
          const key = cartLineKey(line);
          const product = getPublishedProductById(line.productId);
          const summary = product ? optionSummary(product, line.selections) : "";
          const priced = linePrice(line);
          if (!priced.ok) {
            canCheckout = false;
          } else {
            subtotal += priced.lineCadCents;
          }

          return (
            <li key={key} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <CartLineImage
                  name={product?.name ?? "Unavailable product"}
                  imageSrc={product?.imageSrc}
                />
                <div className="space-y-2">
                  <h2 className="text-xl">{product?.name ?? "Unavailable product"}</h2>
                  {summary ? <p className="text-sm text-bark-muted">{summary}</p> : null}
                  {priced.ok ? (
                    <p>
                      {formatCadFromCents(priced.lineCadCents)}{" "}
                      <span className="text-sm text-bark-muted">plus tax</span>
                    </p>
                  ) : (
                    <p>This selection is not available.</p>
                  )}
                </div>
              </div>
              {editable ? (
                <div className="flex items-center gap-3">
                  <label className="type-label">
                    Quantity
                    <input
                      className="ml-2 w-16 border border-bark bg-parchment px-2 py-1 font-body text-bark"
                      type="number"
                      min={1}
                      max={99}
                      value={line.quantity}
                      onChange={(event) => {
                        const next = Number.parseInt(event.target.value, 10);
                        if (Number.isInteger(next)) {
                          setQuantity(key, next);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="type-label underline-offset-4 hover:underline"
                    onClick={() => removeLine(key)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="type-label">
                  Quantity {line.quantity}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="space-y-2">
        <p className="text-lg">
          {formatCadFromCents(subtotal)}{" "}
          <span className="text-sm text-bark-muted">plus tax</span>
        </p>
        <p className="text-sm text-bark-muted">
          CAD is the cart price. Tax is not calculated here.
        </p>
      </div>
      {editable ? (
        canCheckout ? (
          <MotionLink href="/checkout" className={primaryButtonClassName}>
            Checkout
          </MotionLink>
        ) : (
          <p>Remove unavailable lines before checkout.</p>
        )
      ) : null}
    </div>
  );
}
