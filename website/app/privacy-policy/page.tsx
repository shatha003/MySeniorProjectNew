"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTheme } from "../components/theme-provider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CyberEffects from "../components/CyberEffects";

interface BoldItem {
  bold: string;
  text: string;
}

interface TextItem {
  text: string;
}

type ListItem = BoldItem | TextItem;

export default function PrivacyPolicyPage() {
  const { t } = useTranslation("privacy");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sections = [
    {
      title: t("sections.0.title"),
      content: t("sections.0.content"),
      items: t("sections.0.items", { returnObjects: true }) as BoldItem[]
    },
    {
      title: t("sections.1.title"),
      content: t("sections.1.content"),
      items: t("sections.1.items", { returnObjects: true }) as TextItem[]
    },
    {
      title: t("sections.2.title"),
      content: t("sections.2.content"),
    },
    {
      title: t("sections.3.title"),
      content: t("sections.3.content"),
      items: t("sections.3.items", { returnObjects: true }) as TextItem[]
    },
    {
      title: t("sections.4.title"),
      content: t("sections.4.content"),
    },
    {
      title: t("sections.5.title"),
      content: t("sections.5.content"),
      items: t("sections.5.items", { returnObjects: true }) as TextItem[]
    },
    {
      title: t("sections.6.title"),
      content: t("sections.6.content"),
    },
    {
      title: t("sections.7.title"),
      content: t("sections.7.content"),
    },
    {
      title: t("sections.8.title"),
      content: t("sections.8.content"),
    },
  ];

  // Style helper functions to avoid complex template literals
  const getBgGradient = () => isDark ? "bg-[#FF0A54]" : "bg-[#4D00FF]";
  const getBgGradientAlt = () => isDark ? "bg-[#4D00FF]" : "bg-[#FF0A54]";
  const getTextColor = () => isDark ? "text-[#FF0A54]" : "text-[#4D00FF]";
  const getBorderColor = () => isDark ? "border-[#FF0A54]" : "border-[#4D00FF]";
  const getBgLight = () => isDark ? "bg-[#FF0A54]/10" : "bg-[#4D00FF]/10";
  const getBorderLight = () => isDark ? "border-[#FF0A54]/20" : "border-[#4D00FF]/20";
  const getBorderMedium = () => isDark ? "border-[#FF0A54]/30" : "border-[#4D00FF]/30";
  
  // Text color helpers
  const getHeadingColor = () => isDark ? "text-white" : "text-gray-900";
  const getBodyTextColor = () => isDark ? "text-gray-400" : "text-gray-600";
  const getMutedTextColor = () => isDark ? "text-gray-500" : "text-gray-500";

  return (
    <div className="min-h-screen bg-[#0d0d15] text-[#f2effb] font-body relative overflow-x-hidden">
      <CyberEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${getBgGradient()}`} />
          <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 ${getBgGradientAlt()}`} />
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header Card */}
            <div className={`relative rounded-2xl border backdrop-blur-xl p-8 sm:p-12 ${getBgLight()} ${getBorderLight()} shadow-[0_0_60px_rgba(0,0,0,0.1)]`}>
              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 opacity-30 bg-gradient-to-bl ${isDark ? "from-[#FF0A54]" : "from-[#4D00FF]"} to-transparent`} style={{ borderTopRightRadius: '1rem' }} />
              
              <div className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-headline font-bold tracking-wider mb-6 border ${getBgLight()} ${getTextColor()} ${getBorderMedium()}`}
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${getBgGradient()}`} />
                  {t("documentLabel")}
                </motion.div>
                
                <h1 className={`font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${getTextColor()}`}>
                  {t("pageTitle")}
                </h1>
                <p className={`${getMutedTextColor()} font-body text-sm sm:text-base`}>
                  {t("lastUpdated")}
                </p>
              </div>
            </div>

            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`rounded-xl border backdrop-blur-md p-6 ${isDark ? "bg-[#13131c]/60 border-white/5" : "bg-white/60 border-black/5"}`}
            >
              <p className={`${getBodyTextColor()} leading-relaxed text-center`}>
                {t("introduction")}
              </p>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${isDark ? "bg-[#191923]/60 border-white/5 hover:" + getBorderLight() : "bg-white/60 border-black/5 hover:" + getBorderLight()} hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-headline font-bold text-lg ${getBgLight()} ${getTextColor()} ${getBorderLight()}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className={`font-headline text-xl font-bold mb-3 ${getHeadingColor()}`}>
                        {section.title}
                      </h2>
                      <p className={`${getBodyTextColor()} leading-relaxed text-sm sm:text-base mb-4`}>
                        {section.content}
                      </p>
                      {section.items && (
                        <ul className="space-y-3">
                          {section.items.map((item, i) => (
                            <li key={i} className={`flex items-start gap-3 ${getBodyTextColor()} text-sm sm:text-base`}>
                              <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${getBgGradient()}`} />
                              <span>
                                {'bold' in item && (item as BoldItem).bold && (
                                  <strong className={getHeadingColor()}>
                                    {(item as BoldItem).bold}
                                  </strong>
                                )}
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className={`rounded-2xl border backdrop-blur-xl p-8 text-center ${isDark ? "bg-gradient-to-br from-[#FF0A54]/10 to-[#4D00FF]/10" : "bg-gradient-to-br from-[#4D00FF]/10 to-[#FF0A54]/10"} ${getBorderLight()}`}
            >
              <h3 className={`font-headline text-2xl font-bold mb-3 ${getHeadingColor()}`}>
                {t("contactCTA.title")}
              </h3>
              <p className={`${getBodyTextColor()} mb-6`}>
                {t("contactCTA.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:support@chea-security.com"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-headline font-semibold text-sm transition-all duration-300 ${getBgGradient()} text-white hover:opacity-90 shadow-[0_0_20px_rgba(0,0,0,0.2)]`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {t("contactCTA.contactButton")}
                </Link>
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-headline font-semibold text-sm transition-all duration-300 border ${getBorderMedium()} ${getTextColor()} ${getBgLight()} hover:opacity-80`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  {t("contactCTA.backButton")}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
