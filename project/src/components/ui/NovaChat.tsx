import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Zap, Bell, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

// Short, punchy security tips (max 60 chars)
const NOVA_TIPS = [
    "12-char passwords are 62 trillion times harder to crack! 🔐",
    "Never reuse passwords. One breach = all accounts at risk! ⚠️",
    "Check URLs before clicking — scammers love typos! 🔗",
    "Enable 2FA everywhere. It's a deadbolt for your accounts! 🚪",
    "Public WiFi = shouting your passwords in a cafe! ☕",
    "Update apps! Each patch fixes holes hackers exploit. 🩹",
    "'Password123' is in 23 million breaches. Be creative! 🎨",
    "Urgent email? Probably phishing. Slow down and verify! 🐌",
    "Pet name + birth year? Hackers guess that in seconds! 🐕",
    "Ransomware hits every 11 seconds. Backup your files! 💾",
    "QR codes can hide malicious links. Scan carefully! 📱",
    "81% of breaches use stolen or weak passwords. Stay strong! 📊",
    "support@amaz0n.com is NOT Amazon. Check senders! 👀",
    "Hackers crack 6-letter passwords in 10 seconds. Go longer! ⏳",
    "Cover your webcam when not in use! Privacy matters! 🎥",
    "Use a password manager. 100+ passwords is too many! 🔑",
    "Social engineering tricks your brain, not your PC. Think! 🧐",
    "Biometrics + password = maximum security! 👤",
    "Cybercrime costs $6 trillion yearly. Don't be a victim! 💰",
    "The most common password is still '123456'. Do better! 😅",
    "Lock your devices. Physical access = game over! 🔒",
    "Don't click 'Remind me later' on updates. Patch now! 🚨",
    "Free software can cost your privacy. Read permissions! 👁️",
    "Email attachments from strangers? Don't open them! 📧",
];

const NOVA_TIP_KEY = 'chea-nova-last-tip';
const NOVA_ENABLED_KEY = 'chea-nova-enabled';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface NovaChatProps {
    defaultPosition?: { x: number; y: number };
}

