"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";
import ThemeToggle from "./theme-toggle";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
  const { t } = useTranslation("nav");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll direction and visibility
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const scrollThreshold = 50;
    
    // Always show header at the top of the page
    if (latest < scrollThreshold) {
      setIsHeaderVisible(true);
      setScrolled(false);
      return;
    }

    // Update scrolled state for style changes
    setScrolled(latest > scrollThreshold);

    // Determine scroll direction and visibility
    if (latest > previous && latest > scrollThreshold) {
      // Scrolling down - hide header
      setIsHeaderVisible(false);
    } else if (latest < previous) {
      // Scrolling up - show header
      setIsHeaderVisible(true);
    }
  });

  const navLinks = [
    { name: t("features"), href: "/#features" },
    { name: t("training"), href: "/#training" },
    { name: t("avatars"), href: "/#avatars" },
    { name: t("about"), href: "/about" },
  ];

  // Static version for SSR
  if (!mounted) {
    return (
      <nav className="fixed top-4 left-0 right-0 w-[90%] max-w-5xl mx-auto z-50 rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl shadow-lg shadow-black/20 px-6 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="CHEA" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-on-surface font-headline tracking-tight">
              CHEA
            </span>
          </a>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              <span className="text-base font-headline font-semibold text-on-surface/80">Features</span>
              <span className="text-base font-headline font-semibold text-on-surface/80">Training</span>
              <span className="text-base font-headline font-semibold text-on-surface/80">Avatars</span>
              <span className="text-base font-headline font-semibold text-on-surface/80">About</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button placeholder for SSR */}
              <div className="md:hidden w-10 h-10" />
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isHeaderVisible ? 0 : -120, 
        opacity: isHeaderVisible ? 1 : 0 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }}
      className={`fixed top-4 left-0 right-0 w-[90%] max-w-5xl mx-auto z-50 rounded-2xl transition-all duration-500 border ${
        scrolled
          ? "bg-surface/85 backdrop-blur-2xl border-white/15 shadow-xl shadow-black/25 py-4"
          : "bg-surface/70 backdrop-blur-xl border-white/10 shadow-lg shadow-black/15 py-4"
      }`}
    >
      <div className="flex justify-between items-center px-6 sm:px-8">
        {/* Logo - Better spacing from edges */}
        <motion.a
          href="/"
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
              className={`relative font-headline font-semibold text-base transition-all duration-300 py-2 text-on-surface/90 hover:text-on-surface`}
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

        {/* Right Section - Mobile Menu Button + ThemeToggle and LanguageSwitcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-on-surface/80 hover:text-on-surface hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 mt-2 pt-4 pb-2"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-headline font-semibold text-sm transition-all duration-300 ${
                  isDark
                    ? "text-on-surface/80 hover:text-on-surface hover:bg-white/5"
                    : "text-on-surface/80 hover:text-on-surface hover:bg-black/5"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
