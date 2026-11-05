import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The ritual",
  description: "How a heat and cold ritual fits into an evening at home.",
};

export default function BenefitsPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl">The ritual</h1>
      <p className="leading-[26px]">
        Twenty minutes of heat, then rest. The sauna is for warmth and a quiet end to
        the day.
      </p>
      <p className="leading-[26px]">
        The cold plunge pairs with it: heat, a rinse, a minute or two of cold, then
        rest. Set the plunge anywhere from 3 to 40 degrees.
      </p>
      <p className="leading-[26px] text-bark-muted">
        We describe the ritual, not the medicine. This page makes no medical or
        therapeutic claim.
      </p>
    </div>
  );
}
