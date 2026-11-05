"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonHover, buttonTap, hoverTransition } from "./settings";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type MotionLinkProps = ComponentProps<typeof Link>;

export function MotionLink({ className, children, ...props }: MotionLinkProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <Link {...props} className="inline-flex">
      <motion.span
        className={className}
        initial={false}
        whileHover={reduced ? undefined : buttonHover}
        whileTap={reduced ? undefined : buttonTap}
        transition={hoverTransition}
      >
        {children}
      </motion.span>
    </Link>
  );
}

type MotionButtonProps = Omit<
  ComponentProps<"button">,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export function MotionButton({ disabled, ...props }: MotionButtonProps) {
  const reduced = usePrefersReducedMotion();
  const still = disabled || reduced;

  return (
    <motion.button
      {...props}
      disabled={disabled}
      initial={false}
      whileHover={still ? undefined : buttonHover}
      whileTap={still ? undefined : buttonTap}
      transition={hoverTransition}
    />
  );
}
