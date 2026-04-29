import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Loader2, Sparkles, Search, Zap, ShieldCheck, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { callNova } from '../../services/aiService';
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

interface ParsedSection {
  label: string;
  content: string;
}

const SECTION_ORDER = ['ASSESSMENT', 'ATTACK', 'RESULT', 'TIP'];

function ensureCompleteSentence(text: string): string {
  let cleaned = text.trim();
  if (!/[.!?]$/.test(cleaned)) {
    const lastPunctuation = Math.max(
      cleaned.lastIndexOf('.'),
      cleaned.lastIndexOf('!'),
      cleaned.lastIndexOf('?')
    );
    if (lastPunctuation > cleaned.length * 0.4) {
      cleaned = cleaned.slice(0, lastPunctuation + 1);
    } else {
      const conjunctions = [' and', ' or', ' but', ' with', ' by', ' using', ' through'];
      for (const c of conjunctions) {
        const idx = cleaned.lastIndexOf(c);
        if (idx > cleaned.length * 0.5) {
          cleaned = cleaned.slice(0, idx) + '.';
          break;
        }
      }
      if (!/[.!?]$/.test(cleaned)) {
        cleaned += '.';
      }
    }
  }
  return cleaned;
}

function parseSections(raw: string): ParsedSection[] {
  const cleaned = raw.replace(/\*\*/g, '');
  const sections: ParsedSection[] = [];

  for (const label of SECTION_ORDER) {
    const regex = new RegExp(`${label}\\s*[:\\.]\\s*(.+?)(?=(?:ASSESSMENT|ATTACK|RESULT|TIP)\\s*[:\\.]|$)`, 'is');
    const match = cleaned.match(regex);
    if (match) {
      const content = ensureCompleteSentence(
        match[1].replace(/\n{2,}/g, ' ').replace(/\n/g, ' ').trim()
      );
      if (content.length > 5) {
        sections.push({ label, content });
      }
    }
  }

  if (sections.length === 0) {
    const sentences = cleaned
      .split(/(?<=[.!?])\s+/)
      .filter((s: string) => s.trim().length > 10);
    const fallbackLabels = ['ASSESSMENT', 'ATTACK', 'RESULT', 'TIP'];
    for (let i = 0; i < Math.min(sentences.length, 4); i++) {
      sections.push({ label: fallbackLabels[i], content: sentences[i].trim() });
    }
  }

  return sections;
}

export default function AttackNarrative({ passwordTraits }: AttackNarrativeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { t, i18n } = useTranslation('attackNarrative');
  const [sections, setSections] = useState<ParsedSection[]>([]);
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
    if (passwordTraits.hasUppercase) charTypes.push('uppercase');
    if (passwordTraits.hasLowercase) charTypes.push('lowercase');
    if (passwordTraits.hasNumbers) charTypes.push('numbers');
    if (passwordTraits.hasSpecial) charTypes.push('special chars');

    const strengthDesc = passwordTraits.score >= 7 ? 'very strong' :
      passwordTraits.score >= 5 ? 'moderate' :
      passwordTraits.score >= 3 ? 'weak' : 'very weak';

    const currentLang = i18n.language === 'ar' ? 'Arabic' : 'English';

    const prompt = `You are a dramatic hacker. Respond ONLY in ${currentLang}. Be theatrical but clear.

Password info (do NOT guess it): ${passwordTraits.length} chars, ${charTypes.join(', ') || 'none'}, entropy ${passwordTraits.entropy.toFixed(0)} bits, score ${passwordTraits.score}/8 (${strengthDesc}), crack time: ${passwordTraits.crackTime}.

RULES:
- Write exactly 4 lines, each starting with the label and colon shown below
- Each line must be exactly ONE complete sentence with proper grammar — do NOT trail off or end mid-sentence
- Use simple, direct language. No metaphors about "fury" or "biting symbols"
- No markdown, no bold, no bullets, no extra lines
- The TIP must give a specific, practical password improvement suggestion in plain language

ASSESSMENT: <one complete sentence about the password's strength>
ATTACK: <one complete sentence about your hacking method>
RESULT: <one complete sentence about whether you succeeded>
TIP: <one complete sentence with a clear recommendation>`;

    const generate = async () => {
      try {
        setIsLoading(true);
        setSections([]);
        const response = await callNova(
          [{ role: 'user', content: prompt }],
          {
            systemPrompt: `You are a dramatic hacker character for cybersecurity education. Write exactly 4 labeled lines. Each line is ONE complete, grammatically correct sentence. No markdown. No trailing off. Write in the same language as the prompt.`,
            temperature: 0.5,
            maxTokens: 250,
          }
        );
        const parsed = parseSections(response);
        setSections(parsed);
      } catch (err) {
        console.error('Attack narrative failed:', err);
        setError(t('error'));
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [passwordTraits, t, i18n.language]);

  const getSectionConfig = (label: string) => {
    switch (label) {
      case 'ASSESSMENT':
        return {
          icon: <Search size={14} />,
          color: isDark ? 'text-blue-400' : 'text-blue-600',
          bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
          border: isDark ? 'border-blue-500/20' : 'border-blue-200',
        };
      case 'ATTACK':
        return {
          icon: <Zap size={14} />,
          color: isDark ? 'text-orange-400' : 'text-orange-600',
          bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
          border: isDark ? 'border-orange-500/20' : 'border-orange-200',
        };
      case 'RESULT':
        return passwordTraits.score >= 5
          ? {
              icon: <ShieldCheck size={14} />,
              color: isDark ? 'text-emerald-400' : 'text-emerald-600',
              bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              border: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
            }
          : {
              icon: <Skull size={14} />,
              color: isDark ? 'text-red-400' : 'text-red-600',
              bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
              border: isDark ? 'border-red-500/20' : 'border-red-200',
            };
      case 'TIP':
        return {
          icon: <Lightbulb size={14} />,
          color: isDark ? 'text-amber-400' : 'text-amber-600',
          bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
          border: isDark ? 'border-amber-500/20' : 'border-amber-200',
        };
      default:
        return {
          icon: <Zap size={14} />,
          color: mutedText,
          bg: isDark ? 'bg-white/5' : 'bg-gray-50',
          border: isDark ? 'border-white/10' : 'border-gray-200',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className={`rounded-3xl border-2 ${isDark ? 'border-red-500/20' : 'border-red-200'} ${cardBg} overflow-hidden shadow-lg`}
    >
      <div className={`p-5 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between bg-gradient-to-r ${isDark ? 'from-red-500/5 to-orange-500/5' : 'from-red-50 to-orange-50'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20">
            <Skull size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-black ${headingColor}`}>{t('title')}</h3>
            <p className={`text-[10px] font-bold ${mutedText}`}>
              {isLoading ? t('analyzing') : t('subtitle')}
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('thinking')}</span>
          </div>
        )}
        {!isLoading && !error && sections.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('complete')}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {error ? (
          <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'} text-sm font-medium`}>
            {error}
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} animate-pulse shrink-0`} />
                <div className={`h-3 rounded-full flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'} animate-pulse`} style={{ width: `${60 + i * 8}%` }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {sections.map((section, i) => {
              const config = getSectionConfig(section.label);
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl ${config.bg} border ${config.border}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${config.bg} ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${config.color}`}>
                      {section.label}
                    </span>
                    <p className={`text-[13px] font-medium leading-relaxed ${headingColor}`}>
                      {section.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
