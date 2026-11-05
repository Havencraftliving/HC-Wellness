type BrandLogoProps = {
  /** Controls the logo size through font-size utilities, e.g. "text-lg". */
  className?: string;
  /** Endorsed version: adds the "From HavenCraft" micro line. Launch, About, first meetings. */
  endorsed?: boolean;
  /** Reversed version for Bark or Cedar grounds: the dot takes the lighter Clay. */
  reversed?: boolean;
  /** Over photos the whole logo goes one colour: the dot follows currentColor. */
  monochrome?: boolean;
};

/**
 * The hairline split — HC Wellness logo (Brand Guidelines V1, section 03).
 * "HC" and "WELLNESS" in Inter Tight ExtraLight, wide-spaced, joined by a
 * 1px hairline that ends in a Clay dot. Letters and hairline follow
 * currentColor, so the same markup serves light and dark grounds.
 */
export function BrandLogo({
  className = "text-base",
  endorsed = false,
  reversed = false,
  monochrome = false,
}: BrandLogoProps) {
  const dotClassName = monochrome ? "bg-current" : reversed ? "bg-clay-reversed" : "bg-clay";

  return (
    <span
      role="img"
      aria-label="HC Wellness"
      className={`inline-flex flex-col items-center ${className}`}
    >
      <span className="flex items-center leading-none font-extralight tracking-[0.28em] whitespace-nowrap">
        <span>HC</span>
        <span aria-hidden="true" className="mx-[0.45em] flex items-center">
          <span className="h-px w-[1.9em] bg-current" />
          <span className={`-ml-px h-[0.28em] w-[0.28em] shrink-0 rounded-full ${dotClassName}`} />
        </span>
        <span>WELLNESS</span>
      </span>
      {endorsed ? (
        <span className="type-micro mt-[0.7em] opacity-80">From HavenCraft</span>
      ) : null}
    </span>
  );
}
