import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, X } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';

interface GuideStep {
    icon: React.ReactNode;
    text: string;
}

interface QuickGuideProps {
    steps: GuideStep[];
}

export default function QuickGuide({ steps }: QuickGuideProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation('components');
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) return null;

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-primary/15' : 'border-primary/15';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                        <Lightbulb size={16} />
                    </div>
                    <span className={`text-sm font-bold ${headingColor}`}>
                        {t('quickGuide.title')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isOpen && (
                        <span
                            onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
                            className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                        >
                            <X size={14} className={mutedText} />
                        </span>
                    )}
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className={mutedText} />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`px-4 pb-4 pt-1 space-y-2.5`}>
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black bg-gradient-to-br from-primary/20 to-primary/10 text-primary mt-0.5`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex items-start gap-2 min-w-0">
                                        <span className={`shrink-0 mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{step.icon}</span>
                                        <span className={`text-[13px] font-medium leading-relaxed ${headingColor}`}>{step.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
