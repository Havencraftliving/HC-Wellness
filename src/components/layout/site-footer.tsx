import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { UnderlineLink } from "@/components/motion/underline-link";
import { contact, shopLinks, utilityLinks } from "./site-nav";

const linkClassName =
  "outline-offset-4 hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-bark text-linen">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-flex text-linen outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen"
          >
            <BrandLogo reversed className="text-sm" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-linen/70">
            Saunas, cold plunges and red light for the home you have.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-linen/70">
            Made to HavenCraft&rsquo;s spec. Inspected, warrantied and supported
            by our team in Canada.
          </p>
        </div>
        <nav aria-label="Footer shop">
          <p className="type-label text-linen/80">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <UnderlineLink href={link.href} className={linkClassName}>
                  {link.label}
                </UnderlineLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer utility">
          <p className="type-label text-linen/80">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <UnderlineLink href={link.href} className={linkClassName}>
                  {link.label}
                </UnderlineLink>
              </li>
            ))}
          </ul>
        </nav>
        <address className="space-y-2 text-sm leading-6 not-italic">
          <p className="type-label text-linen/80">Contact</p>
          <p className="pt-2">{contact.name}</p>
          <p>
            <a className={linkClassName} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
          <p>
            <a className={linkClassName} href={contact.phoneHref}>
              {contact.phoneDisplay}
            </a>
          </p>
          <p>
            <a className={linkClassName} href={contact.parentHref} target="_blank" rel="noopener noreferrer">
              {contact.parentLabel}
            </a>
          </p>
          <p>
            <a
              className={linkClassName}
              href="https://instagram.com/havencraft.living"
              target="_blank"
              rel="noopener noreferrer"
            >
              @havencraft.living
            </a>
          </p>
        </address>
      </div>
      <div className="border-t border-linen/15">
        <p className="type-micro mx-auto w-full max-w-7xl px-6 py-4 text-linen/60">
          From HavenCraft
        </p>
      </div>
    </footer>
  );
}
