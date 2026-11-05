import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <h1 className="text-4xl">Page not found</h1>
      <p className="max-w-2xl leading-7">
        That page is not published.
      </p>
      <Link
        href="/"
        className="type-label underline-offset-4 hover:underline"
      >
        Back to HC Wellness
      </Link>
    </PageShell>
  );
}
