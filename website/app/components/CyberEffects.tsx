"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

export default function CyberEffects() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Don't render animations during SSR to prevent hydration issues
  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 circuit-grid opacity-[0.02]" />
    );
  }

  return (
    <>
      {/* Floating Neon Orbs */}
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          filter: "blur(100px)",
          top: "10%",
          right: "10%",
          background: isDark
            ? "radial-gradient(circle, rgba(255,10,84,0.2), transparent 70%)"
            : "radial-gradient(circle, rgba(77,0,255,0.15), transparent 70%)",
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          filter: "blur(80px)",
          bottom: "20%",
          left: "5%",
          background: isDark
            ? "radial-gradient(circle, rgba(77,0,255,0.15), transparent 70%)"
            : "radial-gradient(circle, rgba(255,10,84,0.1), transparent 70%)",
        }}
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          filter: "blur(60px)",
          top: "50%",
          right: "30%",
          background: isDark
            ? "radial-gradient(circle, rgba(143,245,255,0.1), transparent 70%)"
            : "radial-gradient(circle, rgba(8,145,178,0.1), transparent 70%)",
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Circuit Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 circuit-grid opacity-[0.02]" />
    </>
  );
}
