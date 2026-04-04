import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    ShieldAlert, 
    Shield, 
    AlertTriangle, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    XCircle, 
    Zap, 
    Hourglass, 
    Clock, 
    Calendar, 
    Infinity as InfinityIcon,
    KeyRound,
    Star,
    Search,
    BarChart3,
    ShieldHalf,
    Lock,
    CheckCircle
} from 'lucide-react';
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

const formatTimeToCrack = (entropy: number) => {
    const guessesPerSecond = 1e10;
    const totalCombinations = Math.pow(2, Math.min(entropy, 1024));
    const seconds = totalCombinations / guessesPerSecond;

    if (seconds < 1) return { value: "Instant", unit: "No time at all", color: "text-red-500", bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <Zap size={22} className="animate-pulse" /> };
    if (seconds < 60) return { value: `${Math.max(1, Math.round(seconds))}s`, unit: "Quick break", color: "text-orange-500", bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <Hourglass size={22} /> };
    if (seconds < 3600) return { value: `${Math.max(1, Math.round(seconds / 60))}m`, unit: "Snack break", color: "text-amber-500", bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Hourglass size={22} /> };
    if (seconds < 86400) return { value: `${Math.max(1, Math.round(seconds / 3600))}h`, unit: "Gaming day", color: "text-yellow-500", bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Clock size={22} /> };
    if (seconds < 31536000) return { value: `${Math.max(1, Math.round(seconds / 86400))}d`, unit: "School week", color: "text-emerald-500", bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Clock size={22} /> };
    if (seconds < 3153600000) return { value: "Years", unit: "A lifetime", color: "text-emerald-500", bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Calendar size={22} /> };
    if (seconds < 315360000000) return { value: "Centuries", unit: "Super hacker proof", color: "text-purple-500", bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Calendar size={22} /> };

    return { value: "Forever!", unit: "Galaxy guarded", color: "text-indigo-500", bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: <InfinityIcon size={22} className="animate-bounce" /> };
};

