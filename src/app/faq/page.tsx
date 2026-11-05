import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { buildFaq } from "@/domain/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions answered from the published HC Wellness catalog.",
};

export default function FaqPage() {
  const items = buildFaq();

  return (
    <PageShell>
      <h1 className="text-4xl">FAQ</h1>
      <dl className="max-w-3xl space-y-8">
        {items.map((item) => (
          <div key={item.question} className="space-y-2">
            <dt className="font-heading text-lg">{item.question}</dt>
            <dd className="leading-7">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
