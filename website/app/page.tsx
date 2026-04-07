import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Screenshots from "@/components/screenshots"
import Stats from "@/components/stats"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}
