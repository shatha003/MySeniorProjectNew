"use client"

import { useEffect, useRef, useState } from "react"

interface StatProps {
  value: number
  suffix: string
  label: string
}

function StatCounter({ value, suffix, label }: StatProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            start = Math.floor(eased * value)
            setCount(start)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neon-crimson to-neon-violet bg-clip-text text-transparent tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-muted font-body mt-2 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-crimson/5 via-neon-violet/5 to-neon-cyan/5" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatCounter value={256} suffix="-bit" label="Encryption" />
          <StatCounter value={100} suffix="%" label="Open Source" />
          <StatCounter value={0} suffix="" label="Data Leaks" />
          <StatCounter value={24} suffix="/7" label="Protection" />
        </div>
      </div>
    </section>
  )
}
