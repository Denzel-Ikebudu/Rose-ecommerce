"use client";

import React from "react";
import { motion } from "framer-motion";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-herbal-cream overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left: Copy & CTAs */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="text-left"
        >
          <motion.span
            variants={FADE_UP}
            className="inline-block font-sans text-xs font-semibold tracking-[0.2em] uppercase text-herbal-primary mb-5"
          >
            100% Pure Botanical
          </motion.span>

          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-herbal-dark leading-[1.1] mb-6"
          >
            Start your journey <br /> to true restoration.
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            className="font-sans text-base sm:text-lg text-herbal-muted font-light leading-relaxed max-w-lg mb-10"
          >
            Clinical tradomedical systems matching clean, raw botanical sciences with ancestral healing diagnostics to cure underlying root systems.
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-herbal-primary hover:bg-herbal-dark text-herbal-cream font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-sm"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent border border-herbal-dark/15 hover:border-herbal-dark/40 text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300"
            >
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Product photo, framed */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/5] lg:aspect-[1/1] rounded-[2rem] overflow-hidden bg-herbal-sage"
        >
          <div
            className="w-full h-full bg-cover bg-right "
            style={{ backgroundImage: "url('/hero-background.png')" }}
          />
        </motion.div>

      </div>
    </section>
  );
}