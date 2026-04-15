"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

// 14 avatars for floating effect - more variety!
const floatingAvatars = [
  { id: 1, name: "Agent Neon" },
  { id: 2, name: "Cyber Drift" },
  { id: 3, name: "Phantom Byte" },
  { id: 4, name: "Data Stream" },
  { id: 5, name: "Net Runner" },
  { id: 6, name: "Code Wave" },
  { id: 7, name: "Glitch Flow" },
  { id: 8, name: "Tech Surfer" },
  { id: 9, name: "Binary Ghost" },
  { id: 10, name: "Pixel Drift" },
  { id: 11, name: "Quantum Surf" },
  { id: 12, name: "Neon Flow" },
  { id: 13, name: "Cyber Current" },
  { id: 14, name: "Digital Tide" },
];

// Positions scattered around edges - avoiding center
const avatarPositions = [
  { top: "3%", left: "2%" },
  { top: "8%", right: "4%" },
  { top: "18%", left: "5%" },
  { top: "25%", right: "2%" },
  { top: "35%", left: "1%" },
  { top: "42%", right: "6%" },
  { top: "52%", left: "4%" },
  { top: "60%", right: "3%" },
  { top: "70%", left: "2%" },
  { top: "78%", right: "5%" },
  { top: "88%", left: "6%" },
  { top: "15%", right: "8%" },
  { top: "48%", left: "7%" },
  { top: "82%", right: "2%" },
];

// Modern smooth floating animation - no glitch, just elegant drift
const createFloatAnimation = (index: number) => ({
  y: [0, -25, 0, 15, 0],
  x: [0, 10, -8, 5, 0],
  rotate: [0, 2, -1, 3, 0],
  scale: [1, 1.03, 0.98, 1.01, 1],
  transition: {
    duration: 12 + index * 1.2, // 12-28 seconds, smooth and slow
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: index * 0.8,
  },
});

// Gentle glow pulse
const createGlowAnimation = (index: number) => ({
  opacity: [0.3, 0.5, 0.3],
  scale: [1, 1.1, 1],
  transition: {
    duration: 4 + index * 0.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: index * 0.3,
  },
});

export default function FloatingAvatars() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {floatingAvatars.map((avatar, index) => {
        const position = avatarPositions[index];
        const isLeft = "left" in position;
        
        return (
          <motion.div
            key={avatar.id}
            className="absolute"
            style={{
              top: position.top,
              [isLeft ? "left" : "right"]: isLeft ? position.left : position.right,
              width: "75px",
              height: "75px",
              zIndex: 0,
            }}
            animate={createFloatAnimation(index)}
          >
            {/* Glow effect behind avatar */}
            <motion.div
              className={`absolute inset-0 rounded-2xl blur-xl ${
                isDark ? "bg-neon-crimson/25" : "bg-neon-violet/25"
              }`}
              animate={createGlowAnimation(index)}
            />
            
            {/* Avatar container */}
            <div className="relative w-full h-full">
              {/* Avatar image - clearly visible */}
              <img
                src={`/avatars/avatar${avatar.id}.png`}
                alt={avatar.name}
                className={`w-full h-full object-cover rounded-2xl ${
                  isDark ? "opacity-50" : "opacity-55"
                }`}
                style={{
                  filter: isDark
                    ? "drop-shadow(0 0 20px rgba(255,10,84,0.5)) saturate(1.3) contrast(1.1)"
                    : "drop-shadow(0 0 20px rgba(77,0,255,0.5)) saturate(1.3) contrast(1.1)",
                }}
              />
              
              {/* Subtle scanline overlay */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-25"
                style={{
                  background: "linear-gradient(to bottom, transparent 50%, rgba(143,245,255,0.1) 50%)",
                  backgroundSize: "100% 4px",
                }}
              />
              
              {/* Soft border glow */}
              <div
                className={`absolute inset-0 rounded-2xl border pointer-events-none ${
                  isDark
                    ? "border-neon-crimson/30 shadow-[0_0_15px_rgba(255,10,84,0.2)]"
                    : "border-neon-violet/30 shadow-[0_0_15px_rgba(77,0,255,0.2)]"
                }`}
              />
            </div>
            
            {/* Floating particles - modern minimal style */}
            <motion.div
              className={`absolute -top-2 -right-2 w-2 h-2 rounded-full ${
                isDark ? "bg-primary" : "bg-primary"
              }`}
              style={{
                boxShadow: "0 0 12px rgba(143,245,255,0.8)",
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1.2, 0.9],
              }}
              transition={{
                duration: 3 + index * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4,
              }}
            />
            
            {/* Second particle */}
            <motion.div
              className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full ${
                isDark ? "bg-neon-crimson" : "bg-neon-violet"
              }`}
              style={{
                boxShadow: isDark 
                  ? "0 0 10px rgba(255,10,84,0.8)"
                  : "0 0 10px rgba(77,0,255,0.8)",
              }}
              animate={{
                y: [0, 6, 0],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2.5 + index * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5 + 0.5,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
