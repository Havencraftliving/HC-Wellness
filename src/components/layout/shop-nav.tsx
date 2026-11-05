"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { MotionButton } from "@/components/motion/pressable";
import { UnderlineLink } from "@/components/motion/underline-link";
import { shopMenus, utilityLinks, type ShopMenu } from "./site-nav";

const itemClassName =
  "block px-4 py-2.5 text-sm text-bark outline-offset-4 hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

const barLinkClassName =
  "type-label inline-flex items-center gap-1.5 px-3 py-2.5 text-bark outline-offset-4 hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark";

function DesktopMenu({ menu }: { menu: ShopMenu }) {
  if (!menu.items) {
    return (
      <UnderlineLink href={menu.href} className={barLinkClassName}>
        {menu.label}
      </UnderlineLink>
    );
  }

  return (
    <div className="group relative">
      <UnderlineLink href={menu.href} className={barLinkClassName} aria-haspopup="true">
        {menu.label}
        <span aria-hidden="true" className="text-[10px] leading-none">
          ▾
        </span>
      </UnderlineLink>
      <div className="invisible absolute top-full left-0 z-30 min-w-56 border border-bark/15 bg-linen py-2 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul>
          {menu.items.map((item) => (
            <li key={item.href}>
              <UnderlineLink href={item.href} className={itemClassName}>
                {item.label}
              </UnderlineLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="none">
      <path
        d="M6.2 7.2 4.4 10.2v9.1A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.7-1.7v-9.1l-1.8-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.4 10.2h15.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.4 13.1a3.4 3.4 0 0 1-6.8 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartLink() {
  const { lines, ready, openDrawer } = useCart();
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <button
      type="button"
      className="relative inline-flex items-center border-l border-bark/15 px-4 py-4 text-bark outline-offset-4 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bark sm:px-6"
      aria-label={ready ? `Open cart, ${count} items` : "Open cart"}
      onClick={openDrawer}
    >
      <span className="relative">
        <CartIcon />
        {ready && count > 0 ? (
          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 font-mono text-[10px] text-linen">
            {count}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function ShopNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Shop" className="ml-6 hidden items-center gap-2.5 xl:flex">
        {shopMenus.map((menu) => (
          <DesktopMenu key={menu.href} menu={menu} />
        ))}
      </nav>
      <MotionButton
        type="button"
        className="type-label px-4 py-5 xl:hidden"
        aria-expanded={open}
        aria-controls="mobile-shop"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close" : "Menu"}
      </MotionButton>
      {open ? (
        <div
          id="mobile-shop"
          className="absolute top-full right-0 left-0 z-30 max-h-[70vh] overflow-y-auto border-b border-bark/15 bg-linen xl:hidden"
        >
          <ul className="px-4 py-2">
            {shopMenus.map((menu) => (
              <li key={menu.href} className="border-b border-bark/15 py-1">
                <UnderlineLink
                  href={menu.href}
                  className="type-label block py-2.5"
                  onClick={() => setOpen(false)}
                >
                  {menu.label}
                </UnderlineLink>
                {menu.items ? (
                  <ul className="pb-2">
                    {menu.items.map((item) => (
                      <li key={`${menu.href}-${item.href}`}>
                        <UnderlineLink
                          href={item.href}
                          className="block py-1.5 pl-3 text-sm text-bark-muted"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </UnderlineLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <UnderlineLink
                  href={link.href}
                  className="block py-2 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </UnderlineLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
