"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Static version for SSR
  if (!mounted) {
    return (
      <footer className="w-[90%] max-w-5xl mx-auto mb-6 rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl shadow-lg shadow-black/20 px-6 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="CHEA" className="w-9 h-9 object-contain opacity-90" />
            <span className="text-lg font-headline font-bold text-on-surface/90 tracking-tight">
              CHEA Protocol
            </span>
          </div>

          {/* Links - More spacing */}
          <div className="flex items-center gap-10 text-sm font-body">
            <a href="/privacy-policy" className="text-on-surface-variant/80 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="text-on-surface-variant/80 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-on-surface-variant/80 hover:text-primary transition-colors">Security</a>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 text-sm text-on-surface-variant/60 font-body">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/70"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>AES-256 Encrypted</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-crimson animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 pt-5 border-t border-white/10 text-center text-sm text-on-surface-variant/40 font-body">
          © 2024 CHEA Protocol. All rights reserved.
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-[90%] max-w-5xl mx-auto mb-6 rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl shadow-lg shadow-black/20 px-6 sm:px-8 py-5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo - Better spacing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img
            src="/icon.png"
            alt="CHEA"
            className="w-9 h-9 object-contain opacity-90"
          />
          <span className="text-lg font-headline font-bold text-on-surface/90 tracking-tight">
            CHEA Protocol
          </span>
        </motion.div>

        {/* Links - Increased spacing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-10 text-sm font-body"
        >
          <a
            href="/privacy-policy"
            className={`text-on-surface-variant/80 transition-colors duration-300 hover:${
              isDark ? "text-neon-crimson" : "text-neon-violet"
            }`}
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className={`text-on-surface-variant/80 transition-colors duration-300 hover:${
              isDark ? "text-neon-crimson" : "text-neon-violet"
            }`}
          >
            Terms of Service
          </a>
          <a
            href="#"
            className={`text-on-surface-variant/80 transition-colors duration-300 hover:${
              isDark ? "text-neon-crimson" : "text-neon-violet"
            }`}
          >
            Security
          </a>
        </motion.div>

        {/* Status - Better organized */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 text-sm text-on-surface-variant/60 font-body"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isDark ? "text-neon-crimson" : "text-neon-violet"}`}
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>AES-256 Encrypted</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-neon-crimson" : "bg-neon-violet"
              } animate-pulse`}
            />
            <span>System Online</span>
          </div>
        </motion.div>
      </div>

      {/* Copyright - With border */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-5 pt-5 border-t border-white/10 text-center text-sm text-on-surface-variant/40 font-body"
        suppressHydrationWarning
      >
        © {currentYear} CHEA Protocol. All rights reserved.
      </motion.div>
    </footer>
  );
}
