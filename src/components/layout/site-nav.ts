export type NavLink = {
  href: string;
  label: string;
};

export type ShopMenu = {
  href: string;
  label: string;
  items?: readonly NavLink[];
};

export const utilityLinks: readonly NavLink[] = [
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/warranty", label: "Warranty" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Main shop navigation. Menus with items render as dropdowns. */
export const shopMenus: readonly ShopMenu[] = [
  { href: "/shop", label: "Shop all" },
  {
    href: "/saunas",
    label: "Saunas",
    items: [
      { href: "/saunas", label: "All saunas" },
      { href: "/saunas?placement=indoor", label: "Indoor" },
      { href: "/saunas?placement=outdoor", label: "Outdoor" },
      { href: "/saunas/compare", label: "Compare" },
    ],
  },
  {
    href: "/cold-plunges",
    label: "Cold plunges",
    items: [
      { href: "/cold-plunges", label: "All cold plunges" },
      { href: "/cold-plunges/cold-plunge", label: "Cold plunge" },
    ],
  },
  {
    href: "/chillers",
    label: "Chillers",
    items: [
      { href: "/chillers", label: "Overview" },
      { href: "/cold-plunges/cold-plunge", label: "Included with the cold plunge" },
    ],
  },
  { href: "/showers", label: "Showers" },
  { href: "/red-light", label: "Red light" },
  { href: "/accessories", label: "Accessories" },
];

export const shopLinks: readonly NavLink[] = shopMenus.map((menu) => ({
  href: menu.href,
  label: menu.label,
}));

export const contact = {
  name: "Malik Sayadi",
  email: "malik@havencraftliving.com",
  phoneDisplay: "(604) 396-2180",
  phoneHref: "tel:+16043962180",
  parentHref: "https://havencraftliving.com",
  parentLabel: "havencraftliving.com",
} as const;
