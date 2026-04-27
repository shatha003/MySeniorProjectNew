import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { callNova } from '../../services/aiService';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserProgressStore } from '../../store/useUserProgressStore';
import { useTheme } from '@/components/theme-provider';

interface Challenge {
    title: string;
    description: string;
    tool?: string;
    difficulty: string;
    category: string;
    completed: boolean;
}

export default function SecurityBuddy() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation('securityBuddy');
    const user = useAuthStore((s) => s.user);
    const { progress } = useUserProgressStore();

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';

    useEffect(() => {
        if (hasFetched.current || !user) return;
        hasFetched.current = true;

        const cached = localStorage.getItem(`chea_buddy_${user.uid}_${new Date().toDateString()}`);
        if (cached) {
            try {
                setChallenges(JSON.parse(cached));
                setIsLoading(false);
                return;
            } catch { /* regenerate */ }
        }

        const generate = async () => {
            try {
                const context = `Level: ${progress?.level || 1}, XP: ${progress?.xp || 0}, Streak: ${progress?.streakDays || 0}`;

                const response = await callNova(
                    [{ role: 'user', content: `Generate 3 personalized daily cybersecurity challenges for a CHEA app user.\n\nUser context: ${context}\n\nReturn ONLY valid JSON array:\n[{"title": "Short challenge title", "description": "1-2 sentence description of what to do", "tool": "Optional: link to CHEA tool (link-scanner, password-check, phishing-dojo, quiz-arena, vault, encryption)", "difficulty": "easy/medium/hard", "category": "Password/Phishing/Privacy/Network"}]\n\nMake challenges specific, actionable, and completable in under 5 minutes.` }],
                    {
                        systemPrompt: 'You are a cybersecurity coach generating daily challenges. Return valid JSON array only.',
                        temperature: 0.85,
                        maxTokens: 500,
                    }
                );

                const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsed = JSON.parse(cleaned);
                const withCompleted = parsed.map((c: Challenge) => ({ ...c, completed: false }));
                setChallenges(withCompleted);
                localStorage.setItem(`chea_buddy_${user.uid}_${new Date().toDateString()}`, JSON.stringify(withCompleted));
            } catch (err) {
                console.error('Buddy generation failed:', err);
                setChallenges([
                    { title: 'Scan a Recent Link', description: 'Check a URL you visited recently for threats using the Link Scanner.', tool: 'link-scanner', difficulty: 'easy', category: 'Network', completed: false },
                    { title: 'Test Your Password', description: 'Check your most-used password strength and see how a hacker would attack it.', tool: 'password-check', difficulty: 'easy', category: 'Password', completed: false },
                    { title: 'Phishing Practice', description: 'Complete a round of Phishing Dojo to sharpen your detection skills.', tool: 'phishing-dojo', difficulty: 'medium', category: 'Phishing', completed: false },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        generate();
    }, [user, progress]);

    const toggleComplete = (index: number) => {
        const updated = challenges.map((c, i) => i === index ? { ...c, completed: !c.completed } : c);
        setChallenges(updated);
        if (user) {
            localStorage.setItem(`chea_buddy_${user.uid}_${new Date().toDateString()}`, JSON.stringify(updated));
        }
    };

    const completedCount = challenges.filter(c => c.completed).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border-2 ${isDark ? 'border-purple-500/20' : 'border-purple-200'} ${isDark ? 'bg-cyber-dark' : 'bg-card'} overflow-hidden shadow-lg`}
        >
            <div className={`p-5 border-b ${isDark ? 'border-white/5 bg-gradient-to-r from-purple-500/5 to-blue-500/5' : 'border-gray-100 bg-purple-50'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h3 className={`font-black ${headingColor}`}>{t('title')}</h3>
                        <p className={`text-[10px] font-bold ${mutedText}`}>{t('subtitle')}</p>
                    </div>
                </div>
                {!isLoading && (
                    <div className={`text-xs font-black px-3 py-1.5 rounded-full ${completedCount === 3 ? 'bg-emerald-500/10 text-emerald-500' : isDark ? 'bg-purple-500/10 text-purple-500' : 'bg-purple-100 text-purple-600'}`}>
                        {t('done', { count: completedCount })}
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                {isLoading ? (
                    <div className="flex items-center gap-3 py-4 justify-center">
                        <Loader2 size={20} className="animate-spin text-purple-500" />
                        <span className={`text-sm font-bold ${mutedText}`}>{t('generating')}</span>
                    </div>
                ) : (
                    challenges.map((challenge, i) => (
                        <motion.div
                            key={i}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                                challenge.completed
                                    ? isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200'
                                    : isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-purple-500/20' : 'bg-gray-50 border-gray-100 hover:border-purple-200'
                            }`}
                            onClick={() => toggleComplete(i)}
                            whileHover={{ x: 3 }}
                        >
                            <div className="flex items-start gap-3">
                                {challenge.completed ? (
                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                ) : (
                                    <Circle size={18} className={`${isDark ? 'text-white/20' : 'text-gray-300'} shrink-0 mt-0.5`} />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-black ${challenge.completed ? 'line-through opacity-60' : ''} ${headingColor}`}>{challenge.title}</p>
                                    <p className={`text-xs ${mutedText} mt-0.5`}>{challenge.description}</p>
                                    {challenge.tool && !challenge.completed && (
                                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black text-purple-500">
                                            <Sparkles size={10} /> {t('open', { tool: challenge.tool.replace('-', ' ') })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}