"use client";

import { useTranslation } from "react-i18next";
import { useTheme } from "./components/theme-provider";
import CyberEffects from "./components/CyberEffects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ScreenshotGallery from "./components/ScreenshotGallery";
import Training from "./components/Training";
import AISidekick from "./components/AISidekick";
import AvatarShowcase from "./components/AvatarShowcase";
import FloatingAvatars from "./components/FloatingAvatars";
import Footer from "./components/Footer";

export default function Home() {
  const { t } = useTranslation("cta");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Prevent hydration mismatch by showing simpler version until mounted
  if (!mounted) {
    return (
      <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-primary/30 selection:text-primary relative">
        <CyberEffects />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <ScreenshotGallery />
          <Training />
          <AISidekick />
          <AvatarShowcase />
          <section id="cta" className="py-32 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <FloatingAvatars />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
            <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold mb-6 text-on-surface">
                Start Your Training Today
              </h2>
              <p className="text-lg sm:text-xl text-on-surface-variant mb-10 font-body max-w-xl mx-auto">
                Join thousands of young defenders securing the digital frontier. 
                Free to download, easy to master.
              </p>
              <a
                href="https://files.catbox.moe/sjgmlz.zip"
                target="_blank"
                rel="noopener noreferrer"
                className="glitch-button bg-gradient-to-br from-neon-crimson to-neon-crimson/80 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-headline font-bold text-lg kinetic-button shadow-[0_0_25px_rgba(255,10,84,0.4)] hover:scale-105 transition-transform inline-block"
              >
                <span className="glitch-text" data-text="Get CHEA for Windows">Get CHEA for Windows</span>
              </a>
              <div className="mt-8 flex justify-center gap-4 text-on-surface-variant font-body text-sm tracking-wide">
                <span>Latest: v1.0.4</span>
                <span className="text-neon-crimson">•</span>
                <span>Verified Secure</span>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-primary/30 selection:text-primary relative">
      {/* Global Cyber Effects */}
      <CyberEffects />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Features / Gadgets */}
        <Features />

        {/* App Gallery */}
        <ScreenshotGallery />

        {/* Training Grounds */}
        <Training />

        {/* AI Sidekick */}
        <AISidekick />

        {/* Avatar Showcase */}
        <AvatarShowcase />

        {/* Final CTA */}
        <section id="cta" className="py-32 text-center relative overflow-hidden">
          {/* Floating Avatars for CTA Section */}
          <div className="absolute inset-0">
            <FloatingAvatars />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold mb-6 text-on-surface">
              {t("title")}
            </h2>
            <p className="text-lg sm:text-xl text-on-surface-variant mb-10 font-body max-w-xl mx-auto">
              {t("description")}
            </p>
            
            <a
              href="https://files.catbox.moe/sjgmlz.zip"
              target="_blank"
              rel="noopener noreferrer"
              className={`glitch-button group bg-gradient-to-br text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-headline font-bold text-lg kinetic-button hover:scale-105 transition-transform inline-block ${
                isDark
                  ? "from-neon-crimson to-neon-crimson/80 shadow-[0_0_25px_rgba(255,10,84,0.4)] hover:shadow-[0_0_35px_rgba(255,10,84,0.6)]"
                  : "from-neon-violet to-neon-violet/80 shadow-[0_0_25px_rgba(77,0,255,0.4)] hover:shadow-[0_0_35px_rgba(77,0,255,0.6)]"
              }`}
            >
              <span className="glitch-text" data-text={t("button")}>{t("button")}</span>
            </a>
            
            <div className="mt-8 flex justify-center gap-4 text-on-surface-variant font-body text-sm tracking-wide">
              <span>{t("latest")}</span>
              <span className={isDark ? "text-neon-crimson" : "text-neon-violet"}>•</span>
              <span>{t("verified")}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
