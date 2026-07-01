import { Variants } from "framer-motion";

// Strict global spring physics for crisp, intentional motion aesthetics
export const SMOOTH_SPRING = {
  type: "spring" as const, // <-- Explicitly cast the type string here
  stiffness: 100,
  damping: 18,
  mass: 0.8,
};

// Reusable micro-interaction variants typed explicitly as Variants
export const FADE_UP: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: SMOOTH_SPRING 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.2 } 
  },
};

export const STAGGER_CONTAINER: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};