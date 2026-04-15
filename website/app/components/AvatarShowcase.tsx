"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";

const featuredAvatars = [
  { id: 1, name: "Agent Neon" },
  { id: 5, name: "Cyber Wolf" },
  { id: 8, name: "Tech Ninja" },
  { id: 12, name: "Data Drake" },
  { id: 15, name: "Net Runner" },
  { id: 17, name: "Byte Master" },
];

export default function AvatarShowcase() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Static version for SSR
  if (!mounted) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
              Choose Your Agent
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-xl mx-auto">
              Customize your digital identity. Pick an avatar that represents your cybersecurity style.
            </p>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {featuredAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className="group relative cursor-pointer"
              >
                {/* Avatar Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low border-2 border-outline-variant/10 transition-all duration-300 group-hover:border-neon-crimson/30 group-hover:shadow-[0_0_30px_rgba(255,10,84,0.2)]">
                  <img
                    src={`/avatars/avatar${avatar.id}.png`}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Avatar Name */}
                <p className="text-center mt-3 text-sm font-body font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {avatar.name}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: "17", label: "Unique Avatars" },
              { value: "∞", label: "Customization" },
              { value: "100%", label: "Free" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-headline font-bold text-neon-crimson">
                  {stat.value}
                </span>
                <span className="text-sm text-on-surface-variant font-body">
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
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-headline font-bold mb-4 text-on-surface">
            Choose Your Agent
          </h2>
          <p className="text-on-surface-variant font-body text-lg max-w-xl mx-auto">
            Customize your digital identity. Pick an avatar that represents your cybersecurity style.
          </p>
        </motion.div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {featuredAvatars.map((avatar, index) => (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              className="group relative cursor-pointer"
            >
              {/* Avatar Container */}
              <div className={`
                relative aspect-square rounded-2xl overflow-hidden 
                bg-surface-container-low border-2 border-outline-variant/10
                transition-all duration-300 
                ${isDark 
                  ? "group-hover:border-neon-crimson/30 group-hover:shadow-[0_0_30px_rgba(255,10,84,0.2)]" 
                  : "group-hover:border-neon-violet/30 group-hover:shadow-[0_0_30px_rgba(77,0,255,0.2)]"
                }
              `}>
                <img
                  src={`/avatars/avatar${avatar.id}.png`}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Avatar Name */}
              <motion.p
                className="text-center mt-3 text-sm font-body font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                {avatar.name}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { value: "17", label: "Unique Avatars" },
            { value: "∞", label: "Customization" },
            { value: "100%", label: "Free" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className={`text-2xl font-headline font-bold ${isDark ? "text-neon-crimson" : "text-neon-violet"}`}>
                {stat.value}
              </span>
              <span className="text-sm text-on-surface-variant font-body">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
