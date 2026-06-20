"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import { FADE_UP, SMOOTH_SPRING } from "@/constants/motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-herbal-dark/90 backdrop-blur-md text-white border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Brand / Identity */}
          <Link href="/" className="flex flex-col tracking-tight group">
            <span className="font-serif text-lg font-semibold uppercase tracking-wider text-herbal-cream">
              Rose of Sharon
            </span>
            <span className="text-[10px] tracking-[0.25em] text-herbal-accent uppercase -mt-1 font-sans font-medium">
              Tradomedicals
            </span>
          </Link>

          {/* Center Links (Desktop Layout) */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-sans tracking-wide text-herbal-cream/80 hover:text-white transition-colors duration-200 relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-herbal-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-5">
            <button className="text-herbal-cream/80 hover:text-white transition-colors p-1" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button className="text-herbal-cream/80 hover:text-white transition-colors p-1" aria-label="Account">
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button className="text-herbal-cream/80 hover:text-white transition-colors p-1 relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-herbal-accent text-herbal-dark text-[10px] font-bold rounded-full flex items-center justify-between justify-center scale-90" />
            </button>
            
            {/* Mobile Trigger Button */}
            <button 
              className="md:hidden text-white p-1 ml-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-herbal-dark md:hidden pt-24 px-8"
          >
            <motion.nav 
              variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-6"
            >
              {NAV_LINKS.map((link) => (
                <motion.div key={link.href} variants={FADE_UP}>
                  <Link 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-serif text-3xl tracking-wide text-herbal-cream block py-2 border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}