/**
 * Shared motion settings for HC Wellness.
 * Every duration, ease, distance, and scale used on the site lives here.
 * Tweens only — no springs — so motion stays calm.
 */

export const motionEase = [0.22, 1, 0.36, 1] as const;

/** First paint and scroll reveals. */
export const enterTransition = {
  duration: 0.6,
  ease: motionEase,
};

/** Hover, tap, and underline. */
export const hoverTransition = {
  duration: 0.28,
  ease: motionEase,
};

export const revealViewport = {
  once: true,
  amount: 0.2,
} as const;

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Parent label so children can inherit hover without moving themselves. */
export const hoverStateVariants = {
  rest: {},
  hover: {},
};

export const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

export const buttonHover = { scale: 1.015 };
export const buttonTap = { scale: 0.985 };

export const cardLiftVariants = {
  rest: { y: 0 },
  hover: { y: -4 },
};

export const imageZoomVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.035 },
};
