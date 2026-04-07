"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Screenshots", href: "#screenshots" },
    { label: "About", href: "#about" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-surface-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-crimson to-neon-violet flex items-center justify-center font-heading font-bold text-white text-sm group-hover:shadow-[0_0_20px_rgba(255,10,84,0.5)] transition-shadow">
            C
          </div>
          <span className="font-heading font-semibold text-foreground text-lg tracking-wide">
            CHEA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted hover:text-foreground text-sm font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-crimson group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-9 h-9 rounded-lg border border-surface-border bg-surface hover:border-neon-crimson/50 flex items-center justify-center transition-colors"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-neon-violet" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* CTA */}
          <Link
            href="#download"
            className="hidden sm:inline-flex px-5 py-2 bg-neon-crimson text-white text-sm font-semibold rounded-lg hover:bg-neon-pink hover:shadow-[0_0_20px_rgba(255,10,84,0.4)] transition-all"
          >
            Download
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 rounded-lg border border-surface-border bg-surface flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-muted hover:text-foreground font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#download"
              onClick={() => setMobileOpen(false)}
              className="block px-5 py-2.5 bg-neon-crimson text-white text-sm font-semibold rounded-lg text-center"
            >
              Download
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
