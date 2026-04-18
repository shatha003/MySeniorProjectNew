"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";

export default function Training() {
  const { t } = useTranslation("training");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const themeColor = isDark ? "neon-crimson" : "neon-violet";
  const themeHex = isDark ? "#FF0A54" : "#4D00FF";

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="training" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-crimson/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          {/* Section Header - Minimal */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
              Level Up
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
              Training Grounds
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
              Level up your cyber skills through hands-on challenges
            </p>
          </div>

          {/* Training Cards - Minimal Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Phishing Dojo */}
            <div className="group relative">
              <div className="relative p-8 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-2 group-hover:text-neon-crimson transition-colors duration-300">
                      Phishing Dojo
                    </h3>
                    <p className="text-on-surface-variant/80 font-body text-sm">
                      Master the art of spotting fake emails and scams
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
                    Active
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-headline font-bold mb-2 tracking-wide text-neon-crimson">
                    <span>XP PROGRESS</span>
                    <span>8,500 / 10,000</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[85%] rounded-full bg-neon-crimson" />
                  </div>
                </div>

              {/* Image - Theme aware */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-surface-container-high/30">
                <img
                  src="/new_pic/websitedark.png"
                  alt="Phishing Dojo"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    isDark 
                      ? "opacity-90 group-hover:opacity-100" 
                      : "opacity-70 group-hover:opacity-90 brightness-90"
                  }`}
                />
                {/* Dark overlay for light mode */}
                <div className={`absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-surface-container-lowest/20 to-transparent transition-opacity duration-500 ${
                  isDark ? "opacity-0" : "opacity-60"
                }`} />
              </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                      military_tech
                    </span>
                    <span>12 Levels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                      target
                    </span>
                    <span>85% Accuracy</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-crimson to-neon-crimson/70 rounded-full group-hover:w-1/3 transition-all duration-500" />
              </div>
            </div>

            {/* Quiz Arena */}
            <div className="group relative">
              <div className="relative p-8 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-2 group-hover:text-neon-crimson transition-colors duration-300">
                      Quiz Arena
                    </h3>
                    <p className="text-on-surface-variant/80 font-body text-sm">
                      Test your knowledge and climb the ranks
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
                    Guardian
                  </span>
                </div>

                {/* Achievements */}
                <div className="flex gap-3 mb-6">
                  {["military_tech", "trophy", "stars"].map((icon) => (
                    <div
                      key={icon}
                      className="w-12 h-12 rounded-xl bg-surface-container-high/50 flex items-center justify-center border border-neon-crimson/10"
                    >
                      <span className="material-symbols-outlined text-neon-crimson text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                    </div>
                  ))}
                </div>

              {/* Image - Theme aware */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-surface-container-high/30">
                <img
                  src="/new_pic/websitelight.png"
                  alt="Quiz Arena"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    isDark 
                      ? "opacity-90 group-hover:opacity-100" 
                      : "opacity-70 group-hover:opacity-90 brightness-90"
                  }`}
                />
                {/* Dark overlay for light mode */}
                <div className={`absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-surface-container-lowest/20 to-transparent transition-opacity duration-500 ${
                  isDark ? "opacity-0" : "opacity-60"
                }`} />
              </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                      groups
                    </span>
                    <span>2,847 Players</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                      emoji_events
                    </span>
                    <span>Weekly Rewards</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-crimson to-neon-crimson/70 rounded-full group-hover:w-1/3 transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Rank Progression - Minimal */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mb-2">
                Your Path to Legend
              </h3>
              <p className="text-on-surface-variant font-body">
                Complete training modules to unlock new ranks
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm">
              {/* Rank Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { name: "Rookie", unlocked: true },
                  { name: "Guardian", unlocked: true, current: true },
                  { name: "Elite", unlocked: false },
                  { name: "Legend", unlocked: false },
                ].map((rank) => (
                  <div key={rank.name} className="flex flex-col items-center">
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ${
                      rank.unlocked ? "" : "grayscale opacity-60"
                    }`}>
                      <img 
                        src={`/ranks/${rank.name}.png`}
                        alt={rank.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* XP Badge - positioned outside image with proper spacing */}
                    {rank.current && (
                      <div className="mt-3 px-2 py-1 rounded-full text-[10px] font-headline font-bold bg-neon-crimson text-white whitespace-nowrap">
                        8,500 XP
                      </div>
                    )}
                    
                    <span className={`font-headline font-bold text-sm mt-1 ${
                      rank.unlocked ? "text-on-surface" : "text-on-surface-variant/50"
                    }`}>
                      {rank.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden mb-8">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-neon-crimson via-neon-crimson/80 to-neon-crimson/60" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { label: "Current Rank", value: "Guardian", icon: "shield" },
                  { label: "XP to Next", value: "1,500 XP", icon: "trending_up" },
                  { label: "Total XP", value: "8,500 XP", icon: "stars" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container-high/30 border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {stat.icon}
                    </span>
                    <div>
                      <p className="text-xs text-on-surface-variant font-body">{stat.label}</p>
                      <p className="font-headline font-bold text-on-surface text-sm">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="training" className="py-24 relative overflow-hidden">
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
            {t("badgeText", { defaultValue: "Level Up" })}
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        {/* Training Cards - Minimal Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Phishing Dojo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="group relative"
          >
            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                isDark
                  ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]"
                  : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/30 hover:shadow-[0_0_60px_rgba(77,0,255,0.15)]"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-2xl font-headline font-bold mb-2 transition-colors duration-300 ${
                    isDark
                      ? "text-on-surface group-hover:text-neon-crimson"
                      : "text-on-surface group-hover:text-neon-violet"
                  }`}>
                    {t("phishingDojo.title")}
                  </h3>
                  <p className="text-on-surface-variant/80 font-body text-sm">
                    {t("phishingDojo.subtitle")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-headline font-bold ${
                  isDark
                    ? "bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20"
                    : "bg-neon-violet/10 text-neon-violet border border-neon-violet/20"
                }`}>
                  {t("phishingDojo.status")}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className={`flex justify-between text-xs font-headline font-bold mb-2 tracking-wide ${
                  isDark ? "text-neon-crimson" : "text-neon-violet"
                }`}>
                  <span>{t("phishingDojo.xpLabel")}</span>
                  <span>{t("phishingDojo.xpProgress")}</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: themeHex }}
                  />
                </div>
              </div>

              {/* Image - Theme aware with dark styling */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-surface-container-high/30">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-full h-full"
                >
                  <img
                    src="/new_pic/websitedark.png"
                    alt={t("phishingDojo.title")}
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isDark 
                        ? "opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,10,84,0.3)]" 
                        : "opacity-70 group-hover:opacity-90 brightness-90 group-hover:drop-shadow-[0_0_20px_rgba(77,0,255,0.3)]"
                    }`}
                  />
                </motion.div>
                {/* Dark overlay for light mode */}
                <div className={`absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-surface-container-lowest/20 to-transparent transition-opacity duration-500 rounded-2xl ${
                  isDark ? "opacity-0" : "opacity-60"
                }`} />
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  <span>{t("phishingDojo.stats.levels")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    target
                  </span>
                  <span>{t("phishingDojo.stats.accuracy")}</span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/3 transition-all duration-500 ${
                isDark
                  ? "bg-gradient-to-r from-neon-crimson to-neon-crimson/70"
                  : "bg-gradient-to-r from-neon-violet to-neon-violet/70"
              }`} />

              {/* Corner accent */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDark ? "bg-neon-crimson" : "bg-neon-violet"
              }`} />
            </motion.div>
          </motion.div>

          {/* Quiz Arena */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative"
          >
            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                isDark
                  ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]"
                  : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/30 hover:shadow-[0_0_60px_rgba(77,0,255,0.15)]"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-2xl font-headline font-bold mb-2 transition-colors duration-300 ${
                    isDark
                      ? "text-on-surface group-hover:text-neon-crimson"
                      : "text-on-surface group-hover:text-neon-violet"
                  }`}>
                    {t("quizArena.title")}
                  </h3>
                  <p className="text-on-surface-variant/80 font-body text-sm">
                    {t("quizArena.subtitle")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-headline font-bold ${
                  isDark
                    ? "bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20"
                    : "bg-neon-violet/10 text-neon-violet border border-neon-violet/20"
                }`}>
                  {t("quizArena.rank")}
                </span>
              </div>

              {/* Achievements - Minimal */}
              <div className="flex gap-3 mb-6">
                {[
                  { icon: "military_tech" },
                  { icon: "trophy" },
                  { icon: "stars" },
                ].map((item, index) => (
                  <motion.div
                    key={item.icon}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      isDark
                        ? "bg-surface-container-high/50 border-neon-crimson/10"
                        : "bg-surface-container-high/50 border-neon-violet/10"
                    }`}
                  >
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Image - Theme aware with dark styling */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-surface-container-high/30">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-full h-full"
                >
                  <img
                    src="/new_pic/websitelight.png"
                    alt={t("quizArena.title")}
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isDark 
                        ? "opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,10,84,0.3)]" 
                        : "opacity-70 group-hover:opacity-90 brightness-90 group-hover:drop-shadow-[0_0_20px_rgba(77,0,255,0.3)]"
                    }`}
                  />
                </motion.div>
                {/* Dark overlay for light mode */}
                <div className={`absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-surface-container-lowest/20 to-transparent transition-opacity duration-500 rounded-2xl ${
                  isDark ? "opacity-0" : "opacity-60"
                }`} />
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                  <span>{t("quizArena.stats.players")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                  <span>{t("quizArena.stats.rewards")}</span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/3 transition-all duration-500 ${
                isDark
                  ? "bg-gradient-to-r from-neon-crimson to-neon-crimson/70"
                  : "bg-gradient-to-r from-neon-violet to-neon-violet/70"
              }`} />

              {/* Corner accent */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDark ? "bg-neon-crimson" : "bg-neon-violet"
              }`} />
            </motion.div>
          </motion.div>
        </div>

        {/* Rank Progression - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mb-2">
              {t("rankProgression.title")}
            </h3>
            <p className="text-on-surface-variant font-body">
              {t("rankProgression.subtitle")}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`relative p-8 rounded-3xl border backdrop-blur-sm ${
              isDark
                ? "bg-surface-container-low/50 border-outline-variant/10"
                : "bg-surface-container-low/70 border-outline-variant/20"
            }`}
          >
            {/* Rank Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { key: "rookie", name: t("rankProgression.ranks.rookie"), unlocked: true },
                { key: "guardian", name: t("rankProgression.ranks.guardian"), unlocked: true, current: true },
                { key: "elite", name: t("rankProgression.ranks.elite"), unlocked: false },
                { key: "legend", name: t("rankProgression.ranks.legend"), unlocked: false },
              ].map((rank, index) => (
                <motion.div 
                  key={rank.key}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={rank.unlocked ? { scale: 1.05 } : {}}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ${
                      rank.unlocked ? "" : "grayscale opacity-60"
                    }`}
                  >
                    <img 
                      src={`/ranks/${rank.key.charAt(0).toUpperCase() + rank.key.slice(1)}.png`}
                      alt={rank.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* XP Badge - positioned outside image with proper spacing */}
                  {rank.current && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className={`mt-3 px-2 py-1 rounded-full text-[10px] font-headline font-bold whitespace-nowrap ${
                        isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"
                      }`}
                    >
                      {t("rankProgression.stats.xpValue")}
                    </motion.div>
                  )}
                </div>
                  <span className={`font-headline font-bold text-sm ${
                    rank.unlocked ? "text-on-surface" : "text-on-surface-variant/50"
                  }`}>
                    {rank.name}
                  </span>
                  {!rank.unlocked && (
                    <span className="material-symbols-outlined text-xs mt-1 text-on-surface-variant/30">
                      lock
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden mb-8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "72%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ 
                  background: isDark 
                    ? "linear-gradient(90deg, #FF0A54 0%, #FF6B35 50%, #FFD700 100%)" 
                    : "linear-gradient(90deg, #4D00FF 0%, #9C27B0 50%, #FFD700 100%)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {[
                { label: t("rankProgression.stats.currentRank"), value: t("rankProgression.ranks.guardian"), icon: "shield" },
                { label: t("rankProgression.stats.xpToNext"), value: t("rankProgression.stats.xpToNextValue"), icon: "trending_up" },
                { label: t("rankProgression.stats.totalXP"), value: t("rankProgression.stats.totalXpValue"), icon: "stars" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                    isDark
                      ? "bg-surface-container-high/30 border-outline-variant/10"
                      : "bg-surface-container-high/50 border-outline-variant/20"
                  }`}
                >
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-xs text-on-surface-variant font-body">{stat.label}</p>
                    <p className="font-headline font-bold text-on-surface text-sm">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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
