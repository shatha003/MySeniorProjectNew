"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

export default function Training() {
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
              Don't just use tools. Master the skills.
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
                    Spot the traps, dodge the bait.
                  </p>
                </div>
                <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                  ELITE STATUS
                </div>
              </div>

              <div className="mb-8">
                <div className={`flex justify-between text-xs font-headline font-bold mb-2 tracking-wide ${
                  isDark ? "text-neon-crimson" : "text-neon-violet"
                }`}>
                  <span>MASTERY XP</span>
                  <span>850 / 1000</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: "85%", background: isDark ? "#FF0A54" : "#4D00FF" }} />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
                <img
                  src="/new_pic/websitedark.png"
                  alt="Phishing Dojo Interface"
                  className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
                />
              </div>

                <div className="flex gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      military_tech
                    </span>
                    <span>12 Levels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      target
                    </span>
                    <span>98% Accuracy</span>
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
                    Duel with friends, climb the ladder.
                  </p>
                </div>
                <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                  RANK: GUARDIAN
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
                    className={`w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border ${
                      isDark ? "border-neon-crimson/20" : "border-neon-violet/20"
                    }`}
                  >
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
                <img
                  src="/new_pic/websitelight.jpeg"
                  alt="Quiz Arena Interface"
                  className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                  <span>500+ Players</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                  <span>Weekly Rewards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rank Progression Bar - Static */}
          <div className="mt-12 glass-hud p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-headline font-bold text-on-surface-variant tracking-wide">
                RANK PROGRESSION
              </span>
              <span className={`text-sm font-headline font-bold ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>
                Guardian → Elite
              </span>
            </div>
            <div className="relative">
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className={`h-full w-[72%] rounded-full ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} />
              </div>
              <div className="flex justify-between mt-3 text-xs font-body text-on-surface-variant">
                <span>Rookie</span>
                <span>Guardian</span>
                <span>Elite</span>
                <span>Legend</span>
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
            Training Grounds
          </h2>
          <p className="text-on-surface-variant font-body text-lg">
            Don't just use tools. Master the skills.
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
                  Phishing Dojo
                </h3>
                <p className="text-on-surface-variant font-body">
                  Spot the traps, dodge the bait.
                </p>
              </div>
              <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                ELITE STATUS
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-8">
              <div className={`flex justify-between text-xs font-headline font-bold mb-2 tracking-wide ${
                isDark ? "text-neon-crimson" : "text-neon-violet"
              }`}>
                <span>MASTERY XP</span>
                <span>850 / 1000</span>
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
                alt="Phishing Dojo Interface"
                className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
                <span>12 Levels</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  target
                </span>
                <span>98% Accuracy</span>
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
                  Quiz Arena
                </h3>
                <p className="text-on-surface-variant font-body">
                  Duel with friends, climb the ladder.
                </p>
              </div>
                <div className={`${isDark ? "bg-neon-crimson text-white" : "bg-neon-violet text-white"} px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wide`}>
                  RANK: GUARDIAN
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
                alt="Quiz Arena Interface"
                className="w-full h-48 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  groups
                </span>
                <span>500+ Players</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
                <span>Weekly Rewards</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rank Progression Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 glass-hud p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-headline font-bold text-on-surface-variant tracking-wide">
              RANK PROGRESSION
            </span>
            <span className={`text-sm font-headline font-bold ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>
              Guardian → Elite
            </span>
          </div>
          <div className="relative">
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "72%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: isDark ? "#FF0A54" : "#4D00FF" }}
              />
            </div>
            {/* Rank Markers */}
            <div className="flex justify-between mt-3 text-xs font-body text-on-surface-variant">
              <span>Rookie</span>
              <span>Guardian</span>
              <span>Elite</span>
              <span>Legend</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
