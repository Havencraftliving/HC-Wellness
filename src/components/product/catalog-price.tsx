import { formatCadFromCents, formatUsdFromCents } from "@/domain/money";

type CatalogPriceProps = {
  cadCents: number;
  listPriceUsdCents: number;
  placeholder?: boolean;
};

export function CatalogPrice({
  cadCents,
  listPriceUsdCents,
  placeholder = false,
}: CatalogPriceProps) {
  return (
    <div className="space-y-1">
      <p className="text-lg font-light">
        <span>{formatCadFromCents(cadCents)}</span>{" "}
        <span className="text-sm text-bark-muted">plus tax</span>
      </p>
      {placeholder ? (
        <p className="type-micro text-bark-muted">Placeholder price</p>
      ) : (
        <p className="text-sm text-bark-muted">
          Published list price {formatUsdFromCents(listPriceUsdCents)}. Exchange-rate
          dependent.
        </p>
      )}
    </div>
  );
}
