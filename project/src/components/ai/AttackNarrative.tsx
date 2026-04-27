import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { callNovaStreaming } from '../../services/aiService';
import { useTheme } from '@/components/theme-provider';

interface AttackNarrativeProps {
  passwordTraits: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecial: boolean;
    entropy: number;
    score: number;
    crackTime: string;
  };
}

export default function AttackNarrative({ passwordTraits }: AttackNarrativeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { t, i18n } = useTranslation('attackNarrative');
  const [narrative, setNarrative] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
  const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
  const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';

  const langRef = useRef(i18n.language);
  const prevTraits = useRef('');

  useEffect(() => {
    const traitsKey = `${passwordTraits.length}-${passwordTraits.entropy}-${passwordTraits.score}`;
    
    if (langRef.current !== i18n.language || prevTraits.current !== traitsKey) {
      langRef.current = i18n.language;
      prevTraits.current = traitsKey;
      hasFetched.current = false;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const charTypes: string[] = [];
    if (passwordTraits.hasUppercase) charTypes.push('uppercase letters');
    if (passwordTraits.hasLowercase) charTypes.push('lowercase letters');
    if (passwordTraits.hasNumbers) charTypes.push('numbers');
    if (passwordTraits.hasSpecial) charTypes.push('special characters');

    const strengthDesc = passwordTraits.score >= 7 ? 'very strong' :
      passwordTraits.score >= 5 ? 'moderately strong' :
      passwordTraits.score >= 3 ? 'weak' : 'very weak';

    const currentLang = i18n.language === 'ar' ? 'Arabic' : 'English';

    const prompt = `You are a dramatic hacker attempting to crack a password. Based on these characteristics, narrate your attack attempt as a story.

IMPORTANT: Write your entire response in ${currentLang}.

Password Characteristics (you do NOT know the actual password):
- Length: ${passwordTraits.length} characters
- Contains: ${charTypes.join(', ') || 'none'}
- Entropy: ${passwordTraits.entropy.toFixed(1)} bits
- Strength score: ${passwordTraits.score}/8 (${strengthDesc})
- Estimated time to crack: ${passwordTraits.crackTime}

Write a short, dramatic first-person narrative in ${currentLang} (3-4 paragraphs) about how you would attempt to crack this password. Be like a villain in a cybersecurity movie. Cover:
1. Your initial assessment of the password's defenses
2. Your attack strategy (brute force, dictionary, rainbow tables, etc.)
3. Whether you succeed or fail, and how long it takes
4. A recommendation for the user

Keep it fun and educational. Use dramatic language but keep it under 200 words. Do NOT try to guess the actual password. Write in ${currentLang}.`;

    const generate = async () => {
      try {
        setIsLoading(true);
        setNarrative('');
        for await (const chunk of callNovaStreaming(
          [{ role: 'user', content: prompt }],
          {
            systemPrompt: 'You are a dramatic hacker character narrating password attacks for educational purposes. Be theatrical but informative. Write in the same language as the prompt.',
            temperature: 0.8,
            maxTokens: 600,
          }
        )) {
          setNarrative(prev => prev + chunk);
        }
      } catch (err) {
        console.error('Attack narrative failed:', err);
        setError(t('error'));
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [passwordTraits, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className={`rounded-3xl border-2 ${isDark ? 'border-red-500/20' : 'border-red-200'} ${cardBg} overflow-hidden shadow-lg`}
    >
      <div className={`p-6 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between bg-gradient-to-r ${isDark ? 'from-red-500/5 to-orange-500/5' : 'from-red-50 to-orange-50'}`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20">
            <Skull size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-black ${headingColor}`}>{t('title')}</h3>
            <p className={`text-xs font-bold ${mutedText}`}>
              {isLoading ? t('analyzing') : t('subtitle')}
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest">{t('thinking')}</span>
          </div>
        )}
        {!isLoading && !error && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Sparkles size={16} />
            <span className="text-xs font-black uppercase tracking-widest">{t('complete')}</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {error ? (
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'} text-sm font-medium`}>
            {error}
          </div>
        ) : isLoading && !narrative ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} animate-pulse`} style={{ width: `${70 + i * 8}%` }} />
            ))}
          </div>
        ) : (
          <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''} ${headingColor}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrative}</ReactMarkdown>
          </div>
        )}
        {isLoading && narrative && (
          <div className="flex items-center gap-2 mt-4">
            <Loader2 size={14} className="animate-spin text-red-500" />
            <span className={`text-xs ${mutedText}`}>{t('simulating')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}