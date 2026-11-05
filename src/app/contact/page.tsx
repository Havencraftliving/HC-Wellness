import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Malik Sayadi at HC Wellness.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <h1 className="text-4xl">Contact</h1>
          <p className="max-w-md leading-7">
            Call or email about a published sauna or the cold plunge.
          </p>
          <ContactDetails />
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
