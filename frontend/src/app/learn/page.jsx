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

const TOPICS = [
  {
    id: "understanding-herbs",
    mark: "01",
    title: "Understanding Herbs",
    Icon: Leaf,
    summary: "What herbal products are, and how to approach them sensibly.",
    body: [
      "Herbal products are made from plants, or parts of plants, that have been used for generations to support everyday wellness. This can include leaves, roots, seeds, bark, or flowers, dried and prepared in forms like teas, powders, or capsules.",
      "The strength and effect of an herbal product depends on how it was grown, harvested, and processed, which is why sourcing and quality control matter as much as the plant itself. A good product will tell you what it contains and how it was prepared.",
      "Herbal products work best as part of a consistent, informed routine, not a one-time fix. Start with a single product, take note of how your body responds, and give it time before adding another.",
    ],
  },
  {
    id: "balanced-nutrition",
    mark: "02",
    title: "Benefits of Balanced Nutrition",
    Icon: Apple,
    summary: "Why variety and consistency matter more than any single food.",
    body: [
      "A balanced diet gives your body a steady supply of energy, protein, healthy fats, vitamins, and minerals, so no single system is left running short. This steadiness shows up in mood, focus, digestion, and how well you recover from daily stress.",
      "Balance doesn't mean restriction. It means building meals around whole grains, vegetables, fruits, and quality proteins most of the time, while leaving room for the foods you enjoy.",
      "Small, repeatable habits, like adding a vegetable to lunch or swapping a sugary snack for nuts and dried fruit, tend to outlast dramatic diet changes, because they don't rely on willpower alone.",
    ],
  },
  {
    id: "healthy-lifestyle-habits",
    mark: "03",
    title: "Healthy Lifestyle Habits",
    Icon: HeartPulse,
    summary: "The daily basics that support everything else you do for your health.",
    body: [
      "Sleep, movement, hydration, and stress management form the foundation that nutrition and herbal support sit on top of. Without this foundation, even the best products will only do so much.",
      "Aim for consistency over intensity: a short walk most days, a regular sleep schedule, and water throughout the day will outperform occasional bursts of extreme effort.",
      "Pay attention to stress specifically. Chronic stress affects digestion, sleep, and immune health, so building in short, regular pauses, even five minutes of quiet, is a legitimate wellness habit, not an indulgence.",
    ],
  },
  {
    id: "spice-education",
    mark: "04",
    title: "Spice Education",
    Icon: Flame,
    summary: "How to store, use, and get more from your spice collection.",
    body: [
      "Spices lose potency over time, especially once ground, so buying in smaller quantities and storing properly matters more than buying in bulk. Whole spices like cloves or black pepper keep their strength far longer than pre-ground versions.",
      "Toasting whole spices briefly before grinding, or adding them early in cooking, releases more of their aroma and flavor than adding them at the very end.",
      "Blends like curry powder are a starting point, not a fixed rule. Adjust the ratio of heat, earthiness, and warmth in a blend to match what you're cooking and how spicy you actually like your food.",
    ],
  },
  {
    id: "traditional-modern-wellness",
    mark: "05",
    title: "Traditional Herbs & Modern Wellness",
    Icon: ScrollText,
    summary: "How generations-old plant knowledge fits into life today.",
    body: [
      "Many herbs used today have been part of traditional wellness practices for generations, passed down long before formal research existed to describe why they worked. That history is valuable, but it isn't the same as clinical evidence, and both matter.",
      "Modern quality practices, like standardized sourcing and clear labeling, exist to make traditional knowledge safer and more consistent to use today, not to replace it.",
      "The most reliable way to use traditional herbs today is to treat them as a complement to medical care, not a substitute for it, and to talk with a healthcare professional about anything you're taking regularly.",
    ],
  },
  {
    id: "food-storage-tips",
    mark: "06",
    title: "Food Storage Tips",
    Icon: Archive,
    summary: "Keeping natural foods fresh for longer, without losing nutrients.",
    body: [
      "Natural foods with no added preservatives are more sensitive to heat, light, and moisture, so proper storage directly affects both freshness and nutritional value.",
      "As a general rule: dried goods like grains, seeds, and nuts keep best in airtight containers in a cool, dry place, away from direct sunlight. Once opened, most natural foods benefit from being resealed tightly rather than left in their original packaging.",
      "If you're unsure how long something will last, smell and appearance are usually more reliable guides than a date alone. Natural products can look and smell slightly different from batch to batch, and that's normal, but anything noticeably off should be discarded.",
    ],
  },
  {
    id: "healthy-recipes",
    mark: "07",
    title: "Healthy Recipes",
    Icon: ChefHat,
    summary: "Simple ways to bring natural foods and spices into daily meals.",
    body: [
      "You don't need an elaborate recipe to eat well. A base of whole grains or legumes, a vegetable, a spice blend, and a source of protein covers most of what a balanced meal needs.",
      "Spices can carry a dish on their own. A simple turmeric and ginger broth, or a curry-spiced vegetable stew, delivers flavor without relying heavily on salt or oil.",
      "For a quick natural breakfast, try oats soaked overnight with dried fruit and a spoon of raw honey, or a smoothie built around seeds, nuts, and a small piece of ginger for a gentle morning lift.",
    ],
  },
  {
    id: "wellness-guides",
    mark: "08",
    title: "Wellness Guides",
    Icon: BookOpenCheck,
    summary: "Putting it all together into a routine that actually fits your life.",
    body: [
      "The most effective wellness routine is the one you can realistically keep up with, not the most elaborate one you can build for a single week. Start with one or two changes, and let them become habit before adding more.",
      "A simple starting routine might include: one herbal product taken consistently, one meal each day built around whole foods, a short daily walk, and a consistent bedtime.",
      "Revisit your routine every few weeks. What's easy to sustain, what feels forced, and what's actually making a difference, will usually become clear once you've given it enough time to settle in.",
    ],
  },
];

