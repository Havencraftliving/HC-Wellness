import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ContactDetails } from "@/components/contact/contact-details";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "HC Wellness is HavenCraft's wellness label for the home. Saunas, cold plunges and red light for the home you have.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="flex justify-center border-b border-bark/15 py-16">
        <BrandLogo endorsed className="text-xl sm:text-2xl" />
      </div>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-[2.25rem] leading-[2.625rem]">
          HavenCraft&rsquo;s wellness label for the home.
        </h1>
        <p className="leading-[26px]">
          Saunas, cold plunges and red light for the home you have. A sibling to
          HavenCraft, with its own look and the same makers behind it.
        </p>
        <p className="leading-[26px]">
          Hemlock and cedar are named on the saunas. Each product page lists only the
          materials, size, and electrical details that product publishes.
        </p>
        <div className="border-y border-bark/15 py-8">
          <p className="type-label text-bark-muted">Where it&rsquo;s made</p>
          <p className="mt-4 text-2xl leading-9 font-light">
            Made to HavenCraft&rsquo;s spec. Inspected, warrantied and supported by our
            team in Canada.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <ContactDetails />
      </div>
    </PageShell>
  );
}
