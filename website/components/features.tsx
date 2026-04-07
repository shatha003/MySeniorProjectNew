"use client"

import Image from "next/image"
import { BorderBeam } from "@/components/ui/border-beam"

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Password Vault",
    description: "AES-256-GCM encrypted password storage with zero-knowledge architecture. Your secrets stay yours.",
    screenshot: "/screenshots/pic1.png",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Link Scanner",
    description: "Real-time URL analysis detecting phishing, malware, and malicious domains before you click.",
    screenshot: "/screenshots/pic2.png",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "File Scanner",
    description: "Deep file inspection with hash verification and threat intelligence from global databases.",
    screenshot: "/screenshots/pic3.png",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Security Analysis",
    description: "Comprehensive security audits and vulnerability assessments for your digital footprint.",
    screenshot: "/screenshots/pic4.png",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Dashboard",
    description: "Intuitive analytics and real-time monitoring of your security posture at a glance.",
    screenshot: "/screenshots/pic5.png",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Quick Actions",
    description: "One-click security tools for password generation, breach checks, and instant scans.",
    screenshot: "/screenshots/pic6.png",
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-violet/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-neon-crimson font-body text-sm font-semibold uppercase tracking-widest">Capabilities</span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-5 text-foreground">
            Powerful Features
          </h2>
          <p className="text-muted max-w-xl mx-auto font-body text-lg">
            Everything you need to stay secure in the digital world, built into one elegant suite.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-card-border rounded-2xl overflow-hidden hover:border-neon-crimson/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,10,84,0.08)]"
            >
              <BorderBeam
                size={80}
                duration={10}
                delay={index * 0.8}
                colorFrom="#ff0a54"
                colorTo="#4d00ff"
                borderWidth={1.5}
              />

              <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-crimson/10 to-neon-violet/10 border border-neon-crimson/20 flex items-center justify-center text-neon-crimson mb-5 group-hover:shadow-[0_0_15px_rgba(255,10,84,0.2)] transition-shadow">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm mb-5 font-body leading-relaxed">
                  {feature.description}
                </p>

                {/* Screenshot */}
                {feature.screenshot && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-card-border">
                    <Image
                      src={feature.screenshot}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-70" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
