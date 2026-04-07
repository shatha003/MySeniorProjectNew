"use client"

import { BorderBeam } from "@/components/ui/border-beam"
import Link from "next/link"

export default function CTA() {
  return (
    <section id="download" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-crimson/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Ready to Secure Your
          <span className="bg-gradient-to-r from-neon-crimson via-neon-violet to-neon-cyan bg-clip-text text-transparent"> Digital Life?</span>
        </h2>
        <p className="text-muted text-lg mb-12 max-w-2xl mx-auto font-body leading-relaxed">
          Download CHEA today and take control of your cybersecurity with our
          comprehensive suite of tools.
        </p>

        <div className="relative inline-block">
          <BorderBeam
            size={150}
            duration={6}
            colorFrom="#ff0a54"
            colorTo="#00e5ff"
            borderWidth={2}
          />
          <button className="px-12 py-5 bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-body font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,10,84,0.3)] hover:shadow-[0_0_60px_rgba(255,10,84,0.5)] focus-visible:ring-2 focus-visible:ring-neon-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-background">
            Download Now
          </button>
        </div>

        <p className="text-muted text-sm mt-6 font-body">
          Available for Windows, macOS & Linux
        </p>
      </div>
    </section>
  )
}
