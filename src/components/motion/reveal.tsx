"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { enterTransition, revealViewport } from "./settings";

const tags = {
  div: "div",
  section: "section",
  main: "main",
} as const;

type RevealProps = {
  as?: keyof typeof tags;
  className?: string;
  children: React.ReactNode;
};

/**
 * Fades up after the element is on screen. The element itself stays a normal
 * tag so the server HTML is fully visible and hydration cannot leave it hidden.
 */
export function Reveal({ as = "div", className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, revealViewport);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = animate(node, { opacity: [0, 1], y: [12, 0] }, enterTransition);
    return () => {
      animation.stop();
      node.style.opacity = "";
      node.style.transform = "";
    };
  }, [inView]);

  const Tag = tags[as];
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

type FadeInProps = {
  className?: string;
  children: React.ReactNode;
};

/** Hero copy. Plays once on load, not on scroll. */
export function FadeIn({ className, children }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = animate(node, { opacity: [0, 1] }, enterTransition);
    return () => {
      animation.stop();
      node.style.opacity = "";
      node.style.transform = "";
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
