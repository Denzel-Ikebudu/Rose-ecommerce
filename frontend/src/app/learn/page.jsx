"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Leaf,
  Apple,
  HeartPulse,
  Flame,
  ScrollText,
  Archive,
  ChefHat,
  BookOpenCheck,
  ArrowRight,
} from "lucide-react";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import Navbar from "@/components/shared/Navbar";

const TOPICS = [ /* ...unchanged... */ ];

export default function LearnCentrePage() {
  return (
    <main className="bg-herbal-dark text-herbal-cream min-h-screen">
      <Navbar />

      {/* Intro — hero image */}
      <section className="relative px-6 pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/herb1.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-herbal-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-herbal-dark/40 via-herbal-dark/70 to-herbal-dark" />
        </div>

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.span
            variants={FADE_UP}
            className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent"
          >
            Learn Centre
          </motion.span>
          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-herbal-cream mt-4"
          >
            Knowledge is one of the most powerful tools for healthy living.
          </motion.h1>
          <motion.p
            variants={FADE_UP}
            className="font-sans text-base text-herbal-cream/60 leading-relaxed mt-5 max-w-xl mx-auto"
          >
            Easy-to-understand guides on herbs, nutrition, spices, and healthy
            living, so you can make informed decisions about what you use and
            eat every day.
          </motion.p>
        </motion.div>
      </section>

    </main>
  );
}