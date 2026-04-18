"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";

export default function Features() {
  const { t } = useTranslation("features");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const gadgets = [
    {
      icon: "policy",
      title: t("gadgets.0.title"),
      description: t("gadgets.0.description"),
      color: "primary",
    },
    {
      icon: "password",
      title: t("gadgets.1.title"),
      description: t("gadgets.1.description"),
      color: "secondary",
    },
    {
      icon: "encrypted",
      title: t("gadgets.2.title"),
      description: t("gadgets.2.description"),
      color: "tertiary",
    },
    {
      icon: "lock",
      title: t("gadgets.3.title"),
      description: t("gadgets.3.description"),
      color: "error",
    },
  ];

  const getColorClass = (color: string) => {
    // All icons use Cyber-Defender colors
    return isDark 
      ? "text-neon-crimson bg-neon-crimson/10" 
      : "text-neon-violet bg-neon-violet/10";
  };

  const getGlowClass = (color: string) => {
    // All glow effects use Cyber-Defender colors
    return isDark 
      ? "group-hover:shadow-[0_0_30px_rgba(255,10,84,0.2)]" 
      : "group-hover:shadow-[0_0_30px_rgba(77,0,255,0.2)]";
  };

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
                The Gadgets
              </h2>
              <p className="text-on-surface-variant max-w-md font-body">
                Equip your digital arsenal with tools built for elite performance.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 mx-12 bg-outline-variant/20" />
            <span className="text-neon-crimson font-headline font-bold tracking-widest text-sm">
              KIT_V.1.0.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "policy", title: "Scan-O-Matic", description: "Instant deep-scan for links and files. Know if it's safe before you click." },
              { icon: "password", title: "Secret Code Maker", description: "Forge unhackable passwords that even a supercomputer couldn't crack." },
              { icon: "encrypted", title: "Top Secret Chat", description: "End-to-end encrypted messaging. For your eyes and your team's eyes only." },
              { icon: "lock", title: "The Vault", description: "Ultra-secure credential storage. Locked behind multi-layer bio-auth." },
            ].map((gadget) => (
              <div
                key={gadget.title}
                className="group bg-surface-container-low hover:bg-surface-container-high p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,10,84,0.2)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 bg-neon-crimson group-hover:opacity-40 transition-opacity duration-300" />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-neon-crimson bg-neon-crimson/10">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {gadget.icon}
                  </span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-3 text-on-surface">
                  {gadget.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                  {gadget.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
              {t("sectionTitle")}
            </h2>
            <p className="text-on-surface-variant max-w-md font-body">
              {t("sectionSubtitle")}
            </p>
          </div>
            <div className="hidden md:block h-px flex-1 mx-12 bg-outline-variant/20" />
            <span className={`${isDark ? "text-neon-crimson" : "text-neon-violet"} font-headline font-bold tracking-widest text-sm`}>
              {t("kitVersion")}
            </span>
        </motion.div>

        {/* Gadgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gadgets.map((gadget, index) => (
            <motion.div
              key={gadget.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group bg-surface-container-low hover:bg-surface-container-high p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden transition-all duration-300 ${getGlowClass(gadget.color)}`}
            >
              {/* Background Glow */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-opacity duration-300 ${
                  isDark ? "bg-neon-crimson group-hover:opacity-40" : "bg-neon-violet group-hover:opacity-40"
                }`}
              />

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${getColorClass(
                  gadget.color
                )}`}
              >
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {gadget.icon}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-headline font-bold mb-3 text-on-surface">
                {gadget.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                {gadget.description}
              </p>

              {/* Hover Arrow */}
              <motion.div
                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>arrow_forward</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
