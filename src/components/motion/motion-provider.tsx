"use client";

import { MotionConfig } from "framer-motion";
import { hoverTransition } from "./settings";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="never" transition={hoverTransition}>
      {children}
    </MotionConfig>
  );
}
