"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, LogOut } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import { FADE_UP, SMOOTH_SPRING } from "@/constants/motion";
import { useCart } from "@/context/CartContext";
import CartDrawer from "../CartDrawer"; // Adjust this path relative to your directory structure
import Cookies from "js-cookie";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cart } = useCart();

  // Dynamically compute absolute allocation quantities 
  const totalItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Check customer auth state on mount
  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    setIsAccountMenuOpen(false);
    window.location.href = "/";
  };

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
              Stars of Dan
            </span>
            <span className="text-[12px] tracking-[0.25em] text-herbal-accent uppercase -mt-1 font-sans font-medium">
              Limited
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
          <div className="flex items-center gap-3">
            
            {/* Account: pill CTA when logged out, dropdown when logged in */}
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-1.5 text-herbal-cream/80 hover:text-white transition-colors p-1"
                    aria-label="Account menu"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-herbal-accent" />
                  </button>

                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-44 bg-herbal-dark border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-herbal-cream/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4 stroke-[1.5]" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/auth">
                  <button 
                    className="flex gap-1.5 items-center text-herbal-dark rounded-[30px] transition-colors px-4 py-2 bg-herbal-accent hover:bg-herbal-cream border-none cursor-pointer text-sm font-medium"
                    aria-label="Sign In"
                  >
                    <User className="w-4 h-4 stroke-[2]" />
                    Sign In
                  </button>
                </Link>
              )}
            </div>
            
            {/* Reactive Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex gap-1 items-center text-black rounded-[30px] transition-colors px-2 py-1 relative bg-white border-none cursor-pointer" 
              aria-label="Cart"
            >
              Cart
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-herbal-accent text-herbal-dark text-[10px] font-bold rounded-full flex items-center justify-center scale-90 animate-fade-in">
                  {totalItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Trigger Button */}
            <button 
              className="md:hidden text-white p-1 ml-1 bg-transparent border-none cursor-pointer"
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

      {/* Slide-out Global Cart Drawer Module */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}