import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ChevronUp, ChevronDown, GripHorizontal } from 'lucide-react'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import { useTheme } from '@/components/theme-provider'

interface Position {
    x: number
    y: number
}

interface MusicPlayerProps {
    position?: Position
    onPositionChange?: (pos: Position) => void
}

export function MusicPlayer({ position, onPositionChange }: MusicPlayerProps) {
    const { isPlaying, currentIndex, volume, song, toggle, next, prev, setVolume } = useBackgroundMusic()
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'
    const [expanded, setExpanded] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const cardBg = isDark ? 'bg-[#1A1A2E]/90' : 'bg-white/90'
    const borderColor = isDark ? 'border-neon-violet/30' : 'border-neon-violet/20'
    const textColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900'
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500'
    const neonAccent = isDark ? 'text-neon-violet' : 'text-violet-600'

    const handleDragEnd = (_: any, info: { offset: { x: number; y: number } }) => {
        if (onPositionChange && position) {
            const newX = position.x + info.offset.x
            const newY = position.y + info.offset.y
            onPositionChange({ x: newX, y: newY })
        }
        setIsDragging(false)
    }

    return (
        <motion.div
            className="fixed z-50"
            style={{
                bottom: position ? undefined : 24,
                right: position ? undefined : 24,
                left: position ? position.x : undefined,
                top: position ? position.y : undefined,
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
            drag={!position}
            dragMomentum={false}
            dragListener={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05, zIndex: 100 }}
        >
            <div
                className={`rounded-2xl border-2 ${borderColor} ${cardBg} backdrop-blur-xl shadow-2xl overflow-hidden min-w-[200px] ${isDragging ? 'cursor-grabbing' : ''}`}
            >
                {/* Collapsed Header - Drag Handle */}
                <div className="flex items-center gap-2 p-3 select-none" onClick={() => setExpanded(!expanded)}>
                    <div
                        className={`cursor-grab active:cursor-grabbing p-1 rounded hover:${isDark ? 'bg-white/10' : 'bg-gray-100'}`}
                        onPointerDown={(e) => {
                            if (position) {
                                e.preventDefault()
                                const startX = e.clientX - position.x
                                const startY = e.clientY - position.y
                                const handleMove = (moveEvent: PointerEvent) => {
                                    const newX = moveEvent.clientX - startX
                                    const newY = moveEvent.clientY - startY
                                    onPositionChange?.({ x: newX, y: newY })
                                }
                                const handleUp = () => {
                                    document.removeEventListener('pointermove', handleMove)
                                    document.removeEventListener('pointerup', handleUp)
                                    setIsDragging(false)
                                }
                                setIsDragging(true)
                                document.addEventListener('pointermove', handleMove)
                                document.addEventListener('pointerup', handleUp)
                            }
                        }}
                    >
                        <GripHorizontal size={14} className={mutedText} />
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md ${isPlaying ? 'animate-pulse' : ''}`}>
                        <Music size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${textColor} truncate`}>{song.title}</p>
                        <p className={`text-[10px] ${mutedText} truncate`}>{song.artist}</p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggle() }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        {isPlaying
                            ? <Pause size={16} className={neonAccent} />
                            : <Play size={16} className={neonAccent} />
                        }
                    </button>

                    {expanded
                        ? <ChevronDown size={14} className={mutedText} />
                        : <ChevronUp size={14} className={mutedText} />
                    }
                </div>

                {/* Expanded Controls */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className={`px-3 pb-3 pt-1 space-y-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200/50'}`}>
                                {/* Progress indicator */}
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black ${neonAccent}`}>
                                        {String(currentIndex + 1).padStart(2, '0')}
                                    </span>
                                    <div className={`flex-1 h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentIndex + 1) / 7) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold ${mutedText}`}>07</span>
                                </div>

                                {/* Playback controls */}
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={prev}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                                    >
                                        <SkipBack size={14} />
                                    </button>

                                    <button
                                        onClick={toggle}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {isPlaying
                                            ? <Pause size={18} />
                                            : <Play size={18} className="ml-0.5" />
                                        }
                                    </button>

                                    <button
                                        onClick={next}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                                    >
                                        <SkipForward size={14} />
                                    </button>
                                </div>

                                {/* Volume control */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                                        className={`w-6 h-6 flex items-center justify-center ${mutedText} hover:text-current transition-colors`}
                                    >
                                        {volume === 0
                                            ? <VolumeX size={12} />
                                            : <Volume2 size={12} />
                                        }
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="flex-1 h-1 accent-violet-500 cursor-pointer appearance-none bg-gray-200 dark:bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
