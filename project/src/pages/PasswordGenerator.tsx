import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ShieldCheck, ShieldAlert, ShieldHalf, Star, RefreshCw, KeyRound, Zap, Lock, Sparkles } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
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

const presets = [
    { label: 'Easy', length: 8, emoji: '🔑', desc: 'Simple accounts' },
    { label: 'Good', length: 12, emoji: '🔐', desc: 'Most websites' },
    { label: 'Strong', length: 16, emoji: '🛡️', desc: 'Email & games' },
    { label: 'Super', length: 24, emoji: '🚀', desc: 'Super important!' },
];

export default function PasswordGenerator() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [copied, setCopied] = useState(false);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(false);
    const [excludeSimilar, setExcludeSimilar] = useState(true);

    const trackActivity = useTrackActivity();

    const calculateEntropy = (len: number, poolSize: number) => {
        if (poolSize === 0) return 0;
        return len * Math.log2(poolSize);
    };

    const generatePassword = () => {
        let charset = "";
        if (useUppercase) charset += UPPERCASE;
        if (useLowercase) charset += LOWERCASE;
        if (useNumbers) charset += NUMBERS;
        if (useSymbols) charset += SYMBOLS;

        if (excludeSimilar) charset = charset.replace(SIMILAR_CHARS, '');
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

        setPassword(newPassword);
        setCopied(false);
    };

    useEffect(() => {
        generatePassword();
    }, [length, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        trackActivity('generate_password');
        setTimeout(() => setCopied(false), 2000);
    };

    let poolSize = 0;
    if (useUppercase) poolSize += 26;
    if (useLowercase) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += SYMBOLS.length;
    if (excludeSimilar) poolSize -= 7;
    if (poolSize <= 0) poolSize = 26;

    const entropy = calculateEntropy(length, poolSize);

    const strength = entropy >= 80
        ? { label: 'Super Strong!', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', emoji: '🚀', width: '100%', gradient: 'from-indigo-400 to-purple-600' }
        : entropy >= 60
            ? { label: 'Really Strong!', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', emoji: '💪', width: '75%', gradient: 'from-emerald-400 to-teal-500' }
            : entropy >= 40
                ? { label: 'Pretty Good', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', emoji: '🙂', width: '50%', gradient: 'from-amber-400 to-yellow-500' }
                : { label: 'Too Weak!', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', emoji: '😟', width: '25%', gradient: 'from-red-500 to-orange-600' };

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

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
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30`}>
                                        <KeyRound size={28} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>
                                        Password Maker
                                    </h1>
                                </div>
                                <p className={`text-lg font-medium ${mutedText}`}>
                                    Create super strong passwords that keep the bad guys out! 🛡️
                                </p>
                            </div>

                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+10 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Use</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Password Card */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${strength.border} ${strength.bg} p-6 md:p-8 shadow-lg relative overflow-hidden`}>
                        {/* Password Display */}
                        <div className="text-center space-y-6">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-3xl">{strength.emoji}</span>
                                <span className={`text-sm font-black uppercase tracking-[0.2em] ${strength.color}`}>
                                    {strength.label}
                                </span>
                            </div>

                            <div className={`bg-white/5 rounded-2xl border-2 ${isDark ? 'border-white/10' : 'border-gray-200'} p-5 font-mono text-lg md:text-xl break-all tracking-wider ${headingColor}`}>
                                {password}
                            </div>

                            {/* Strength Bar */}
                            <div className="space-y-2">
                                <div className={`h-3 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-0.5`}>
                                    <motion.div
                                        className={`h-full bg-gradient-to-r ${strength.gradient} rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: strength.width }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    onClick={handleCopy}
                                    className={`flex-1 flex justify-center items-center gap-3 px-8 py-4 font-display text-lg font-black rounded-2xl transition-all shadow-xl ${copied
                                            ? 'bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-500'
                                            : 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-[1.02]'
                                        }`}
                                    whileHover={!copied ? { y: -4 } : {}}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {copied ? <Check size={22} /> : <Copy size={22} />}
                                    {copied ? 'Copied!' : 'Copy It!'}
                                </motion.button>

                                <motion.button
                                    onClick={generatePassword}
                                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 font-black transition-all ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <RefreshCw size={20} />
                                    New One
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Length Presets */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg`}>
                        <h3 className={`text-lg font-black mb-4 ${headingColor}`}>How Long?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {presets.map((preset) => (
                                <motion.button
                                    key={preset.label}
                                    onClick={() => setLength(preset.length)}
                                    className={`p-4 rounded-2xl border-2 text-center transition-all ${length === preset.length
                                            ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/20'
                                            : `${isDark ? 'border-white/10 hover:border-primary/30' : 'border-gray-200 hover:border-primary/30'}`
                                        }`}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-2xl">{preset.emoji}</span>
                                    <p className={`text-lg font-black mt-1 ${length === preset.length ? 'text-primary' : headingColor}`}>
                                        {preset.length}
                                    </p>
                                    <p className={`text-[10px] font-bold ${mutedText}`}>{preset.desc}</p>
                                </motion.button>
                            ))}
                        </div>

                        {/* Custom Length Slider */}
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-bold ${mutedText}`}>Or pick your own:</span>
                                <span className={`text-2xl font-black ${headingColor}`}>{length}</span>
                            </div>
                            <input
                                type="range"
                                min="6"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-primary"
                                style={{
                                    background: `linear-gradient(to right, hsl(var(--primary)) ${((length - 6) / (64 - 6)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${((length - 6) / (64 - 6)) * 100}%)`
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Character Options */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg`}>
                        <h3 className={`text-lg font-black mb-4 ${headingColor}`}>What's Inside?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`group flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useUppercase ? 'border-primary/40 bg-primary/5' : `${isDark ? 'border-white/10' : 'border-gray-200'} hover:border-primary/30`}`}>
                                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${useUppercase ? 'bg-primary border-primary text-primary-foreground' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useUppercase && <Check className="w-4 h-4" />}
                                </div>
                                <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="hidden" />
                                <div>
                                    <p className={`text-sm font-black ${headingColor}`}>ABC</p>
                                    <p className={`text-[10px] font-bold ${mutedText}`}>Uppercase</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useLowercase ? 'border-emerald-500/40 bg-emerald-500/5' : `${isDark ? 'border-white/10' : 'border-gray-200'} hover:border-emerald-500/30`}`}>
                                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${useLowercase ? 'bg-emerald-500 border-emerald-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useLowercase && <Check className="w-4 h-4" />}
                                </div>
                                <input type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} className="hidden" />
                                <div>
                                    <p className={`text-sm font-black ${headingColor}`}>abc</p>
                                    <p className={`text-[10px] font-bold ${mutedText}`}>Lowercase</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useNumbers ? 'border-amber-500/40 bg-amber-500/5' : `${isDark ? 'border-white/10' : 'border-gray-200'} hover:border-amber-500/30`}`}>
                                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${useNumbers ? 'bg-amber-500 border-amber-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useNumbers && <Check className="w-4 h-4" />}
                                </div>
                                <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="hidden" />
                                <div>
                                    <p className={`text-sm font-black ${headingColor}`}>123</p>
                                    <p className={`text-[10px] font-bold ${mutedText}`}>Numbers</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${useSymbols ? 'border-indigo-500/40 bg-indigo-500/5' : `${isDark ? 'border-white/10' : 'border-gray-200'} hover:border-indigo-500/30`}`}>
                                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${useSymbols ? 'bg-indigo-500 border-indigo-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {useSymbols && <Check className="w-4 h-4" />}
                                </div>
                                <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="hidden" />
                                <div>
                                    <p className={`text-sm font-black ${headingColor}`}>!@#</p>
                                    <p className={`text-[10px] font-bold ${mutedText}`}>Symbols</p>
                                </div>
                            </label>
                        </div>

                        <label className={`mt-3 flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${excludeSimilar ? 'bg-purple-500/10' : 'hover:bg-muted/50'}`}>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${excludeSimilar ? 'bg-purple-500 border-purple-500 text-white' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                {excludeSimilar && <Check className="w-3 h-3" />}
                            </div>
                            <input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} className="hidden" />
                            <span className={`text-sm font-bold ${excludeSimilar ? 'text-purple-500' : mutedText}`}>
                                No confusing letters (1, l, 0, O)
                            </span>
                        </label>
                    </div>
                </motion.div>

                {/* Fun Tips */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                        <div className={`p-6 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-3 bg-primary/5`}>
                            <span className="text-2xl">💡</span>
                            <h2 className={`font-display text-xl font-black ${headingColor}`}>Password Tips</h2>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { emoji: '📏', title: 'Longer = Stronger', text: 'A 16-character password is WAY harder to crack than an 8-character one!' },
                                    { emoji: '🎲', title: 'Mix It Up', text: 'Use letters, numbers, AND symbols for the strongest passwords.' },
                                    { emoji: '🚫', title: 'Never Reuse', text: 'Use a different password for every account. That way if one gets stolen, the others are safe!' },
                                    { emoji: '🤫', title: 'Keep It Secret', text: 'Never share your passwords with friends. Not even your best friend!' },
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30">
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
