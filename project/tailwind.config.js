/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neon: {
          crimson: "#FF0A54",
          cyan: "#00E5FF",
          violet: "#4D00FF",
          blue: "#8AB4F8",
        },
        cyber: {
          void: "#05050A",
          dark: "#0A1128",
          surface: "#121A33",
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        cyber: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #FF0A54, 0 0 10px rgba(255,10,84,0.3)" },
          "50%": { boxShadow: "0 0 15px #FF0A54, 0 0 30px rgba(255,10,84,0.4), 0 0 45px rgba(255,10,84,0.15)" },
        },
        "neon-pulse-light": {
          "0%, 100%": { boxShadow: "0 0 3px rgba(77,0,255,0.3), 0 0 8px rgba(77,0,255,0.15)" },
          "50%": { boxShadow: "0 0 8px rgba(77,0,255,0.4), 0 0 20px rgba(77,0,255,0.2)" },
        },
        "cyber-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(255,10,84,0.4)" },
          "50%": { borderColor: "rgba(255,10,84,0.8)" },
        },
        "border-glow-light": {
          "0%, 100%": { borderColor: "rgba(77,0,255,0.3)" },
          "50%": { borderColor: "rgba(77,0,255,0.6)" },
        },
        "glow-rotate": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "neon-pulse-light": "neon-pulse-light 2s ease-in-out infinite",
        "cyber-scan": "cyber-scan 8s linear infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "border-glow-light": "border-glow-light 3s ease-in-out infinite",
        "glow-rotate": "glow-rotate 3s ease infinite",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
