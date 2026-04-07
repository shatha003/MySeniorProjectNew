import Image from "next/image"
import Link from "next/link"
import { Meteors } from "@/components/ui/meteors"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { BorderBeam } from "@/components/ui/border-beam"
import { Marquee } from "@/components/ui/marquee"

const features = [
  {
    icon: "🔐",
    title: "Password Vault",
    description: "AES-256-GCM encrypted password storage with zero-knowledge architecture",
    screenshot: "/screenshots/pic1.png",
  },
  {
    icon: "🔗",
    title: "Link Scanner",
    description: "Real-time URL analysis detecting phishing, malware, and malicious domains",
    screenshot: "/screenshots/pic2.png",
  },
  {
    icon: "📁",
    title: "File Scanner",
    description: "Deep file inspection with hash verification and threat intelligence",
    screenshot: "/screenshots/pic3.png",
  },
  {
    icon: "🛡️",
    title: "Security Analysis",
    description: "Comprehensive security audits and vulnerability assessments",
    screenshot: "/screenshots/pic4.png",
  },
  {
    icon: "📊",
    title: "Dashboard",
    description: "Intuitive analytics and real-time monitoring of your security posture",
    screenshot: "/screenshots/pic5.png",
  },
  {
    icon: "⚡",
    title: "Quick Actions",
    description: "One-click security tools for password generation and breach checks",
    screenshot: "/screenshots/pic6.png",
  },
]

const screenshots = [
  "/screenshots/pic7.png",
  "/screenshots/pic8.png",
  "/screenshots/pic9.png",
  "/screenshots/pic10.png",
  "/screenshots/pic11.png",
  "/screenshots/pic12.png",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <Meteors number={30} />
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff2a6d]/30 bg-[#ff2a6d]/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#ff2a6d] animate-pulse" />
            <span className="text-sm text-[#ff2a6d] font-medium">Desktop Cybersecurity Suite</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <span className="bg-gradient-to-r from-[#ff2a6d] via-[#a855f7] to-[#05d9e8] bg-clip-text text-transparent">
              CHEA
            </span>
          </h1>

          <div className="animate-slide-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <AnimatedShinyText className="text-xl md:text-2xl text-zinc-400 mb-4 font-light">
              Comprehensive Cybersecurity for Everyone
            </AnimatedShinyText>
          </div>

          <p className="max-w-2xl mx-auto text-zinc-500 text-lg mb-12 animate-slide-up" style={{ animationDelay: "0.6s", opacity: 0 }}>
            A powerful desktop application featuring encrypted password vaults, 
            real-time threat scanning, and advanced security analysis tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.8s", opacity: 0 }}>
            <Link
              href="#features"
              className="group relative px-8 py-4 bg-[#ff2a6d] text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,42,109,0.5)]"
            >
              <span className="relative z-10">Explore Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="#screenshots"
              className="px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:border-[#05d9e8] hover:text-[#05d9e8] transition-all hover:scale-105"
            >
              View Screenshots
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#ff2a6d] rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#a855f7]/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-[#ff2a6d] to-[#a855f7] bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Everything you need to stay secure in the digital world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#ff2a6d]/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <BorderBeam
                  size={100}
                  duration={8}
                  delay={index * 0.5}
                  colorFrom="#ff2a6d"
                  colorTo="#a855f7"
                />
                
                <div className="p-6">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  {feature.screenshot && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800">
                      <Image
                        src={feature.screenshot}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Marquee */}
      <section id="screenshots" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#05d9e8]/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-[#05d9e8] to-[#a855f7] bg-clip-text text-transparent">
                See It In Action
              </span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Browse through the application interface and experience the cyberpunk aesthetic
            </p>
          </div>

          <div className="space-y-8">
            <Marquee pauseOnHover repeat={2}>
              {screenshots.slice(0, 3).map((screenshot, index) => (
                <div
                  key={index}
                  className="relative w-[400px] aspect-video rounded-xl overflow-hidden border border-zinc-800 hover:border-[#05d9e8]/50 transition-all"
                >
                  <Image
                    src={screenshot}
                    alt={`CHEA Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </Marquee>

            <Marquee pauseOnHover reverse repeat={2}>
              {screenshots.slice(3).map((screenshot, index) => (
                <div
                  key={index}
                  className="relative w-[400px] aspect-video rounded-xl overflow-hidden border border-zinc-800 hover:border-[#a855f7]/50 transition-all"
                >
                  <Image
                    src={screenshot}
                    alt={`CHEA Screenshot ${index + 4}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff2a6d]/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-[#ff2a6d] via-[#a855f7] to-[#05d9e8] bg-clip-text text-transparent">
              Ready to Secure Your Digital Life?
            </span>
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-2xl mx-auto">
            Download CHEA today and take control of your cybersecurity with our 
            comprehensive suite of tools.
          </p>
          
          <div className="relative inline-block">
            <BorderBeam
              size={150}
              duration={6}
              colorFrom="#ff2a6d"
              colorTo="#05d9e8"
            />
            <button className="px-12 py-5 bg-gradient-to-r from-[#ff2a6d] to-[#a855f7] text-white font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,42,109,0.3)]">
              Download Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff2a6d] to-[#a855f7] flex items-center justify-center font-bold text-white">
              C
            </div>
            <span className="font-semibold text-zinc-300">CHEA</span>
          </div>
          
          <p className="text-zinc-600 text-sm">
            © 2026 CHEA. Comprehensive Cybersecurity for Everyone.
          </p>
          
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 hover:text-[#ff2a6d] transition-colors">
              GitHub
            </Link>
            <Link href="#" className="text-zinc-500 hover:text-[#a855f7] transition-colors">
              Documentation
            </Link>
            <Link href="#" className="text-zinc-500 hover:text-[#05d9e8] transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
