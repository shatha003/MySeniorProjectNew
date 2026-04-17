import { useState, useCallback } from 'react'

const STORAGE_KEY = 'chea-music-player-position'

interface Position {
    x: number
    y: number
}

interface UseWidgetPositionReturn {
    position: Position
    setPosition: (pos: Position) => void
}

export function useWidgetPosition(defaultPosition: Position): UseWidgetPositionReturn {
    const [position, setPositionState] = useState<Position>(() => {
        if (typeof window === 'undefined') return defaultPosition
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                    return parsed
                }
            } catch {
                // Invalid JSON, use default
            }
        }
        return defaultPosition
    })

    const setPosition = useCallback((pos: Position) => {
        setPositionState(pos)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    }, [])

    return { position, setPosition }
}