"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import FloatingAvatars from "./FloatingAvatars";

export default function Hero() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Static version for SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="relative min-h-screen pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img src="/Background_dark_mode..png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-surface/40 to-surface" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col items-center text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold mb-6 leading-tight max-w-5xl">
            CHEA: Your <span className="glitch-accent text-neon-crimson drop-shadow-[0_0_15px_rgba(255,10,84,0.5)]">Cyber-Defender</span>
            <br />
            Toolkit
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-10 font-body">
            The ultimate digital shield built for the next generation. Master the internet, 
            protect your data, and level up your security skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="glitch-button group flex items-center gap-3 bg-gradient-to-br from-neon-crimson to-neon-crimson/80 text-white px-8 py-4 rounded-xl font-headline font-bold text-lg kinetic-button shadow-[0_0_25px_rgba(255,10,84,0.4)] hover:shadow-[0_0_35px_rgba(255,10,84,0.6)]">
              <span className="material-symbols-outlined text-2xl">download</span>
              <span className="glitch-text" data-text="Get Started">Get Started</span>
            </button>
          </div>
        </div>
        
        {/* Floating Avatars Background - Static version */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-0">
          {/* Placeholder for SSR */}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      </header>
    );
  }

  return (
    <header className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Images */}
      <motion.div
        className="absolute inset-0 -z-20"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src="/Background.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 -z-20"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src="/Background_dark_mode..png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-surface/40 to-surface" />

      {/* Electric Pulse */}
      <div className="absolute inset-0 -z-10 electric-pulse" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <motion.div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{
            top: ["0%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col items-center text-center relative z-10">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold mb-6 leading-tight max-w-5xl"
        >
          CHEA:{" "}
          <span className={`glitch-accent drop-shadow-[0_0_15px_rgba(255,10,84,0.5)] ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>Cyber-Defender</span>
          <br />
          Toolkit
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-10 font-body"
        >
          The ultimate digital shield built for the next generation. Master the internet, 
          protect your data, and level up your security skills.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            className={`glitch-button group flex items-center gap-3 px-8 py-4 rounded-xl font-headline font-bold text-lg kinetic-button text-white ${
              isDark 
                ? "bg-gradient-to-br from-neon-crimson to-neon-crimson/80 shadow-[0_0_25px_rgba(255,10,84,0.4)] hover:shadow-[0_0_35px_rgba(255,10,84,0.6)]" 
                : "bg-gradient-to-br from-neon-violet to-neon-violet/80 shadow-[0_0_25px_rgba(77,0,255,0.4)] hover:shadow-[0_0_35px_rgba(77,0,255,0.6)]"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
              download
            </span>
            <span className="glitch-text" data-text="Get Started">Get Started</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Avatars Background */}
      <FloatingAvatars />

      {/* Bottom Floating Avatars */}
      <FloatingAvatars variant="bottom" />

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </header>
  );
}
