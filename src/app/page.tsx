import Link from "next/link";
import {
  ContrastLine,
  RitualPath,
  TemperatureMark,
  type Ritual,
} from "@/components/brand/temperature-line";
import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";
import { MotionLink } from "@/components/motion/pressable";
import { FadeIn, Reveal } from "@/components/motion/reveal";
import { primaryButtonClassName } from "@/components/ui/styles";

type RitualTile = {
  ritual: Ritual;
  title: string;
  line: string;
  href: string;
  imageSrc: string;
  alt: string;
};

const ritualTiles: readonly RitualTile[] = [
  {
    ritual: "heat",
    title: "Saunas",
    line: "From a plug-in for the spare room to a cabin for the garden.",
    href: "/saunas",
    imageSrc: "/images/hearth-exterior.jpg",
    alt: "A dark wood sauna cabin among cedars, its window lit warm",
  },
  {
    ritual: "cold",
    title: "Cold plunges",
    line: "Set the temperature, step in, step out cold and clear.",
    href: "/cold-plunges",
    imageSrc: "/images/category-wellness.jpg",
    alt: "Cold plunges and sauna cabins on a wet cedar deck in a forest",
  },
  {
    ritual: "light",
    title: "Red light",
    line: "A few quiet minutes of light, apart from the heat.",
    href: "/red-light",
    imageSrc: "/images/red-light.jpg",
    alt: "A red light panel glowing in a dim room beside a wooden bench",
  },
];

const outlineLinkClassName =
  "type-label inline-flex items-center justify-center border border-linen/70 px-6 py-3.5 text-linen hover:bg-linen/10";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative min-h-[82vh] bg-bark text-linen">
        <img
          src="/images/hero-closing.jpg"
          alt="A dark sauna cabin on a cedar deck, with mist over the forest behind it"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/45 via-bark/35 to-bark/60" />
        <FadeIn className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <p className="type-micro text-linen/85">From HavenCraft</p>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.05] font-extralight text-linen sm:text-[3.5rem] sm:leading-[3.75rem]">
            Rituals for the home you have.
          </h1>
          <p className="mt-5 max-w-md text-base leading-[26px] text-linen/90">
            Saunas, cold plunges and red light, made to HavenCraft&rsquo;s spec.
          </p>
          <div className="mt-9">
            <MotionLink href="/shop" className={outlineLinkClassName}>
              Shop the ritual
            </MotionLink>
          </div>
        </FadeIn>
      </section>

      <Reveal as="section" className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <span aria-hidden="true" className="mx-auto flex w-14 items-center">
          <span className="h-px flex-1 bg-bark/60" />
          <span className="-ml-px h-1.5 w-1.5 rounded-full bg-clay" />
        </span>
        <p className="mt-8 text-[2.25rem] leading-[2.625rem] font-light">
          Twenty minutes of heat, a minute of cold, and the rest of the evening to
          yourself.
        </p>
      </Reveal>

      <Reveal as="section" className="mx-auto w-full max-w-7xl px-6 pb-24">
        <div className="flex items-end justify-between gap-6 border-b border-bark/15 pb-5">
          <h2 className="text-[2.25rem] leading-[2.625rem]">Shop by ritual</h2>
          <Link href="/shop" className="type-label hidden underline-offset-4 hover:underline sm:inline">
            Shop all
          </Link>
        </div>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {ritualTiles.map((tile) => (
            <li key={tile.href}>
              <Link href={tile.href} className="group block space-y-4">
                <div className="aspect-[4/5] overflow-hidden bg-parchment">
                  <img
                    src={tile.imageSrc}
                    alt={tile.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <TemperatureMark ritual={tile.ritual} />
                <h3 className="text-2xl font-light group-hover:underline group-hover:underline-offset-4">
                  {tile.title}
                </h3>
                <p className="text-sm leading-6 text-bark-muted">{tile.line}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="section" className="border-y border-bark/15 bg-parchment">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p className="type-label text-bark-muted">The evening, in order</p>
            <h2 className="text-[2.25rem] leading-[2.625rem]">Heat, rinse, cold, rest.</h2>
            <p className="max-w-md leading-[26px] text-bark-muted">
              Twenty minutes in the sauna, a rinse, a minute or two in the plunge, then
              rest. Light is its own daily ritual, off the path.
            </p>
            <MotionLink href="/cold-plunges" className={primaryButtonClassName}>
              Pair a sauna with a plunge
            </MotionLink>
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="type-micro text-bark-muted">Ritual path</p>
              <RitualPath />
            </div>
            <div className="space-y-4">
              <p className="type-micro text-bark-muted">Contrast pairing · sauna + plunge</p>
              <ContrastLine />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
        <p className="type-label text-bark-muted">Where it&rsquo;s made</p>
        <p className="mt-6 text-[2.25rem] leading-[2.625rem] font-light">
          Made to HavenCraft&rsquo;s spec. Inspected, warrantied and supported by our
          team in Canada.
        </p>
        <Link
          href="/warranty"
          className="type-label mt-8 inline-block underline-offset-4 hover:underline"
        >
          Warranty and support
        </Link>
      </Reveal>

      <Reveal as="section" className="bg-cedar text-linen">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
          <div className="space-y-4">
            <p className="type-label text-linen/75">HavenCraft Step-Up Credit</p>
            <h2 className="text-[2.25rem] leading-[2.625rem] text-linen">
              Start here. Step up later.
            </h2>
            <p className="max-w-md leading-[26px] text-linen/85">
              Your HC Wellness purchase can count toward a HavenCraft Signature sauna or
              home. Terms are being set and will be announced on HavenCraft.
            </p>
          </div>
          <div className="space-y-4 md:border-l md:border-linen/20 md:pl-10">
            <p className="type-label text-linen/75">The HavenCraft world</p>
            <p className="max-w-md leading-[26px] text-linen/85">
              HC Wellness saunas beside HavenCraft homes, built by the same makers.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              <a
                href="https://instagram.com/havencraft.living"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-linen underline-offset-4 hover:underline"
              >
                @havencraft.living
              </a>
              <a
                href="https://havencraftliving.com"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-linen underline-offset-4 hover:underline"
              >
                havencraftliving.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <p className="type-label text-bark-muted">Talk to us</p>
            <h2 className="text-[2.25rem] leading-[2.625rem]">A sauna for the room you have.</h2>
            <p className="max-w-md leading-[26px] text-bark-muted">
              Call or email about a sauna, the cold plunge, or where one might go.
            </p>
            <ContactDetails />
          </div>
          <ContactForm />
        </div>
      </Reveal>
    </main>
  );
}
