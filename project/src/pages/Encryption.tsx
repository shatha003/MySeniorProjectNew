import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import { Lock, Unlock, Copy, Check, Eye, EyeOff, ShieldCheck, AlertTriangle, Key, RotateCcw, Star, Shield, Zap } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';

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

export default function Encryption() {
    const { t } = useTranslation(['encryption', 'common']);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [inputText, setInputText] = useState('');
    const [password, setPassword] = useState('');
    const [outputText, setOutputText] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [error, setError] = useState('');
    const [scanProgress, setScanProgress] = useState(0);

    const trackActivity = useTrackActivity();

    useEffect(() => {
        if (isProcessing) {
            setScanProgress(0);
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    return prev + Math.random() * 15;
                });
            }, 200);
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    const handleProcess = async () => {
        if (!inputText.trim() || !password.trim()) return;

        setIsProcessing(true);
        setError('');
        setHasResult(false);

        try {
            if (mode === 'encrypt') {
                const result = await invoke<string>('encrypt_text', {
                    plaintext: inputText,
                    password: password,
                    algorithm: 'AES-256-GCM',
                });
                setOutputText(result);
                await trackActivity('generate_encryption');
            } else {
                const result = await invoke<string>('decrypt_text', {
                    encoded: inputText,
                    password: password,
                });
                setOutputText(result);
            }
            setHasResult(true);
            setScanProgress(100);
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Wrong password or bad data!');
            setError(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText('');
        setPassword('');
        setOutputText('');
        setHasResult(false);
        setError('');
        setScanProgress(0);
    };

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const passwordStrength = password.length < 6
        ? { label: t('encryption:tooShort'), color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', emoji: '😟' }
        : password.length < 10
            ? { label: t('encryption:gettingBetter'), color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', emoji: '🙂' }
            : { label: t('encryption:superStrong'), color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', emoji: '💪' };

    return (
        <motion.div
            className="relative min-h-full pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                {/* Hero Header */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-crimson to-neon-violet flex items-center justify-center text-white shadow-lg shadow-neon-crimson/30`}>
                                        <Shield size={28} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>
                                        {t('encryption:title')}
                                    </h1>
                                </div>
                                <p className={`text-lg font-medium ${mutedText}`}>
                                    {t('encryption:subtitle')}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+10 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{t('common:perUse')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Card - All in One */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg relative overflow-hidden`}>
                        {/* Mode Toggle */}
                        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl w-fit mb-8">
                            <motion.button
                                onClick={() => { setMode('encrypt'); setOutputText(''); setHasResult(false); setError(''); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${mode === 'encrypt'
                                        ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white shadow-lg'
                                        : `${mutedText} hover:text-foreground`
                                    }`}
                                whileHover={mode !== 'encrypt' ? { scale: 1.05 } : {}}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Lock size={18} />
                                {t('encryption:lockIt')}
                            </motion.button>
                            <motion.button
                                onClick={() => { setMode('decrypt'); setOutputText(''); setHasResult(false); setError(''); }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${mode === 'decrypt'
                                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg'
                                        : `${mutedText} hover:text-foreground`
                                    }`}
                                whileHover={mode !== 'decrypt' ? { scale: 1.05 } : {}}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Unlock size={18} />
                                {t('encryption:unlockIt')}
                            </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                            {!hasResult ? (
                                <motion.div
                                    key="input"
                                    className="space-y-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {/* Message Input */}
                                    <div>
                                        <label className={`flex items-center gap-2 text-sm font-black mb-3 ${headingColor}`}>
                                            {mode === 'encrypt' ? (
                                                <>
                                                    <Zap size={16} className="text-yellow-500" />
                                                    {t('encryption:yourMessage')}
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={16} className="text-purple-500" />
                                                    {t('encryption:secretCode')}
                                                </>
                                            )}
                                        </label>
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => { setInputText(e.target.value); setError(''); }}
                                            placeholder={mode === 'encrypt' ? t('encryption:messagePlaceholder') : t('encryption:codePlaceholder')}
                                            rows={4}
                                            className={`w-full rounded-2xl border-2 bg-transparent px-5 py-4 text-sm font-mono resize-none focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className={`flex items-center gap-2 text-sm font-black mb-3 ${headingColor}`}>
                                            <Key size={16} className="text-blue-500" />
                                            {t('encryption:secretPassword')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={t('encryption:passwordPlaceholder')}
                                                className={`block w-full pl-5 pr-14 py-4 rounded-2xl border-2 bg-transparent text-sm font-mono focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute inset-y-0 right-0 pr-5 flex items-center transition-colors ${mutedText} hover:text-foreground`}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        {/* Password Strength */}
                                        {password && (
                                            <motion.div
                                                className={`mt-3 flex items-center gap-3 p-3 rounded-xl ${passwordStrength.bg} border ${passwordStrength.border}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <span className="text-lg">{passwordStrength.emoji}</span>
                                                <span className={`text-sm font-black ${passwordStrength.color}`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <motion.button
                                        onClick={handleProcess}
                                        disabled={!inputText.trim() || !password.trim() || isProcessing}
                                        className={`w-full flex justify-center items-center gap-3 px-10 py-5 font-display text-lg font-black rounded-2xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'encrypt'
                                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-[1.02]'
                                                : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:scale-[1.02]'
                                            }`}
                                        whileHover={!isProcessing && inputText.trim() && password.trim() ? { y: -4 } : {}}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                                                {t('encryption:workingOnIt')}
                                            </>
                                        ) : (
                                            <>
                                                {mode === 'encrypt' ? <Lock size={22} /> : <Unlock size={22} />}
                                                {mode === 'encrypt' ? t('encryption:lockMyMessage') : t('encryption:unlockMessage')}
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    className="space-y-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {/* Success Header */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode === 'encrypt' ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-cyan-500'} flex items-center justify-center text-white shadow-lg`}>
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <div className={`text-xs font-black uppercase tracking-[0.2em] ${mode === 'encrypt' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                {t('encryption:done')}
                                            </div>
                                            <h2 className={`text-2xl font-black font-display ${headingColor}`}>
                                                {mode === 'encrypt' ? t('encryption:messageLocked') : t('encryption:messageUnlocked')}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Output */}
                                    <div className={`bg-muted/50 rounded-2xl border-2 ${isDark ? 'border-white/5' : 'border-gray-200'} p-5 font-mono text-sm break-all max-h-40 overflow-y-auto whitespace-pre-wrap`}>
                                        {outputText}
                                    </div>

                                    {/* Copy + Clear Buttons */}
                                    <div className="flex gap-4">
                                        <motion.button
                                            onClick={handleCopy}
                                            className={`flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-2xl border-2 font-black text-sm transition-all ${copied
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                    : `${isDark ? 'border-white/10 text-white hover:border-primary/30 hover:bg-primary/5' : 'border-gray-200 text-gray-600 hover:border-primary/30 hover:bg-primary/5'}`
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                            {copied ? t('common:copied') : t('common:copy')}
                                        </motion.button>

                                        <motion.button
                                            onClick={handleClear}
                                            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 font-black text-sm transition-all ${isDark ? 'border-white/10 text-white hover:border-primary/30 hover:bg-primary/5' : 'border-gray-200 text-gray-600 hover:border-primary/30 hover:bg-primary/5'}`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <RotateCcw size={18} />
                                            {t('encryption:newMessage')}
                                        </motion.button>
                                    </div>

                                    {/* Tips */}
                                    {mode === 'encrypt' && (
                                        <motion.div
                                            className={`flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className="text-lg">💡</span>
                                            <p className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                                {t('encryption:shareTip')}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress Bar */}
                        <AnimatePresence>
                            {isProcessing && (
                                <motion.div
                                    className="mt-6 space-y-3"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider">
                                        <span className={mutedText}>
                                            {mode === 'encrypt' ? t('encryption:locking') : t('encryption:unlocking')}
                                        </span>
                                        <span className={headingColor}>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full relative"
                                            style={{ width: `${scanProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer bg-[length:200%_100%]" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className={`mt-6 p-5 rounded-2xl border-2 flex items-start gap-4 text-sm font-bold ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <AlertTriangle size={24} className="shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Fun Tips Card */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                        <div className={`p-6 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-3 bg-primary/5`}>
                            <span className="text-2xl">🎓</span>
                            <h2 className={`font-display text-xl font-black ${headingColor}`}>{t('encryption:howDoesThisWork')}</h2>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { emoji: '🔐', title: t('encryption:tipStrongLockTitle'), text: t('encryption:tipStrongLockText') },
                                    { emoji: '🎲', title: t('encryption:tipAlwaysDifferentTitle'), text: t('encryption:tipAlwaysDifferentText') },
                                    { emoji: '🏠', title: t('encryption:tipOnYourComputerTitle'), text: t('encryption:tipOnYourComputerText') },
                                    { emoji: '⚠️', title: t('encryption:tipPasswordKeyTitle'), text: t('encryption:tipPasswordKeyText') },
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30">
                                        <span className="text-2xl shrink-0">{tip.emoji}</span>
                                        <div>
                                            <h3 className={`text-sm font-black mb-1 ${headingColor}`}>{tip.title}</h3>
                                            <p className={`text-sm font-medium ${mutedText}`}>{tip.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
