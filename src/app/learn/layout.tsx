import { UnderlineLink } from "@/components/motion/underline-link";

const links = [
  { href: "/learn/materials", label: "Materials" },
  { href: "/learn/benefits", label: "The ritual" },
  { href: "/learn/safety-emf", label: "Safety and EMF" },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
      <nav aria-label="Learn">
        <ul className="type-label flex flex-wrap gap-x-6 gap-y-2 border-b border-bark/15 pb-4">
          <li>
            <UnderlineLink href="/learn">
              Overview
            </UnderlineLink>
          </li>
          {links.map((link) => (
            <li key={link.href}>
              <UnderlineLink href={link.href}>
                {link.label}
              </UnderlineLink>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </main>
  );
}
