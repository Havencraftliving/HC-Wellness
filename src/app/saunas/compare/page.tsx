import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ComparisonTable } from "@/components/saunas/comparison-table";

export const metadata: Metadata = {
  title: "Compare saunas",
  description: "Comparison of published HC Wellness saunas.",
};

export default function CompareSaunasPage() {
  return (
    <PageShell>
      <div className="space-y-3">
        <h1 className="text-4xl">Compare saunas</h1>
        <p className="max-w-2xl leading-7 text-bark-muted">
          Published saunas only. A cell marked not stated is a detail the catalog
          does not include.
        </p>
      </div>
      <ComparisonTable />
    </PageShell>
  );
}
