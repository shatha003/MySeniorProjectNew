"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

export default function AISidekick() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Static version for SSR
  if (!mounted) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="glass-hud rounded-[3rem] p-8 sm:p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-crimson/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-crimson/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* AI Character */}
              <div className="flex flex-col items-center md:items-start">
                {/* Avatar Circle with Glow */}
                <div className="relative mb-6">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-crimson/30 to-neon-violet/30 blur-2xl scale-150" />
                  
                  {/* Avatar Container */}
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-surface-container-high ring-4 ring-neon-crimson/20 flex items-center justify-center overflow-hidden">
                    <img
                      src="/Support agent..webp"
                      alt="AI Support Agent"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-surface">
                    <div className="w-3 h-3 bg-neon-crimson rounded-full animate-pulse" />
                  </div>
                </div>

                {/* AI Name */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
                    C.H.E.A.I.
                  </h3>
                  <p className="text-sm text-on-surface-variant font-body">
                    Cybernetic Helper & Educational AI
                  </p>
                </div>
              </div>

              {/* Speech Bubble Content */}
              <div className="relative">
                {/* Comic Speech Bubble */}
                <div className="comic-bubble relative">
                  <p className="text-lg leading-relaxed font-comic">
                    "Hey there! I'm your AI sidekick. I'm here 24/7 to help you analyze suspicious links, 
                    answer security questions, and give you tactical advice for staying safe online. 
                    Think of me as your personal cybersecurity coach!"
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: "chat", text: "Instant Answers" },
                    { icon: "link", text: "Link Analysis" },
                    { icon: "school", text: "Security Tips" },
                    { icon: "support_agent", text: "24/7 Support" },
                  ].map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 text-sm text-on-surface-variant font-body"
                    >
                      <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {feature.icon}
                      </span>
                      {feature.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-hud rounded-[3rem] p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Background Decorations */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none ${isDark ? "bg-neon-crimson/5" : "bg-neon-violet/5"}`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none ${isDark ? "bg-neon-crimson/5" : "bg-neon-violet/5"}`} />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* AI Character */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center md:items-start"
            >
              {/* Avatar Circle with Glow */}
              <motion.div
                className="relative mb-6"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-2xl scale-150 ${isDark ? "bg-gradient-to-br from-neon-crimson/30 to-neon-crimson/20" : "bg-gradient-to-br from-neon-violet/30 to-neon-violet/20"}`} />
                
                {/* Avatar Container */}
                <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-surface-container-high ring-4 flex items-center justify-center overflow-hidden ${isDark ? "ring-neon-crimson/20" : "ring-neon-violet/20"}`}>
                  <img
                    src="/Support agent..webp"
                    alt="AI Support Agent"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-surface">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} />
                </div>
              </motion.div>

              {/* AI Name */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
                  C.H.E.A.I.
                </h3>
                <p className="text-sm text-on-surface-variant font-body">
                  Cybernetic Helper & Educational AI
                </p>
              </div>
            </motion.div>

            {/* Speech Bubble Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              {/* Comic Speech Bubble */}
              <div className="comic-bubble relative">
                <p className="text-lg leading-relaxed font-comic">
                  "Hey there! I'm your AI sidekick. I'm here 24/7 to help you analyze suspicious links, 
                  answer security questions, and give you tactical advice for staying safe online. 
                  Think of me as your personal cybersecurity coach!"
                </p>
              </div>

              {/* Features List */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: "chat", text: "Instant Answers" },
                  { icon: "link", text: "Link Analysis" },
                  { icon: "school", text: "Security Tips" },
                  { icon: "support_agent", text: "24/7 Support" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 text-sm text-on-surface-variant font-body"
                  >
                    <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {feature.icon}
                    </span>
                    {feature.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
