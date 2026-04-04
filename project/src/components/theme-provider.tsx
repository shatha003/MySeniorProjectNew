import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: "dark" | "light"
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function getSystemTheme(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "chea-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )
    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
        () => theme === "system" ? getSystemTheme() : theme as "dark" | "light"
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = getSystemTheme()
            root.classList.add(systemTheme)
            setResolvedTheme(systemTheme)
            return
        }

        root.classList.add(theme)
        setResolvedTheme(theme)
    }, [theme])

    // Listen for system changes if system theme is selected
    useEffect(() => {
        if (theme !== "system") return

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = () => {
            const root = window.document.documentElement
            root.classList.remove("light", "dark")
            const newTheme = mediaQuery.matches ? "dark" : "light"
            root.classList.add(newTheme)
            setResolvedTheme(newTheme)
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
