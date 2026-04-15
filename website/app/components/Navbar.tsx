"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Training", href: "#training" },
    { name: "Avatars", href: "#avatars" },
  ];

  // Static version for SSR
  if (!mounted) {
    return (
      <nav className="fixed top-4 left-0 right-0 w-[90%] max-w-5xl mx-auto z-50 rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl shadow-lg shadow-black/20 px-6 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img src="/icon.png" alt="CHEA" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-on-surface font-headline tracking-tight">
              CHEA
            </span>
          </a>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              <span className="text-sm font-body font-semibold text-on-surface-variant">Features</span>
              <span className="text-sm font-body font-semibold text-on-surface-variant">Training</span>
              <span className="text-sm font-body font-semibold text-on-surface-variant">Avatars</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10" />
              <button className="glitch-button hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-headline font-semibold text-sm bg-neon-crimson text-white">
                <span className="glitch-text" data-text="Get CHEA">Get CHEA</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 left-0 right-0 w-[90%] max-w-5xl mx-auto z-50 rounded-2xl transition-all duration-500 border ${
        scrolled
          ? "bg-surface/85 backdrop-blur-2xl border-white/15 shadow-xl shadow-black/25 py-4"
          : "bg-surface/70 backdrop-blur-xl border-white/10 shadow-lg shadow-black/15 py-4"
      }`}
    >
      <div className="flex justify-between items-center px-6 sm:px-8">
        {/* Logo - Better spacing from edges */}
        <motion.a
          href="#"
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className="relative">
            <img
              src="/icon.png"
              alt="CHEA"
              className="w-12 h-12 object-contain relative z-10"
            />
            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-full blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-125 ${
                isDark ? "bg-neon-crimson/40" : "bg-neon-violet/40"
              }`}
            />
          </div>
          <span className="text-2xl font-bold text-on-surface font-headline tracking-tight">
            CHEA
          </span>
        </motion.a>

        {/* Center Section - Nav Links with more spacing */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className={`relative font-body font-semibold text-sm transition-all duration-300 py-2 ${
                isDark
                  ? "text-[#8AB4F8]/80 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {link.name}
              <motion.span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                  isDark ? "bg-neon-crimson" : "bg-neon-violet"
                }`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Right Section - Better spacing between buttons */}
        <div className="flex items-center gap-6">
          {/* Divider line */}
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          
          {/* Buttons with consistent spacing */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <motion.button
              className={`glitch-button hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl font-headline font-semibold text-sm transition-all duration-300 ${
                isDark
                  ? "bg-neon-crimson text-white hover:bg-neon-crimson/90 shadow-[0_0_20px_rgba(255,10,84,0.3)] hover:shadow-[0_0_30px_rgba(255,10,84,0.5)]"
                  : "bg-neon-violet text-white hover:bg-neon-violet/90 shadow-[0_0_20px_rgba(77,0,255,0.3)] hover:shadow-[0_0_30px_rgba(77,0,255,0.5)]"
              }`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span className="glitch-text" data-text="Get CHEA">Get CHEA</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
