"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = { value: number; suffix?: string; label: string };


const STATS: Stat[] = [
  { value: 5, suffix: "+", label: "Years of Trusted Service" },
  { value: 10000, suffix: "+", label: "Customers Served" },
  { value: 50, suffix: "+", label: "Natural Products" },
  { value: 20, suffix: "+", label: "Herbs & Spices Sourced" },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-serif text-4xl sm:text-5xl text-herbal-cream tabular-nums">
      {display.toLocaleString()}
      <span className="text-herbal-accent">{suffix}</span>
    </span>
  );
}

export default function TrustStats() {
  return (
    <section className="px-6 py-20 border-y border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center px-4 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-herbal-cream/50 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}