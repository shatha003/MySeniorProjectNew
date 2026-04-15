"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

const screenshots = [
  {
    id: 1,
    src: "/screenshots/login-light.png",
    title: "Welcome to CHEA",
    description: "Secure login to begin your cybersecurity journey",
  },
  {
    id: 2,
    src: "/screenshots/dashbored-light.png",
    title: "Command Center",
    description: "Your main dashboard for all security tools",
  },
  {
    id: 3,
    src: "/screenshots/link-checker-light.png",
    title: "Link Scanner",
    description: "Verify links before you click to stay safe",
  },
  {
    id: 4,
    src: "/screenshots/photo-secrets-light.png",
    title: "Photo Vault",
    description: "Secure storage for your private photos",
  },
  {
    id: 5,
    src: "/screenshots/my-valut-light.png",
    title: "Password Vault",
    description: "Encrypted storage for all your passwords",
  },
  {
    id: 6,
    src: "/screenshots/password-maker-light.png",
    title: "Password Generator",
    description: "Create strong, unhackable passwords",
  },
  {
    id: 7,
    src: "/screenshots/secret-messages-light.png",
    title: "Secret Messages",
    description: "End-to-end encrypted messaging",
  },
  {
    id: 8,
    src: "/screenshots/phishing-dojo-light.png",
    title: "Phishing Dojo",
    description: "Master the art of spotting fake emails",
  },
  {
    id: 9,
    src: "/screenshots/quiz arena-light.png",
    title: "Quiz Arena",
    description: "Test your skills and compete with friends",
  },
  {
    id: 10,
    src: "/screenshots/test-password-light.png",
    title: "Password Tester",
    description: "Check how strong your passwords are",
  },
  {
    id: 11,
    src: "/screenshots/setting-chose- avatrs-light.png",
    title: "Choose Your Avatar",
    description: "Customize your digital identity",
  },
];

export default function ScreenshotGallery() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mounted]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % screenshots.length;
      }
      return prev === 0 ? screenshots.length - 1 : prev - 1;
    });
  };

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="gallery" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
              See CHEA in Action
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto">
              Explore the features that make CHEA your ultimate cybersecurity companion
            </p>
          </div>

          {/* Carousel Container - Floating Style */}
          <div className="relative w-[90%] max-w-5xl mx-auto">
            {/* Main Display */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container-low border border-white/10 shadow-xl shadow-black/20" style={{ maxHeight: "70vh", minHeight: "400px" }}>
              <div className="relative bg-surface-container-high flex items-center justify-center" style={{ minHeight: "400px" }}>
                <span className="text-on-surface-variant font-body">Loading gallery...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20 ${isDark ? "bg-neon-crimson/30" : "bg-neon-violet/30"}`} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
            See CHEA in Action
          </h2>
          <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto">
            Explore the features that make CHEA your ultimate cybersecurity companion
          </p>
        </motion.div>

        {/* Carousel Container - Floating Capsule Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-[90%] max-w-5xl mx-auto"
        >
          {/* Floating Container */}
          <div className={`relative rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-500 ${
            isDark 
              ? "bg-surface/80 border-white/15 shadow-xl shadow-black/25" 
              : "bg-surface/80 border-white/10 shadow-lg shadow-black/15"
          }`}>
            {/* Main Display */}
            <div className="relative bg-surface-container-high overflow-hidden" style={{ maxHeight: "70vh" }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                  className="relative w-full flex items-center justify-center"
                  style={{ minHeight: "400px" }}
                >
                  <img
                    src={screenshots[currentIndex].src}
                    alt={screenshots[currentIndex].title}
                    className="w-auto h-auto max-w-full max-h-[65vh] object-contain"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent pointer-events-none" />
                  
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className={`text-xl sm:text-2xl font-headline font-bold mb-2 ${
                        isDark ? "text-neon-crimson" : "text-neon-violet"
                      }`}>
                        {screenshots[currentIndex].title}
                      </h3>
                      <p className="text-on-surface-variant font-body text-sm sm:text-base">
                        {screenshots[currentIndex].description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
              <motion.button
                onClick={() => paginate(-1)}
                className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                  isDark 
                    ? "bg-surface/80 border-white/20 hover:bg-neon-crimson/20 hover:border-neon-crimson/50 text-white" 
                    : "bg-surface/80 border-white/20 hover:bg-neon-violet/20 hover:border-neon-violet/50 text-on-surface"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </motion.button>
              
              <motion.button
                onClick={() => paginate(1)}
                className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                  isDark 
                    ? "bg-surface/80 border-white/20 hover:bg-neon-crimson/20 hover:border-neon-crimson/50 text-white" 
                    : "bg-surface/80 border-white/20 hover:bg-neon-violet/20 hover:border-neon-violet/50 text-on-surface"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </motion.button>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="mt-6 flex justify-center gap-2 sm:gap-3 flex-wrap">
            {screenshots.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`relative w-12 h-12 sm:w-16 sm:h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? isDark 
                      ? "border-neon-crimson shadow-[0_0_10px_rgba(255,10,84,0.5)]" 
                      : "border-neon-violet shadow-[0_0_10px_rgba(77,0,255,0.5)]"
                    : "border-white/10 hover:border-white/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={screenshots[index].src}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    index === currentIndex ? "opacity-100" : "opacity-50"
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex justify-center items-center gap-2 text-sm text-on-surface-variant font-body">
            <span className={`font-headline font-bold ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="w-8 h-px bg-outline-variant/30" />
            <span>{String(screenshots.length).padStart(2, '0')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
