"use client"

import { Meteors } from "@/components/ui/meteors"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
      <Meteors number={25} />

      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-crimson/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-violet/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[150px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-crimson/20 bg-neon-crimson/5 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-neon-crimson animate-pulse" />
          <span className="text-sm text-neon-crimson font-medium font-body">Desktop Cybersecurity Suite</span>
        </div>

        {/* Main heading */}
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <span className="bg-gradient-to-r from-neon-crimson via-neon-violet to-neon-cyan bg-clip-text text-transparent">
            CHEA
          </span>
        </h1>

        <div className="animate-slide-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <AnimatedShinyText className="text-xl md:text-2xl text-muted mb-4 font-body font-light" shimmerWidth={200}>
            Comprehensive Cybersecurity for Everyone
          </AnimatedShinyText>
        </div>

        <p className="max-w-2xl mx-auto text-muted text-lg mb-12 font-body leading-relaxed animate-slide-up" style={{ animationDelay: "0.45s", opacity: 0 }}>
          A powerful desktop application featuring encrypted password vaults,
          real-time threat scanning, and advanced security analysis tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.6s", opacity: 0 }}>
          <Link
            href="#features"
            className="group relative px-8 py-4 bg-neon-crimson text-white font-body font-semibold rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,10,84,0.4)] focus-visible:ring-2 focus-visible:ring-neon-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="relative z-10">Explore Features</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-crimson to-neon-violet opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="#screenshots"
            className="px-8 py-4 border border-surface-border text-foreground font-body font-semibold rounded-xl hover:border-neon-cyan/50 hover:text-neon-cyan transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Screenshots
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-surface-border rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-crimson rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