export default function LearnCentrePage() {
  return (
    <main className="bg-herbal-dark text-herbal-cream min-h-screen">
      <Navbar />

     {/* Intro — hero image */}
      <section className="relative px-6 pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/learn-centre/hero.jpg"
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

      {/* Quick jump index */}
      <section className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2.5"
        >
          {TOPICS.map(({ id, mark, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-sans text-xs text-herbal-cream/70 hover:text-herbal-accent border border-white/10 hover:border-herbal-accent/50 rounded-full px-4 py-2 transition-colors duration-200"
            >
              <span className="text-herbal-accent/70 mr-1.5">{mark}</span>
              {title}
            </a>
          ))}
        </motion.div>
      </section>

      {/* Topics */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-20">
          {TOPICS.map(({ id, mark, title, Icon, summary, body }) => (
            <motion.article
              key={id}
              id={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border border-white/10 text-herbal-accent">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </span>
                <div>
                  <span className="font-serif text-xs tracking-[0.2em] text-herbal-cream/30 uppercase">
                    {mark}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-herbal-cream">
                    {title}
                  </h2>
                </div>
              </div>
              <p className="font-sans text-sm text-herbal-accent/80 mb-5 ml-[60px]">
                {summary}
              </p>
              <div className="flex flex-col gap-4 ml-[60px]">
                {body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-sans text-sm sm:text-base text-herbal-cream/65 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Health disclaimer */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-8 bg-white/[0.02]"
        >
          <h4 className="font-serif text-lg text-herbal-accent mb-3">A Note on This Guide</h4>
          <p className="font-sans text-sm text-herbal-cream/55 leading-relaxed">
            This Learn Centre is intended for educational and informational
            purposes only, and is not intended to diagnose, treat, cure, or
            prevent any disease. Always consult a qualified healthcare
            professional before starting any herbal regimen, particularly if
            you are pregnant, breastfeeding, taking medications, or managing a
            health condition.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center">
        <p className="font-sans text-sm text-herbal-cream/60 mb-5">
          Have a specific question we haven&apos;t covered?
        </p>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 justify-center bg-herbal-cream hover:bg-white text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300"
        >
          Visit our FAQ
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </Link>
      </section>
    </main>
  );
}