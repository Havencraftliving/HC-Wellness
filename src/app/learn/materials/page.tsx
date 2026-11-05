import type { Metadata } from "next";
import { materialLines } from "@/domain/catalog/display";
import { listPublishedProducts } from "@/domain/catalog/products";

export const metadata: Metadata = {
  title: "Materials",
  description: "Wood and metal listed on published HC Wellness products.",
};

export default function MaterialsPage() {
  const products = listPublishedProducts();

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl">Materials</h1>
        <p className="leading-7">
          Made to HavenCraft&rsquo;s spec. Inspected, warrantied and supported by our
          team in Canada. Construction details below are the include lines each
          published product states.
        </p>
      </div>
      {products.map((product) => {
        const lines = materialLines(product);
        if (lines.length === 0) {
          return null;
        }

        return (
          <section key={product.id} className="space-y-3">
            <h2 className="text-2xl">{product.name}</h2>
            <ul className="list-disc space-y-2 pl-5 leading-7">
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
