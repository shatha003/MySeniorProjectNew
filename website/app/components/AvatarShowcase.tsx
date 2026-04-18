"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";
import { Users, Sparkles, Lock } from "lucide-react";

export default function AvatarShowcase() {
  const { t } = useTranslation("avatars");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const featuredAvatars = [
    { id: 1, name: t("featuredAvatars.0.name"), rarity: "common" },
    { id: 5, name: t("featuredAvatars.1.name"), rarity: "rare" },
    { id: 8, name: t("featuredAvatars.2.name"), rarity: "epic" },
    { id: 12, name: t("featuredAvatars.3.name"), rarity: "legendary" },
    { id: 15, name: t("featuredAvatars.4.name"), rarity: "epic" },
    { id: 17, name: t("featuredAvatars.5.name"), rarity: "rare" },
  ];

  const stats = [
    { value: t("stats.count"), label: t("stats.uniqueAvatars"), icon: Users },
    { value: t("stats.infinity"), label: t("stats.customization"), icon: Sparkles },
    { value: t("stats.percent"), label: t("stats.free"), icon: Lock },
  ];

  const getRarityColor = (rarity: string) => {
    if (isDark) {
      switch (rarity) {
        case "legendary": return "from-amber-400/20 to-orange-500/20 border-amber-400/30";
        case "epic": return "from-purple-400/20 to-pink-500/20 border-purple-400/30";
        case "rare": return "from-cyan-400/20 to-blue-500/20 border-cyan-400/30";
        default: return "from-gray-400/10 to-gray-500/10 border-gray-400/20";
      }
    } else {
      switch (rarity) {
        case "legendary": return "from-amber-400/30 to-orange-500/30 border-amber-400/40";
        case "epic": return "from-violet-400/30 to-purple-500/30 border-violet-400/40";
        case "rare": return "from-sky-400/30 to-blue-500/30 border-sky-400/40";
        default: return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
      }
    }
  };

  const getRarityGlow = (rarity: string) => {
    if (!isDark) return "";
    switch (rarity) {
      case "legendary": return "shadow-[0_0_30px_rgba(251,191,36,0.3)]";
      case "epic": return "shadow-[0_0_30px_rgba(192,132,252,0.3)]";
      case "rare": return "shadow-[0_0_30px_rgba(34,211,238,0.3)]";
      default: return "shadow-[0_0_20px_rgba(255,10,84,0.15)]";
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-amber-400";
      case "epic": return isDark ? "text-purple-400" : "text-violet-500";
      case "rare": return isDark ? "text-cyan-400" : "text-sky-500";
      default: return "text-on-surface-variant";
    }
  };

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="avatars" className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-crimson/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          {/* Section Header - Minimal */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
              Collection
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
              Choose Your Avatar
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
              Express yourself with unique cyberpunk avatars. Unlock more as you level up!
            </p>
          </div>

          {/* Avatar Grid - Minimal Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {[
              { id: 1, name: "Cipher" },
              { id: 5, name: "Glitch" },
              { id: 8, name: "Neo" },
              { id: 12, name: "Vortex" },
              { id: 15, name: "Phantom" },
              { id: 17, name: "Nova" },
            ].map((avatar) => (
              <div
                key={avatar.id}
                className="group cursor-pointer"
              >
                {/* Avatar Container - Clean Square */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/10 transition-all duration-500 group-hover:border-neon-crimson/30 group-hover:shadow-[0_0_30px_rgba(255,10,84,0.15)]">
                  <img
                    src={`/avatars/avatar${avatar.id}.png`}
                    alt={avatar.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Corner Accent */}
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neon-crimson/0 group-hover:bg-neon-crimson/60 transition-all duration-300" />
                </div>

                {/* Avatar Name - Minimal */}
                <p className="text-center mt-3 text-sm font-body font-medium text-on-surface-variant group-hover:text-on-surface transition-colors duration-300">
                  {avatar.name}
                </p>
              </div>
            ))}
          </div>

          {/* Stats - Horizontal Minimal */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              { value: "20+", label: "Unique Avatars" },
              { value: "∞", label: "Customization" },
              { value: "100%", label: "Free" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-headline font-bold text-neon-crimson">
                  {stat.value}
                </span>
                <span className="text-sm text-on-surface-variant font-body mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="avatars" className="py-24 relative overflow-hidden">
      {/* Background gradient - theme aware */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none ${
        isDark ? "via-neon-crimson/5" : "via-neon-violet/5"
      } to-transparent`} />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header - Minimal & Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
            {t("badgeText", { defaultValue: "Collection" })}
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        {/* Avatar Grid - Modern Minimal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {featuredAvatars.map((avatar, index) => (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
              className="group cursor-pointer"
            >
              {/* Avatar Container - Clean with gradient border effect */}
              <div className={`
                relative aspect-square rounded-2xl overflow-hidden 
                bg-surface-container-low border transition-all duration-500
                ${isDark 
                  ? `border-outline-variant/10 group-hover:border-neon-crimson/30 ${getRarityGlow(avatar.rarity)}` 
                  : `border-outline-variant/20 group-hover:border-neon-violet/30 ${getRarityGlow(avatar.rarity)}`
                }
              `}>
                {/* Gradient background based on rarity */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(avatar.rarity)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <img
                  src={`/avatars/avatar${avatar.id}.png`}
                  alt={avatar.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                
                {/* Corner Accent - appears on hover */}
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-300 z-30 ${
                  isDark 
                    ? "bg-neon-crimson/0 group-hover:bg-neon-crimson/80" 
                    : "bg-neon-violet/0 group-hover:bg-neon-violet/80"
                }`} />
              </div>

              {/* Avatar Name - Minimal with rarity color */}
              <motion.p
                className={`text-center mt-3 text-sm font-body font-medium transition-colors duration-300 ${
                  getRarityText(avatar.rarity)
                } group-hover:${isDark ? "text-neon-crimson" : "text-neon-violet"}`}
              >
                {avatar.name}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Stats - Minimal Horizontal with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center px-6 py-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                isDark
                  ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/20"
                  : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/20"
              }`}
            >
              <stat.icon className={`w-5 h-5 mb-2 ${isDark ? "text-neon-crimson/60" : "text-neon-violet/60"}`} />
              <span className={`text-3xl font-headline font-bold ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>
                {stat.value}
              </span>
              <span className="text-sm text-on-surface-variant font-body mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
