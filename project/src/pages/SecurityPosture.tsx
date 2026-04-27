import { useSecurityQuestions, type SecurityQuestion } from '@/hooks/useSecurityQuestions';
import { callNova } from '@/services/aiService';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProgressStore } from '@/store/useUserProgressStore';
import { logActivity } from '@/services/activityService';
import { useTheme } from '@/components/theme-provider';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ShieldCheck, ChevronRight, Home, Brain,
    Award, AlertTriangle, CheckCircle2, XCircle, BarChart3,
    Lock, Wifi, Eye, Users
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

interface PostureReport {
    overallGrade: string;
    overallScore: number;
    categories: { name: string; score: number; icon: string }[];
    vulnerabilities: string[];
    recommendations: string[];
    summary: string;
}

export default function SecurityPosture() {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation('securityPosture');
    const user = useAuthStore((s) => s.user);
    const { earnXp } = useUserProgressStore();

    const [phase, setPhase] = useState<'welcome' | 'questions' | 'analyzing' | 'report'>('welcome');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [report, setReport] = useState<PostureReport | null>(null);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const questions: SecurityQuestion[] = useSecurityQuestions();
    const totalQuestions = questions.length;

    const handleAnswer = useCallback((questionIndex: number, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
        if (questionIndex < totalQuestions - 1) {
            setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
        }
    }, [totalQuestions]);

    const analyzePosture = useCallback(async () => {
        setPhase('analyzing');

        const qaList = questions.map((q: SecurityQuestion, i: number) => {
            const ansIdx = answers[i] ?? 0;
            return `Q: ${q.question}\nA: ${q.options[ansIdx]}`;
        }).join('\n\n');

        const rawScore = questions.reduce((sum: number, q: SecurityQuestion, i: number) => {
            const ansIdx = answers[i] ?? 0;
            return sum + (q.scores[ansIdx] || 0);
        }, 0);
        const maxScore = questions.reduce((sum: number, q: SecurityQuestion) => sum + Math.max(...q.scores), 0);
        const percentage = Math.round((rawScore / maxScore) * 100);

        try {
            const response = await callNova(
                [{ role: 'user', content: `Analyze this user's cybersecurity posture based on their answers to a security questionnaire.\n\n${qaList}\n\nRaw score: ${rawScore}/${maxScore} (${percentage}%)\n\nGenerate a personalized security report. Return ONLY valid JSON:\n{\n  "overallGrade": "A-F letter grade",\n  "overallScore": ${percentage},\n  "categories": [\n    {"name": "Password Hygiene", "score": 0-100, "icon": "Lock"},\n    {"name": "Network Safety", "score": 0-100, "icon": "Wifi"},\n    {"name": "Data Privacy", "score": 0-100, "icon": "Eye"},\n    {"name": "Social Engineering", "score": 0-100, "icon": "Users"}\n  ],\n  "vulnerabilities": ["top 3 vulnerability descriptions"],\n  "recommendations": ["5 prioritized action items"],\n  "summary": "encouraging 2-3 sentence summary"\n}` }],
                {
                    systemPrompt: 'You are a cybersecurity posture analyzer. Return valid JSON only. Be encouraging but honest.',
                    temperature: 0.6,
                    maxTokens: 800,
                }
            );

            const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleaned);
            setReport({
                overallGrade: parsed.overallGrade || 'C',
                overallScore: parsed.overallScore || percentage,
                categories: parsed.categories || [],
                vulnerabilities: parsed.vulnerabilities || [],
                recommendations: parsed.recommendations || [],
                summary: parsed.summary || 'Complete your security profile for personalized recommendations.',
            });
        } catch (err) {
            console.error('Posture analysis failed:', err);
            setReport({
                overallGrade: percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D',
                overallScore: percentage,
                categories: [
                    { name: 'Password Hygiene', score: percentage, icon: 'Lock' },
                    { name: 'Network Safety', score: percentage - 10, icon: 'Wifi' },
                    { name: 'Data Privacy', score: percentage + 5, icon: 'Eye' },
                    { name: 'Social Engineering', score: percentage - 5, icon: 'Users' },
                ],
                vulnerabilities: ['Review your security habits regularly', 'Use stronger passwords', 'Be cautious with links'],
                recommendations: ['Enable 2FA on all accounts', 'Use a password manager', 'Keep software updated', 'Use VPN on public WiFi', 'Review privacy settings'],
                summary: 'Your security posture needs improvement. Follow the recommendations above to strengthen your defenses.',
            });
        }

        if (user?.uid) {
            await earnXp(user.uid, 25);
            await logActivity(user.uid, 'security_posture', { score: String(percentage) });
        }

        setPhase('report');
    }, [answers, questions, user, earnXp]);

    const categoryIcons: Record<string, React.ReactNode> = {
        Lock: <Lock size={20} />,
        Wifi: <Wifi size={20} />,
        Eye: <Eye size={20} />,
        Users: <Users size={20} />,
    };

    if (phase === 'welcome') {
        return (
            <motion.div className="relative min-h-full flex items-center justify-center" variants={containerVariants} initial="hidden" animate="visible">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                </div>
                <div className="relative z-10 max-w-lg w-full mx-auto px-4">
                    <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}>
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" />
                        <motion.div className="text-6xl mb-6" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                            <ShieldCheck size={64} className="mx-auto text-emerald-500" />
                        </motion.div>
                        <h1 className={`font-display text-4xl font-black mb-3 ${headingColor}`}>{t('title')}</h1>
                        <p className={`text-lg font-medium ${mutedText} mb-6`}>{t('subtitle')}</p>

                        <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6 text-left space-y-2`}>
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} className="text-emerald-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('categoriesAnalyzed')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Brain size={16} className="text-purple-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('aiReport')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-amber-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>{t('xpReward')}</span>
                            </div>
                        </div>

                        <motion.button onClick={() => setPhase('questions')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {t('startAssessment')} <ChevronRight size={20} />
                        </motion.button>
                        <motion.button onClick={() => navigate('/dashboard')} className={`w-full mt-3 py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold text-sm flex items-center justify-center gap-2`} whileHover={{ scale: 1.02 }}>
                            <Home size={16} /> {t('backToDashboard')}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (phase === 'questions') {
        const q = questions[currentQuestion];
        const answered = answers[currentQuestion] !== undefined;
        const progress = ((Object.keys(answers).length) / totalQuestions) * 100;

        return (
            <motion.div className="relative min-h-full py-8" variants={containerVariants} initial="hidden" animate="visible">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                        <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-xl ${isDark ? 'bg-cyber-dark/50' : 'bg-gray-100'} hover:scale-105 transition-transform`}>
                            <Home size={18} className={mutedText} />
                        </button>
                        <div className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-cyber-dark/50' : 'bg-gray-100'}`}>
                            <span className={`text-xs font-bold ${mutedText}`}>{currentQuestion + 1}/{totalQuestions}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className={`h-2 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full mb-8 overflow-hidden`}>
                        <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                    </motion.div>

                    <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} shadow-xl overflow-hidden`}>
                        <div className={`p-4 border-b ${isDark ? 'border-white/5 bg-emerald-500/5' : 'border-gray-100 bg-emerald-50'} flex items-center gap-2`}>
                            <span className={`text-xs font-black uppercase tracking-widest ${mutedText}`}>{q.category}</span>
                        </div>
                        <div className="p-6 md:p-8">
                            <h3 className={`text-xl font-black mb-6 ${headingColor}`}>{q.question}</h3>
                            <div className="space-y-3">
                                {q.options.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => handleAnswer(currentQuestion, i)}
                                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                                            answered && answers[currentQuestion] === i
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : isDark ? 'border-white/10 hover:border-emerald-500/50 bg-cyber-surface' : 'border-gray-200 hover:border-emerald-300 bg-gray-50'
                                        }`}
                                        whileHover={!answered ? { scale: 1.02, x: 5 } : {}}
                                        whileTap={!answered ? { scale: 0.98 } : {}}
                                        disabled={answered}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                                                answered && answers[currentQuestion] === i
                                                    ? 'bg-emerald-500 text-white'
                                                    : isDark ? 'bg-white/5 text-[#8AB4F8]/60' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                                {answered && answers[currentQuestion] === i ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + i)}
                                            </div>
                                            <span className={`text-sm font-bold ${headingColor}`}>{option}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {Object.keys(answers).length === totalQuestions && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={analyzePosture}
                                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Brain size={20} /> {t('analyzePosture')}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (phase === 'analyzing') {
        return (
            <motion.div className="relative min-h-full flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center space-y-6">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <Brain size={64} className="text-purple-500 mx-auto" />
                    </motion.div>
                    <div>
                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('analyzing')}</h2>
                        <p className={`text-sm ${mutedText} mt-2`}>{t('aiThinking')}</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (phase === 'report' && report) {
        const gradeColor = report.overallScore >= 80 ? 'text-emerald-500' : report.overallScore >= 60 ? 'text-blue-500' : report.overallScore >= 40 ? 'text-amber-500' : 'text-red-500';

        return (
            <motion.div className="relative min-h-full py-8" variants={containerVariants} initial="hidden" animate="visible">
                <div className="max-w-4xl mx-auto px-4 space-y-8">
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-xl ${isDark ? 'bg-cyber-dark/50' : 'bg-gray-100'} hover:scale-105 transition-transform`}>
                            <Home size={18} className={mutedText} />
                        </button>
                        <h1 className={`font-display text-2xl font-black ${headingColor}`}>{t('reportCard')}</h1>
                        <div />
                    </motion.div>

                    <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center`}>
                        <motion.div className={`text-8xl font-black font-display ${gradeColor}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                            {report.overallGrade}
                        </motion.div>
                        <p className={`text-lg font-bold mt-2 ${headingColor}`}>{t('overallScore')}: {report.overallScore}{t('of100')}</p>
                        <p className={`text-sm ${mutedText} mt-2 max-w-lg mx-auto`}>{report.summary}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {report.categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 shadow-lg text-center`}
                                whileHover={{ y: -5 }}
                            >
                                <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                                    cat.score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                    cat.score >= 60 ? 'bg-blue-500/10 text-blue-500' :
                                    cat.score >= 40 ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                    {categoryIcons[cat.icon] || <ShieldCheck size={20} />}
                                </div>
                                <h4 className={`text-sm font-black mb-2 ${headingColor}`}>{cat.name}</h4>
                                <div className={`text-3xl font-black ${cat.score >= 80 ? 'text-emerald-500' : cat.score >= 60 ? 'text-blue-500' : cat.score >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {cat.score}
                                </div>
                                <div className={`h-2 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full mt-3 overflow-hidden`}>
                                    <motion.div
                                        className={`h-full rounded-full ${cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 60 ? 'bg-blue-500' : cat.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(cat.score, 100)}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${isDark ? 'border-red-500/20' : 'border-red-200'} ${cardBg} p-6 shadow-lg`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-red-500/10 text-red-500"><AlertTriangle size={20} /></div>
                                <h3 className={`text-lg font-black ${headingColor}`}>{t('topVulnerabilities')}</h3>
                            </div>
                            <div className="space-y-3">
                                {report.vulnerabilities.map((v, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
                                        <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                        <span className={`text-sm font-medium ${headingColor}`}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'} ${cardBg} p-6 shadow-lg`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={20} /></div>
                                <h3 className={`text-lg font-black ${headingColor}`}>{t('priorityActions')}</h3>
                            </div>
                            <div className="space-y-3">
                                {report.recommendations.map((r, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-50'}`}>
                                        <span className="text-sm font-black text-emerald-500 shrink-0">{i + 1}.</span>
                                        <span className={`text-sm font-medium ${headingColor}`}>{r}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="text-center">
                        <motion.button onClick={() => { setPhase('welcome'); setCurrentQuestion(0); setAnswers({}); setReport(null); }} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black flex items-center justify-center gap-2 mx-auto" whileHover={{ scale: 1.02 }}>
                            {t('retakeAssessment')}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return null;
}
