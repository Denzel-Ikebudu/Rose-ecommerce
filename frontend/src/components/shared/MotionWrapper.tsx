"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
// Importing your design system constants directly
import { STAGGER_CONTAINER, FADE_UP, SMOOTH_SPRING } from "@/constants/motion";

interface MotionProps {
  children: ReactNode;
  direction?: "left" | "up";
}

// Layout wrapper using your global STAGGER_CONTAINER parameters
export const MotionGridContainer = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-100px" }}
    variants={STAGGER_CONTAINER}
    className="lg:col-span-8"
  >
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{children}</div>
  </motion.div>
);

// Individual layout panels syncing with your precise spring physics
export const MotionItem = ({ children, direction = "up" }: MotionProps) => {
  const isLeft = direction === "left";
  
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={
        isLeft 
          ? {
              initial: { opacity: 0, x: -25 },
              animate: { opacity: 1, x: 0, transition: SMOOTH_SPRING }
            }
          : FADE_UP // Direct reuse of your global FADE_UP map
      }
      whileHover={!isLeft ? { y: -6, transition: SMOOTH_SPRING } : undefined}
      className={
        isLeft 
          ? "lg:col-span-4 space-y-6 lg:sticky lg:top-24" 
          : "flex flex-col justify-between h-full bg-white/40 border border-black/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      }
    >
      {children}
    </motion.div>
  );
};