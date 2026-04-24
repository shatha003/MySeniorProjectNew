import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Swords, ChevronRight, RotateCcw, Home, Loader2,
    ShieldCheck, ShieldAlert, AlertTriangle, Brain, Trophy, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProgressStore } from '@/store/useUserProgressStore';
import { useTheme } from '@/components/theme-provider';
import { callNova } from '@/services/aiService';
import { logActivity } from '@/services/activityService';
import type { DifficultyTier } from '@/services/phishingService';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

interface ScenarioData {
    scenario: string;
    choices: string[];
    topic: string;
}

export default function ScenarioSimulator() {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const user = useAuthStore((s) => s.user);
    const { earnXp } = useUserProgressStore();

    const [phase, setPhase] = useState<'welcome' | 'playing' | 'revealing' | 'results'>('welcome');
    const [tier, setTier] = useState<DifficultyTier>('cadet');
    const [round, setRound] = useState(0);
    const [totalRounds] = useState(5);
    const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [consequence, setConsequence] = useState('');
    const [wasSafe, setWasSafe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [safeChoices, setSafeChoices] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const totalXpEarned = useRef(0);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const tierConfig = {
        cadet: { label: 'Cadet', color: 'text-amber-500', bg: 'bg-amber-500/10', emoji: '🔍' },
        analyst: { label: 'Analyst', color: 'text-blue-500', bg: 'bg-blue-500/10', emoji: '🕵️' },
        operator: { label: 'Operator', color: 'text-purple-500', bg: 'bg-purple-500/10', emoji: '🎯' },
    };

    const generateScenario = useCallback(async (tierOverride?: DifficultyTier) => {
        setIsLoading(true);
        try {
            const activeTier = tierOverride || tier;
            const tierDescriptions = {
                cadet: 'Basic everyday cybersecurity situations that anyone might encounter',
                analyst: 'Professional-level security scenarios involving workplace security policies',
                operator: 'Advanced security incidents requiring expert-level decision making',
            };

            const prompt = `Generate a cybersecurity scenario for an interactive training exercise.

Difficulty: ${activeTier} - ${tierDescriptions[activeTier]}
Round: ${round + 1} of ${totalRounds}

Create a realistic scenario where the user must make a security decision. Return ONLY valid JSON:
{
  "scenario": "A detailed description of the situation (2-3 sentences)",
  "choices": ["Option A", "Option B", "Option C"],
  "topic": "The security topic being tested (e.g., 'Phishing', 'Password Security', 'Social Engineering')"
}

Requirements:
- The scenario should be realistic and educational
- Include exactly 3 choices where only ONE is the safest/correct option
- Make the wrong choices tempting but clearly risky to an educated user
- Vary topics across: phishing, passwords, social engineering, WiFi security, data privacy, malware, physical security`;

            const response = await callNova(
                [{ role: 'user', content: prompt }],
                {
                    systemPrompt: 'You are a cybersecurity training scenario generator. Always return valid JSON only. Create engaging, educational scenarios.',
                    temperature: 0.85,
                    maxTokens: 500,
                }
            );

            const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleaned);
            setScenarioData({
                scenario: parsed.scenario || 'A security scenario...',
                choices: parsed.choices || ['Option A', 'Option B', 'Option C'],
                topic: parsed.topic || 'General Security',
            });
        } catch (err) {
            console.error('Failed to generate scenario:', err);
            setScenarioData({
                scenario: 'You receive an email from your bank saying your account has been compromised. They ask you to click a link to verify your identity immediately. What do you do?',
                choices: [
                    'Click the link and verify your information',
                    'Call the bank using the number on their official website',
                    'Reply to the email asking for more details',
                ],
                topic: 'Phishing',
            });
        } finally {
            setIsLoading(false);
        }
    }, [tier, round, totalRounds]);

    const evaluateChoice = useCallback(async (choiceIndex: number) => {
        if (!scenarioData || selectedChoice !== null) return;
        setSelectedChoice(choiceIndex);
        setIsLoading(true);

        try {
            const prompt = `Evaluate this cybersecurity training choice.

Scenario: ${scenarioData.scenario}
Available choices: ${scenarioData.choices.map((c, i) => `${i + 1}. ${c}`).join('\n')}
User selected: Choice ${choiceIndex + 1} - "${scenarioData.choices[choiceIndex]}"

Determine if this was the SAFEST choice. Return ONLY valid JSON:
{
  "wasSafe": true/false,
  "consequence": "A brief, dramatic narrative (2-3 sentences) describing what happens as a result of this choice. Be engaging like a story."
}`;

            const response = await callNova(
                [{ role: 'user', content: prompt }],
                {
                    systemPrompt: 'You are a cybersecurity training evaluator. Return valid JSON only. Be dramatic but educational in your consequence narratives.',
                    temperature: 0.7,
                    maxTokens: 300,
                }
            );

            const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleaned);
            const safe = parsed.wasSafe ?? false;
            setWasSafe(safe);
            setConsequence(parsed.consequence || 'The consequences of your action unfold...');

            if (safe) {
                setSafeChoices(prev => prev + 1);
                const newStreak = streak + 1;
                setStreak(newStreak);
                setMaxStreak(prev => Math.max(prev, newStreak));
            } else {
                setStreak(0);
            }

            totalXpEarned.current += safe ? 15 : 5;
        } catch (err) {
            console.error('Failed to evaluate:', err);
            setWasSafe(false);
            setConsequence('The system could not evaluate your choice. Moving on...');
        } finally {
            setIsLoading(false);
            setPhase('revealing');
        }
    }, [scenarioData, selectedChoice, streak]);

    const nextRound = useCallback(async () => {
        if (round + 1 >= totalRounds) {
            if (user?.uid) {
                await earnXp(user.uid, totalXpEarned.current);
                await logActivity(user.uid, 'scenario_simulator', {
                    correct: String(safeChoices),
                    total: String(totalRounds),
                    tier,
                });
            }
            setPhase('results');
        } else {
            setRound(prev => prev + 1);
            setSelectedChoice(null);
            setConsequence('');
            setPhase('playing');
            await generateScenario();
        }
    }, [round, totalRounds, user, earnXp, safeChoices, tier, generateScenario]);

    const startGame = async (selectedTier: DifficultyTier) => {
        setTier(selectedTier);
        setRound(0);
        setSafeChoices(0);
        setStreak(0);
        setMaxStreak(0);
        totalXpEarned.current = 0;
        setSelectedChoice(null);
        setConsequence('');
        setScenarioData(null);
        setPhase('playing');
        await generateScenario(selectedTier);
    };

    if (phase === 'welcome') {
        return (
            <motion.div className="relative min-h-full flex items-center justify-center" variants={containerVariants} initial="hidden" animate="visible">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: isDark ? 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.06), transparent 70%)' }} />
                </div>

                <div className="relative z-10 max-w-lg w-full mx-auto px-4">
                    <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}>
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse" />

                        <motion.div className="text-6xl mb-6" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Swords size={64} className="mx-auto text-purple-500" />
                        </motion.div>

                        <h1 className={`font-display text-4xl font-black mb-3 ${headingColor}`}>Scenario Simulator</h1>
                        <p className={`text-lg font-medium ${mutedText} mb-6`}>Face realistic cybersecurity situations and make the right call</p>

                        <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4 mb-6 text-left space-y-2`}>
                            <div className="flex items-center gap-2">
                                <Brain size={16} className="text-purple-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>AI-generated scenarios</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Swords size={16} className="text-red-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>Choose your response wisely</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className={`text-sm font-bold ${headingColor}`}>5 rounds, +15 XP per safe choice</span>
                            </div>
                        </div>

                        <p className={`text-sm font-bold ${mutedText} mb-4`}>Select difficulty:</p>
                        <div className="space-y-3">
                            {(['cadet', 'analyst', 'operator'] as DifficultyTier[]).map((t) => (
                                <motion.button
                                    key={t}
                                    onClick={() => startGame(t)}
                                    className={`w-full p-4 rounded-2xl border-2 ${isDark ? 'border-white/10 hover:border-purple-500/50 bg-cyber-surface' : 'border-gray-200 hover:border-purple-300 bg-gray-50'} transition-all text-left flex items-center gap-4`}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-2xl">{tierConfig[t].emoji}</span>
                                    <div>
                                        <span className={`font-black ${tierConfig[t].color}`}>{tierConfig[t].label}</span>
                                        <p className={`text-xs ${mutedText}`}>
                                            {t === 'cadet' ? 'Everyday security situations' : t === 'analyst' ? 'Workplace security scenarios' : 'Advanced security incidents'}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <motion.button onClick={() => navigate('/dashboard')} className={`w-full mt-4 py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold text-sm flex items-center justify-center gap-2`} whileHover={{ scale: 1.02 }}>
                            <Home size={16} /> Back to Dashboard
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (phase === 'playing' || phase === 'revealing') {
        return (
            <motion.div className="relative min-h-full py-8" variants={containerVariants} initial="hidden" animate="visible">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Progress Header */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                        <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-xl ${isDark ? 'bg-cyber-dark/50 text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} hover:scale-105 transition-transform`}>
                            <Home size={18} />
                        </button>
                        <div className="flex items-center gap-4">
                            {streak > 0 && (
                                <motion.div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-xs font-black text-orange-500">{streak}</span>
                                </motion.div>
                            )}
                            <div className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-cyber-dark/50' : 'bg-gray-100'}`}>
                                <span className={`text-xs font-bold ${mutedText}`}>{round + 1}/{totalRounds}</span>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full ${tierConfig[tier].bg}`}>
                                <span className={`text-xs font-bold ${tierConfig[tier].color}`}>{tierConfig[tier].emoji} {tierConfig[tier].label}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div variants={itemVariants} className={`h-2 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full mb-8 overflow-hidden`}>
                        <motion.div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" animate={{ width: `${((round + 1) / totalRounds) * 100}%` }} transition={{ duration: 0.5 }} />
                    </motion.div>

                    {isLoading && !scenarioData ? (
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-12 shadow-xl text-center`}>
                            <Loader2 size={40} className="animate-spin text-purple-500 mx-auto mb-4" />
                            <p className={`font-black ${headingColor}`}>Generating scenario...</p>
                            <p className={`text-sm ${mutedText} mt-2`}>AI is crafting your challenge</p>
                        </div>
                    ) : scenarioData && (
                        <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} shadow-xl overflow-hidden`}>
                            {/* Topic Badge */}
                            <div className={`p-4 border-b ${isDark ? 'border-white/5 bg-purple-500/5' : 'border-gray-100 bg-purple-50'} flex items-center gap-2`}>
                                <Brain size={16} className="text-purple-500" />
                                <span className={`text-xs font-black uppercase tracking-widest ${mutedText}`}>{scenarioData.topic}</span>
                            </div>

                            {/* Scenario Text */}
                            <div className="p-6 md:p-8">
                                <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-5 mb-6`}>
                                    <p className={`text-lg font-medium leading-relaxed ${headingColor}`}>{scenarioData.scenario}</p>
                                </div>

                                {/* Choices */}
                                <AnimatePresence mode="wait">
                                    {phase === 'playing' && !isLoading && (
                                        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {scenarioData.choices.map((choice, i) => (
                                                <motion.button
                                                    key={i}
                                                    onClick={() => evaluateChoice(i)}
                                                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                                                        isDark ? 'border-white/10 hover:border-purple-500/50 bg-cyber-surface' : 'border-gray-200 hover:border-purple-300 bg-gray-50'
                                                    }`}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    disabled={isLoading}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${isDark ? 'bg-purple-500/10 text-purple-500' : 'bg-purple-100 text-purple-600'}`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                        <span className={`text-sm font-bold ${headingColor}`}>{choice}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {isLoading && selectedChoice !== null && (
                                        <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <Loader2 size={32} className="animate-spin text-purple-500 mx-auto mb-3" />
                                            <p className={`font-bold ${mutedText}`}>Evaluating your choice...</p>
                                        </motion.div>
                                    )}

                                    {phase === 'revealing' && !isLoading && (
                                        <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            {/* Result Badge */}
                                            <div className={`p-4 rounded-2xl ${wasSafe ? (isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200') : (isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200')}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${wasSafe ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                                        {wasSafe ? <ShieldCheck size={20} className="text-white" /> : <ShieldAlert size={20} className="text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-black ${wasSafe ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {wasSafe ? 'Safe Choice!' : 'Risky Move!'}
                                                        </p>
                                                        <p className={`text-xs ${mutedText}`}>You chose: {scenarioData.choices[selectedChoice!]}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Consequence */}
                                            <div className={`rounded-2xl ${isDark ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-blue-50 border border-blue-100'} p-4`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle size={14} className="text-blue-500" />
                                                    <span className={`text-xs font-black ${headingColor}`}>What happened:</span>
                                                </div>
                                                <p className={`text-sm ${mutedText} leading-relaxed`}>{consequence}</p>
                                            </div>

                                            <motion.button
                                                onClick={nextRound}
                                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {round + 1 < totalRounds ? <>Next Scenario <ChevronRight size={18} /></> : <>See Results <Trophy size={18} /></>}
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        );
    }

    if (phase === 'results') {
        const percentage = Math.round((safeChoices / totalRounds) * 100);
        const getGrade = () => {
            if (percentage === 100) return { emoji: '🏆', label: 'Security Expert', color: 'text-amber-500' };
            if (percentage >= 80) return { emoji: '🌟', label: 'Sharp Analyst', color: 'text-emerald-500' };
            if (percentage >= 60) return { emoji: '👍', label: 'Good Instincts', color: 'text-blue-500' };
            return { emoji: '📚', label: 'Keep Training', color: 'text-orange-500' };
        };
        const grade = getGrade();

        return (
            <motion.div className="relative min-h-full flex items-center justify-center py-8" variants={containerVariants} initial="hidden" animate="visible">
                <div className="max-w-lg w-full mx-auto px-4">
                    <motion.div variants={itemVariants} className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-2xl text-center overflow-hidden relative`}>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl" />

                        <motion.div className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                            {grade.emoji}
                        </motion.div>

                        <h1 className={`font-display text-3xl font-black mb-2 ${headingColor}`}>{grade.label}</h1>
                        <p className={`text-sm ${mutedText} mb-6`}>{tierConfig[tier].emoji} {tierConfig[tier].label} Scenario Complete</p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className={`text-2xl font-black ${grade.color}`}>{safeChoices}/{totalRounds}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>Safe</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-orange-500">{maxStreak}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>Best Streak</div>
                            </div>
                            <div className={`rounded-2xl ${isDark ? 'bg-cyber-surface' : 'bg-gray-50'} p-4`}>
                                <div className="text-2xl font-black text-emerald-500">+{totalXpEarned.current}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>XP</div>
                            </div>
                        </div>

                        <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 mb-6`}>
                            <motion.div className={`h-full rounded-full ${percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, delay: 0.3 }} />
                        </div>

                        <div className="space-y-3">
                            <motion.button onClick={async () => { setPhase('welcome'); }} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <RotateCcw size={18} /> Play Again
                            </motion.button>
                            <motion.button onClick={() => navigate('/dashboard')} className={`w-full py-3 rounded-2xl ${isDark ? 'bg-cyber-surface text-[#8AB4F8]/60' : 'bg-gray-100 text-gray-500'} font-bold flex items-center justify-center gap-2`} whileHover={{ scale: 1.02 }}>
                                <Home size={16} /> Back to Dashboard
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return null;
}