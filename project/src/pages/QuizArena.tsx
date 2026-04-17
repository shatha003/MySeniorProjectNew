import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Flame, Zap, ChevronRight, RotateCcw, Home,
    CheckCircle2, XCircle, Brain,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProgressStore } from '@/store/useUserProgressStore';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';
import {
    QuizQuestion,
    getQuestionsForTier,
    getTierForLevel,
    calculateQuizXp,
} from '@/services/quizService';
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

export default function QuizArena() {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation(['quiz', 'common']);
    const user = useAuthStore((s) => s.user);
    const { progress, earnXp, fetchProgress } = useUserProgressStore();

    const [gameState, setGameState] = useState<'welcome' | 'playing' | 'results'>('welcome');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);
    const [totalXpEarned, setTotalXpEarned] = useState(0);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const tier = progress ? getTierForLevel(progress.level) : 'cadet';
    const tierLabels: Record<string, { label: string; color: string; emoji: string }> = {
        cadet: { label: t('quiz:cadetMode').replace(' Mode', ''), color: 'text-amber-500', emoji: '🎖️' },
        analyst: { label: t('quiz:analystMode').replace(' Mode', ''), color: 'text-blue-500', emoji: '🔍' },
        operator: { label: t('quiz:operatorMode').replace(' Mode', ''), color: 'text-purple-500', emoji: '⚡' },
    };

    const encouragements = (t('quiz:encouragements', { returnObjects: true }) as string[]) || [
        'Cyber Ninja! 🔥', 'Brilliant! 🧠', 'Awesome! ⭐', 'Keep it up! 🚀',
        'Sharp mind! 💡', 'Well done! 🎯', 'You rock! 🎸', 'Genius! 🌟',
    ];

    const wrongMessages = (t('quiz:wrongMessages', { returnObjects: true }) as string[]) || [
        'Not quite — but now you know! 💪',
        'Good try! Learn from this one! 📚',
        'Almost! Here\'s the right answer: 🎯',
    ];

    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
        }
    }, [user?.uid, fetchProgress]);

    const startGame = useCallback(() => {
        const qs = getQuestionsForTier(tier, 5);
        setQuestions(qs);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setCorrectCount(0);
        setStreak(0);
        setMaxStreak(0);
        setTotalXpEarned(0);
        setGameState('playing');
    }, [tier]);

    const handleAnswer = useCallback((answerIndex: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === questions[currentIndex].correctIndex;

        if (isCorrect) {
            const newStreak = streak + 1;
            setCorrectCount((prev) => prev + 1);
            setStreak(newStreak);
            setMaxStreak((prev) => Math.max(prev, newStreak));
        } else {
            setStreak(0);
        }
    }, [selectedAnswer, questions, currentIndex, streak]);

    const nextQuestion = useCallback(async () => {
        if (currentIndex < questions.length - 1) {
            setSlideDirection(1);
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
        } else {
            if (!user?.uid) return;

            const xpResult = calculateQuizXp(correctCount, maxStreak, questions.length);
            setTotalXpEarned(xpResult.totalXp);

            await earnXp(user.uid, xpResult.totalXp);
            await logActivity(user.uid, 'quiz_round', {
                correct: String(correctCount),
                total: String(questions.length),
                tier,
            });

            if (maxStreak >= 3) {
                await logActivity(user.uid, 'quiz_streak', { streak: String(maxStreak) });
                await earnXp(user.uid, 10);
            }

            await incrementTaskProgress(user.uid, 'quiz_round');

            setGameState('results');
        }
    }, [currentIndex, questions, correctCount, maxStreak, user, earnXp, tier]);

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
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.08), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.06), transparent 70%)' }} />
                </div>

                <div className="relative z-10 max-w-lg w-full mx-auto px-4">
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse" />

                        <motion.div
                            className="text-6xl mb-6"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🧠
                        </motion.div>

                        <h1 className={`font-display text-4xl font-black mb-3 ${headingColor}`}>
                            {t('quiz:title')}
                        </h1>
                        <p className={`text-lg font-medium ${mutedText} mb-6`}>
                            {t('quiz:subtitle')}
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} mb-6`}>
                            <span className={`text-sm font-bold ${tierLabels[tier].color}`}>
                                {tierLabels[tier].emoji} {tierLabels[tier].label} {t('quiz:modeLabel', { defaultValue: 'Mode' })}
                            </span>
                            <span className={`text-xs ${mutedText}`}>
                                {t('quiz:level', { level: progress?.level || 1 })}
                            </span>
                        </div>

                        <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6 text-left space-y-2`}>
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('quiz:questionsPerRound')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame size={16} className="text-orange-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('quiz:buildStreaks')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Brain size={16} className="text-blue-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('quiz:learnExplanations')}</span>
                            </div>
                        </div>

                        <motion.button
                            onClick={startGame}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-black text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('quiz:startQuiz')} <ChevronRight size={20} />
                        </motion.button>

                        <motion.button
                            onClick={handleGoHome}
                            className={`w-full mt-3 py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold text-sm flex items-center justify-center gap-2`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Home size={16} /> {t('quiz:backToDashboard')}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (gameState === 'playing' && questions[currentIndex]) {
        const question = questions[currentIndex];
        const isAnswered = selectedAnswer !== null;
        const isCorrect = selectedAnswer === question.correctIndex;

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
                                    {currentIndex + 1}/{questions.length}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div variants={itemVariants} className={`h-2 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full mb-8 overflow-hidden`}>
                        <motion.div
                            className="h-full bg-gradient-to-r from-neon-crimson to-neon-violet rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>

                    {/* Question Card */}
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
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 shadow-xl`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${tierLabels[tier].color}`}>
                                        {tierLabels[tier].emoji} {tierLabels[tier].label}
                                    </span>
                                </div>

                                <h2 className={`font-display text-xl md:text-2xl font-black mb-6 ${headingColor}`}>
                                    {question.question}
                                </h2>

                                <div className="space-y-3">
                                    {question.options.map((option, idx) => {
                                        const isSelected = selectedAnswer === idx;
                                        const isCorrectOption = idx === question.correctIndex;
                                        const showResult = isAnswered;

                                        let optionStyle = `border-2 ${isDark ? 'border-white/10 bg-cyber-surface' : 'border-gray-200 bg-gray-50'} hover:border-primary/50`;

                                        if (showResult) {
                                            if (isCorrectOption) {
                                                optionStyle = `border-2 border-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`;
                                            } else if (isSelected && !isCorrectOption) {
                                                optionStyle = `border-2 border-red-500 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`;
                                            } else {
                                                optionStyle = `border-2 ${isDark ? 'border-white/5 bg-cyber-surface/50' : 'border-gray-100 bg-gray-50/50'} opacity-50`;
                                            }
                                        }

                                        return (
                                            <motion.button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={isAnswered}
                                                className={`w-full text-left p-4 rounded-2xl transition-all ${optionStyle} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                                                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                                                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                                                        showResult && isCorrectOption
                                                            ? 'bg-emerald-500 text-white'
                                                            : showResult && isSelected
                                                                ? 'bg-red-500 text-white'
                                                                : isDark
                                                                    ? 'bg-white/10 text-[#8AB4F8]/60'
                                                                    : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        {showResult && isCorrectOption ? (
                                                            <CheckCircle2 size={16} />
                                                        ) : showResult && isSelected ? (
                                                            <XCircle size={16} />
                                                        ) : (
                                                            String.fromCharCode(65 + idx)
                                                        )}
                                                    </div>
                                                    <span className={`text-sm font-bold ${
                                                        showResult && isCorrectOption
                                                            ? 'text-emerald-500'
                                                            : showResult && isSelected
                                                                ? 'text-red-500'
                                                                : headingColor
                                                    }`}>
                                                        {option}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-6 p-4 rounded-2xl ${
                                            isCorrect
                                                ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                                                : isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-0.5">
                                                {isCorrect ? '🎉' : '💡'}
                                            </span>
                                            <div>
                                                <p className={`text-sm font-black mb-1 ${
                                                    isCorrect ? 'text-emerald-500' : 'text-amber-500'
                                                }`}>
                                                    {isCorrect
                                                        ? encouragements[Math.floor(Math.random() * encouragements.length)]
                                                        : wrongMessages[Math.floor(Math.random() * wrongMessages.length)]
                                                    }
                                                </p>
                                                <p className={`text-xs ${mutedText} leading-relaxed`}>
                                                    {question.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {isAnswered && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={nextQuestion}
                                        className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-black flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {currentIndex < questions.length - 1 ? (
                                            <>{t('quiz:nextQuestion')} <ChevronRight size={18} /></>
                                        ) : (
                                            <>{t('quiz:seeResults')} <Trophy size={18} /></>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    }

    if (gameState === 'results') {
        const percentage = Math.round((correctCount / questions.length) * 100);
        const getGrade = () => {
            if (percentage === 100) return { emoji: '🏆', label: t('quiz:perfectScore'), color: 'text-amber-500' };
            if (percentage >= 80) return { emoji: '🌟', label: t('quiz:excellent'), color: 'text-emerald-500' };
            if (percentage >= 60) return { emoji: '👍', label: t('quiz:goodJob'), color: 'text-blue-500' };
            if (percentage >= 40) return { emoji: '💪', label: t('quiz:keepPracticing'), color: 'text-orange-500' };
            return { emoji: '📚', label: t('quiz:keepLearning'), color: 'text-red-500' };
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
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl" />

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
                            {t('quiz:modeComplete', { emoji: tierLabels[tier].emoji, mode: tierLabels[tier].label })}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className={`text-2xl font-black ${grade.color}`}>{correctCount}/{questions.length}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('quiz:correct')}</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-orange-500">{maxStreak}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('quiz:bestStreak')}</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-emerald-500">+{totalXpEarned}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{t('quiz:xpEarned')}</div>
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
                                <RotateCcw size={18} /> {t('quiz:playAgain')}
                            </motion.button>

                            <motion.button
                                onClick={handleGoHome}
                                className={`w-full py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold flex items-center justify-center gap-2`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Home size={16} /> {t('quiz:backToDashboard')}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return null;
}
