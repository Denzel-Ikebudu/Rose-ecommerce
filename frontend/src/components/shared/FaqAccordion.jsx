"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-6 py-7 text-left bg-transparent border-none cursor-pointer group"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-serif text-xs text-herbal-accent/70 tracking-widest">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-lg sm:text-xl text-herbal-cream group-hover:text-herbal-accent transition-colors duration-200">
                  {item.question}
                </span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-herbal-cream/70"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-sans text-sm sm:text-base text-herbal-cream/60 leading-relaxed pb-8 pl-0 sm:pl-[52px] max-w-2xl">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}