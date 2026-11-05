"use client";

import { motion } from "framer-motion";
import { hoverTransition, imageZoomVariants } from "@/components/motion/settings";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

type GalleryPanelProps = {
  name: string;
  imageSrc?: string;
};

export function GalleryPanel({ name, imageSrc }: GalleryPanelProps) {
  const reduced = usePrefersReducedMotion();
  const zoom = reduced ? undefined : imageZoomVariants.hover;

  if (!imageSrc) {
    return (
      <motion.div
        initial={false}
        whileHover={zoom}
        transition={hoverTransition}
        className="flex aspect-[4/3] items-center justify-center bg-parchment px-6 text-center"
      >
        <p aria-hidden="true" className="font-heading text-2xl font-extralight text-bark sm:text-3xl">
          {name}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="aspect-[4/3] overflow-hidden bg-parchment">
      <motion.img
        src={imageSrc}
        alt={name}
        initial={false}
        whileHover={zoom}
        transition={hoverTransition}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
