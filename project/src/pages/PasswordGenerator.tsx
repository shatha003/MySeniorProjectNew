import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    RefreshCw, 
    Copy, 
    Check, 
    ShieldCheck, 
    ShieldAlert, 
    Shield, 
    Star, 
    Trash2, 
    ShieldHalf, 
    Zap, 
    Hourglass, 
    Clock, 
    Calendar, 
    Lock, 
    Rocket, 
    Ghost, 
    Trophy, 
    Sword, 
    Sparkles,
    KeyRound,
    SlidersHorizontal,
    ShieldQuestion,
    RotateCcw,
    ChevronRight,
    Search
} from 'lucide-react';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuthStore } from '../store/useAuthStore';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { addPasswordHistory, getUserPasswordHistory, updatePasswordHistoryPin, deletePasswordHistory, clearUnpinnedHistory } from '../services/passwordHistoryService';
import { hasVaultSetup, verifyMasterPassword } from '../services/vaultService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 280, damping: 22 },
    },
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
const SIMILAR_CHARS = /[ilLI|`oO01]/g;

interface HistoryItem {
    id: string;
    password: string;
    pinned: boolean;
    createdAt: number;
    entropy: number;
}

const formatTimeToCrack = (entropy: number) => {
    const guessesPerSecond = 1e10;
    const totalCombinations = Math.pow(2, Math.min(entropy, 1024));
    const seconds = totalCombinations / guessesPerSecond;

    if (seconds < 1) return { value: "Instant", unit: "No time at all", color: "text-red-500", bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <Zap size={22} className="animate-pulse" /> };
    if (seconds < 60) return { value: `${Math.round(seconds)}s`, unit: "Quick break", color: "text-orange-500", bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <Hourglass size={22} /> };
    if (seconds < 3600) return { value: `${Math.max(1, Math.round(seconds / 60))}m`, unit: "Snack break", color: "text-amber-500", bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Hourglass size={22} /> };
    if (seconds < 86400) return { value: `${Math.max(1, Math.round(seconds / 3600))}h`, unit: "Gaming day", color: "text-yellow-500", bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Clock size={22} /> };
    if (seconds < 31536000) return { value: `${Math.max(1, Math.round(seconds / 86400))}d`, unit: "School week", color: "text-emerald-500", bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Clock size={22} /> };
    if (seconds < 3153600000) return { value: "Years", unit: "A lifetime", color: "text-emerald-500", bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Calendar size={22} /> };
    if (seconds < 315360000000) return { value: "Centuries", unit: "Super hacker proof", color: "text-purple-500", bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Trophy size={22} /> };

    return { value: "Forever!", unit: "Galaxy guarded", color: "text-indigo-500", bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: <Rocket size={22} className="animate-bounce" /> };
};

export default function PasswordGenerator() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [copied, setCopied] = useState(false);

    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [excludeSimilar, setExcludeSimilar] = useState(true);

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const { user, masterPassword, setMasterPassword } = useAuthStore();
    const [unlockPassword, setUnlockPassword] = useState('');
    const [unlockError, setUnlockError] = useState('');
    const [vaultSetup, setVaultSetup] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const trackActivity = useTrackActivity();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            hasVaultSetup(user.uid).then(setVaultSetup);
        }
    }, [user]);

    useEffect(() => {
        if (user && masterPassword) {
            loadHistory();
        } else {
            setHistory([]);
        }
    }, [user, masterPassword]);

    const loadHistory = async () => {
        if (!user || !masterPassword) return;
        setIsLoadingHistory(true);
        try {
            const items = await getUserPasswordHistory(user.uid);
            const decryptedItems: HistoryItem[] = [];
            for (const item of items) {
                try {
                    const decrypted = await invoke<string>('decrypt_text', {
                        encoded: item.encryptedPassword,
                        password: masterPassword
                    });
                    decryptedItems.push({
                        id: item.id!,
                        password: decrypted,
                        pinned: item.pinned,
                        createdAt: item.createdAt as number,
                        entropy: item.entropy
                    });
                } catch (e) {
                    console.error("Failed to decrypt history item", e);
                }
            }
            setHistory(decryptedItems);
        } catch (error) {
            console.error("Failed to load password history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const calculateEntropy = useCallback((len: number, poolSize: number) => {
        if (poolSize === 0) return 0;
        return len * Math.log2(poolSize);
    }, []);

    const generatePassword = useCallback((saveToHistory = true) => {
        let charset = "";
        if (useUppercase) charset += UPPERCASE;
        if (useLowercase) charset += LOWERCASE;
        if (useNumbers) charset += NUMBERS;
        if (useSymbols) charset += SYMBOLS;

        if (excludeSimilar) {
            charset = charset.replace(SIMILAR_CHARS, '');
        }

        if (charset.length === 0) {
            charset = LOWERCASE;
            setUseLowercase(true);
        }

        let newPassword = "";
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length];
        }

        const entropy = calculateEntropy(length, charset.length);
        setPassword(newPassword);

        if (saveToHistory) {
            trackActivity('generate_password');
        }

        if (saveToHistory && user && masterPassword) {
            (async () => {
                try {
                    const encryptedPassword = await invoke<string>('encrypt_text', {
                        plaintext: newPassword,
                        password: masterPassword,
                        algorithm: 'AES-256-GCM'
                    });

                    const firestoreId = await addPasswordHistory(user.uid, {
                        encryptedPassword,
                        pinned: false,
                        entropy
                    });

                    setHistory(prev => {
                        const newItem: HistoryItem = {
                            id: firestoreId,
                            password: newPassword,
                            pinned: false,
                            createdAt: Date.now(),
                            entropy
                        };
                        const updated = [newItem, ...prev];
                        const pinned = updated.filter(i => i.pinned);
                        const unpinned = updated.filter(i => !i.pinned).slice(0, 50);
                        return [...pinned, ...unpinned].map(i => updated.find(u => u.id === i.id)!);
                    });
                } catch (error) {
                    console.error("Failed to encrypt and save password history", error);
                }
            })();
        }
    }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, calculateEntropy, user, masterPassword, trackActivity]);

    useEffect(() => {
        generatePassword(false);
    }, [generatePassword]);

    const handleCopy = (text: string, id: string | null = null) => {
        navigator.clipboard.writeText(text);
        if (id) {
            setCopiedHistoryId(id);
            setTimeout(() => setCopiedHistoryId(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            setHistory(prev => {
                if (prev.length > 0 && prev[0].password === text) return prev;

                let pSize = 0;
                if (useUppercase) pSize += 26;
                if (useLowercase) pSize += 26;
                if (useNumbers) pSize += 10;
                if (useSymbols) pSize += SYMBOLS.length;
                if (excludeSimilar) pSize -= 7;
                if (pSize <= 0) pSize = 26;

                const newItem: HistoryItem = {
                    id: crypto.randomUUID(),
                    password: text,
                    pinned: false,
                    createdAt: Date.now(),
                    entropy: calculateEntropy(text.length, pSize)
                };

                const updated = [newItem, ...prev];
                const pinned = updated.filter(i => i.pinned);
                const unpinned = updated.filter(i => !i.pinned).slice(0, 50);
                return [...pinned, ...unpinned].map(i => updated.find(u => u.id === i.id)!);
            });
        }
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (unlockPassword.length < 4) {
            setUnlockError('Password is too short');
            return;
        }

        setIsVerifying(true);
        try {
            const isValid = await verifyMasterPassword(user.uid, unlockPassword);
            if (isValid) {
                setMasterPassword(unlockPassword);
                setUnlockError('');
                setUnlockPassword('');
            } else {
                setUnlockError('Incorrect Master Password');
            }
        } catch (error: any) {
            if (error.message === 'vault_not_initialized') {
                setVaultSetup(false);
            } else {
                setUnlockError('Verification failed');
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const togglePin = async (id: string) => {
        const item = history.find(i => i.id === id);
        if (!item || !user) return;

        try {
            await updatePasswordHistoryPin(user.uid, id, !item.pinned);
            setHistory(prev => prev.map(i =>
                i.id === id ? { ...i, pinned: !i.pinned } : i
            ));
        } catch (error) {
            console.error("Failed to pin item", error);
        }
    };

    const clearHistory = async () => {
        if (!user) return;
        if (confirm("Are you sure you want to clear unpinned history?")) {
            try {
                setIsLoadingHistory(true);
                await clearUnpinnedHistory(user.uid);
                setHistory(prev => prev.filter(item => item.pinned));
            } catch (error) {
                console.error("Failed to clear history", error);
            } finally {
                setIsLoadingHistory(false);
            }
        }
    };

    const removeHistoryItem = async (id: string) => {
        if (!user) return;
        try {
            await deletePasswordHistory(user.uid, id);
            setHistory(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to remove history item", error);
        }
    };

    let poolSize = 0;
    if (useUppercase) poolSize += 26;
    if (useLowercase) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += SYMBOLS.length;
    if (excludeSimilar) poolSize -= 7;
    if (poolSize <= 0) poolSize = 26;

    const currentEntropy = calculateEntropy(length, poolSize);
    const timeToCrack = formatTimeToCrack(currentEntropy);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const strengthConfig = {
        weak: {
            color: 'from-red-500 to-orange-600',
            glow: 'shadow-red-500/30',
            bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
            border: 'border-red-500/20',
            text: 'text-red-500',
            label: 'WEAK PASSWORD!',
            icon: ShieldAlert,
            width: '25%',
        },
        fair: {
            color: 'from-amber-400 to-yellow-500',
            glow: 'shadow-amber-500/30',
            bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            border: 'border-amber-500/20',
            text: 'text-amber-500',
            label: 'FAIR PASSWORD!',
            icon: ShieldHalf,
            width: '50%',
        },
        strong: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'STRONG PASSWORD!',
            icon: ShieldCheck,
            width: '75%',
        },
        ultra: {
            color: 'from-indigo-400 to-purple-600',
            glow: 'shadow-indigo-500/30',
            bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
            border: 'border-indigo-500/20',
            text: 'text-indigo-500',
            label: 'ULTRA STRONG!',
            icon: Sparkles,
            width: '100%',
        },
    };

    const getStrengthConfig = () => {
        if (currentEntropy >= 80) return strengthConfig.ultra;
        if (currentEntropy >= 60) return strengthConfig.strong;
        if (currentEntropy >= 40) return strengthConfig.fair;
        return strengthConfig.weak;
    };

    const strengthConfig_current = getStrengthConfig();
    const StrengthIcon = strengthConfig_current.icon;

    const sortedHistory = [...history].sort((a, b) => {
        if (a.pinned === b.pinned) {
            return b.createdAt - a.createdAt;
        }
        return a.pinned ? -1 : 1;
    });

    return (
        <motion.div
            className="relative min-h-full pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-8 max-w-6xl mx-auto">
                {/* Friendly Hero Header */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30`}>
                                        <KeyRound size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Password Generator
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Create unbreakable passwords that keep the bad guys out! 🛡️
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+10 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Generation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Password Output + Strength Card */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${strengthConfig_current.border} ${strengthConfig_current.bg} p-8 md:p-10 shadow-2xl relative overflow-hidden`}>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${strengthConfig_current.color} flex items-center justify-center text-white shadow-2xl ${strengthConfig_current.glow} transform -rotate-6`}>
                                    <StrengthIcon size={48} />
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <div className={`text-xs font-black uppercase tracking-[0.2em] ${strengthConfig_current.text}`}>
                                        Strength Level
                                    </div>
                                    <h2 className={`text-4xl md:text-5xl font-black font-display ${headingColor}`}>
                                        {strengthConfig_current.label}
                                    </h2>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-current/10 text-sm font-bold font-mono tracking-wider ${mutedText} mt-2`}>
                                        <span className="max-w-[200px] md:max-w-md truncate">{password || 'Generate one...'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Big Score Stats */}
                            <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                                {[
                                    { label: 'Entropy', value: `${currentEntropy.toFixed(0)}`, color: strengthConfig_current.text },
                                    { label: 'Length', value: length, color: 'text-blue-500' },
                                    { label: 'Crack Time', value: timeToCrack.value, color: timeToCrack.color }
                                ].map((stat, i) => (
                                    <div key={i} className={`flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-current/5`}>
                                        <span className={`text-2xl md:text-3xl font-black font-display ${stat.color}`}>{stat.value}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copy & Generate Buttons */}
                        <div className="flex gap-4 mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (password) handleCopy(password);
                                }}
                                disabled={!password}
                                className={`flex items-center gap-3 px-8 py-4 font-display text-lg font-black rounded-2xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
                                    isDark
                                        ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-105'
                                        : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105'
                                }`}
                            >
                                {copied ? <Check size={24} /> : <Copy size={24} />}
                                {copied ? 'Copied!' : 'Copy!'}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => generatePassword(true)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 font-display font-black transition-all ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
                            >
                                <RefreshCw size={20} />
                                Generate New
                            </motion.button>
                        </div>

                        {/* Strength Bar */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-black uppercase tracking-wider ${mutedText}`}>Password Strength</span>
                                <span className={`text-xs font-black uppercase tracking-wider ${strengthConfig_current.text}`}>{strengthConfig_current.label}</span>
                            </div>
                            <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${strengthConfig_current.color} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: strengthConfig_current.width }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Length Slider Card */}
                    <motion.div
                        className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                <SlidersHorizontal size={24} />
                            </div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Password Length</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className={`text-sm font-bold ${mutedText}`}>Characters</span>
                                <span className={`text-5xl font-black ${headingColor}`}>{length}</span>
                            </div>
                            <div className="relative w-full h-4 bg-muted rounded-full overflow-visible flex items-center border-2 border-border/50">
                                <motion.div
                                    className="absolute left-0 h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full pointer-events-none"
                                    animate={{ width: `${((length - 8) / (128 - 8)) * 100}%` }}
                                ></motion.div>
                                <motion.div
                                    className="absolute w-10 h-10 bg-primary border-4 border-background rounded-2xl shadow-xl pointer-events-none flex items-center justify-center cursor-grab active:cursor-grabbing"
                                    animate={{ left: `calc(${((length - 8) / (128 - 8)) * 100}% - 20px)` }}
                                >
                                    <div className="w-1.5 h-4 bg-background/50 rounded-full mx-0.5" />
                                    <div className="w-1.5 h-4 bg-background/50 rounded-full mx-0.5" />
                                </motion.div>
                                <input
                                    type="range"
                                    min="8"
                                    max="128"
                                    value={length}
                                    onChange={(e) => setLength(parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground font-black tracking-tighter uppercase px-1">
                                <span>Tiny</span>
                                <span>Pro</span>
                                <span>Super Huge</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Time to Crack Card */}
                    <motion.div
                        className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${timeToCrack.bg} ${timeToCrack.color}`}>
                                {timeToCrack.icon}
                            </div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Time to Crack</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className={`text-sm font-bold ${mutedText}`}>Estimated time</span>
                                <span className={`text-4xl font-black ${timeToCrack.color}`}>{timeToCrack.value}</span>
                            </div>
                            <p className={`text-lg font-bold leading-relaxed ${headingColor}`}>
                                {currentEntropy >= 80 ? 'Wow! This password would take forever to crack. Super hacker proof! 🌟' :
                                 currentEntropy >= 60 ? 'Looking great! It would take years to break this one. 👍' :
                                 currentEntropy >= 40 ? 'Not bad, but adding more length or symbols would make it stronger! 🤔' :
                                 'Uh oh... This password could be cracked quickly. Add more characters! 🛑'}
                            </p>
                            <div className={`text-sm ${mutedText} font-medium`}>
                                Based on 10 billion guesses per second.
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Character Options */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg`}>
                        <div className={`flex items-center gap-3 mb-8`}>
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                <ShieldQuestion size={24} />
                            </div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Character Options</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <label className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useUppercase ? 'border-primary/40 bg-primary/5' : `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} hover:border-primary/20`}`}>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${useUppercase ? 'bg-primary border-primary text-primary-foreground' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useUppercase && <Check className="w-5 h-5 font-black" />}
                                </div>
                                <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="hidden" />
                                <div>
                                    <p className={`font-black text-base ${headingColor}`}>Uppercase</p>
                                    <p className={`text-xs font-mono tracking-widest ${mutedText}`}>ABC...</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useLowercase ? 'border-emerald-500/40 bg-emerald-500/5' : `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} hover:border-emerald-500/20`}`}>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${useLowercase ? 'bg-emerald-500 border-emerald-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useLowercase && <Check className="w-5 h-5 font-black" />}
                                </div>
                                <input type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} className="hidden" />
                                <div>
                                    <p className={`font-black text-base ${headingColor}`}>Lowercase</p>
                                    <p className={`text-xs font-mono tracking-widest ${mutedText}`}>abc...</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useNumbers ? 'border-amber-500/40 bg-amber-500/5' : `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} hover:border-amber-500/20`}`}>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${useNumbers ? 'bg-amber-500 border-amber-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useNumbers && <Check className="w-5 h-5 font-black" />}
                                </div>
                                <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="hidden" />
                                <div>
                                    <p className={`font-black text-base ${headingColor}`}>Numbers</p>
                                    <p className={`text-xs font-mono tracking-widest ${mutedText}`}>123...</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useSymbols ? 'border-indigo-500/40 bg-indigo-500/5' : `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} hover:border-indigo-500/20`}`}>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${useSymbols ? 'bg-indigo-500 border-indigo-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useSymbols && <Check className="w-5 h-5 font-black" />}
                                </div>
                                <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="hidden" />
                                <div>
                                    <p className={`font-black text-base ${headingColor}`}>Symbols</p>
                                    <p className={`text-xs font-mono tracking-widest ${mutedText}`}>!@#...</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${excludeSimilar ? 'border-purple-500/40 bg-purple-500/5' : `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} hover:border-purple-500/20`}`}>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${excludeSimilar ? 'bg-purple-500 border-purple-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {excludeSimilar && <Check className="w-5 h-5 font-black" />}
                                </div>
                                <input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} className="hidden" />
                                <div>
                                    <p className={`font-black text-base ${headingColor}`}>No Confusing</p>
                                    <p className={`text-xs font-bold ${mutedText}`}>Removes 1, l, I, 0, O</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* History / Vault Section */}
                {!masterPassword ? (
                    <motion.div key="vault-locked" variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <Lock className="text-primary" />
                                    <h2 className={`font-display text-2xl font-black ${headingColor}`}>Password Vault</h2>
                                </div>
                                <span className={`text-sm font-bold ${mutedText}`}>Locked</span>
                            </div>

                            <div className="p-10">
                                {!vaultSetup ? (
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldAlert className="text-rose-500" size={40} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Setup Required!</h3>
                                        <p className={`text-lg ${mutedText} max-w-md mx-auto`}>
                                            To save your passwords, you need to create a Master Password first.
                                        </p>
                                        <Button onClick={() => navigate('/dashboard/settings')} className="px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-500/20" size="lg">
                                            GO TO SETTINGS 🚀
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-6 max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Lock className="text-primary" size={40} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Vault Locked</h3>
                                        <p className={`text-lg ${mutedText}`}>
                                            Enter your Master Password to see your saved passwords!
                                        </p>
                                        <form onSubmit={handleUnlock} className="space-y-4 text-left">
                                            <div className="space-y-2">
                                                <PasswordInput
                                                    label="Master Password"
                                                    placeholder="Enter secret..."
                                                    value={unlockPassword}
                                                    onChange={(e: any) => setUnlockPassword(e.target.value)}
                                                    required
                                                />
                                                {unlockError && <p className="text-sm font-bold text-rose-500 text-left px-1">{unlockError}</p>}
                                            </div>
                                            <Button type="submit" className="w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20" size="lg" disabled={isVerifying}>
                                                {isVerifying ? 'OPENING...' : 'UNLOCK VAULT 🔓'}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="vault-unlocked" variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500" />
                                    <h2 className={`font-display text-2xl font-black ${headingColor}`}>Saved Passwords</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold ${mutedText}`}>{history.length} Saved</span>
                                    <button
                                        onClick={() => setMasterPassword(null)}
                                        className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        title="Lock Vault"
                                    >
                                        <Lock size={18} />
                                    </button>
                                    {history.filter(h => !h.pinned).length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                                            title="Clear Unpinned"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {isLoadingHistory ? (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <RefreshCw className="text-primary animate-spin" size={32} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Loading Vault...</h3>
                                    </div>
                                ) : sortedHistory.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sortedHistory.map((item) => {
                                            const itemStrength = item.entropy >= 80 ? strengthConfig.ultra :
                                                                 item.entropy >= 60 ? strengthConfig.strong :
                                                                 item.entropy >= 40 ? strengthConfig.fair :
                                                                 strengthConfig.weak;
                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    className={`group flex flex-col p-5 rounded-2xl border-2 transition-all ${item.pinned 
                                                        ? `${isDark ? 'bg-primary/5 border-primary/30' : 'bg-primary/5 border-primary/20'}` 
                                                        : `${isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-primary/30' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`
                                                    }`}
                                                    whileHover={{ x: 5, scale: 1.02 }}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`font-mono truncate mr-3 text-sm font-black tracking-wider ${headingColor}`}>
                                                            {item.password}
                                                        </div>
                                                        <div className="flex shrink-0 gap-1">
                                                            <button
                                                                onClick={() => togglePin(item.id)}
                                                                className={`p-2 rounded-xl transition-all hover:scale-110 ${item.pinned ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : `${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'}`}`}
                                                                title={item.pinned ? "Unpin" : "Pin"}
                                                            >
                                                                <Star size={16} fill={item.pinned ? "currentColor" : "none"} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCopy(item.password, item.id)}
                                                                className={`p-2 rounded-xl transition-all hover:scale-110 ${copiedHistoryId === item.id ? 'text-emerald-500 bg-emerald-500/10' : `${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'}`}`}
                                                                title="Copy"
                                                            >
                                                                {copiedHistoryId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                                            </button>
                                                            {!item.pinned && (
                                                                <button
                                                                    onClick={() => removeHistoryItem(item.id)}
                                                                    className="p-2 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all hover:scale-110"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} /> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(item.createdAt))}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full border ${itemStrength.bg} ${itemStrength.text} ${itemStrength.border}`}>
                                                            {item.entropy >= 80 ? 'SUPER' : item.entropy >= 60 ? 'MASTER' : item.entropy >= 40 ? 'GUARD' : 'BASIC'}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={`py-16 text-center border-4 border-dashed ${isDark ? 'border-white/5' : 'border-gray-100'} rounded-3xl`}>
                                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className={`text-primary/20`} size={40} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>No passwords yet!</h3>
                                        <p className={`text-lg ${mutedText} mt-2`}>Generate some passwords to see them here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
