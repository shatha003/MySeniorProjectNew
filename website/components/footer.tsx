import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-crimson to-neon-violet flex items-center justify-center font-heading font-bold text-white text-sm">
            C
          </div>
          <span className="font-heading font-semibold text-foreground">CHEA</span>
        </div>

        <p className="text-muted text-sm font-body">
          &copy; 2026 CHEA. Comprehensive Cybersecurity for Everyone.
        </p>

        <div className="flex gap-6">
          <Link href="#" className="text-muted hover:text-neon-crimson transition-colors text-sm font-body">
            GitHub
          </Link>
          <Link href="#" className="text-muted hover:text-neon-violet transition-colors text-sm font-body">
            Documentation
          </Link>
          <Link href="#" className="text-muted hover:text-neon-cyan transition-colors text-sm font-body">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
