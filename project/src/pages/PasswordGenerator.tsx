import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Shield, Star, Trash2, ShieldHalf, Zap, Hourglass, Clock, Calendar, Infinity as InfinityIcon, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuthStore } from '../store/useAuthStore';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { addPasswordHistory, getUserPasswordHistory, updatePasswordHistoryPin, deletePasswordHistory, clearUnpinnedHistory } from '../services/passwordHistoryService';
import { hasVaultSetup, verifyMasterPassword } from '../services/vaultService';
import { useNavigate } from 'react-router-dom';

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

    if (seconds < 1) return { value: "Instantly", unit: "", color: "bg-destructive/10 text-destructive", icon: <Zap size={22} /> };
    if (seconds < 60) return { value: Math.max(1, Math.round(seconds)).toString(), unit: "seconds", color: "bg-destructive/10 text-destructive", icon: <Hourglass size={22} /> };
    if (seconds < 3600) return { value: Math.max(1, Math.round(seconds / 60)).toString(), unit: "minutes", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: <Hourglass size={22} /> };
    if (seconds < 86400) return { value: Math.max(1, Math.round(seconds / 3600)).toString(), unit: "hours", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: <Clock size={22} /> };
    if (seconds < 31536000) return { value: Math.max(1, Math.round(seconds / 86400)).toString(), unit: "days", color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: <Clock size={22} /> };
    if (seconds < 3153600000) return { value: Math.max(1, Math.round(seconds / 31536000)).toString(), unit: "years", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: <Calendar size={22} /> };
    if (seconds < 315360000000) return { value: Math.max(1, Math.round(seconds / 3153600000)).toString(), unit: "centuries", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: <Calendar size={22} /> };

    return { value: "Forever", unit: "(\u221E)", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", icon: <InfinityIcon size={22} /> };
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

    let strengthLabel = "WEAK";
    let strengthColor = "text-destructive";
    let strengthBgClass = "bg-destructive";
    let strengthIcon = <ShieldAlert size={16} />;
    let strengthWidth = "w-1/4";

    if (currentEntropy >= 80) {
        strengthLabel = "VERY STRONG";
        strengthColor = "text-emerald-500";
        strengthBgClass = "bg-emerald-500";
        strengthIcon = <ShieldCheck size={16} />;
        strengthWidth = "w-full";
    } else if (currentEntropy >= 60) {
        strengthLabel = "STRONG";
        strengthColor = "text-green-400";
        strengthBgClass = "bg-green-400";
        strengthIcon = <ShieldCheck size={16} />;
        strengthWidth = "w-3/4";
    } else if (currentEntropy >= 40) {
        strengthLabel = "FAIR";
        strengthColor = "text-yellow-500";
        strengthBgClass = "bg-yellow-500";
        strengthIcon = <ShieldHalf size={16} />;
        strengthWidth = "w-1/2";
    } else {
        strengthLabel = "WEAK";
        strengthColor = "text-destructive";
        strengthBgClass = "bg-destructive";
        strengthIcon = <Shield size={16} />;
        strengthWidth = "w-1/4";
    }

    // Sort history: pinned first, then by date desc
    const sortedHistory = [...history].sort((a, b) => {
        if (a.pinned === b.pinned) {
            return b.createdAt - a.createdAt;
        }
        return a.pinned ? -1 : 1;
    });

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
                <p className="text-muted-foreground">
                    Create strong, secure passwords locally using Web Crypto API.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Generator Controls & Output */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-primary/20 shadow-md">
                        <CardContent className="pt-6 space-y-8">
                            {/* Password Display Box */}
                            <div className="relative group">
                                <div className="flex items-center justify-between p-6 bg-muted/30 border-2 border-border rounded-xl hover:border-primary/50 transition-colors">
                                    <span className="text-2xl sm:text-3xl font-mono tracking-wider break-all select-all font-medium text-foreground mr-4">
                                        {password}
                                    </span>
                                    <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                                        <button
                                            onClick={() => handleCopy(password)}
                                            className="p-3 bg-secondary rounded-lg text-secondary-foreground hover:bg-secondary/80 transition-colors tooltip relative group/btn"
                                            title="Copy Password"
                                        >
                                            {copied ? <Check className="text-emerald-500" /> : <Copy />}
                                        </button>
                                        <button
                                            onClick={() => generatePassword(true)}
                                            className="p-3 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                                            title="Generate New"
                                        >
                                            <RefreshCw className="hover:rotate-180 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Strength Indicator */}
                            <div className="space-y-2 bg-card p-4 rounded-xl border border-border shadow-sm">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-muted-foreground">Password Strength</span>
                                    <span className={`font-bold flex items-center gap-1 ${strengthColor}`}>
                                        {strengthIcon} {strengthLabel}
                                    </span>
                                </div>
                                <div className="flex gap-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ease-out ${strengthBgClass} ${strengthWidth}`}></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right mt-1">Entropy: ~{currentEntropy.toFixed(1)} bits</p>
                            </div>

                            {/* Controls */}
                            <div className="space-y-6 pt-4 border-t border-border">

                                {/* Time to Crack Visualization */}
                                <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border transition-all duration-700 ease-out ${timeToCrack.color.split(' ')[0]} border-current/10 hover:shadow-md transform hover:-translate-y-0.5 relative overflow-hidden group`}>

                                    {/* Subtle pulse background animation */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-current to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-opacity duration-700 pointer-events-none"></div>

                                    <div className="flex items-center gap-4 mb-2 sm:mb-0 relative z-10 w-full sm:w-auto">
                                        <div className={`p-3 rounded-full bg-background/80 shadow-sm transition-transform duration-500 group-hover:scale-110 ${timeToCrack.color.split(' ')[1]}`}>
                                            {timeToCrack.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Time to Crack</p>
                                            <p className="text-xs text-muted-foreground font-medium">Estimated offline attack time</p>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-1.5 relative z-10 w-full sm:w-auto justify-end flex-wrap overflow-visible" key={timeToCrack.value + timeToCrack.unit}>
                                        <span className={`text-4xl sm:text-5xl font-black tracking-tight pl-1 ${timeToCrack.color.split(' ')[1]} drop-shadow-sm animate-in slide-in-from-bottom-6 fade-in zoom-in-75 duration-500 ease-out`}>
                                            {timeToCrack.value}
                                        </span>
                                        {timeToCrack.unit && (
                                            <span className={`text-sm sm:text-base font-bold uppercase tracking-widest ${timeToCrack.color.split(' ')[1]} opacity-90 backdrop-blur-md px-2.5 py-1 rounded-md bg-background/40 shadow-sm animate-in slide-in-from-left-4 fade-in duration-700 delay-150 fill-mode-backwards border border-current/10`}>
                                                {timeToCrack.unit}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Length Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-sm font-medium">Password Length</label>
                                        <span className="text-3xl font-bold text-primary px-4 py-1 bg-primary/10 rounded-lg shadow-inner">
                                            {length}
                                        </span>
                                    </div>
                                    <div className="relative w-full h-3 bg-muted rounded-full overflow-visible flex items-center">
                                        {/* Filled Track */}
                                        <div
                                            className="absolute left-0 h-full bg-primary rounded-full pointer-events-none"
                                            style={{ width: `${((length - 8) / (128 - 8)) * 100}%` }}
                                        ></div>
                                        {/* Thumb */}
                                        <div
                                            className="absolute w-6 h-6 bg-primary border-4 border-background rounded-full shadow-md pointer-events-none transition-transform"
                                            style={{ left: `calc(${((length - 8) / (128 - 8)) * 100}% - 12px)` }}
                                        ></div>
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
                                    <div className="flex justify-between text-xs text-muted-foreground font-medium pt-2">
                                        <span>8</span>
                                        <span>64</span>
                                        <span>128</span>
                                    </div>
                                </div>

                                {/* Toggles Map */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${useUppercase ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'}`}>
                                        <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="w-5 h-5 accent-primary rounded" />
                                        <div>
                                            <p className="font-medium">Uppercase</p>
                                            <p className="text-xs text-muted-foreground font-mono">A-Z</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${useLowercase ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'}`}>
                                        <input type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} className="w-5 h-5 accent-primary rounded" />
                                        <div>
                                            <p className="font-medium">Lowercase</p>
                                            <p className="text-xs text-muted-foreground font-mono">a-z</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${useNumbers ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'}`}>
                                        <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="w-5 h-5 accent-primary rounded" />
                                        <div>
                                            <p className="font-medium">Numbers</p>
                                            <p className="text-xs text-muted-foreground font-mono">0-9</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${useSymbols ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'}`}>
                                        <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="w-5 h-5 accent-primary rounded" />
                                        <div>
                                            <p className="font-medium">Symbols</p>
                                            <p className="text-xs text-muted-foreground font-mono">!@#$*%_+</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors col-span-1 sm:col-span-2 ${excludeSimilar ? 'border-primary/50 bg-primary/5' : 'hover:bg-accent/50'}`}>
                                        <input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} className="w-5 h-5 accent-primary rounded" />
                                        <div>
                                            <p className="font-medium">Exclude Similar Characters</p>
                                            <p className="text-xs text-muted-foreground">Removes ambiguous characters like (1, l, I) and (0, O)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Mini History & Pinning */}
                <div className="lg:col-span-4 space-y-4">
                    {!masterPassword ? (
                        <Card className="shadow-sm border-border flex flex-col h-[450px]">
                            <div className="p-4 border-b border-border bg-card flex justify-between items-center rounded-t-xl">
                                <h3 className="font-semibold flex items-center gap-2">
                                    History
                                </h3>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                {!vaultSetup ? (
                                    <>
                                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                                            <ShieldAlert size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg">Setup Required</h4>
                                            <p className="text-xs text-muted-foreground mt-1 mb-4">
                                                You need to setup a Master Password in the Settings page to use the Vault and History.
                                            </p>
                                        </div>
                                        <Button onClick={() => navigate('/dashboard/settings')} className="w-full" size="sm">
                                            Go to Settings
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg">Vault Locked</h4>
                                            <p className="text-xs text-muted-foreground mt-1 mb-4">
                                                Unlock your vault to securely save and view your password history on the cloud. Generated passwords are kept locally until unlocked.
                                            </p>
                                        </div>
                                        <form onSubmit={handleUnlock} className="w-full space-y-4 text-left">
                                            <div className="space-y-1">
                                                <PasswordInput
                                                    label="Master Password"
                                                    placeholder="..."
                                                    value={unlockPassword}
                                                    onChange={(e: any) => setUnlockPassword(e.target.value)}
                                                    required
                                                />
                                                {unlockError && <p className="text-xs text-destructive text-left">{unlockError}</p>}
                                            </div>
                                            <Button type="submit" className="w-full" size="sm" disabled={isVerifying}>
                                                {isVerifying ? 'Verifying...' : 'Unlock History'}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <Card className="shadow-sm border-border flex flex-col max-h-[700px]">
                            <div className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10 rounded-t-xl">
                                <h3 className="font-semibold flex items-center gap-2">
                                    History
                                    <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full flex items-center gap-1">
                                        <ShieldCheck size={10} /> Sync
                                    </span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setMasterPassword(null)}
                                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors bg-accent/50 hover:bg-accent px-1.5 py-1 rounded"
                                        title="Lock Vault"
                                    >
                                        <Lock size={12} />
                                    </button>
                                    {history.filter(h => !h.pinned).length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors bg-destructive/10 hover:bg-destructive/20 px-1.5 py-1 rounded"
                                            title="Clear Unpinned"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {isLoadingHistory ? (
                                    <div className="text-center p-6 text-muted-foreground flex flex-col items-center justify-center opacity-70">
                                        <RefreshCw size={24} className="mb-2 animate-spin text-primary opacity-50" />
                                        <p className="text-sm">Loading history...</p>
                                    </div>
                                ) : sortedHistory.length === 0 ? (
                                    <div className="text-center p-6 text-muted-foreground flex flex-col items-center justify-center opacity-70">
                                        <RefreshCw size={24} className="mb-2 opacity-50" />
                                        <p className="text-sm">No history yet.</p>
                                        <p className="text-xs mt-1">Generate a password to see it here.</p>
                                    </div>
                                ) : (
                                    sortedHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`group relative flex flex-col p-3 rounded-lg border text-sm transition-all hover:shadow-sm ${item.pinned ? 'bg-primary/5 border-primary/30' : 'bg-card border-border hover:border-border/80'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono truncate mr-2 w-3/4 select-all text-xs sm:text-sm">
                                                    {item.password}
                                                </div>
                                                <div className="flex shrink-0 gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => togglePin(item.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${item.pinned ? 'text-amber-500 hover:bg-amber-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                                        title={item.pinned ? "Unpin password" : "Pin password"}
                                                    >
                                                        <Star size={14} fill={item.pinned ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item.password, item.id)}
                                                        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                                        title="Copy"
                                                    >
                                                        {copiedHistoryId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                    </button>
                                                    {!item.pinned && (
                                                        <button
                                                            onClick={() => removeHistoryItem(item.id)}
                                                            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                                                <span>
                                                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(item.createdAt))}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {item.entropy >= 80 ? (
                                                        <span className="text-emerald-500 flex items-center gap-0.5"><ShieldCheck size={10} /> Strong</span>
                                                    ) : item.entropy >= 60 ? (
                                                        <span className="text-green-400 flex items-center gap-0.5"><ShieldCheck size={10} /> Good</span>
                                                    ) : item.entropy >= 40 ? (
                                                        <span className="text-yellow-500 flex items-center gap-0.5"><ShieldHalf size={10} /> Fair</span>
                                                    ) : (
                                                        <span className="text-destructive flex items-center gap-0.5"><Shield size={10} /> Weak</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
