import { contact } from "@/components/layout/site-nav";

const linkClassName =
  "rounded-sm underline-offset-4 outline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

export function ContactDetails() {
  return (
    <address className="space-y-2 text-sm leading-6 not-italic">
      <p className="type-label">{contact.name}</p>
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
        <a
          className={linkClassName}
          href={contact.parentHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact.parentLabel}
        </a>
      </p>
    </address>
  );
}
