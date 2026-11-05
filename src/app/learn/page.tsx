import type { Metadata } from "next";
import { listPublishedProducts } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Learn",
  description: "Materials, the ritual, and the published low-EMF note for HC Wellness.",
};

export default function LearnPage() {
  const names = listPublishedProducts().map((product) => product.name);

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl">Learn</h1>
      <p className="leading-7">
        Notes on the published line: {names.join(", ")}. These pages stay with what
        the catalog states.
      </p>
    </div>
  );
}
