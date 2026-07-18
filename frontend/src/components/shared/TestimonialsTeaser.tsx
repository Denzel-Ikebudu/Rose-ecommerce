"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

type Testimonial = { name: string; location: string; quote: string; rating: number };

const TESTIMONIALS: Testimonial[] = [
  { name: "Amaka O.", location: "Lagos", quote: "The turmeric blend genuinely changed my morning routine. Fast delivery too.", rating: 5 },
  { name: "Tobenna E.", location: "Abuja", quote: "Quality you can taste. I've reordered three times already.", rating: 5 },
  { name: "Grace A.", location: "Port Harcourt", quote: "Finally a natural foods brand that actually explains what I'm buying.", rating: 5 },
  { name: "Chidi N.", location: "Ibadan", quote: "Their spice blends are unmatched. My jollof has never been better.", rating: 5 },
  { name: "Faith U.", location: "Lagos", quote: "Customer support walked me through exactly what to try first. Loved it.", rating: 5 },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="shrink-0 w-[320px] sm:w-[380px] border border-white/10 rounded-2xl p-8 bg-white/[0.02] mx-3">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-herbal-accent text-herbal-accent" />
        ))}
      </div>
      <p className="font-sans text-sm text-herbal-cream/75 leading-relaxed mb-6">
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="font-serif text-sm text-herbal-cream">
        {t.name}
        <span className="font-sans text-xs text-herbal-cream/40 ml-2">{t.location}</span>
      </p>
    </div>
  );
}

export default function TestimonialsTeaser() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-6 max-w-3xl mx-auto text-center mb-12"
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent">Reviews</span>
        <h2 className="font-serif text-3xl sm:text-4xl text-herbal-cream mt-3">
          What our customers are saying
        </h2>
      </motion.div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-herbal-dark to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-herbal-dark to-transparent z-10" />
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {loop.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 font-sans text-sm text-herbal-accent hover:text-herbal-cream transition-colors duration-200"
        >
          Read all reviews
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </Link>
      </div>
    </section>
  );
}