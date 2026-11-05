/**
 * Display money from integer cents.
 * CAD is the cart currency. USD is a printed list price only.
 */

function formatAmount(cents: number): string {
  const negative = cents < 0;
  const absolute = Math.abs(cents);
  const dollars = Math.trunc(absolute / 100);
  const remainder = absolute % 100;
  const grouped = dollars.toLocaleString("en-CA");
  const amount =
    remainder === 0
      ? `$${grouped}`
      : `$${grouped}.${remainder.toString().padStart(2, "0")}`;

  return `${negative ? "-" : ""}${amount}`;
}

/** Example: 800000 → "$8,000 CAD". */
export function formatCadFromCents(cents: number): string {
  return `${formatAmount(cents)} CAD`;
}

/** Example: 590000 → "$5,900 USD". Not used in cart math. */
export function formatUsdFromCents(cents: number): string {
  return `${formatAmount(cents)} USD`;
}
