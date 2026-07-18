"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Apple, HeartPulse, ArrowRight } from "lucide-react";
import { STAGGER_CONTAINER, FADE_UP } from "@/constants/motion";

const FEATURED_TOPICS = [
  {
    id: "understanding-herbs",
    mark: "01",
    title: "Understanding Herbs",
    Icon: Leaf,
    summary: "What herbal products are, and how to approach them sensibly.",
  },
  {
    id: "balanced-nutrition",
    mark: "02",
    title: "Benefits of Balanced Nutrition",
    Icon: Apple,
    summary: "Why variety and consistency matter more than any single food.",
  },
  {
    id: "healthy-lifestyle-habits",
    mark: "03",
    title: "Healthy Lifestyle Habits",
    Icon: HeartPulse,
    summary: "The daily basics that support everything else you do for your health.",
  },
];

export default function LearnCentreTeaser() {
  return (
    <section className="px-6 py-24">
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={FADE_UP} className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent">
              Learn Centre
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-herbal-cream mt-3">
              Make informed decisions, not guesses
            </h2>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-sans text-sm text-herbal-accent hover:text-herbal-cream transition-colors duration-200"
          >
            Visit the Learn Centre
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_TOPICS.map(({ id, mark, title, Icon, summary }) => (
            <motion.div key={id} variants={FADE_UP}>
              <Link
                href={`/learn-centre#${id}`}
                className="group block h-full border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-herbal-accent/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 text-herbal-accent group-hover:border-herbal-accent/50 transition-colors duration-300">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </span>
                  <span className="font-serif text-xs tracking-[0.2em] text-herbal-cream/25 uppercase">
                    {mark}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-herbal-cream mb-2">{title}</h4>
                <p className="font-sans text-sm text-herbal-cream/55 leading-relaxed">{summary}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}