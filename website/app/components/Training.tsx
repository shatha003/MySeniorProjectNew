"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";

export default function Training() {
  const { t } = useTranslation("training");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Static version for SSR
  if (!mounted) {
    return (
      <section id="training" className="py-24 bg-surface-container-lowest relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-headline font-extrabold mb-4 text-on-surface">
              Training Grounds
            </h2>
            <p className="text-on-surface-variant font-body text-lg">
              Level up your cyber skills through hands-on challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Phishing Dojo - Static */}
            <div className="glass-hud p-8 sm:p-10 rounded-3xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-on-surface">
                    Phishing Dojo
                  </h3>
                  <p className="text-on-surface-variant font-body">
                    Master the art of spotting fake emails and scams
                  </p>
                </div>
                <div className="bg-neon-crimson text-white px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide">
                  Active
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-xs font-headline font-bold mb-2 tracking-wide text-neon-crimson">
                  <span>XP PROGRESS</span>
                  <span>8,500 / 10,000</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: "85%", background: "#FF0A54" }} />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
                <img
                  src="/new_pic/websitedark.png"
                  alt="Phishing Dojo"
                  className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
                />
              </div>

                <div className="flex gap-4 mt-6">
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
            </div>

            {/* Quiz Arena - Static */}
            <div className="glass-hud p-8 sm:p-10 rounded-3xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-on-surface">
                    Quiz Arena
                  </h3>
                  <p className="text-on-surface-variant font-body">
                    Test your knowledge and climb the ranks
                  </p>
                </div>
                <div className="bg-neon-crimson text-white px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide">
                  Rank: Guardian
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                {[
                  { icon: "military_tech" },
                  { icon: "trophy" },
                  { icon: "stars" },
                ].map((item) => (
                  <div
                    key={item.icon}
                    className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-neon-crimson/20"
                  >
                    <span className="material-symbols-outlined text-neon-crimson text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
                <img
                  src="/new_pic/websitelight.jpeg"
                  alt="Quiz Arena"
                  className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
                />
              </div>

              <div className="flex gap-4 mt-6">
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
            </div>
          </div>

          {/* Rank Progression - Static */}
          <div className="mt-16">
            {/* Title */}
            <div className="text-center mb-10">
              <h3 className="text-3xl sm:text-4xl font-headline font-extrabold text-on-surface mb-2">
                <span className="inline-flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ 
                      fontVariationSettings: "'FILL' 1",
                      color: "#FF0A54"
                    }}
                  >
                    stars
                  </span>
                  Your Path to Legend
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ 
                      fontVariationSettings: "'FILL' 1",
                      color: "#FF0A54"
                    }}
                  >
                    stars
                  </span>
                </span>
              </h3>
              <p className="text-on-surface-variant font-body text-lg">
                Complete training modules to unlock new ranks and rewards
              </p>
            </div>

            {/* Rank Path Container */}
            <div className="glass-hud p-8 sm:p-12 rounded-3xl relative overflow-hidden">
              {/* Rank Nodes */}
              <div className="relative">
                {/* Rank Cards Row - Above the line */}
                <div className="relative grid grid-cols-4 gap-4 sm:gap-8 z-20 mb-8">
                  {[
                    { 
                      name: "Rookie", 
                      color: "#6B7280",
                      unlocked: true,
                    },
                    { 
                      name: "Guardian", 
                      color: "#FF0A54",
                      unlocked: true,
                      current: true
                    },
                    { 
                      name: "Elite", 
                      color: "#FFD700",
                      unlocked: false,
                    },
                    { 
                      name: "Legend", 
                      color: "#FF0A54",
                      unlocked: false,
                    },
                  ].map((rank) => (
                    <div
                      key={rank.name}
                      className="flex flex-col items-center"
                    >
                      {/* Rank Badge with Image */}
                      <div
                        className={`relative z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-3 overflow-hidden ${
                          rank.unlocked 
                            ? "" 
                            : "grayscale opacity-80"
                        }`}
                      >
                        <img 
                          src={`/ranks/${rank.name === "Guardian" ? "Guardian" : rank.name}.png`}
                          alt={rank.name}
                          className={`w-full h-full object-cover`}
                        />

                        {/* XP Badge for current rank */}
                        {rank.current && (
                          <div
                            className="absolute -bottom-2 px-2 py-0.5 rounded-full text-xs font-headline font-bold bg-primary-container text-on-primary-container"
                          >
                            8,500 XP
                          </div>
                        )}
                      </div>

                      {/* Rank Name */}
                      <span 
                        className={`font-headline font-bold text-sm sm:text-base ${
                          rank.unlocked 
                            ? "text-on-surface" 
                            : "text-on-surface-variant/50"
                        }`}
                      >
                      {rank.name}
                      </span>

                      {/* Lock icon for locked ranks */}
                      {!rank.unlocked && (
                        <span className="material-symbols-outlined text-sm mt-1 text-on-surface-variant/30">
                          lock
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Connection Path - Below the badges */}
                <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden z-0 mt-2">
                  <div
                    className="h-full w-[72%] rounded-full"
                    style={{ 
                      background: "linear-gradient(90deg, #FF0A54 0%, #FF6B35 50%, #FFD700 100%)"
                    }}
                  />
                </div>
              </div>

              {/* Progress Stats */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
                {[
                  { label: "Current Rank", value: "Guardian", icon: "shield" },
                  { label: "XP to Next", value: "1,500 XP", icon: "trending_up" },
                  { label: "Total XP", value: "8,500 XP", icon: "stars" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-container-high/50 border border-surface-variant/20"
                  >
                    <span 
                      className="material-symbols-outlined text-xl"
                      style={{ 
                        fontVariationSettings: "'FILL' 1",
                        color: "#FF0A54"
                      }}
                    >
                      {stat.icon}
                    </span>
                    <div>
                      <p className="text-xs text-on-surface-variant font-body">{stat.label}</p>
                      <p className="font-headline font-bold text-on-surface">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Motivational Message */}
              <div className="mt-8 text-center">
                <p className="font-comic text-lg text-on-surface-variant/60 italic">
                  "Only 1,500 XP until you reach Elite status!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="training" className="py-24 bg-surface-container-lowest relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-headline font-extrabold mb-4 text-on-surface">
            {t("sectionTitle")}
          </h2>
          <p className="text-on-surface-variant font-body text-lg">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        {/* Training Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Phishing Dojo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="glass-hud p-8 sm:p-10 rounded-3xl relative overflow-hidden group"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-on-surface">
                  {t("phishingDojo.title")}
                </h3>
                <p className="text-on-surface-variant font-body">
                  {t("phishingDojo.subtitle")}
                </p>
              </div>
              <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                {t("phishingDojo.status")}
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-8">
              <div className={`flex justify-between text-xs font-headline font-bold mb-2 tracking-wide ${
                isDark ? "text-neon-crimson" : "text-neon-violet"
              }`}>
                <span>{t("phishingDojo.xpLabel")}</span>
                <span>{t("phishingDojo.xpProgress")}</span>
              </div>
              <div className="xp-bar">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="xp-fill"
                  style={{ background: isDark ? "#FF0A54" : "#4D00FF" }}
                />
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
              <img
                src="/new_pic/websitedark.png"
                alt={t("phishingDojo.title")}
                className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 mt-6">
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
          </motion.div>

          {/* Quiz Arena */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="glass-hud p-8 sm:p-10 rounded-3xl relative overflow-hidden group"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-on-surface">
                  {t("quizArena.title")}
                </h3>
                <p className="text-on-surface-variant font-body">
                  {t("quizArena.subtitle")}
                </p>
              </div>
                <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                  {t("quizArena.rank")}
                </div>
              </div>

              {/* Achievement Icons */}
              <div className="flex gap-4 mb-8">
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
                    className={`w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border ${
                      isDark ? "border-neon-crimson/20" : "border-neon-violet/20"
                    }`}
                  >
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </motion.div>
                ))}
              </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
              <img
                src="/new_pic/websitelight.jpeg"
                alt={t("quizArena.title")}
                className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 mt-6">
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
          </motion.div>
        </div>

        {/* Rank Progression - Exciting & Playful Redesign */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          {/* Title with sparkle effect */}
          <motion.div 
            className="text-center mb-10"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-3xl sm:text-4xl font-headline font-extrabold text-on-surface mb-2">
              <span className="inline-flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="material-symbols-outlined text-4xl"
                  style={{ 
                    fontVariationSettings: "'FILL' 1",
                    color: isDark ? "#FF0A54" : "#4D00FF"
                  }}
                >
                  stars
                </motion.span>
                {t("rankProgression.title")}
                <motion.span
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="material-symbols-outlined text-4xl"
                  style={{ 
                    fontVariationSettings: "'FILL' 1",
                    color: isDark ? "#FF0A54" : "#4D00FF"
                  }}
                >
                  stars
                </motion.span>
              </span>
            </h3>
            <p className="text-on-surface-variant font-body text-lg">
              {t("rankProgression.subtitle")}
            </p>
          </motion.div>

          {/* Rank Path Container */}
          <div className="glass-hud p-8 sm:p-12 rounded-3xl relative overflow-hidden">
            {/* Background animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${isDark ? "bg-neon-crimson/30" : "bg-neon-violet/30"}`}
                  animate={{
                    y: [0, -100, 0],
                    x: [0, Math.sin(i) * 30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${15 + i * 15}%`,
                    bottom: "20%",
                  }}
                />
              ))}
            </div>

            {/* Rank Nodes */}
            <div className="relative">
              {/* Rank Cards Row - Above the line */}
              <div className="relative grid grid-cols-4 gap-4 sm:gap-8 z-20 mb-8">
              {[
                { 
                  key: "rookie",
                  name: t("rankProgression.ranks.rookie"), 
                  color: isDark ? "#6B7280" : "#9CA3AF",
                  unlocked: true,
                  position: 0
                },
                { 
                  key: "guardian",
                  name: t("rankProgression.ranks.guardian"), 
                  color: "#FF0A54",
                  unlocked: true,
                  position: 72,
                  current: true
                },
                { 
                  key: "elite",
                  name: t("rankProgression.ranks.elite"), 
                  color: "#FFD700",
                  unlocked: false,
                  position: 100
                },
                { 
                  key: "legend",
                  name: t("rankProgression.ranks.legend"), 
                  color: "#FF0A54",
                  unlocked: false,
                  position: 100
                },
              ].map((rank, index) => (
                <motion.div
                  key={rank.key}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  {/* Rank Badge with Image */}
                  <motion.div
                    whileHover={rank.unlocked ? { scale: 1.1, y: -5 } : {}}
                    className={`relative z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-3 overflow-hidden transition-all duration-300 ${
                      rank.unlocked 
                        ? "" 
                        : "grayscale opacity-80"
                    }`}
                  >
                    <img 
                      src={`/ranks/${rank.key.charAt(0).toUpperCase() + rank.key.slice(1)}.png`}
                      alt={rank.name}
                      className={`w-full h-full object-cover`}
                    />
                  </motion.div>

                    {/* Rank Name */}
                    <span 
                      className={`font-headline font-bold text-sm sm:text-base ${
                        rank.unlocked 
                          ? "text-on-surface" 
                          : "text-on-surface-variant/50"
                      }`}
                    >
                      {rank.name}
                    </span>

                    {/* XP Badge for current rank */}
                    {rank.current && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                        className="mt-2 px-3 py-1 rounded-full text-xs font-headline font-bold bg-primary-container text-on-primary-container"
                        whileHover={{ scale: 1.1 }}
                      >
                        {t("rankProgression.stats.xpValue")}
                      </motion.div>
                    )}

                    {/* Lock icon for locked ranks */}
                    {!rank.unlocked && (
                      <motion.span 
                        className="material-symbols-outlined text-sm mt-1 text-on-surface-variant/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        lock
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Connection Path - Below the badges */}
              <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden z-0 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full relative"
                  style={{ 
                    background: isDark 
                      ? "linear-gradient(90deg, #FF0A54 0%, #FF6B35 50%, #FFD700 100%)" 
                      : "linear-gradient(90deg, #4D00FF 0%, #9C27B0 50%, #FFD700 100%)"
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Progress Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10"
            >
              {[
                { label: t("rankProgression.stats.currentRank"), value: t("rankProgression.ranks.guardian"), icon: "shield" },
                { label: t("rankProgression.stats.xpToNext"), value: t("rankProgression.stats.xpToNextValue"), icon: "trending_up" },
                { label: t("rankProgression.stats.totalXP"), value: t("rankProgression.stats.totalXpValue"), icon: "stars" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-container-high/50 border border-surface-variant/20"
                >
                  <span 
                    className="material-symbols-outlined text-xl"
                    style={{ 
                      fontVariationSettings: "'FILL' 1",
                      color: isDark ? "#FF0A54" : "#4D00FF"
                    }}
                  >
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-xs text-on-surface-variant font-body">{stat.label}</p>
                    <p className="font-headline font-bold text-on-surface">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 }}
              className="mt-8 text-center"
            >
              <p className="font-comic text-lg text-on-surface-variant/60 italic">
                "{t("rankProgression.motivationalMessage")}"
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
