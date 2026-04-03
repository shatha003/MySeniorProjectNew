import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    // Determine actual theme if system is selected
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="titlebar-btn flex items-center justify-center w-[46px] relative overflow-hidden focus:outline-none"
            aria-label="Toggle theme"
            tabIndex={-1}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.25, type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute"
                    >
                        <Moon className="h-[14px] w-[14px]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.25, type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute"
                    >
                        <Sun className="h-[14px] w-[14px]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}
