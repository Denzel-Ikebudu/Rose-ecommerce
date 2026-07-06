"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, ArrowRight, Leaf } from "lucide-react";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";

const EXPLORE_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const LEARN_LINKS = [
  { href: "/learn/understanding-herbs", label: "Understanding Herbs" },
  { href: "/learn/spice-education", label: "Spice Education" },
  { href: "/learn/wellness-guides", label: "Wellness Guides" },
  { href: "/learn/healthy-recipes", label: "Healthy Recipes" },
];

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire this up to your email list provider (Mailchimp, Beehiiv, etc.)
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="relative w-full bg-herbal-dark text-herbal-cream border-t border-white/5 overflow-hidden">
      {/* Ambient botanical backdrop, echoes the hero treatment */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-herbal-accent/5 blur-3xl" />

      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 md:gap-8">
          {/* Brand column */}
          <motion.div variants={FADE_UP}>
            <div className="flex flex-col mb-5">
              <span className="font-serif text-xl font-semibold uppercase tracking-wider text-herbal-cream">
                Stars of Dan
              </span>
              <span className="text-[11px] tracking-[0.25em] text-herbal-accent uppercase -mt-1 font-sans font-medium">
                Limited
              </span>
            </div>
            <p className="font-sans text-sm text-herbal-cream/60 leading-relaxed max-w-xs">
              Herbal products, wholesome natural foods, and authentic spices,
              carefully selected to support healthier, more grounded living.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-herbal-cream/70 hover:text-herbal-dark hover:bg-herbal-accent hover:border-herbal-accent transition-all duration-300"
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Explore column */}
          <motion.div variants={FADE_UP}>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-5">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-herbal-cream/75 hover:text-herbal-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Learn Centre column */}
          <motion.div variants={FADE_UP}>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-5">
              Learn Centre
            </h4>
            <ul className="flex flex-col gap-3">
              {LEARN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-herbal-cream/75 hover:text-herbal-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter column */}
          <motion.div variants={FADE_UP}>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-5">
              Stay Rooted
            </h4>
            <p className="font-sans text-sm text-herbal-cream/60 leading-relaxed mb-4">
              Get wellness guides and new arrivals in your inbox, occasionally.
            </p>
            {submitted ? (
              <p className="font-sans text-sm text-herbal-accent flex items-center gap-2">
                <Leaf className="w-4 h-4 stroke-[1.5]" />
                You&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 min-w-0 bg-transparent border border-white/15 focus:border-herbal-accent rounded-full px-4 py-2.5 text-sm font-sans text-herbal-cream placeholder:text-herbal-cream/30 outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-herbal-accent text-herbal-dark hover:bg-herbal-cream transition-colors duration-300"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={FADE_UP} className="w-full h-px bg-white/5 my-10" />

        {/* Health disclaimer, required for herbal product claims */}
        <motion.p
          variants={FADE_UP}
          className="font-sans text-[11px] text-herbal-cream/35 leading-relaxed max-w-4xl mb-6"
        >
          The information on this website is intended solely for educational and
          informational purposes and is not intended to diagnose, treat, cure, or
          prevent any disease. Always consult a qualified healthcare professional
          before using herbal products, particularly if you are pregnant,
          breastfeeding, taking medications, or managing a health condition.
        </motion.p>

        {/* Bottom bar */}
        <motion.div
          variants={FADE_UP}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2"
        >
          <p className="font-sans text-xs text-herbal-cream/40">
            © {new Date().getFullYear()} Stars of Dan Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="font-sans text-xs text-herbal-cream/40 hover:text-herbal-cream/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs text-herbal-cream/40 hover:text-herbal-cream/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}