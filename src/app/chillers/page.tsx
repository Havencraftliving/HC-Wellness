import type { Metadata } from "next";
import { TemperatureMark } from "@/components/brand/temperature-line";
import { PageShell } from "@/components/layout/page-shell";
import { MotionLink } from "@/components/motion/pressable";
import { contact } from "@/components/layout/site-nav";
import { primaryButtonClassName } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Chillers",
  description: "The chiller included with the published HC Wellness cold plunge.",
};

export default function ChillersPage() {
  return (
    <PageShell>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <img
          src="/images/cold-plunge.jpg"
          alt="HC Wellness cold plunge with the chiller housing on the side of the tub"
          className="w-full bg-lake/15 object-contain"
        />
        <div className="max-w-xl space-y-4">
          <TemperatureMark ritual="cold" detail="3–40 degrees" />
          <h1 className="text-4xl">Chillers</h1>
          <p className="leading-7">
            The published cold plunge includes a precision cooling system. It holds
            3–40 degrees, with a circulation pump and filtration. A standalone chiller
            is not a separate priced product on this site.
          </p>
          <p className="leading-7 text-bark-muted">
            Electrical connection and a water source are required. The tub can be
            installed indoors or outdoors when drainage and ventilation are in place.
          </p>
          <MotionLink href="/cold-plunges/cold-plunge" className={primaryButtonClassName}>
            View the cold plunge
          </MotionLink>
          <p className="text-sm leading-6">
            Questions about cooling:{" "}
            <a className="underline-offset-4 hover:underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
