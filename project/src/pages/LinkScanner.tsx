import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Link as LinkIcon, AlertTriangle, ExternalLink, Globe, Search, Clock, RotateCcw, Scan, Crosshair, BarChart3 } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { useTheme } from '@/components/theme-provider';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

interface ScanResult {
    target: string;
    status: string;
    reputation: number;
    categories: string[];
    detections: Detection[];
    scan_date: string;
    stats: ScanStats;
}

interface ScanStats {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
}

interface Detection {
    engine: string;
    result: string;
    category: string;
}

interface HistoryItem {
    id: string;
    url: string;
    date: string;
    status: string;
}

export default function LinkScanner() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [scanProgress, setScanProgress] = useState(0);

    const trackActivity = useTrackActivity();

    useEffect(() => {
        const savedHistory = localStorage.getItem('chea_link_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isScanning) {
            setScanProgress(0);
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    return prev + Math.random() * 15;
                });
            }, 200);
            return () => clearInterval(interval);
        }
    }, [isScanning]);

    const saveToHistory = (result: ScanResult) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            url: result.target,
            date: new Date().toLocaleString(),
            status: result.status
        };
        const updated = [newItem, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem('chea_link_history', JSON.stringify(updated));
    };

    const handleScan = async (e: React.FormEvent | string) => {
        if (typeof e !== 'string') e.preventDefault();

        const targetUrl = typeof e === 'string' ? e : url;
        if (!targetUrl) return;

        setIsScanning(true);
        setErrorMsg(null);
        setHasScanned(false);

        try {
            const result: ScanResult = await invoke('scan_url', { url: targetUrl });
            setScanResult(result);
            setHasScanned(true);
            setScanProgress(100);
            saveToHistory(result);
            await trackActivity('scan_link', { url: result.target });
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.toString());
        } finally {
            setIsScanning(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setHasScanned(false);
        setErrorMsg(null);
        setUrl('');
        setScanProgress(0);
    };

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';
    const inputBg = isDark ? 'bg-cyber-surface border-[#8AB4F8]/10 focus:border-neon-crimson/50' : 'bg-gray-50 border-gray-200 focus:border-neon-violet/50';
    const tableBorder = isDark ? 'border-[#8AB4F8]/8' : 'border-gray-200';
    const tableHeaderBg = isDark ? 'bg-cyber-surface/80' : 'bg-gray-50';
    const tableRowBg = isDark ? 'bg-cyber-dark/50' : 'bg-white';
    const tableRowHover = isDark ? 'hover:bg-cyber-surface/60' : 'hover:bg-gray-50';

    const statusConfig = {
        malicious: {
            color: isDark ? '#FF0A54' : '#EF4444',
            bg: isDark ? 'bg-neon-crimson/10' : 'bg-red-50',
            border: isDark ? 'border-neon-crimson/30' : 'border-red-300',
            text: isDark ? 'text-neon-crimson' : 'text-red-600',
            label: 'THREAT DETECTED',
            icon: ShieldAlert,
        },
        suspicious: {
            color: isDark ? '#FB923C' : '#F59E0B',
            bg: isDark ? 'bg-orange-400/10' : 'bg-amber-50',
            border: isDark ? 'border-orange-400/30' : 'border-amber-300',
            text: isDark ? 'text-orange-400' : 'text-amber-600',
            label: 'SUSPICIOUS',
            icon: AlertTriangle,
        },
        clean: {
            color: isDark ? '#34D399' : '#10B981',
            bg: isDark ? 'bg-emerald-400/10' : 'bg-emerald-50',
            border: isDark ? 'border-emerald-400/30' : 'border-emerald-300',
            text: isDark ? 'text-emerald-400' : 'text-emerald-600',
            label: 'CLEAN',
            icon: ShieldCheck,
        },
    };

    const getConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.clean;

    const totalDetections = scanResult ? scanResult.stats.malicious + scanResult.stats.suspicious : 0;
    const totalEngines = scanResult ? (scanResult.detections?.length || 0) : 0;
    const cleanCount = scanResult ? scanResult.stats.harmless + scanResult.stats.undetected : 0;

    return (
        <motion.div
            className="relative min-h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'border-neon-crimson/20 bg-neon-crimson/5' : 'border-neon-violet/20 bg-neon-violet/5'}`}>
                            <Crosshair size={20} className={isDark ? 'text-neon-crimson' : 'text-neon-violet'} />
                        </div>
                        <div>
                            <div className={`text-xs font-cyber tracking-[0.2em] uppercase ${mutedText}`}>URL Analysis Module</div>
                            <h1 className={`font-cyber text-2xl md:text-3xl font-bold tracking-wider ${headingColor}`}>
                                Link Scanner
                            </h1>
                        </div>
                    </div>
                    <p className={`text-sm ${mutedText} ml-[52px]`}>
                        Analyze URLs for malware, phishing attempts, and reputation threats using VirusTotal.
                    </p>
                </motion.div>

                {/* Scan Input */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden relative`}>
                        {/* Corner accents */}
                        <div className={`absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-xl`} />
                        <div className={`absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-xl`} />
                        <div className={`absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-xl`} />
                        <div className={`absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-xl`} />

                        <div className="p-5 md:p-6">
                            <form onSubmit={handleScan} className="flex gap-3 flex-col sm:flex-row">
                                <div className="relative flex-1">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${mutedText}`}>
                                        <LinkIcon size={18} />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className={`block w-full pl-11 pr-4 py-3.5 border rounded-xl bg-transparent ${inputBg} text-sm focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-neon-crimson/30' : 'focus:ring-neon-violet/30'} transition-all ${headingColor}`}
                                        required
                                        disabled={isScanning}
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isScanning || !url}
                                    className={`flex justify-center items-center gap-2 px-8 py-3.5 font-cyber text-xs tracking-[0.15em] uppercase rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden ${
                                        isDark
                                            ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:brightness-110 shadow-lg shadow-neon-crimson/20'
                                            : 'bg-gradient-to-r from-neon-violet to-purple-600 text-white hover:brightness-110 shadow-lg shadow-neon-violet/20'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isScanning ? (
                                        <>
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <Scan size={16} />
                                            Scan URL
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Scan Progress Bar */}
                            {isScanning && (
                                <motion.div
                                    className="mt-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <div className={`h-1 ${isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                                        <motion.div
                                            className={`h-full rounded-full ${isDark ? 'bg-gradient-to-r from-neon-crimson to-neon-violet' : 'bg-gradient-to-r from-neon-violet to-purple-600'}`}
                                            style={{ width: `${scanProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <div className={`flex items-center gap-2 mt-2 ${mutedText}`}>
                                        <Search size={12} className="animate-pulse" />
                                        <span className="text-xs font-cyber tracking-wider">SCANNING URL...</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {errorMsg && (
                                <motion.div
                                    className={`mt-4 p-3 rounded-lg border flex items-start gap-2 text-sm ${isDark ? 'bg-red-500/5 border-red-500/20 text-red-400/90' : 'bg-red-50 border-red-200/60 text-red-600'}`}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                                    <span>{errorMsg}</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Scan Results */}
                {hasScanned && scanResult && (
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* Status Banner */}
                        {(() => {
                            const config = getConfig(scanResult.status);
                            const StatusIcon = config.icon;
                            return (
                                <motion.div
                                    className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden relative`}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                >
                                    <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.bg} border ${config.border}`}>
                                                <StatusIcon size={28} style={{ color: config.color }} />
                                            </div>
                                            <div>
                                                <div className={`text-xs font-cyber tracking-[0.2em] uppercase ${config.text}`}>
                                                    {config.label}
                                                </div>
                                                <div className={`text-lg font-bold font-cyber ${headingColor} mt-0.5`}>
                                                    {scanResult.status === 'malicious' ? 'Malicious Site Detected' :
                                                     scanResult.status === 'suspicious' ? 'Suspicious Activity Found' : 'Site Is Clean'}
                                                </div>
                                                <a href={scanResult.target} target="_blank" rel="noreferrer" className={`text-xs ${mutedText} hover:underline flex items-center gap-1 mt-1`}>
                                                    {scanResult.target}
                                                    <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold font-cyber ${isDark ? 'text-red-400' : 'text-red-600'}`}>{scanResult.stats.malicious}</div>
                                                <div className={`text-[0.6rem] font-cyber tracking-wider uppercase ${mutedText}`}>Malicious</div>
                                            </div>
                                            <div className={`w-px h-10 ${isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200'}`} />
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold font-cyber ${isDark ? 'text-orange-400' : 'text-amber-600'}`}>{scanResult.stats.suspicious}</div>
                                                <div className={`text-[0.6rem] font-cyber tracking-wider uppercase ${mutedText}`}>Suspicious</div>
                                            </div>
                                            <div className={`w-px h-10 ${isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200'}`} />
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold font-cyber ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{cleanCount}</div>
                                                <div className={`text-[0.6rem] font-cyber tracking-wider uppercase ${mutedText}`}>Clean</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {/* Detection Ratio + Reputation + Reset */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Detection Ratio */}
                            <motion.div
                                className={`rounded-xl border ${borderColor} ${cardBg} p-5 relative overflow-hidden`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                                <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                                <div className={`flex items-center gap-2 mb-3 ${mutedText}`}>
                                    <BarChart3 size={16} />
                                    <span className="text-xs font-cyber tracking-wider">DETECTION RATIO</span>
                                </div>
                                <div className={`text-3xl font-black font-cyber ${headingColor}`}>
                                    {totalDetections}<span className={`text-lg ${mutedText}`}>/{totalEngines}</span>
                                </div>
                                <div className={`h-2 ${isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200'} rounded-full mt-3 overflow-hidden`}>
                                    <motion.div
                                        className={`h-full rounded-full ${totalDetections > 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-emerald-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${totalEngines > 0 ? (totalDetections / totalEngines) * 100 : 0}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    />
                                </div>
                            </motion.div>

                            {/* Reputation Score */}
                            <motion.div
                                className={`rounded-xl border ${borderColor} ${cardBg} p-5 relative overflow-hidden`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                                <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                                <div className={`flex items-center gap-2 mb-3 ${mutedText}`}>
                                    <Globe size={16} />
                                    <span className="text-xs font-cyber tracking-wider">COMMUNITY SCORE</span>
                                </div>
                                <div className={`text-3xl font-black font-cyber ${
                                    scanResult.reputation < 0 ? (isDark ? 'text-red-400' : 'text-red-600') :
                                    scanResult.reputation > 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                                    headingColor
                                }`}>
                                    {scanResult.reputation > 0 ? '+' : ''}{scanResult.reputation}
                                </div>
                                <div className={`text-xs ${mutedText} mt-2`}>
                                    {scanResult.reputation > 50 ? 'Highly trusted' :
                                     scanResult.reputation > 0 ? 'Generally safe' :
                                     scanResult.reputation === 0 ? 'No reputation data' :
                                     'Potentially harmful'}
                                </div>
                            </motion.div>

                            {/* Reset */}
                            <motion.div
                                className={`rounded-xl border ${borderColor} ${cardBg} p-5 flex flex-col items-center justify-center relative overflow-hidden`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                                <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                                <motion.button
                                    onClick={resetScan}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cyber text-xs tracking-[0.1em] uppercase transition-all ${
                                        isDark
                                            ? 'border-[#8AB4F8]/20 text-[#8AB4F8]/80 hover:bg-[#8AB4F8]/10 hover:border-neon-crimson/30'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-neon-violet/30'
                                    }`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <RotateCcw size={14} />
                                    New Scan
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Security Engine Analysis Table */}
                        <motion.div
                            className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={`px-5 py-4 border-b ${isDark ? 'border-[#8AB4F8]/10' : 'border-gray-200'} flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className={isDark ? 'text-neon-crimson' : 'text-neon-violet'} />
                                    <h2 className={`font-cyber text-sm tracking-wider ${headingColor}`}>SECURITY ENGINE ANALYSIS</h2>
                                </div>
                                <span className={`text-xs ${mutedText}`}>{totalEngines} vendors checked</span>
                            </div>

                            {scanResult.detections && scanResult.detections.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`${tableHeaderBg} ${tableBorder} border-b`}>
                                                <th className={`text-left px-5 py-3 text-xs font-cyber tracking-wider ${mutedText} uppercase`}>Security Vendor</th>
                                                <th className={`text-left px-5 py-3 text-xs font-cyber tracking-wider ${mutedText} uppercase hidden sm:table-cell`}>Result</th>
                                                <th className={`text-right px-5 py-3 text-xs font-cyber tracking-wider ${mutedText} uppercase`}>Verdict</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scanResult.detections.map((det: Detection, i: number) => {
                                                const isMalicious = det.category.toLowerCase() === 'malicious';
                                                const isSuspicious = det.category.toLowerCase() === 'suspicious';
                                                const verdictColor = isMalicious
                                                    ? (isDark ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-50')
                                                    : isSuspicious
                                                    ? (isDark ? 'text-orange-400 bg-orange-400/10' : 'text-amber-600 bg-amber-50')
                                                    : (isDark ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-600 bg-emerald-50');

                                                return (
                                                    <tr key={i} className={`${tableRowBg} ${tableBorder} border-b ${tableRowHover} transition-colors`}>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <Globe size={16} className={mutedText} />
                                                                <span className={`font-medium text-sm ${headingColor}`}>{det.engine}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-5 py-3 hidden sm:table-cell`}>
                                                            <span className={`text-xs ${mutedText}`}>{det.result || '—'}</span>
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${verdictColor}`}>
                                                                {isMalicious && <ShieldAlert size={12} />}
                                                                {isSuspicious && <AlertTriangle size={12} />}
                                                                {!isMalicious && !isSuspicious && <ShieldCheck size={12} />}
                                                                {det.category}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <ShieldCheck size={48} className={`mx-auto mb-4 ${isDark ? 'text-emerald-400/30' : 'text-emerald-500/30'}`} />
                                    <h3 className={`text-lg font-medium font-cyber ${headingColor}`}>No Findings</h3>
                                    <p className={`text-sm ${mutedText} mt-1`}>No security vendors flagged this URL as malicious.</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {/* Recent Scans History */}
                {!hasScanned && (
                    <motion.div variants={itemVariants}>
                        <div className={`rounded-xl border ${borderColor} ${cardBg} overflow-hidden`}>
                            <div className={`px-5 py-4 border-b ${isDark ? 'border-[#8AB4F8]/10' : 'border-gray-200'} flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className={isDark ? 'text-neon-crimson' : 'text-neon-violet'} />
                                    <h2 className={`font-cyber text-sm tracking-wider ${headingColor}`}>RECENT SCANS</h2>
                                </div>
                                <span className={`text-xs ${mutedText}`}>{history.length} entries</span>
                            </div>

                            <div className="p-3">
                                {history.length > 0 ? (
                                    <div className="space-y-1">
                                        {history.map((scan) => {
                                            const config = getConfig(scan.status);
                                            const StatusIcon = config.icon;
                                            return (
                                                <motion.div
                                                    key={scan.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'border-[#8AB4F8]/8 bg-cyber-surface/30 hover:bg-cyber-surface/50' : 'border-gray-200 bg-gray-50 hover:bg-white'} transition-colors cursor-pointer`}
                                                    onClick={() => {
                                                        setUrl(scan.url);
                                                        handleScan(scan.url);
                                                    }}
                                                    whileHover={{ x: 2 }}
                                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} border ${config.border}`}>
                                                            <StatusIcon size={14} style={{ color: config.color }} />
                                                        </div>
                                                        <div className="truncate pr-4">
                                                            <p className={`font-medium text-sm truncate ${headingColor}`}>{scan.url}</p>
                                                            <p className={`text-xs ${mutedText}`}>{scan.date}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${config.text} ${config.bg} ${config.border}`}>
                                                        {scan.status.toUpperCase()}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={`py-10 text-center border border-dashed ${isDark ? 'border-[#8AB4F8]/10' : 'border-gray-200'} rounded-xl m-2`}>
                                        <Search className={`mx-auto mb-3 ${isDark ? 'text-[#8AB4F8]/20' : 'text-gray-300'}`} size={32} />
                                        <p className={mutedText}>No recent scans</p>
                                        <p className={`text-sm ${mutedText} mt-1`}>Your scan history will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}