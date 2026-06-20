"use client";

import React from "react";
import { motion } from "framer-motion";
import { FADE_UP, STAGGER_CONTAINER, SMOOTH_SPRING } from "@/constants/motion";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-herbal-dark flex items-center overflow-hidden">
      {/* Immersive Img Canvas Backdrop */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: '/hero-background.png'
          }}
        />
        {/* Cinematic Linear Shadow Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-herbal-dark via-transparent to-herbal-dark/30" />
      </div>

      {/* Main Structural Layout Content */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 pt-20">
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="max-w-2xl text-left"
        >
          <motion.h1 
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-herbal-cream leading-[1.08] mb-6"
          >
            Start your journey <br /> to true restoration.
          </motion.h1>

          <motion.p 
            variants={FADE_UP}
            className="font-sans text-base sm:text-lg text-herbal-cream/70 font-light tracking-wide leading-relaxed max-w-lg mb-10"
          >
            Clinical tradomedical systems matching clean, raw botanical sciences with ancestral healing diagnostics to cure underlying root systems.
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-wrap gap-4">
            <Link 
              href="/clinic/book"
              className="inline-flex items-center justify-center bg-herbal-cream hover:bg-white text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-sm"
            >
              Book Consultation
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center bg-transparent border border-white/20 hover:border-white/60 text-white font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300"
            >
              Explore Formulas
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}