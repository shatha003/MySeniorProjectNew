"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "../components/theme-provider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CyberEffects from "../components/CyberEffects";
import ScreenshotGallery from "../components/ScreenshotGallery";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  cv: string;
}

export default function AboutPage() {
  const { t } = useTranslation("about");
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const getBgGradient = () => (isDark ? "bg-[#FF0A54]" : "bg-[#4D00FF]");
  const getTextColor = () => (isDark ? "text-[#FF0A54]" : "text-[#4D00FF]");
  const getBorderColor = () => (isDark ? "border-[#FF0A54]" : "border-[#4D00FF]");
  const getBgLight = () => (isDark ? "bg-[#FF0A54]/10" : "bg-[#4D00FF]/10");
  const getBorderLight = () => (isDark ? "border-[#FF0A54]/20" : "border-[#4D00FF]/20");
  const getBorderMedium = () => (isDark ? "border-[#FF0A54]/30" : "border-[#4D00FF]/30");
  const getHeadingColor = () => (isDark ? "text-white" : "text-gray-900");
  const getBodyTextColor = () => (isDark ? "text-gray-400" : "text-gray-600");
  const getMutedTextColor = () => (isDark ? "text-gray-500" : "text-gray-400");

  const members = t("team.membersList", { returnObjects: true }) as TeamMember[];

  if (!mounted) {
    return (
      <div className="min-h-screen font-body relative overflow-x-hidden bg-[#0d0d15] text-[#f2effb]">
        <CyberEffects />
        <Navbar />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-[#FF0A54]/10 backdrop-blur-xl p-8 sm:p-12">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-headline font-bold tracking-wider mb-6 border bg-[#FF0A54]/10 text-[#FF0A54] border-[#FF0A54]/30">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-[#FF0A54]" />
                  PROJECT OVERVIEW
                </div>
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-[#FF0A54]">
                  About CHEA
                </h1>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-body relative overflow-x-hidden ${
        isDark ? "bg-[#0d0d15] text-[#f2effb]" : "bg-gray-50 text-gray-900"
      }`}
    >
      <CyberEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${getBgGradient()}`}
          />
          <div
            className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 ${
              isDark ? "bg-[#4D00FF]" : "bg-[#FF0A54]"
            }`}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header Card */}
            <div
              className={`relative rounded-2xl border backdrop-blur-xl p-8 sm:p-12 ${getBgLight()} ${getBorderLight()} shadow-[0_0_60px_rgba(0,0,0,0.1)]`}
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 opacity-30 bg-gradient-to-bl ${
                  isDark ? "from-[#FF0A54]" : "from-[#4D00FF]"
                } to-transparent`}
                style={{ borderTopRightRadius: "1rem" }}
              />
              <div className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-headline font-bold tracking-wider mb-6 border ${getBgLight()} ${getTextColor()} ${getBorderMedium()}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${getBgGradient()}`}
                  />
                  {t("documentLabel")}
                </motion.div>
                <h1
                  className={`font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${getTextColor()}`}
                >
                  {t("pageTitle")}
                </h1>
              </div>
            </div>

            {/* Abstract Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? "bg-[#191923]/60 border-white/5 hover:border-[#FF0A54]/20"
                  : "bg-white/60 border-black/5 hover:border-[#4D00FF]/20"
              } hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-headline font-bold text-lg ${getBgLight()} ${getTextColor()} ${getBorderLight()}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2
                    className={`font-headline text-xl font-bold mb-3 ${getHeadingColor()}`}
                  >
                    {t("abstract.title")}
                  </h2>
                  <p
                    className={`${getBodyTextColor()} leading-relaxed text-sm sm:text-base`}
                  >
                    {t("abstract.content")}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Demo Video Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? "bg-[#191923]/60 border-white/5 hover:border-[#FF0A54]/20"
                  : "bg-white/60 border-black/5 hover:border-[#4D00FF]/20"
              } hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
            >
              <div className="text-center mb-6">
                <h2
                  className={`font-headline text-2xl font-bold mb-2 ${getHeadingColor()}`}
                >
                  {t("demo.title")}
                </h2>
                <p className={`${getMutedTextColor()} font-body text-sm`}>
                  {t("demo.subtitle")}
                </p>
              </div>
              <div
                className={`relative rounded-xl overflow-hidden border ${getBorderLight()}`}
              >
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src="https://www.youtube.com/embed/q8ijaS6fbJk"
                    title="CHEA Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            </motion.section>

            {/* See CHEA in Action Section */}
            <ScreenshotGallery />

            {/* Project Report Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? "bg-[#191923]/60 border-white/5 hover:border-[#FF0A54]/20"
                  : "bg-white/60 border-black/5 hover:border-[#4D00FF]/20"
              } hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
            >
              <div className="text-center mb-6">
                <h2
                  className={`font-headline text-2xl font-bold mb-2 ${getHeadingColor()}`}
                >
                  {t("report.title")}
                </h2>
                <p className={`${getMutedTextColor()} font-body text-sm`}>
                  {t("report.subtitle")}
                </p>
              </div>
              <div
                className={`relative rounded-xl overflow-hidden border ${getBorderLight()}`}
                style={{ height: "800px" }}
              >
                <object
                  data="/report/Report-CHEA.pdf"
                  type="application/pdf"
                  className="w-full h-full"
                  title="CHEA Project Report"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
                    <p className="font-body text-sm">PDF viewer is not supported in this browser.</p>
                    <a
                      href="/report/Report-CHEA.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-headline font-semibold border ${getBorderMedium()} ${getTextColor()} ${getBgLight()}`}
                    >
                      Open PDF in new tab
                    </a>
                  </div>
                </object>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/report/Report-CHEA.pdf"
                  download
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-headline font-semibold text-sm transition-all duration-300 border ${getBorderMedium()} ${getTextColor()} ${getBgLight()} hover:opacity-80`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t("report.download")}
                </a>
              </div>
            </motion.section>

            {/* Meet the Team Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 ${
                isDark
                  ? "bg-[#191923]/60 border-white/5"
                  : "bg-white/60 border-black/5"
              }`}
            >
              <div className="text-center mb-8">
                <h2
                  className={`font-headline text-2xl font-bold mb-2 ${getHeadingColor()}`}
                >
                  {t("team.title")}
                </h2>
              </div>

              {/* Supervisor Card */}
              <div
                className={`rounded-xl border p-6 mb-6 transition-all duration-300 hover:scale-[1.01] ${
                  isDark
                    ? "bg-gradient-to-br from-[#FF0A54]/10 to-[#4D00FF]/10 border-[#FF0A54]/20"
                    : "bg-gradient-to-br from-[#4D00FF]/10 to-[#FF0A54]/10 border-[#4D00FF]/20"
                } hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-headline font-bold ${getBgLight()} ${getTextColor()} ${getBorderLight()} border`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    {t("team.supervisor")}
                  </div>
                </div>
                <h3
                  className={`font-headline text-xl font-bold mb-2 ${getHeadingColor()}`}
                >
                  {t("team.supervisorName")}
                </h3>
                <a
                  href="mailto:ysalslais@uob.edu.bh"
                  className={`inline-flex items-center gap-2 text-sm ${getBodyTextColor()} hover:${getTextColor()} transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  ysalslais@uob.edu.bh
                </a>
              </div>

              {/* Members Label */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-headline font-bold ${getBgLight()} ${getTextColor()} ${getBorderLight()} border`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {t("team.members")}
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {members.map((member: TeamMember, index: number) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
                    className={`rounded-xl border p-5 transition-all duration-300 hover:scale-[1.02] ${
                      isDark
                        ? "bg-[#13131c]/60 border-white/5 hover:border-[#FF0A54]/20"
                        : "bg-white/60 border-black/5 hover:border-[#4D00FF]/20"
                    } hover:shadow-[0_0_25px_rgba(0,0,0,0.1)]`}
                  >
                    {/* Avatar placeholder */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${getBgLight()} ${getBorderLight()} border`}
                    >
                      <span className={`font-headline font-bold text-lg ${getTextColor()}`}>
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>

                    <h4
                      className={`font-headline font-bold text-sm mb-2 ${getHeadingColor()}`}
                    >
                      {member.name}
                    </h4>

                    <div className="space-y-1.5 mb-4">
                      <a
                        href={`mailto:${member.email}`}
                        className={`flex items-center gap-2 text-xs ${getBodyTextColor()} hover:${getTextColor()} transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {member.email}
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className={`flex items-center gap-2 text-xs ${getBodyTextColor()} hover:${getTextColor()} transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {member.phone}
                      </a>
                    </div>

                    <a
                      href={member.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-headline font-semibold transition-all duration-300 border ${getBorderMedium()} ${getTextColor()} ${getBgLight()} hover:opacity-80`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      {t("team.viewCV")}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