export function NovaChat({ defaultPosition = { x: 24, y: 100 } }: NovaChatProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const user = useAuthStore((s) => s.user);
    const userId = user?.uid;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [showTip, setShowTip] = useState(false);
    const [currentTip, setCurrentTip] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem(NOVA_ENABLED_KEY);
        return saved ? saved === 'true' : true;
    });

    // Position with drag
    const [pos, setPos] = useState({ x: defaultPosition.x, y: defaultPosition.y });
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const tipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

    const onDragStart = (e: React.PointerEvent) => {
        e.preventDefault();
        dragging.current = false;
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        const onMove = (ev: PointerEvent) => {
            dragging.current = true;
            const newX = window.innerWidth - ev.clientX + dragOffset.current.x - 80;
            const newY = window.innerHeight - ev.clientY + dragOffset.current.y - 80;
            setPos({ x: Math.max(0, newX), y: Math.max(0, newY) });
        };

        const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    };

    const handleAvatarClick = () => {
        if (dragging.current) { dragging.current = false; return; }
        setIsOpen((prev) => !prev);
        if (!isOpen && messages.length === 0) {
            setMessages([{ role: 'assistant', content: "Hey! 👋 I'm Nova — your security sidekick. Ask me anything!" }]);
        }
    };

    const toggleEnabled = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newVal = !enabled;
        setEnabled(newVal);
        localStorage.setItem(NOVA_ENABLED_KEY, String(newVal));
    }, [enabled]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !userId) return;
        const userMsg = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);
        setIsStreaming(false);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error('API key missing');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'x-ai/grok-4-fast',
                    messages: [
                        { role: 'system', content: 'You are Nova, a friendly cybersecurity assistant. Keep responses to 1-2 short sentences. Use emojis occasionally.' },
                        ...messages.map((m) => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMsg },
                    ],
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No stream');
            const decoder = new TextDecoder();
            let full = '';
            let started = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                for (const line of decoder.decode(value, { stream: true }).split('\n')) {
                    const t = line.trim();
                    if (!t.startsWith('data: ')) continue;
                    const d = t.slice(6);
                    if (d === '[DONE]') continue;
                    try {
                        const delta = JSON.parse(d).choices?.[0]?.delta?.content;
                        if (delta) {
                            full += delta;
                            if (!started) {
                                started = true;
                                setIsStreaming(true);
                                setMessages((p) => [...p, { role: 'assistant', content: delta }]);
                            } else {
                                setMessages((p) => {
                                    const n = [...p];
                                    const li = n.length - 1;
                                    if (li >= 0 && n[li].role === 'assistant') n[li] = { ...n[li], content: n[li].content + delta };
                                    return n;
                                });
                            }
                        }
                    } catch { /* skip */ }
                }
            }
        } catch (err) {
            console.error('Nova AI Error:', err);
            setMessages((p) => [...p, { role: 'assistant', content: 'Oops! Something went wrong 😅 Try again!' }]);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    // Tip notifications every 3 hours
    useEffect(() => {
        if (!userId || !enabled) return;
        
        const check = () => {
            const last = localStorage.getItem(NOVA_TIP_KEY);
            const now = Date.now();
            const THREE_HOURS = 3 * 60 * 60 * 1000;
            
            if (!last || now - parseInt(last) >= THREE_HOURS) {
                const randomTip = NOVA_TIPS[Math.floor(Math.random() * NOVA_TIPS.length)];
                setCurrentTip(randomTip);
                setShowTip(true);
                localStorage.setItem(NOVA_TIP_KEY, now.toString());
                
                if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
                tipTimeoutRef.current = setTimeout(() => setShowTip(false), 8000);
            }
        };
        
        check();
        const iv = setInterval(check, 60000);
        
        return () => {
            clearInterval(iv);
            if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
        };
    }, [userId, enabled]);

    const text = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const muted = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';

    return (
        <>
            {/* Tip Notification - Minimal Glass Style */}
            <AnimatePresence>
                {showTip && currentTip && enabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ position: 'fixed', right: 24, bottom: pos.y + 100, zIndex: 9998 }}
                        className="max-w-[320px] pointer-events-auto"
                    >
                        <div className={cn(
                            'p-4 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden relative',
                            isDark 
                                ? 'bg-cyber-dark/80 border border-neon-crimson/30' 
                                : 'bg-white/80 border border-violet-300/50'
                        )}>
                            <div className="relative flex items-start gap-3">
                                <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                                    isDark 
                                        ? 'bg-gradient-to-br from-neon-crimson to-purple-600' 
                                        : 'bg-gradient-to-br from-violet-500 to-purple-600'
                                )}>
                                    <Zap size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn('text-xs font-black uppercase tracking-wider', isDark ? 'text-neon-crimson' : 'text-violet-600')}>
                                            Nova Tip
                                        </span>
                                    </div>
                                    <p className={cn('text-sm font-medium leading-relaxed', text)}>{currentTip}</p>
                                </div>
                                <button 
                                    onClick={() => setShowTip(false)}
                                    className={cn('p-1 rounded-lg hover:bg-white/10 shrink-0', muted)}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                                <motion.div 
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: 8, ease: 'linear' }}
                                    className={cn('h-full', isDark ? 'bg-neon-crimson' : 'bg-violet-500')}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Container */}
            <div style={{ position: 'fixed', right: pos.x, bottom: pos.y, zIndex: 9999 }}>
                {/* Chat Panel - Glassmorphism Style */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={cn(
                                'absolute bottom-24 right-0 w-[380px] rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl',
                                isDark 
                                    ? 'bg-cyber-dark/90 border border-white/10' 
                                    : 'bg-white/90 border border-gray-200/50'
                            )}
                        >
                            {/* Header - Minimal */}
                            <div className={cn(
                                'p-4 border-b flex items-center justify-between',
                                isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/50 bg-gray-50/50'
                            )}>
                                <div className="flex items-center gap-3">
                                    <img src="/aibox.png" alt="Nova" className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <h3 className={cn('font-black text-sm', text)}>Nova</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className={cn('text-[10px]', muted)}>Security AI</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={toggleEnabled}
                                        className={cn(
                                            'p-2 rounded-xl transition-colors',
                                            enabled 
                                                ? (isDark ? 'hover:bg-white/10 text-emerald-400' : 'hover:bg-gray-200 text-emerald-600')
                                                : (isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-200 text-gray-400')
                                        )}
                                        title={enabled ? 'Tips enabled' : 'Tips disabled'}
                                    >
                                        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => setIsOpen(false)} 
                                        className={cn('p-2 rounded-xl', isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200', muted)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages - Clean */}
                            <div className={cn('h-[340px] overflow-y-auto p-4 space-y-3', isDark ? 'bg-transparent' : 'bg-white/30')}>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <img src="/aibox.png" alt="Nova" className="w-16 h-16 rounded-full object-cover mb-3 opacity-60" />
                                        <p className={cn('text-sm font-bold', text)}>Ask me anything!</p>
                                        <p className={cn('text-xs mt-1', muted)}>Security tips, passwords, safety — I've got you! 🛡️</p>
                                    </div>
                                ) : messages.map((msg, i) => (
                                    <div key={i} className={cn('flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                        {msg.role === 'assistant' && (
                                            <img src="/aibox.png" alt="" className="w-7 h-7 rounded-full object-cover mr-2 shrink-0 mt-0.5" />
                                        )}
                                        <div className={cn(
                                            'px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed',
                                            msg.role === 'user' 
                                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-md'
                                                : isDark 
                                                    ? 'bg-white/10 text-white rounded-bl-md backdrop-blur-sm'
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && !isStreaming && (
                                    <div className="flex items-center gap-2 pl-10">
                                        <span className={cn('w-2 h-2 rounded-full animate-bounce', isDark ? 'bg-neon-crimson' : 'bg-violet-500')} />
                                        <span className={cn('w-2 h-2 rounded-full animate-bounce', isDark ? 'bg-neon-crimson' : 'bg-violet-500')} style={{ animationDelay: '0.15s' }} />
                                        <span className={cn('w-2 h-2 rounded-full animate-bounce', isDark ? 'bg-neon-crimson' : 'bg-violet-500')} style={{ animationDelay: '0.3s' }} />
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input - Minimal */}
                            <div className={cn(
                                'p-4 border-t',
                                isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/50 bg-gray-50/50'
                            )}>
                                <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                    <input
                                        type="text" 
                                        value={input} 
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about security..."
                                        className={cn(
                                            'flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all',
                                            isDark 
                                                ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-neon-crimson/50'
                                                : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-500/50'
                                        )}
                                        disabled={isLoading}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!input.trim() || isLoading}
                                        className={cn(
                                            'p-2.5 rounded-xl transition-all',
                                            isDark 
                                                ? 'bg-gradient-to-r from-neon-crimson to-purple-600 text-white disabled:opacity-40'
                                                : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-40',
                                            'hover:scale-105 active:scale-95'
                                        )}
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Big Avatar Button - Using aibox.png */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative cursor-pointer"
                    onClick={handleAvatarClick}
                    onPointerDown={onDragStart}
                >
                    {/* Outer glow ring */}
                    <div className={cn(
                        'absolute inset-0 rounded-full animate-pulse blur-md',
                        isDark ? 'bg-neon-crimson/40' : 'bg-violet-500/40'
                    )} style={{ transform: 'scale(1.15)' }} />
                    
                    {/* Main avatar container - Bigger */}
                    <div className={cn(
                        'relative w-20 h-20 rounded-full overflow-hidden shadow-2xl border-2',
                        isDark 
                            ? 'border-neon-crimson/50 bg-cyber-dark' 
                            : 'border-violet-400/50 bg-white'
                    )}>
                        {/* Animated gradient ring */}
                        <div className={cn(
                            'absolute inset-0 rounded-full',
                            isDark 
                                ? 'bg-gradient-to-r from-neon-crimson via-purple-500 to-neon-crimson' 
                                : 'bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500'
                        )} style={{ 
                            animation: 'spin 4s linear infinite',
                            padding: '3px',
                            backgroundClip: 'content-box'
                        }} />
                        
                        {/* Inner circle with aibox.png */}
                        <div className={cn(
                            'absolute inset-[3px] rounded-full overflow-hidden flex items-center justify-center',
                            isDark ? 'bg-cyber-dark' : 'bg-white'
                        )}>
                            <img 
                                src="/aibox.png" 
                                alt="Nova" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    {/* Online indicator */}
                    <div className={cn(
                        'absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        isDark ? 'bg-cyber-dark border-cyber-dark' : 'bg-white border-white'
                    )}>
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    
                    {/* Tip notification badge */}
                    {enabled && showTip && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                                'absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                isDark 
                                    ? 'bg-neon-crimson border-cyber-dark' 
                                    : 'bg-violet-500 border-white'
                            )}
                        >
                            <Bell size={12} className="text-white" />
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
