// Strict global spring physics for crisp, intentional motion aesthetics
export const SMOOTH_SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 18,
  mass: 0.8,
};

// Reusable micro-interaction variants
export const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: SMOOTH_SPRING },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};