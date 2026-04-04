import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Shield, Star, Trash2, ShieldHalf, Zap, Hourglass, Clock, Calendar, Lock, Rocket, Ghost, Trophy, Sword, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuthStore } from '../store/useAuthStore';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { addPasswordHistory, getUserPasswordHistory, updatePasswordHistoryPin, deletePasswordHistory, clearUnpinnedHistory } from '../services/passwordHistoryService';
import { hasVaultSetup, verifyMasterPassword } from '../services/vaultService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryItem {
    id: string;
    password: string;
    pinned: boolean;
    createdAt: number;
    entropy: number;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
const SIMILAR_CHARS = /[ilLI|`oO01]/g;

const formatTimeToCrack = (entropy: number) => {
    // Assume offline cracking speed of ~10 billion guesses/second
    const guessesPerSecond = 1e10;
    const totalCombinations = Math.pow(2, Math.min(entropy, 1024));
    const seconds = totalCombinations / guessesPerSecond;

    if (seconds < 1) return { value: "In a blink!", unit: "", color: "bg-rose-500/10 text-rose-500", icon: <Zap size={22} className="animate-pulse" /> };
    if (seconds < 60) return { value: "Super Fast", unit: "by a hacker", color: "bg-rose-500/10 text-rose-500", icon: <Hourglass size={22} /> };
    if (seconds < 3600) return { value: Math.max(1, Math.round(seconds / 60)).toString(), unit: "mins (Snack break)", color: "bg-amber-500/10 text-amber-500", icon: <Hourglass size={22} /> };
    if (seconds < 86400) return { value: Math.max(1, Math.round(seconds / 3600)).toString(), unit: "hours (Gaming day)", color: "bg-amber-500/10 text-amber-500", icon: <Clock size={22} /> };
    if (seconds < 31536000) return { value: Math.max(1, Math.round(seconds / 86400)).toString(), unit: "days (School week)", color: "bg-emerald-500/10 text-emerald-500", icon: <Clock size={22} /> };
    if (seconds < 3153600000) return { value: "A Lifetime", unit: "(Until you grow up)", color: "bg-emerald-500/10 text-emerald-500", icon: <Calendar size={22} /> };
    if (seconds < 315360000000) return { value: "Centuries", unit: "(Super Hacker proof)", color: "bg-purple-500/10 text-purple-500", icon: <Trophy size={22} /> };

    return { value: "Forever!", unit: "(Galaxy Guarded)", color: "bg-indigo-500/10 text-indigo-500", icon: <Rocket size={22} className="animate-bounce" /> };
};

export default function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [copied, setCopied] = useState(false);

    // Options
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [excludeSimilar, setExcludeSimilar] = useState(true);

    // History and State
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Auth & Lock
    const { user, masterPassword, setMasterPassword } = useAuthStore();
    const [unlockPassword, setUnlockPassword] = useState('');
    const [unlockError, setUnlockError] = useState('');
    const [vaultSetup, setVaultSetup] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const trackActivity = useTrackActivity();
    const navigate = useNavigate();

    // Load setup status
    useEffect(() => {
        if (user) {
            hasVaultSetup(user.uid).then(setVaultSetup);
        }
    }, [user]);

    // Load history from Firestore on mount or login
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

            // Decrypt all items
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
            // Fallback if user unchecks everything
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

        // Track activity when password is generated (only when saving to history)
        if (saveToHistory) {
            trackActivity('generate_password');
        }

        // Add to history (limit to 50 unpinned items to save space)
        if (saveToHistory && user && masterPassword) {
            // Async wrapper inside useCallback
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
                        // Keep all pinned + up to 50 unpinned
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

    // Auto-generate when options change (but don't flood history)
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

            // If the user liked the password enough to copy it after tweaking settings, make sure it's in history!
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

    // Calculate current strength
    let poolSize = 0;
    if (useUppercase) poolSize += 26;
    if (useLowercase) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += SYMBOLS.length;
    if (excludeSimilar) poolSize -= 7; // Approx reduction
    if (poolSize <= 0) poolSize = 26;

    const currentEntropy = calculateEntropy(length, poolSize);
    const timeToCrack = formatTimeToCrack(currentEntropy);

    let strengthLabel = "BEGINNER NINJA";
    let strengthColor = "text-rose-500";
    let strengthBgClass = "bg-rose-500";
    let strengthIcon = <Sword size={16} />;
    let strengthWidth = "w-1/4";

    if (currentEntropy >= 80) {
        strengthLabel = "SUPER NINJA";
        strengthColor = "text-indigo-500";
        strengthBgClass = "bg-indigo-500";
        strengthIcon = <Sparkles size={16} />;
        strengthWidth = "w-full";
    } else if (currentEntropy >= 60) {
        strengthLabel = "MASTER GUARD";
        strengthColor = "text-emerald-500";
        strengthBgClass = "bg-emerald-500";
        strengthIcon = <ShieldCheck size={16} />;
        strengthWidth = "w-3/4";
    } else if (currentEntropy >= 40) {
        strengthLabel = "ADVANCED SCOUT";
        strengthColor = "text-amber-500";
        strengthBgClass = "bg-amber-500";
        strengthIcon = <ShieldHalf size={16} />;
        strengthWidth = "w-1/2";
    }

    // Sort history: pinned first, then by date desc
    const sortedHistory = [...history].sort((a, b) => {
        if (a.pinned === b.pinned) {
            return b.createdAt - a.createdAt;
        }
        return a.pinned ? -1 : 1;
    });

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
            >
                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-emerald-500">
                    SUPER NINJA PASSWORD MAKER
                </h1>
                <p className="text-muted-foreground font-medium">
                    Create unbreakable secret codes that keep the bad guys out! 🛡️
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Generator Controls & Output */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-primary/30 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardContent className="pt-6 space-y-8">
                            {/* Password Display Box */}
                            <div className="relative group">
                                <motion.div 
                                    layoutId="password-box"
                                    className="flex items-center justify-between p-8 bg-primary/5 border-4 border-primary/20 rounded-3xl hover:border-primary/50 transition-all shadow-inner relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />
                                    <span className="text-3xl sm:text-5xl font-mono tracking-widest break-all select-all font-black text-primary drop-shadow-sm z-10">
                                        {password}
                                    </span>
                                    <div className="flex gap-3 shrink-0 flex-col sm:flex-row z-10">
                                        <button
                                            onClick={() => handleCopy(password)}
                                            className="p-4 bg-secondary rounded-2xl text-secondary-foreground hover:bg-secondary/80 transition-all hover:scale-110 active:scale-95 shadow-lg group/btn"
                                            title="Copy Code"
                                        >
                                            {copied ? <Check className="text-emerald-500 w-8 h-8" /> : <Copy className="w-8 h-8" />}
                                        </button>
                                        <button
                                            onClick={() => generatePassword(true)}
                                            className="p-4 bg-primary rounded-2xl text-primary-foreground hover:bg-primary/90 transition-all hover:scale-110 active:rotate-90 active:scale-95 shadow-lg shadow-primary/20"
                                            title="Make New Code"
                                        >
                                            <RefreshCw className="w-8 h-8 transition-transform duration-500 group-hover:rotate-180" />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Strength Indicator */}
                            <div className="space-y-3 bg-muted/20 p-6 rounded-3xl border-2 border-border shadow-md">
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-sm uppercase tracking-widest text-muted-foreground">SHIELD DEFENSE LEVEL</span>
                                    <motion.span 
                                        key={strengthLabel}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`font-black flex items-center gap-2 px-4 py-1.5 rounded-full text-sm ${strengthColor} bg-current/10 border-2 border-current/20 shadow-sm`}
                                    >
                                        {strengthIcon} {strengthLabel}
                                    </motion.span>
                                </div>
                                <div className="h-4 w-full bg-muted rounded-full overflow-hidden border-2 border-border/50">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: strengthWidth.replace('w-', '') }}
                                        className={`h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,0,0,0.1)] ${strengthBgClass}`}
                                        style={{ width: strengthWidth === "w-full" ? "100%" : strengthWidth === "w-3/4" ? "75%" : strengthWidth === "w-1/2" ? "50%" : "25%" }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/60">
                                    <p>SHIELD POINTS: ~{currentEntropy.toFixed(1)} XP</p>
                                    <p className="flex items-center gap-1"><Ghost size={12} /> HACKER PROOF</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-8 pt-4 border-t-2 border-dashed border-border">

                                {/* Time to Crack Visualization */}
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl border-4 transition-all duration-700 ease-out ${timeToCrack.color.split(' ')[0]} border-current/20 hover:shadow-2xl relative overflow-hidden group bg-card`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-transparent via-current to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] transition-opacity duration-700 pointer-events-none"></div>

                                    <div className="flex items-center gap-4 mb-4 sm:mb-0 relative z-10 w-full sm:w-auto">
                                        <div className={`p-4 rounded-2xl bg-background/90 shadow-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${timeToCrack.color.split(' ')[1]}`}>
                                            {timeToCrack.icon}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-foreground tracking-tight">Hacker Guess Time</p>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Estimated defense time</p>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-2 relative z-10 w-full sm:w-auto justify-end flex-wrap overflow-visible" key={timeToCrack.value + timeToCrack.unit}>
                                        <span className={`text-5xl sm:text-6xl font-black tracking-tighter pl-1 ${timeToCrack.color.split(' ')[1]} drop-shadow-md animate-in slide-in-from-bottom-8 fade-in zoom-in-75 duration-700 ease-out`}>
                                            {timeToCrack.value}
                                        </span>
                                        {timeToCrack.unit && (
                                            <span className={`text-xs sm:text-sm font-black uppercase tracking-widest ${timeToCrack.color.split(' ')[1]} opacity-90 backdrop-blur-md px-3 py-1.5 rounded-xl bg-background/60 shadow-lg animate-in slide-in-from-right-6 fade-in duration-1000 delay-200 fill-mode-backwards border-2 border-current/10`}>
                                                {timeToCrack.unit}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Length Slider */}
                                <div className="space-y-6 px-2">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">CODE LENGTH</label>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-primary drop-shadow-sm">
                                                {length}
                                            </span>
                                            <span className="text-sm font-bold text-muted-foreground uppercase">Symbols</span>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-4 bg-muted rounded-full overflow-visible flex items-center border-2 border-border/50">
                                        {/* Filled Track */}
                                        <motion.div
                                            className="absolute left-0 h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full pointer-events-none shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                            animate={{ width: `${((length - 8) / (128 - 8)) * 100}%` }}
                                        ></motion.div>
                                        {/* Thumb */}
                                        <motion.div
                                            className="absolute w-10 h-10 bg-primary border-4 border-background rounded-2xl shadow-xl pointer-events-none transition-all flex items-center justify-center cursor-grab active:cursor-grabbing"
                                            animate={{ left: `calc(${((length - 8) / (128 - 8)) * 100}% - 20px)` }}
                                        >
                                            <div className="w-1.5 h-4 bg-background/50 rounded-full mx-0.5" />
                                            <div className="w-1.5 h-4 bg-background/50 rounded-full mx-0.5" />
                                        </motion.div>
                                        {/* Invisible Input */}
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

                                {/* Toggles Map */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`group flex items-center gap-4 p-5 border-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useUppercase ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5' : 'border-border/50 hover:bg-muted/30'}`}>
                                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-colors ${useUppercase ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                            {useUppercase && <Check className="w-5 h-5 font-black" />}
                                        </div>
                                        <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="hidden" />
                                        <div>
                                            <p className="font-black text-lg">BIG Letters</p>
                                            <p className="text-xs text-muted-foreground font-black font-mono tracking-widest">ABC...</p>
                                        </div>
                                    </label>

                                    <label className={`group flex items-center gap-4 p-5 border-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useLowercase ? 'border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-border/50 hover:bg-muted/30'}`}>
                                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-colors ${useLowercase ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30'}`}>
                                            {useLowercase && <Check className="w-5 h-5 font-black" />}
                                        </div>
                                        <input type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} className="hidden" />
                                        <div>
                                            <p className="font-black text-lg">small letters</p>
                                            <p className="text-xs text-muted-foreground font-black font-mono tracking-widest">abc...</p>
                                        </div>
                                    </label>

                                    <label className={`group flex items-center gap-4 p-5 border-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useNumbers ? 'border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5' : 'border-border/50 hover:bg-muted/30'}`}>
                                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-colors ${useNumbers ? 'bg-amber-500 border-amber-500 text-white' : 'border-muted-foreground/30'}`}>
                                            {useNumbers && <Check className="w-5 h-5 font-black" />}
                                        </div>
                                        <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="hidden" />
                                        <div>
                                            <p className="font-black text-lg">Lucky Numbers</p>
                                            <p className="text-xs text-muted-foreground font-black font-mono tracking-widest">123...</p>
                                        </div>
                                    </label>

                                    <label className={`group flex items-center gap-4 p-5 border-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${useSymbols ? 'border-indigo-500/40 bg-indigo-500/5 shadow-lg shadow-indigo-500/5' : 'border-border/50 hover:bg-muted/30'}`}>
                                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-colors ${useSymbols ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-muted-foreground/30'}`}>
                                            {useSymbols && <Check className="w-5 h-5 font-black" />}
                                        </div>
                                        <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="hidden" />
                                        <div>
                                            <p className="font-black text-lg">Secret Symbols</p>
                                            <p className="text-xs text-muted-foreground font-black font-mono tracking-widest">!@#...</p>
                                        </div>
                                    </label>

                                    <label className={`group flex items-center gap-4 p-5 border-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.01] active:scale-95 col-span-1 sm:col-span-2 ${excludeSimilar ? 'border-purple-500/40 bg-purple-500/5 shadow-lg shadow-purple-500/5' : 'border-border/50 hover:bg-muted/30'}`}>
                                        <div className={`w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-colors ${excludeSimilar ? 'bg-purple-500 border-purple-500 text-white' : 'border-muted-foreground/30'}`}>
                                            {excludeSimilar && <Check className="w-5 h-5 font-black" />}
                                        </div>
                                        <input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} className="hidden" />
                                        <div>
                                            <p className="font-black text-lg">No Confusing Letters</p>
                                            <p className="text-xs text-muted-foreground font-bold">Removes tricky look-alikes like (1, l, I) and (0, O)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Mini History & Pinning */}
                <div className="lg:col-span-4 space-y-6">
                    {!masterPassword ? (
                        <Card className="shadow-2xl border-4 border-border rounded-3xl flex flex-col h-[500px] overflow-hidden">
                            <div className="p-6 border-b-4 border-border bg-muted/30 flex justify-between items-center">
                                <h3 className="font-black flex items-center gap-2 text-lg uppercase tracking-wider">
                                    Your Secret Vault
                                </h3>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                <AnimatePresence mode="wait">
                                {!vaultSetup ? (
                                    <motion.div 
                                        key="setup"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner border-4 border-rose-500/20">
                                            <ShieldAlert size={40} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-2xl">Setup Required!</h4>
                                            <p className="text-sm text-muted-foreground font-medium mt-2">
                                                To save your secret codes, you need to create a Master Password first.
                                            </p>
                                        </div>
                                        <Button onClick={() => navigate('/dashboard/settings')} className="w-full py-6 rounded-2xl font-black text-lg shadow-xl shadow-rose-500/20" size="lg">
                                            GO TO SETTINGS 🚀
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="locked"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full space-y-6"
                                    >
                                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-inner border-4 border-primary/20">
                                            <Lock size={40} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-2xl">Vault Locked</h4>
                                            <p className="text-sm text-muted-foreground font-medium mt-2">
                                                Enter your secret password to see your saved codes!
                                            </p>
                                        </div>
                                        <form onSubmit={handleUnlock} className="w-full space-y-4 text-left">
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
                                            <Button type="submit" className="w-full py-6 rounded-2xl font-black text-lg shadow-xl shadow-primary/20" size="lg" disabled={isVerifying}>
                                                {isVerifying ? 'OPENING...' : 'UNLOCK VAULT 🔓'}
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    ) : (
                        <Card className="shadow-2xl border-4 border-border rounded-3xl flex flex-col max-h-[800px] overflow-hidden">
                            <div className="p-6 border-b-4 border-border bg-muted/30 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                                <h3 className="font-black flex items-center gap-2 text-lg uppercase tracking-wider">
                                    SAVED CODES
                                    <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1 border border-emerald-500/20">
                                        <ShieldCheck size={10} /> CLOUD SYNC
                                    </span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setMasterPassword(null)}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-all bg-accent/50 hover:bg-accent rounded-xl border border-border"
                                        title="Lock Vault"
                                    >
                                        <Lock size={16} />
                                    </button>
                                    {history.filter(h => !h.pinned).length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="p-2 text-muted-foreground hover:text-rose-500 transition-all bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20"
                                            title="Clear Unpinned"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                {isLoadingHistory ? (
                                    <div className="text-center p-12 text-muted-foreground flex flex-col items-center justify-center space-y-4">
                                        <RefreshCw size={32} className="animate-spin text-primary" />
                                        <p className="font-black uppercase tracking-widest text-sm">Searching Vault...</p>
                                    </div>
                                ) : sortedHistory.length === 0 ? (
                                    <div className="text-center p-12 text-muted-foreground flex flex-col items-center justify-center space-y-4">
                                        <Ghost size={48} className="opacity-20" />
                                        <p className="font-black uppercase tracking-widest text-sm">Vault is Empty!</p>
                                        <p className="text-xs font-medium">Make some codes to see them here.</p>
                                    </div>
                                ) : (
                                    sortedHistory.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`group relative flex flex-col p-4 rounded-2xl border-4 text-sm transition-all hover:shadow-xl hover:-translate-y-1 ${item.pinned ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' : 'bg-card border-border hover:border-primary/20'}`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="font-mono truncate mr-3 w-3/4 select-all text-sm sm:text-base font-black tracking-wider text-foreground">
                                                    {item.password}
                                                </div>
                                                <div className="flex shrink-0 gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => togglePin(item.id)}
                                                        className={`p-2 rounded-xl transition-all hover:scale-110 ${item.pinned ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-muted-foreground hover:bg-muted border border-transparent'}`}
                                                        title={item.pinned ? "Unpin code" : "Pin code"}
                                                    >
                                                        <Star size={16} fill={item.pinned ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item.password, item.id)}
                                                        className="p-2 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent transition-all hover:scale-110"
                                                        title="Copy"
                                                    >
                                                        {copiedHistoryId === item.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                                    </button>
                                                    {!item.pinned && (
                                                        <button
                                                            onClick={() => removeHistoryItem(item.id)}
                                                            className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-transparent transition-all hover:scale-110"
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
                                                <span className="flex items-center gap-1">
                                                    {item.entropy >= 80 ? (
                                                        <span className="text-indigo-500 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20"><Sparkles size={10} /> SUPER</span>
                                                    ) : item.entropy >= 60 ? (
                                                        <span className="text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"><ShieldCheck size={10} /> MASTER</span>
                                                    ) : item.entropy >= 40 ? (
                                                        <span className="text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><ShieldHalf size={10} /> GUARD</span>
                                                    ) : (
                                                        <span className="text-rose-500 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20"><Shield size={10} /> BASIC</span>
                                                    )}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
