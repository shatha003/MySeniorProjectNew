import { useState, useEffect } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { ThemeToggle } from './ThemeToggle'

const appWindow = getCurrentWindow()

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        const checkMaximized = async () => {
            const maximized = await appWindow.isMaximized()
            setIsMaximized(maximized)
        }
        checkMaximized()

        const unlisten = appWindow.onResized(async () => {
            const maximized = await appWindow.isMaximized()
            setIsMaximized(maximized)
        })

        return () => {
            unlisten.then((fn) => fn())
        }
    }, [])

    const handleMinimize = () => appWindow.minimize()
    const handleMaximize = () => appWindow.toggleMaximize()
    const handleClose = () => appWindow.close()

    return (
        <div className="titlebar" data-tauri-drag-region>
            {/* App Branding */}
            <div className="titlebar-brand" data-tauri-drag-region>
                <div className="titlebar-icon">
                    <img src="/icon.png" alt="HyperTool" width="16" height="16" className="object-contain" />
                </div>
                <span className="titlebar-title" data-tauri-drag-region>
                    HyperTool
                </span>
            </div>

            {/* Window Controls */}
            <div className="titlebar-controls flex items-center">
                <ThemeToggle />

                {/* Minimize */}
                <button
                    className="titlebar-btn titlebar-btn-minimize"
                    onClick={handleMinimize}
                    aria-label="Minimize"
                    tabIndex={-1}
                >
                    <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
                        <rect width="10" height="1" rx="0.5" />
                    </svg>
                </button>

                {/* Maximize / Restore */}
                <button
                    className="titlebar-btn titlebar-btn-maximize"
                    onClick={handleMaximize}
                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                    tabIndex={-1}
                >
                    {isMaximized ? (
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        >
                            <rect x="2.5" y="0" width="7.5" height="7.5" rx="1" />
                            <rect x="0" y="2.5" width="7.5" height="7.5" rx="1" />
                        </svg>
                    ) : (
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        >
                            <rect x="0.5" y="0.5" width="9" height="9" rx="1" />
                        </svg>
                    )}
                </button>

                {/* Close */}
                <button
                    className="titlebar-btn titlebar-btn-close"
                    onClick={handleClose}
                    aria-label="Close"
                    tabIndex={-1}
                >
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    >
                        <line x1="1" y1="1" x2="9" y2="9" />
                        <line x1="9" y1="1" x2="1" y2="9" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
