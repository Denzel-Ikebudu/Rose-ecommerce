"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Users, GraduationCap, Sprout, Sparkles } from "lucide-react";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import Navbar from "@/components/shared/Navbar";

const CORE_VALUES = [
  {
    mark: "In",
    title: "Integrity",
    body: "We operate with honesty, transparency, and accountability in everything we do.",
    Icon: ShieldCheck,
  },
  {
    mark: "Qu",
    title: "Quality",
    body: "Every product is carefully selected to meet high standards before reaching our customers.",
    Icon: Leaf,
  },
  {
    mark: "Cf",
    title: "Customer First",
    body: "Our customers remain at the center of every decision we make.",
    Icon: Users,
  },
  {
    mark: "Ed",
    title: "Education",
    body: "We empower individuals with reliable information that helps them make informed wellness decisions.",
    Icon: GraduationCap,
  },
  {
    mark: "Su",
    title: "Sustainability",
    body: "We encourage responsible sourcing and environmentally conscious business practices.",
    Icon: Sprout,
  },
  {
    mark: "Ex",
    title: "Excellence",
    body: "We continually improve our products, services, and customer experience.",
    Icon: Sparkles,
  },
];

const WHY_US = [
  "Premium-quality herbal products",
  "Carefully selected natural foods",
  "Fresh and authentic spices",
  "Reliable customer support",
  "Educational wellness resources",
  "Transparent business practices",
];

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <main className="bg-herbal-dark text-herbal-cream">
      <Navbar />

      {/* Page intro — video background */}
      <section className="relative w-full pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-20">
          {reducedMotion ? (
            <Image
              src="/images/Herb1.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/herb2.jpg"
            >
              <source src="/videos/bg.webm" type="video/webm" />
              <source src="/videos/bg.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-herbal-dark/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-herbal-dark/30 via-herbal-dark/60 to-herbal-dark" />
        </div>

        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-herbal-accent/5 blur-3xl -z-10" />
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
            Our Story
          </motion.span>
          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-herbal-cream leading-[1.1] mt-4"
          >
            Nature has always been one of humanity&apos;s greatest sources of nourishment.
          </motion.h1>
          <motion.p
            variants={FADE_UP}
            className="font-sans text-base sm:text-lg text-herbal-cream/65 font-light leading-relaxed mt-6 max-w-xl mx-auto"
          >
            Stars of Dan was established with a simple but meaningful vision: to
            reconnect people with nature&apos;s gifts through trusted herbal
            products, nourishing natural foods, and authentic spices.
          </motion.p>
        </motion.div>
      </section>

      {/* Story body — text + image */}
      <section className="px-6 pb-24">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14 items-center"
        >
          <motion.div variants={FADE_UP} className="md:col-span-3">
            <p className="font-sans text-base text-herbal-cream/70 leading-relaxed">
              Inspired by generations of traditional knowledge and supported by
              modern quality practices, we are building a brand that people can
              trust for quality, transparency, and education. Our journey
              continues as we expand our range of products while remaining
              committed to promoting healthier living, naturally.
            </p>
          </motion.div>
          <motion.div
            variants={FADE_UP}
            className="md:col-span-2 relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10"
          >
            <Image
              src="/images/herb3.jpg"
              alt="Natural herbs and ingredients used in Stars of Dan products"
              fill
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 pb-24">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            variants={FADE_UP}
            className="border border-white/10 rounded-2xl p-10 bg-white/[0.02]"
          >
            <h3 className="font-serif text-2xl text-herbal-accent mb-4">Our Mission</h3>
            <p className="font-sans text-sm text-herbal-cream/65 leading-relaxed">
              To improve lives by providing premium herbal products, wholesome
              natural foods, and quality spices, while promoting wellness
              through education, integrity, and responsible business practices.
            </p>
          </motion.div>
          <motion.div
            variants={FADE_UP}
            className="border border-white/10 rounded-2xl p-10 bg-white/[0.02]"
          >
            <h3 className="font-serif text-2xl text-herbal-accent mb-4">Our Vision</h3>
            <p className="font-sans text-sm text-herbal-cream/65 leading-relaxed">
              To become one of Africa&apos;s most trusted natural wellness
              brands, providing products that support healthy living and
              inspire confidence in natural solutions.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Mood image band */}
      <section className="px-6 pb-24">
        <motion.div
          variants={FADE_UP}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-6xl mx-auto h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/10"
        >
          <Image
            src="/images/herb4.jpg"
            alt="Dried herbs and spices selected for Stars of Dan products"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-herbal-dark/90 via-herbal-dark/10 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-serif text-xl sm:text-2xl text-herbal-cream max-w-md">
              Every leaf, root, and spice is chosen before it ever reaches your shelf.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Core values, indexed like an apothecary ledger */}
      <section className="px-6 pb-24">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={FADE_UP} className="text-center mb-14">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent">
              Core Values
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-herbal-cream mt-3">
              What guides every product on our shelf
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {CORE_VALUES.map(({ mark, title, body, Icon }) => (
              <motion.div
                key={title}
                variants={FADE_UP}
                className="bg-herbal-dark p-8 hover:bg-white/[0.02] transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <Icon className="w-5 h-5 text-herbal-accent stroke-[1.5]" />
                  <span className="font-serif text-xs tracking-[0.2em] text-herbal-cream/25 uppercase">
                    {mark}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-herbal-cream mb-2">{title}</h4>
                <p className="font-sans text-sm text-herbal-cream/55 leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why choose us */}
      <section className="px-6 pb-28">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 variants={FADE_UP} className="font-serif text-3xl sm:text-4xl text-herbal-cream mb-10">
            Why Choose Stars of Dan
          </motion.h2>
          <motion.div variants={FADE_UP} className="flex flex-wrap justify-center gap-3">
            {WHY_US.map((item) => (
              <span
                key={item}
                className="font-sans text-sm text-herbal-cream/75 border border-white/10 rounded-full px-5 py-2.5"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA — image background */}
      <section className="px-6 pb-32">
        <motion.div
          variants={FADE_UP}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-3xl mx-auto text-center border border-white/10 rounded-3xl p-14 overflow-hidden"
        >
          <Image
            src="/images/herb2.jpg"
            alt=""
            fill
            className="object-cover -z-10"
          />
          <div className="absolute inset-0 bg-herbal-dark/85 -z-10" />

          <h3 className="font-serif text-2xl sm:text-3xl text-herbal-cream mb-4">
            Join thousands embracing natural living
          </h3>
          <p className="font-sans text-sm text-herbal-cream/60 mb-8 max-w-lg mx-auto">
            Discover premium herbal products, wholesome natural foods, and
            authentic spices, carefully selected to support a healthier lifestyle.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-herbal-cream hover:bg-white text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>
    </main>
  );
}