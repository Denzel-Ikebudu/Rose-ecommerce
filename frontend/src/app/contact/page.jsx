"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import Navbar from "@/components/shared/Navbar";

const CONTACT_DETAILS = [
  {
    Icon: Mail,
    label: "Email",
    value: "starsofadventures@gmail.com",
    href: "mailto:starsofadventures@gmail.com",
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+234 904 881 3369",
    href: "tel:+2349048813369",
  },
  {
    Icon: MapPin,
    label: "Location",
    value: "Lagos, Nigeria",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Swap this for your preferred sending method, e.g. an EmailJS call
      // or a fetch to a Next.js route handler at /api/contact that emails you.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="bg-herbal-dark text-herbal-cream min-h-screen">
      <Navbar />

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
            Get in Touch
          </motion.span>
          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-herbal-cream mt-4"
          >
            We&apos;d love to hear from you.
          </motion.h1>
          <motion.p
            variants={FADE_UP}
            className="font-sans text-base text-herbal-cream/60 leading-relaxed mt-5 max-w-lg mx-auto"
          >
            Questions about a product, an order, or where to start with herbal
            wellness? Send us a message and our team will get back to you.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-16"
        >
          {/* Contact details */}
          <div>
            <h3 className="font-serif text-2xl text-herbal-cream mb-8">
              Contact Details
            </h3>
            <div className="flex flex-col gap-6">
              {CONTACT_DETAILS.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-white/10 text-herbal-accent">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </span>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-sans text-sm text-herbal-cream/80 hover:text-herbal-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-herbal-cream/80">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="font-sans text-xs text-herbal-cream/40 leading-relaxed">
                For urgent product safety concerns, please contact a qualified
                healthcare professional directly rather than waiting for a
                response here.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center border border-white/10 rounded-2xl p-12 bg-white/[0.02]">
                <CheckCircle2 className="w-10 h-10 text-herbal-accent mb-4 stroke-[1.5]" />
                <h4 className="font-serif text-xl text-herbal-cream mb-2">
                  Message sent
                </h4>
                <p className="font-sans text-sm text-herbal-cream/60 max-w-xs">
                  Thank you for reaching out. We&apos;ll get back to you within
                  one to two business days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 font-sans text-sm text-herbal-accent underline underline-offset-4 bg-transparent border-none cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-transparent border border-white/15 focus:border-herbal-accent rounded-xl px-4 py-3.5 text-sm font-sans text-herbal-cream placeholder:text-herbal-cream/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full bg-transparent border border-white/15 focus:border-herbal-accent rounded-xl px-4 py-3.5 text-sm font-sans text-herbal-cream placeholder:text-herbal-cream/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/40 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full bg-transparent border border-white/15 focus:border-herbal-accent rounded-xl px-4 py-3.5 text-sm font-sans text-herbal-cream placeholder:text-herbal-cream/30 outline-none transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="font-sans text-sm text-red-400">
                    Something went wrong sending your message. Please try
                    again, or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 bg-herbal-cream hover:bg-white disabled:opacity-60 text-herbal-dark font-sans text-sm font-medium uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 mt-2"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                  {status !== "sending" && <Send className="w-4 h-4 stroke-[2]" />}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}