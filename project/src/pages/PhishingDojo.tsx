import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Flame, ChevronRight, RotateCcw, Home,
    CheckCircle2, XCircle, Eye, Mail,
    Flag, ShieldCheck, ShieldAlert, Brain, Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProgressStore } from '@/store/useUserProgressStore';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';
import {
    PhishingEmail,
    getEmailsForTier,
    getTierForLevel,
    calculatePhishingXp,
} from '@/services/phishingService';
import { generatePhishingEmail } from '@/services/aiPhishingGenerator';
import { logActivity } from '@/services/activityService';
import { incrementTaskProgress } from '@/services/dailyTasksService';

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

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export default function PhishingDojo() {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation(['phishing', 'common']);
    const user = useAuthStore((s) => s.user);
    const { progress, earnXp, fetchProgress } = useUserProgressStore();

    const [gameState, setGameState] = useState<'welcome' | 'playing' | 'results'>('welcome');
    const [gameMode, setGameMode] = useState<'classic' | 'ai'>('classic');
    const [emails, setEmails] = useState<PhishingEmail[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userDecision, setUserDecision] = useState<'phishing' | 'safe' | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);
    const [totalXpEarned, setTotalXpEarned] = useState(0);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const tier = progress ? getTierForLevel(progress.level) : 'cadet';
    const tierLabels: Record<string, { label: string; color: string; emoji: string }> = {
        cadet: { label: t('phishing:cadetMode').replace(' Mode', ''), color: 'text-amber-500', emoji: '🔍' },
        analyst: { label: t('phishing:analystMode').replace(' Mode', ''), color: 'text-blue-500', emoji: '🕵️' },
        operator: { label: t('phishing:operatorMode').replace(' Mode', ''), color: 'text-purple-500', emoji: '🎯' },
    };

    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
        }
    }, [user?.uid, fetchProgress]);

    const startGame = useCallback(async () => {
        if (gameMode === 'ai') {
            setIsGeneratingEmail(true);
            try {
                const aiEmail = await generatePhishingEmail(tier);
                setEmails([aiEmail]);
            } catch {
                const es = getEmailsForTier(tier, 1);
                setEmails(es);
            }
            setIsGeneratingEmail(false);
        } else {
            const es = getEmailsForTier(tier, 5);
            setEmails(es);
        }
        setCurrentIndex(0);
        setUserDecision(null);
        setCorrectCount(0);
        setStreak(0);
        setMaxStreak(0);
        setTotalXpEarned(0);
        setGameState('playing');
    }, [tier, gameMode]);

    const handleDecision = useCallback((decision: 'phishing' | 'safe') => {
        if (userDecision !== null) return;

        setUserDecision(decision);
        const email = emails[currentIndex];
        const isCorrect = (decision === 'phishing' && email.isPhishing) || (decision === 'safe' && !email.isPhishing);

        if (isCorrect) {
            const newStreak = streak + 1;
            setCorrectCount((prev) => prev + 1);
            setStreak(newStreak);
            setMaxStreak((prev) => Math.max(prev, newStreak));
        } else {
            setStreak(0);
        }
    }, [userDecision, emails, currentIndex, streak]);

    const nextEmail = useCallback(async () => {
        if (gameMode === 'ai' && currentIndex < 4) {
            setIsGeneratingEmail(true);
            setSlideDirection(1);
            try {
                const usedTopics = emails.map(e => e.subject);
                const aiEmail = await generatePhishingEmail(tier, usedTopics);
                setEmails(prev => [...prev, aiEmail]);
            } catch {
                // fallback
            }
            setIsGeneratingEmail(false);
            setCurrentIndex((prev) => prev + 1);
            setUserDecision(null);
        } else if (gameMode === 'classic' && currentIndex < emails.length - 1) {
            setSlideDirection(1);
            setCurrentIndex((prev) => prev + 1);
            setUserDecision(null);
        } else {
            if (!user?.uid) return;

            const xpResult = calculatePhishingXp(correctCount, maxStreak, Math.max(emails.length, currentIndex + 1));
            setTotalXpEarned(xpResult.totalXp);

            await earnXp(user.uid, xpResult.totalXp);
            await logActivity(user.uid, gameMode === 'ai' ? 'ai_phishing_round' : 'phishing_round', {
                correct: String(correctCount),
                total: String(Math.max(emails.length, currentIndex + 1)),
                tier,
                mode: gameMode,
            });

            if (maxStreak >= 3) {
                await logActivity(user.uid, 'phishing_streak', { streak: String(maxStreak) });
                await earnXp(user.uid, 10);
            }

            await incrementTaskProgress(user.uid, 'phishing_round');

            setGameState('results');
        }
    }, [gameMode, currentIndex, emails, correctCount, maxStreak, user, earnXp, tier]);

    const handleGoHome = () => navigate('/dashboard');

    if (gameState === 'welcome') {
        return (
            <motion.div
                className="relative min-h-full flex items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.08), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.06), transparent 70%)' }} />
                </div>

                <div className="relative z-10 max-w-lg w-full mx-auto px-4">
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}
                    >
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse" />

                        <motion.div
                            className="text-6xl mb-6"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🎣
                        </motion.div>

                        <h1 className={`font-display text-4xl font-black mb-3 ${headingColor}`}>
                            {t('phishing:title')}
                        </h1>
                        <p className={`text-lg font-medium ${mutedText} mb-6`}>
                            {t('phishing:subtitle')}
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} mb-6`}>
                            <span className={`text-sm font-bold ${tierLabels[tier].color}`}>
                                {tierLabels[tier].emoji} {tierLabels[tier].label} {t('phishing:modeLabel', { defaultValue: 'Mode' })}
                            </span>
                            <span className={`text-xs ${mutedText}`}>
                                {t('phishing:level', { level: progress?.level || 1 })}
                            </span>
                        </div>

                         <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6 text-left space-y-2`}>
                             <div className="flex items-center gap-2">
                                 <Mail size={16} className="text-blue-500" />
                                 <span className={`text-sm font-bold ${headingColor}`}>{t('phishing:emailsToInspect')}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Flag size={16} className="text-red-500" />
                                 <span className={`text-sm font-bold ${headingColor}`}>{t('phishing:spotRedFlags')}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <ShieldCheck size={16} className="text-emerald-500" />
                                 <span className={`text-sm font-bold ${headingColor}`}>{t('phishing:learnFromReveal')}</span>
                             </div>
                         </div>

                         {/* Game Mode Toggle */}
                         <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6`}>
                             <div className="flex items-center gap-2 mb-3">
                                 <Brain size={16} className="text-purple-500" />
                                 <span className={`text-sm font-black ${headingColor}`}>Game Mode</span>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                 <button
                                     onClick={() => setGameMode('classic')}
                                     className={`p-3 rounded-xl border-2 transition-all text-left ${
                                         gameMode === 'classic'
                                             ? 'border-neon-crimson bg-neon-crimson/10'
                                             : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                                     }`}
                                 >
                                     <span className={`text-sm font-black block ${gameMode === 'classic' ? 'text-neon-crimson' : headingColor}`}>Classic</span>
                                     <span className={`text-[10px] ${mutedText}`}>5 preset emails</span>
                                 </button>
                                 <button
                                     onClick={() => setGameMode('ai')}
                                     className={`p-3 rounded-xl border-2 transition-all text-left ${
                                         gameMode === 'ai'
                                             ? 'border-purple-500 bg-purple-500/10'
                                             : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                                     }`}
                                 >
                                     <span className={`text-sm font-black flex items-center gap-1 ${gameMode === 'ai' ? 'text-purple-500' : headingColor}`}>
                                         <Brain size={14} /> AI Challenge
                                     </span>
                                     <span className={`text-[10px] ${mutedText}`}>AI-generated emails</span>
                                 </button>
                             </div>
                         </div>

                         <motion.button
                             onClick={startGame}
                             disabled={isGeneratingEmail}
                             className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-black text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 disabled:opacity-50"
                             whileHover={{ scale: isGeneratingEmail ? 1 : 1.02 }}
                             whileTap={{ scale: isGeneratingEmail ? 1 : 0.98 }}
                         >
                             {isGeneratingEmail ? (
                                 <>
                                     <Loader2 size={20} className="animate-spin" /> Generating AI Emails...
                                 </>
                             ) : (
                                 <>
                                     {t('phishing:enterDojo')} <ChevronRight size={20} />
                                 </>
                             )}
                         </motion.button>

                        <motion.button
                            onClick={handleGoHome}
                            className={`w-full mt-3 py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold text-sm flex items-center justify-center gap-2`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Home size={16} /> {t('phishing:backToDashboard')}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (gameState === 'playing' && emails[currentIndex]) {
        const email = emails[currentIndex];
        const isAnswered = userDecision !== null;
        const wasCorrect = isAnswered && (
            (userDecision === 'phishing' && email.isPhishing) ||
            (userDecision === 'safe' && !email.isPhishing)
        );

        return (
            <motion.div
                className="relative min-h-full py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-2xl mx-auto px-4">
                    {/* Progress Header */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleGoHome}
                            className={`p-2 rounded-xl ${isDark ? 'bg-cyber-dark/50 text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} hover:scale-105 transition-transform`}
                        >
                            <Home size={18} />
                        </button>

                        <div className="flex items-center gap-4">
                            {streak > 0 && (
                                <motion.div
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-xs font-black text-orange-500">{streak}</span>
                                </motion.div>
                            )}
                             <div className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-cyber-dark/50' : 'bg-gray-100'}`}>
                                 <span className={`text-xs font-bold ${mutedText}`}>
                                     {currentIndex + 1}/{gameMode === 'ai' ? '5' : emails.length}
                                 </span>
                             </div>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div variants={itemVariants} className={`h-2 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full mb-8 overflow-hidden`}>
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                            initial={{ width: 0 }}
                             animate={{ width: `${((currentIndex + 1) / (gameMode === 'ai' ? 5 : emails.length)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>

                    {/* Email Card */}
                    <AnimatePresence mode="wait" custom={slideDirection}>
                        <motion.div
                            key={currentIndex}
                            custom={slideDirection}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} shadow-xl overflow-hidden`}>
                                {/* Email Header */}
                                <div className={`p-4 border-b ${isDark ? 'border-white/5 bg-cyber-surface' : 'border-gray-100 bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${tierLabels[tier].color}`}>
                                            {tierLabels[tier].emoji} {tierLabels[tier].label}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className={mutedText} />
                                            <span className={`text-xs ${mutedText}`}>{t('phishing:email', { number: currentIndex + 1 })}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${mutedText} w-16`}>{t('phishing:from')}</span>
                                            <div>
                                                <span className={`text-sm font-bold ${headingColor}`}>{email.sender}</span>
                                                <span className={`text-xs ${mutedText} ml-2`}>&lt;{email.senderEmail}&gt;</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${mutedText} w-16`}>{t('phishing:subject')}</span>
                                            <span className={`text-sm font-bold ${headingColor}`}>{email.subject}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Body */}
                                <div className="p-6">
                                    <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6`}>
                                        <pre className={`text-sm ${headingColor} whitespace-pre-wrap font-sans leading-relaxed`}>
                                            {email.body}
                                        </pre>
                                    </div>

                                    {/* Decision Buttons */}
                                    {!isAnswered && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <motion.button
                                                onClick={() => handleDecision('phishing')}
                                                className="py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <ShieldAlert size={18} /> {t('phishing:reportFake')}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDecision('safe')}
                                                className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <ShieldCheck size={18} /> {t('phishing:markSafe')}
                                            </motion.button>
                                        </div>
                                    )}

                                    {/* Reveal Panel */}
                                    {isAnswered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            {/* Result Banner */}
                                            <div className={`p-4 rounded-2xl ${
                                                wasCorrect
                                                    ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                                                    : isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <div className="flex items-center gap-3">
                                                    {wasCorrect ? (
                                                        <>
                                                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                <CheckCircle2 size={20} className="text-white" />
                                                            </div>
                                                            <div>
                                                                 <p className="text-sm font-black text-emerald-500">{t('phishing:greatDetective')}</p>
                                                                 <p className={`text-xs ${mutedText}`}>
                                                                     {email.isPhishing
                                                                         ? t('phishing:spottedPhishing')
                                                                         : t('phishing:correctLegitimate')
                                                                     }
                                                                 </p>
                                                             </div>
                                                         </>
                                                     ) : (
                                                         <>
                                                             <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                                                 <XCircle size={20} className="text-white" />
                                                             </div>
                                                             <div>
                                                                 <p className="text-sm font-black text-red-500">{t('phishing:notQuite')}</p>
                                                                 <p className={`text-xs ${mutedText}`}>
                                                                     {email.isPhishing
                                                                         ? t('phishing:wasPhishing')
                                                                         : t('phishing:wasSafe')
                                                                     }
                                                                 </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Red Flags or Safe Explanation */}
                                            {email.isPhishing && email.redFlags.length > 0 && (
                                                <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Flag size={16} className="text-red-500" />
                                                        <span className={`text-sm font-black ${headingColor}`}>{t('phishing:redFlagsDetected')}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {email.redFlags.map((flag, idx) => (
                                                            <div key={idx} className={`p-3 rounded-xl ${isDark ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50 border border-red-100'}`}>
                                                                <p className="text-xs font-bold text-red-500 mb-1">{flag.label}</p>
                                                                <p className={`text-xs ${mutedText}`}>{flag.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!email.isPhishing && (
                                                <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <ShieldCheck size={16} className="text-emerald-500" />
                                                        <span className={`text-sm font-black ${headingColor}`}>{t('phishing:whySafe')}</span>
                                                    </div>
                                                    <p className={`text-xs ${mutedText} leading-relaxed`}>{email.explanation}</p>
                                                </div>
                                            )}

                                            {/* Overall Explanation */}
                                            <div className={`rounded-2xl ${isDark ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-blue-50 border border-blue-100'} p-4`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Eye size={16} className="text-blue-500" />
                                                    <span className={`text-sm font-black ${headingColor}`}>{t('phishing:detectiveNotes')}</span>
                                                </div>
                                                <p className={`text-xs ${mutedText} leading-relaxed`}>{email.explanation}</p>
                                            </div>

                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                onClick={nextEmail}
                                                 className="w-full py-3 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-black flex items-center justify-center gap-2 disabled:opacity-50"
                                                 whileHover={{ scale: 1.02 }}
                                                 whileTap={{ scale: 0.98 }}
                                                 disabled={isGeneratingEmail}
                                             >
                                                 {isGeneratingEmail ? (
                                                     <><Loader2 size={18} className="animate-spin" /> Generating...</>
                                                 ) : currentIndex < (gameMode === 'ai' ? 4 : emails.length - 1) ? (
                                                     <>{t('phishing:nextEmail')} <ChevronRight size={18} /></>
                                                 ) : (
                                                     <>{t('phishing:seeResults')} <Trophy size={18} /></>
                                                 )}
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    }

    if (gameState === 'results') {
        const percentage = Math.round((correctCount / emails.length) * 100);
        const getGrade = () => {
            if (percentage === 100) return { emoji: '🏆', label: t('phishing:masterDetective'), color: 'text-amber-500' };
            if (percentage >= 80) return { emoji: '🌟', label: t('phishing:sharpEye'), color: 'text-emerald-500' };
            if (percentage >= 60) return { emoji: '👍', label: t('phishing:goodInstincts'), color: 'text-blue-500' };
            if (percentage >= 40) return { emoji: '💪', label: t('phishing:keepTraining'), color: 'text-orange-500' };
            return { emoji: '📚', label: t('phishing:practiceMakesPerfect'), color: 'text-red-500' };
        };

        const grade = getGrade();

        return (
            <motion.div
                className="relative min-h-full flex items-center justify-center py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-lg w-full mx-auto px-4">
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-2xl" />

                        <motion.div
                            className="text-6xl mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                        >
                            {grade.emoji}
                        </motion.div>

                        <h1 className={`font-display text-3xl font-black mb-2 ${headingColor}`}>
                            {grade.label}
                        </h1>
                        <p className={`text-sm ${mutedText} mb-6`}>
                             {gameMode === 'ai'
                                 ? `AI Challenge Complete!`
                                 : t('phishing:modeComplete', { emoji: tierLabels[tier].emoji, mode: tierLabels[tier].label })
                             }
                         </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className={`text-2xl font-black ${grade.color}`}>{correctCount}/{emails.length}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('phishing:correct')}</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-orange-500">{maxStreak}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('phishing:bestStreak')}</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-emerald-500">+{totalXpEarned}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('phishing:xpEarned')}</div>
                            </div>
                        </div>

                        {/* Score Bar */}
                        <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 mb-6`}>
                            <motion.div
                                className={`h-full rounded-full ${
                                    percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                    percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                    'bg-gradient-to-r from-orange-500 to-red-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>

                        <div className="space-y-3">
                            <motion.button
                                onClick={startGame}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-black text-lg flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RotateCcw size={18} /> {t('phishing:playAgain')}
                            </motion.button>

                            <motion.button
                                onClick={handleGoHome}
                                className={`w-full py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold flex items-center justify-center gap-2`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Home size={16} /> {t('phishing:backToDashboard')}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return null;
}
