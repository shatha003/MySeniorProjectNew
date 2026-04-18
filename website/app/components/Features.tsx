"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useTheme } from "./theme-provider";

export default function Features() {
  const { t } = useTranslation("features");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const gadgets = [
    {
      image: "/new_pic/pic1.png",
      title: t("gadgets.0.title"),
      description: t("gadgets.0.description"),
    },
    {
      image: "/new_pic/pic2.png",
      title: t("gadgets.1.title"),
      description: t("gadgets.1.description"),
    },
    {
      image: "/new_pic/pic3.png",
      title: t("gadgets.2.title"),
      description: t("gadgets.2.description"),
    },
    {
      image: "/new_pic/pic4.png",
      title: t("gadgets.3.title"),
      description: t("gadgets.3.description"),
    },
  ];

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="features" className="py-24 relative overflow-hidden">
        {/* Subtle background gradient - theme colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-crimson/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          {/* Section Header - Minimal */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
              KIT_V.1.0.4
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
              The Gadgets
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
              Equip your digital arsenal with tools built for elite performance.
            </p>
          </div>

          {/* Gadgets Grid - Minimal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { image: "/new_pic/pic1.png", title: "Scan-O-Matic", description: "Instant deep-scan for links and files. Know if it's safe before you click." },
              { image: "/new_pic/pic2.png", title: "Secret Code Maker", description: "Forge unhackable passwords that even a supercomputer couldn't crack." },
              { image: "/new_pic/pic3.png", title: "Top Secret Chat", description: "End-to-end encrypted messaging. For your eyes and your team's eyes only." },
              { image: "/new_pic/pic4.png", title: "The Vault", description: "Ultra-secure credential storage. Locked behind multi-layer bio-auth." },
            ].map((gadget) => (
              <div
                key={gadget.title}
                className="group relative"
              >
                {/* Card */}
                <div className="relative p-6 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]">
                  {/* Image Container - Large & Centered */}
                  <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-crimson/5 to-neon-crimson/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Image
                      src={gadget.image}
                      alt={gadget.title}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(255,10,84,0.35)]"
                    />
                  </div>

                  {/* Content - Minimal */}
                  <div className="text-center">
                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-neon-crimson transition-colors duration-300">
                      {gadget.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant/80 leading-relaxed font-body">
                      {gadget.description}
                    </p>
                  </div>

                  {/* Hover indicator line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-crimson to-neon-crimson/70 rounded-full group-hover:w-1/2 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Subtle background gradient - theme aware */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none ${
        isDark ? "via-neon-crimson/5" : "via-neon-violet/5"
      } to-transparent`} />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        {/* Section Header - Minimal & Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 border ${
              isDark 
                ? "bg-neon-crimson/10 text-neon-crimson border-neon-crimson/20" 
                : "bg-neon-violet/10 text-neon-violet border-neon-violet/20"
            }`}
          >
            {t("kitVersion")}
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        {/* Gadgets Grid - Modern Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gadgets.map((gadget, index) => (
            <motion.div
              key={gadget.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative p-6 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                  isDark
                    ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]"
                    : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/30 hover:shadow-[0_0_60px_rgba(77,0,255,0.15)]"
                }`}
              >
                {/* Image Container - Large & Centered */}
                <div className="relative w-full aspect-square mb-6 flex items-center justify-center overflow-hidden rounded-2xl">
                  {/* Subtle gradient background on hover - theme colors */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark 
                      ? "bg-gradient-to-br from-neon-crimson/10 to-neon-crimson/5" 
                      : "bg-gradient-to-br from-neon-violet/10 to-neon-violet/5"
                  }`} />
                  
                  {/* Glow effect behind image - theme colors */}
                  <div 
                    className={`absolute inset-4 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${
                      isDark ? "bg-neon-crimson" : "bg-neon-violet"
                    }`}
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={gadget.image}
                      alt={gadget.title}
                      width={200}
                      height={200}
                      className={`object-contain w-full h-full drop-shadow-2xl transition-all duration-500 ${
                        isDark
                          ? "group-hover:drop-shadow-[0_0_30px_rgba(255,10,84,0.4)]"
                          : "group-hover:drop-shadow-[0_0_30px_rgba(77,0,255,0.4)]"
                      }`}
                    />
                  </motion.div>
                </div>

                {/* Content - Minimal */}
                <div className="text-center">
                  <h3 className={`text-xl font-headline font-bold mb-2 transition-colors duration-300 ${
                    isDark
                      ? "text-on-surface group-hover:text-neon-crimson"
                      : "text-on-surface group-hover:text-neon-violet"
                  }`}>
                    {gadget.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed font-body">
                    {gadget.description}
                  </p>
                </div>

                {/* Minimal hover indicator - theme colors */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/3 transition-all duration-500 ${
                  isDark
                    ? "bg-gradient-to-r from-neon-crimson to-neon-crimson/70"
                    : "bg-gradient-to-r from-neon-violet to-neon-violet/70"
                }`} />

                {/* Corner accent - theme colors */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDark ? "bg-neon-crimson" : "bg-neon-violet"
                }`} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element - theme colors */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mt-20 mx-auto w-32 h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-neon-crimson/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-neon-violet/50 to-transparent"
          }`}
        />
      </div>
    </section>
  );
}
