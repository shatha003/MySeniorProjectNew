import { useState, useCallback } from 'react'

const STORAGE_KEY = 'chea-music-player-position'

interface Position {
    x: number
    y: number
}

function getDefaultPosition(): Position {
    if (typeof window === 'undefined') {
        return { x: 24, y: 24 }
    }
    return {
        x: window.innerWidth - 224,
        y: window.innerHeight - 100
    }
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