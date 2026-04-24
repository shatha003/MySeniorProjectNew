import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { callNovaStreaming } from '../../services/aiService';
import { useTheme } from '@/components/theme-provider';

interface ScanAnalysisProps {
  scanData: {
    target: string;
    status: string;
    stats: { malicious: number; suspicious: number; harmless: number; undetected: number };
    detections: { engine: string; result: string; category: string }[];
    type: 'link' | 'file';
  };
}

export default function ScanAIAnalysis({ scanData }: ScanAnalysisProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
  const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
  const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
  const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const threatDetections = scanData.detections
      .filter(d => d.category === 'malicious' || d.category === 'suspicious')
      .slice(0, 5)
      .map(d => `${d.engine}: ${d.result}`)
      .join('\n');

    const prompt = scanData.type === 'link'
      ? `Analyze this URL scan result and explain it in simple terms for a non-expert user.

URL: ${scanData.target}
Status: ${scanData.status}
Detection Stats: ${scanData.stats.malicious} malicious, ${scanData.stats.suspicious} suspicious, ${scanData.stats.harmless} harmless, ${scanData.stats.undetected} undetected
Key Detections:
${threatDetections || 'No threats detected'}

Provide a brief, friendly analysis in 3-4 short paragraphs:
1. What does this scan result mean in plain language?
2. What is the risk level and should the user be worried?
3. What specific actions should the user take?
4. Any tips to stay safe?

Keep it concise, use bullet points where helpful, and avoid technical jargon. Use emojis sparingly for emphasis.`
      : `Analyze this file scan result and explain it in simple terms for a non-expert user.

File: ${scanData.target}
Status: ${scanData.status}
Detection Stats: ${scanData.stats.malicious} malicious, ${scanData.stats.suspicious} suspicious, ${scanData.stats.harmless} harmless, ${scanData.stats.undetected} undetected
Key Detections:
${threatDetections || 'No threats detected'}

Provide a brief, friendly analysis in 3-4 short paragraphs:
1. What does this scan result mean in plain language?
2. What is the risk level and should the user be worried?
3. What specific actions should the user take?
4. Any tips to stay safe?

Keep it concise, use bullet points where helpful, and avoid technical jargon. Use emojis sparingly for emphasis.`;

    const analyze = async () => {
      try {
        setIsAnalyzing(true);
        setAnalysis('');
        for await (const chunk of callNovaStreaming(
          [{ role: 'user', content: prompt }],
          {
            systemPrompt: 'You are CHEA\'s AI security analyst. Explain scan results clearly and help users understand cybersecurity threats. Be friendly but accurate.',
            temperature: 0.6,
            maxTokens: 800,
          }
        )) {
          setAnalysis(prev => prev + chunk);
        }
      } catch (err) {
        console.error('AI analysis failed:', err);
        setError('AI analysis unavailable. Please try again later.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyze();
  }, [scanData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}
    >
      <div className={`p-6 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between bg-gradient-to-r ${isDark ? 'from-purple-500/5 to-blue-500/5' : 'from-purple-50 to-blue-50'}`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-black ${headingColor}`}>AI Security Analysis</h3>
            <p className={`text-xs font-bold ${mutedText}`}>
              {isAnalyzing ? 'Analyzing scan results...' : 'Powered by Nova AI'}
            </p>
          </div>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest">Thinking</span>
          </div>
        )}
        {!isAnalyzing && !error && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Sparkles size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Complete</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {error ? (
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'} text-sm font-medium`}>
            {error}
          </div>
        ) : isAnalyzing && !analysis ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className={`h-4 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} animate-pulse`} style={{ width: `${80 + i * 5}%` }} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''} ${headingColor}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
          </div>
        )}
        {isAnalyzing && analysis && (
          <div className="flex items-center gap-2 mt-4">
            <Loader2 size={14} className="animate-spin text-purple-500" />
            <span className={`text-xs ${mutedText}`}>Still analyzing...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}