"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { hoverTransition, underlineVariants } from "./settings";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type UnderlineLinkProps = ComponentProps<typeof Link>;

export function UnderlineLink({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: UnderlineLinkProps) {
  const reduced = usePrefersReducedMotion();
  const controls = useAnimation();

  function enter(event: MouseEvent<HTMLAnchorElement>) {
    onMouseEnter?.(event);
    if (!reduced) {
      void controls.start("hover");
    }
  }

  function leave(event: MouseEvent<HTMLAnchorElement>) {
    onMouseLeave?.(event);
    void controls.start("rest");
  }

  return (
    <Link className={className} onMouseEnter={enter} onMouseLeave={leave} {...props}>
      <span className="relative inline-flex items-center gap-[inherit]">
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current"
          initial={false}
          animate={controls}
          variants={underlineVariants}
          transition={hoverTransition}
        />
      </span>
    </Link>
  );
}
