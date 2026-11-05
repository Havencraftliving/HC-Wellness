import type { Metadata } from "next";
import { getPublishedProductBySlug } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Safety and EMF",
  description: "Low-EMF is stated only for the infrared carbon heater.",
};

export default function SafetyEmfPage() {
  const infrared = getPublishedProductBySlug("indoor-infrared");
  const ember = getPublishedProductBySlug("ember-1");
  const heater = ember?.includes.find((line) => /heater/i.test(line));

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl">Safety and EMF</h1>
      <p className="leading-7">
        {infrared?.specs.heat
          ? `${infrared.name} lists ${infrared.specs.heat}.`
          : "The indoor infrared sauna lists a carbon infrared, low-EMF heater."}
      </p>
      <p className="leading-7">
        No EMF measurement is published.
      </p>
      <p className="leading-7">
        {ember
          ? `${ember.name} includes ${heater ?? "an electric sauna heater"} and does not state low-EMF.`
          : "Haven Ember 1 does not state low-EMF."}
      </p>
    </div>
  );
}
