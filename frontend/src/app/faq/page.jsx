"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import FaqAccordion from "@/components/FaqAccordion";

const FAQ_ITEMS = [
  {
    question: "Are your products natural?",
    answer:
      "Our products are carefully selected with an emphasis on natural ingredients and quality.",
  },
  {
    question: "Can herbal products replace hospital treatment?",
    answer:
      "No. Herbal products should not replace professional medical advice, diagnosis, or treatment.",
  },
  {
    question: "How should I store herbal products?",
    answer:
      "Store products according to the instructions provided on the packaging, usually in a cool, dry place away from direct sunlight.",
  },
  {
    question: "Can everyone use herbal products?",
    answer:
      "Not always. Individuals with medical conditions, pregnant or breastfeeding women, children, and people taking medications should consult a qualified healthcare professional before use.",
  },
  {
    question: "What if I have a question that isn't answered here?",
    answer:
      "Reach out through our contact page and our team will get back to you, usually within one to two business days.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-herbal-dark text-herbal-cream min-h-screen">
      <section className="px-6 pt-40 pb-16">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span
            variants={FADE_UP}
            className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent"
          >
            Frequently Asked Questions
          </motion.span>
          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-herbal-cream mt-4"
          >
            Answers, before you ask.
          </motion.h1>
          <motion.p
            variants={FADE_UP}
            className="font-sans text-base text-herbal-cream/60 leading-relaxed mt-5 max-w-lg mx-auto"
          >
            Everything you need to know about our herbal products, natural
            foods, and spices, in one place.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <FaqAccordion items={FAQ_ITEMS} />
        </motion.div>
      </section>

      {/* Health disclaimer callout */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-8 bg-white/[0.02]"
        >
          <h4 className="font-serif text-lg text-herbal-accent mb-3">Health Disclaimer</h4>
          <p className="font-sans text-sm text-herbal-cream/55 leading-relaxed">
            The information provided on this website is intended solely for
            educational and informational purposes. It is not intended to
            diagnose, treat, cure, or prevent any disease. Always consult a
            qualified healthcare professional regarding any medical condition
            or before using herbal products, particularly if you are pregnant,
            breastfeeding, taking medications, or managing a health condition.
            Results from natural products may vary from person to person.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center">
        <p className="font-sans text-sm text-herbal-cream/60 mb-5">
          Still have questions?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-herbal-cream hover:bg-white text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300"
        >
          Get in Touch
        </Link>
      </section>
    </main>
  );
}