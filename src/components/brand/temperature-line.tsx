import type { ProductCategory } from "@/domain/catalog/types";

/**
 * The temperature line — Brand Guidelines V1, section 05.
 * The hairline is a thermometer; the dot names the ritual. The word always
 * sits beside the dot, so colour never carries the meaning alone.
 */
export type Ritual = "heat" | "light" | "rinse" | "cold";

type RitualStyle = {
  label: string;
  dotClassName: string;
  /** Thermometer length: heat runs longest, cold shortest. */
  stemClassName: string;
};

const RITUALS: Record<Ritual, RitualStyle> = {
  heat: { label: "Heat", dotClassName: "bg-clay", stemClassName: "h-16" },
  light: { label: "Light", dotClassName: "bg-ochre", stemClassName: "h-12" },
  rinse: { label: "Rinse", dotClassName: "bg-slate-tile", stemClassName: "h-9" },
  cold: { label: "Cold", dotClassName: "bg-lake", stemClassName: "h-6" },
};

const CATEGORY_RITUAL: Record<ProductCategory, Ritual> = {
  sauna: "heat",
  "red-light": "light",
  shower: "rinse",
  "cold-plunge": "cold",
};

export function ritualForCategory(category: ProductCategory): Ritual {
  return CATEGORY_RITUAL[category];
}

type TemperatureMarkProps = {
  ritual: Ritual;
  /** Optional mono detail after the word, e.g. "3–40 degrees". */
  detail?: string;
  className?: string;
};

/** Laid flat: a short hairline ending in the ritual dot, then the word. */
export function TemperatureMark({ ritual, detail, className = "" }: TemperatureMarkProps) {
  const style = RITUALS[ritual];

  return (
    <p className={`type-label flex items-center gap-2.5 text-bark ${className}`}>
      <span aria-hidden="true" className="flex items-center">
        <span className="h-px w-6 bg-bark/60" />
        <span className={`-ml-px h-1.5 w-1.5 rounded-full ${style.dotClassName}`} />
      </span>
      <span>
        {style.label}
        {detail ? <span className="text-bark-muted"> · {detail}</span> : null}
      </span>
    </p>
  );
}

type TemperatureHeaderProps = {
  ritual: Ritual;
  detail?: string;
  title: string;
  children?: React.ReactNode;
};

/** Clean type-only collection header with the vertical thermometer. */
export function TemperatureHeader({ ritual, detail, title, children }: TemperatureHeaderProps) {
  const style = RITUALS[ritual];

  return (
    <header className="flex flex-col items-center gap-5 py-6 text-center">
      <span aria-hidden="true" className="flex flex-col items-center">
        <span className={`w-px bg-bark/70 ${style.stemClassName}`} />
        <span className={`-mt-px h-2 w-2 rounded-full ${style.dotClassName}`} />
      </span>
      <p className="type-label text-bark">
        {style.label}
        {detail ? <span className="text-bark-muted"> · {detail}</span> : null}
      </p>
      <h1 className="text-5xl leading-[1.05] font-extralight sm:text-[3.5rem] sm:leading-[3.75rem]">
        {title}
      </h1>
      {children ? (
        <div className="max-w-2xl space-y-3 leading-[26px] text-bark-muted">{children}</div>
      ) : null}
    </header>
  );
}

type PathStep = { label: string; ritual?: Ritual };

const RITUAL_PATH: readonly PathStep[] = [
  { label: "Heat", ritual: "heat" },
  { label: "Rinse", ritual: "rinse" },
  { label: "Cold", ritual: "cold" },
  { label: "Rest" },
];

/**
 * The ritual path: Heat, Rinse, Cold, Rest. Solid line for done or current,
 * dotted for what comes next. Light is its own daily ritual, off the path.
 */
export function RitualPath({ current }: { current?: Ritual }) {
  const currentIndex = current
    ? RITUAL_PATH.findIndex((step) => step.ritual === current)
    : RITUAL_PATH.length - 1;

  return (
    <ol aria-label="Ritual path" className="flex w-full items-start">
      {RITUAL_PATH.map((step, index) => {
        const dotClassName = step.ritual ? RITUALS[step.ritual].dotClassName : "bg-bark";
        const last = index === RITUAL_PATH.length - 1;

        return (
          <li
            key={step.label}
            aria-current={current && step.ritual === current ? "step" : undefined}
            className={`flex flex-col gap-3 ${last ? "items-end" : "flex-1"}`}
          >
            <span aria-hidden="true" className="flex w-full items-center">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName}`} />
              {last ? null : (
                <span
                  className={`flex-1 ${
                    index < currentIndex
                      ? "h-px bg-bark/70"
                      : "border-t border-dotted border-bark/60"
                  }`}
                />
              )}
            </span>
            <span className="type-label text-bark">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** Contrast pairing: heat at one end, cold at the other, one hairline between. */
export function ContrastLine() {
  return (
    <p className="type-label flex w-full items-center gap-3 text-bark">
      <span>Heat</span>
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-clay" />
      <span aria-hidden="true" className="h-px flex-1 bg-bark/70" />
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-lake" />
      <span>Cold</span>
    </p>
  );
}
