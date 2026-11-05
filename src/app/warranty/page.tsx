import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/contact-details";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Warranty",
  description: "Confirm warranty with your HC Wellness order.",
};

export default function WarrantyPage() {
  return (
    <PageShell>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl">Warranty</h1>
        <p className="leading-7">
          A warranty term and coverage are not published on this page. Confirm the
          warranty with your order.
        </p>
      </div>
      <ContactDetails />
    </PageShell>
  );
}
