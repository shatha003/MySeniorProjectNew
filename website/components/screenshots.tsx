"use client"

import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"

const screenshots = [
  { src: "/screenshots/pic7.png", alt: "CHEA Dashboard View" },
  { src: "/screenshots/pic8.png", alt: "CHEA Password Vault" },
  { src: "/screenshots/pic9.png", alt: "CHEA Link Scanner" },
  { src: "/screenshots/pic10.png", alt: "CHEA File Scanner" },
  { src: "/screenshots/pic11.png", alt: "CHEA Security Analysis" },
  { src: "/screenshots/pic12.png", alt: "CHEA Settings Panel" },
]

export default function Screenshots() {
  return (
    <section id="screenshots" className="relative py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-neon-cyan/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-neon-cyan font-body text-sm font-semibold uppercase tracking-widest">Gallery</span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-5 text-foreground">
            See It In Action
          </h2>
          <p className="text-muted max-w-xl mx-auto font-body text-lg">
            Browse through the application interface and experience the sleek cybersecurity design.
          </p>
        </div>

        {/* Marquee rows */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <Marquee pauseOnHover repeat={2}>
              {screenshots.slice(0, 3).map((screenshot, index) => (
                <div
                  key={index}
                  className="relative w-[420px] aspect-video rounded-2xl overflow-hidden border border-card-border hover:border-neon-cyan/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] group"
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    sizes="420px"
                  />
                </div>
              ))}
            </Marquee>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <Marquee pauseOnHover reverse repeat={2}>
              {screenshots.slice(3).map((screenshot, index) => (
                <div
                  key={index}
                  className="relative w-[420px] aspect-video rounded-2xl overflow-hidden border border-card-border hover:border-neon-violet/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(77,0,255,0.1)] group"
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    sizes="420px"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}