export default function PasswordChecker() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [hasChecked, setHasChecked] = useState(false);
    const trackActivity = useTrackActivity();

    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    let poolSize = 0;
    if (checks.uppercase) poolSize += 26;
    if (checks.lowercase) poolSize += 26;
    if (checks.number) poolSize += 10;
    if (checks.special) poolSize += 32;

    const entropy = password.length > 0 && poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
    const timeToCrack = formatTimeToCrack(entropy);

    useEffect(() => {
        if (!password) {
            setScore(0);
            setFeedback([]);
            return;
        }

        let currentScore = 0;
        const currentFeedback: string[] = [];

        if (password.length > 0) currentScore += 1;
        if (password.length >= 8) currentScore += 1;
        if (password.length >= 12) currentScore += 1;
        if (password.length >= 16) currentScore += 1;

        if (checks.uppercase) currentScore += 1;
        else currentFeedback.push('Add uppercase letters (A-Z)');

        if (checks.lowercase) currentScore += 1;
        else currentFeedback.push('Add lowercase letters (a-z)');

        if (checks.number) currentScore += 1;
        else currentFeedback.push('Add numbers (0-9)');

        if (checks.special) currentScore += 2;
        else currentFeedback.push('Add special characters (!@#$%^&*)');

        if (password.length < 12 && password.length > 0) {
            currentFeedback.push('Make it longer (at least 12 characters recommended)');
        }

        if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) {
            currentScore = Math.min(currentScore, 2);
            currentFeedback.push('Mix letters, numbers, and symbols');
        }

        setScore(currentScore);

        if (password && !hasChecked) {
            setHasChecked(true);
            trackActivity('check_password');
        }

        if (currentFeedback.length === 0) {
            currentFeedback.push('Your password is very strong!');
        }

        setFeedback(currentFeedback);
    }, [password, hasChecked, trackActivity]);

    const getStrengthWidth = () => {
        if (!password) return '0%';
        return `${Math.min((score / 8) * 100, 100)}%`;
    };

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
        good: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'GOOD PASSWORD!',
            icon: ShieldCheck,
            width: '75%',
        },
        excellent: {
            color: 'from-indigo-400 to-purple-600',
            glow: 'shadow-indigo-500/30',
            bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
            border: 'border-indigo-500/20',
            text: 'text-indigo-500',
            label: 'EXCELLENT!',
            icon: ShieldCheck,
            width: '100%',
        },
    };

    const getStrengthConfig = () => {
        if (!password) return strengthConfig.weak;
        if (score <= 2) return strengthConfig.weak;
        if (score <= 4) return strengthConfig.fair;
        if (score <= 6) return strengthConfig.good;
        return strengthConfig.excellent;
    };

    const strengthConfig_current = getStrengthConfig();
    const StrengthIcon = strengthConfig_current.icon;

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
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30`}>
                                        <KeyRound size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Test Password
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Test your password strength and see how long it takes to crack! 🕵️‍♂️
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+10 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Check</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Password Input Card */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg relative overflow-hidden`}>
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none ${mutedText}`}>
                                <Lock size={22} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Type your password to test..."
                                className={`block w-full pl-14 pr-14 py-5 rounded-2xl border-2 bg-transparent ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} text-lg font-bold font-mono focus:outline-none transition-all ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 right-0 pr-5 flex items-center transition-colors ${mutedText} hover:text-primary`}
                            >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>

                        {password && (
                            <div className="mt-6 flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                                <span className={mutedText}>Analyzing strength...</span>
                                <span className={strengthConfig_current.text}>{strengthConfig_current.label}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Results Display */}
                <AnimatePresence mode="wait">
                    {password && (
                        <motion.div 
                            key="results"
                            variants={itemVariants} 
                            className="space-y-8"
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Status Hero Card */}
                            <motion.div
                                className={`rounded-3xl border-2 ${strengthConfig_current.border} ${strengthConfig_current.bg} p-8 md:p-10 shadow-2xl relative overflow-hidden`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${strengthConfig_current.color} flex items-center justify-center text-white shadow-2xl ${strengthConfig_current.glow} transform -rotate-6`}>
                                            <StrengthIcon size={48} />
                                        </div>
                                        <div className="text-center md:text-left space-y-2">
                                            <div className={`text-xs font-black uppercase tracking-[0.2em] ${strengthConfig_current.text}`}>
                                                Strength Verdict
                                            </div>
                                            <h2 className={`text-4xl md:text-5xl font-black font-display ${headingColor}`}>
                                                {strengthConfig_current.label}
                                            </h2>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-current/10 text-sm font-bold font-mono tracking-wider ${mutedText} mt-2`}>
                                                <span className="max-w-[200px] md:max-w-md truncate">{password}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Big Score Stats */}
                                    <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                                        {[
                                            { label: 'Score', value: `${score}/8`, color: strengthConfig_current.text },
                                            { label: 'Entropy', value: `${entropy.toFixed(0)}`, color: 'text-blue-500' },
                                            { label: 'Crack Time', value: timeToCrack.value, color: timeToCrack.color }
                                        ].map((stat, i) => (
                                            <div key={i} className={`flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-current/5`}>
                                                <span className={`text-2xl md:text-3xl font-black font-display ${stat.color}`}>{stat.value}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
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
                                            animate={{ width: getStrengthWidth() }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                            {entropy >= 80 ? 'Wow! This password would take forever to crack. Super hacker proof! 🌟' :
                                             entropy >= 60 ? 'Looking great! It would take years to break this one. 👍' :
                                             entropy >= 40 ? 'Not bad, but adding more length or symbols would make it stronger! 🤔' :
                                             'Uh oh... This password could be cracked quickly. Add more characters! 🛑'}
                                        </p>
                                        <div className={`text-sm ${mutedText} font-medium`}>
                                            Based on 10 billion guesses per second.
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Security Checks Card */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                            <BarChart3 size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Security Checks</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {[
                                            { label: '12+ Characters', pass: checks.length },
                                            { label: 'Uppercase (A-Z)', pass: checks.uppercase },
                                            { label: 'Lowercase (a-z)', pass: checks.lowercase },
                                            { label: 'Numbers (0-9)', pass: checks.number },
                                            { label: 'Special (!@#$)', pass: checks.special },
                                        ].map((check, i) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${check.pass ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50') : (isDark ? 'bg-white/5' : 'bg-gray-50')}`}>
                                                <span className={`text-sm font-bold ${check.pass ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : mutedText}`}>{check.label}</span>
                                                {check.pass ? (
                                                    <CheckCircle2 size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
                                                ) : (
                                                    <XCircle size={18} className={mutedText} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Recommendations */}
                            {feedback.length > 0 && score < 7 && (
                                <motion.div 
                                    variants={itemVariants}
                                    className={`rounded-3xl border-2 ${isDark ? 'border-amber-500/20' : 'border-amber-200'} ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'} p-8 shadow-lg`}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                            <AlertTriangle size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Recommendations</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {feedback.map((tip, index) => (
                                            <div key={index} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                <span className={`text-sm font-medium ${headingColor}`}>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Excellent Message */}
                            {score >= 7 && (
                                <motion.div 
                                    variants={itemVariants}
                                    className={`rounded-3xl border-2 ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'} ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-50'} p-8 flex items-center gap-6`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                                        <CheckCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black ${headingColor}`}>Excellent!</h3>
                                        <p className={`text-lg font-medium ${mutedText} mt-1`}>
                                            Your password meets all best practices for security and complexity. It would take a supercomputer millions of years to crack this.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Vulnerability Warning */}
                            {score <= 4 && (
                                <motion.div 
                                    variants={itemVariants}
                                    className={`rounded-3xl border-2 ${isDark ? 'border-red-500/20' : 'border-red-200'} ${isDark ? 'bg-red-500/5' : 'bg-red-50'} p-8 flex items-center gap-6`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black ${headingColor}`}>Vulnerability Warning</h3>
                                        <p className={`text-sm font-medium ${mutedText} mt-1`}>
                                            Passwords with a "Weak" or "Fair" rating are highly susceptible to dictionary attacks and brute-forcing. Consider using the Password Generator to create a secure alternative.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!password && (
                        <motion.div key="empty" variants={itemVariants}>
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                                <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <Shield className="text-primary" />
                                        <h2 className={`font-display text-2xl font-black ${headingColor}`}>Ready to Test</h2>
                                    </div>
                                    <span className={`text-sm font-bold ${mutedText}`}>Type above to begin</span>
                                </div>

                                <div className="p-10">
                                    <div className="text-center space-y-6">
                                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                                            <Search className={`text-primary/20`} size={48} />
                                        </div>
                                        <h3 className={`text-2xl font-black ${headingColor}`}>Start typing a password</h3>
                                        <p className={`text-lg ${mutedText} max-w-md mx-auto`}>
                                            We'll instantly analyze its strength, estimate crack time, and give you tips to make it stronger. Your password never leaves your device!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
