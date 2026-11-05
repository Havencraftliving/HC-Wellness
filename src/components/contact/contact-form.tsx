"use client";

import { useState, type FormEvent } from "react";
import { MotionButton } from "@/components/motion/pressable";
import { contact } from "@/components/layout/site-nav";
import { primaryButtonClassName } from "@/components/ui/styles";

const interests = [
  "A published sauna",
  "The cold plunge",
  "A shower",
  "Red light",
  "Something else",
] as const;

type FieldName = "name" | "email" | "message";

const labelClassName = "type-label text-bark";

const inputClassName =
  "mt-2 w-full border border-bark/15 bg-parchment px-3 py-3 text-bark outline-offset-4 placeholder:text-bark-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

function mailtoHref(fields: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}) {
  const subject = `HC Wellness inquiry from ${fields.name}`;
  const body = [
    fields.message,
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    `Interest: ${fields.interest}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<(typeof interests)[number]>(interests[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [opened, setOpened] = useState(false);

  function validate() {
    const next: Partial<Record<FieldName, string>> = {};
    if (name.trim().length < 2) {
      next.name = "Enter your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (message.trim().length < 10) {
      next.message = "Write a short note, at least a sentence.";
    }
    return next;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setOpened(false);
    if (Object.keys(next).length > 0) {
      return;
    }

    window.location.href = mailtoHref({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interest,
      message: message.trim(),
    });
    setOpened(true);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-5 border border-bark/10 bg-parchment/70 p-6 sm:p-8"
    >
      <div>
        <h3 className="text-2xl">Send a note</h3>
        <p className="mt-2 text-sm leading-6 text-bark-muted">
          Your email app opens with this message addressed to {contact.name}. Nothing is stored on
          this site.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClassName}
          />
          {errors.name ? (
            <p id="contact-name-error" className="mt-2 text-sm text-clay">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClassName}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClassName}
          />
          {errors.email ? (
            <p id="contact-email-error" className="mt-2 text-sm text-clay">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            Phone <span className="tracking-normal text-bark-muted">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="contact-interest" className={labelClassName}>
            Interest
          </label>
          <select
            id="contact-interest"
            name="interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value as (typeof interests)[number])}
            className={inputClassName}
          >
            {interests.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${inputClassName} resize-y`}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-2 text-sm text-clay">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <MotionButton type="submit" className={primaryButtonClassName}>
          Send message
        </MotionButton>
        <p className="text-sm text-bark-muted" aria-live="polite">
          {opened ? "If your email app did not open, write to " : "Or write directly to "}
          <a className="underline-offset-4 hover:underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
