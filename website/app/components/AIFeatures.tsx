"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme-provider";

const aiIcons = [
  "smart_toy",
  "alternate_email",
  "analytics",
  "psychology",
  "rocket_launch",
  "shield_person",
];

export default function AIFeatures() {
  const { t } = useTranslation("ai-features");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const features = Array.from({ length: 6 }, (_, i) => ({
    icon: aiIcons[i],
    title: t(`features.${i}.title`),
    description: t(`features.${i}.description`),
    tag: t(`features.${i}.tag`),
  }));

  const staticFeatures = [
    { icon: "smart_toy", title: "Nova AI Chatbot", description: "Your personal cybersecurity expert. Ask anything about threats, passwords, or online safety — Nova streams real-time answers with code examples and diagrams.", tag: "AI" },
    { icon: "alternate_email", title: "AI Phishing Generator", description: "AI crafts unique, never-seen-before phishing emails in real-time. Train against an infinite library of AI-generated scams across 3 difficulty tiers.", tag: "AI" },
    { icon: "analytics", title: "AI Scan Analysis", description: "After every link or file scan, Nova breaks down the results in plain language — what was detected, how risky it is, and what you should do next.", tag: "AI" },
    { icon: "psychology", title: "AI Attack Narrative", description: "Check a password and watch Nova stage a dramatic hacker attack simulation — will your password survive? Learn through thrilling storytelling.", tag: "AI" },
    { icon: "rocket_launch", title: "AI Scenario Simulator", description: "Face 5 rounds of AI-generated security dilemmas. Make choices, face consequences, and learn from realistic cybersecurity scenarios in real-time.", tag: "AI" },
    { icon: "shield_person", title: "AI Security Posture", description: "Answer a security questionnaire and get a comprehensive AI-powered report card — your grade, vulnerabilities, and a personalized action plan.", tag: "AI" },
  ];

  if (!mounted) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-crimson/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
              AI POWERED
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
              AI Superpowers
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
              Meet Nova — your AI-powered cybersecurity sidekick
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staticFeatures.map((feature) => (
              <div key={feature.title} className="group relative">
                <div className="relative p-6 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-crimson/10 flex items-center justify-center border border-neon-crimson/20">
                      <span className="material-symbols-outlined text-neon-crimson text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {feature.icon}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-headline font-bold bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20 uppercase tracking-wider">
                      AI
                    </span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-neon-crimson transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed font-body">
                    {feature.description}
                  </p>
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
    <section className="py-24 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none ${
        isDark ? "via-neon-crimson/3" : "via-neon-violet/3"
      } to-transparent`} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
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
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 border ${
              isDark
                ? "bg-neon-crimson/10 text-neon-crimson border-neon-crimson/20"
                : "bg-neon-violet/10 text-neon-violet border-neon-violet/20"
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            {t("badgeText")}
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative p-6 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                  isDark
                    ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/30 hover:shadow-[0_0_60px_rgba(255,10,84,0.15)]"
                    : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/30 hover:shadow-[0_0_60px_rgba(77,0,255,0.15)]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isDark
                        ? "bg-neon-crimson/10 border-neon-crimson/20"
                        : "bg-neon-violet/10 border-neon-violet/20"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {feature.icon}
                    </span>
                  </motion.div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider ${
                    isDark
                      ? "bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20"
                      : "bg-neon-violet/10 text-neon-violet border border-neon-violet/20"
                  }`}>
                    {feature.tag}
                  </span>
                </div>

                <h3 className={`text-xl font-headline font-bold mb-2 transition-colors duration-300 ${
                  isDark
                    ? "text-on-surface group-hover:text-neon-crimson"
                    : "text-on-surface group-hover:text-neon-violet"
                }`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant/80 leading-relaxed font-body">
                  {feature.description}
                </p>

                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/3 transition-all duration-500 ${
                  isDark
                    ? "bg-gradient-to-r from-neon-crimson to-neon-crimson/70"
                    : "bg-gradient-to-r from-neon-violet to-neon-violet/70"
                }`} />

                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isDark ? "bg-neon-crimson" : "bg-neon-violet"
                }`} />

                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  isDark
                    ? "bg-gradient-to-br from-neon-crimson/5 via-transparent to-neon-crimson/5"
                    : "bg-gradient-to-br from-neon-violet/5 via-transparent to-neon-violet/5"
                }`} />
              </motion.div>
            </motion.div>
          ))}
        </div>

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
