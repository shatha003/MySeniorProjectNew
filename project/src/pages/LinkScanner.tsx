import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, 
    ShieldCheck, 
    Link as LinkIcon, 
    AlertTriangle, 
    ExternalLink, 
    Globe, 
    Search, 
    Clock, 
    RotateCcw, 
    Scan, 
    BarChart3,
    Star,
    ChevronRight,
    Activity,
    Target
} from 'lucide-react';
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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 280, damping: 22 },
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

    const statusConfig = {
        malicious: {
            color: 'from-red-500 to-orange-600',
            glow: 'shadow-red-500/30',
            bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
            border: 'border-red-500/20',
            text: 'text-red-500',
            label: 'DANGER DETECTED!',
            icon: ShieldAlert,
        },
        suspicious: {
            color: 'from-orange-400 to-amber-500',
            glow: 'shadow-amber-500/30',
            bg: isDark ? 'bg-orange-500/10' : 'bg-amber-50',
            border: 'border-orange-500/20',
            text: 'text-orange-500',
            label: 'CAREFUL NOW...',
            icon: AlertTriangle,
        },
        clean: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'SAFE TO GO!',
            icon: ShieldCheck,
        },
    };

    const getConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.clean;

    const totalDetections = scanResult ? scanResult.stats.malicious + scanResult.stats.suspicious : 0;
    const totalEngines = scanResult ? (scanResult.detections?.length || 0) : 0;
    const cleanCount = scanResult ? scanResult.stats.harmless + scanResult.stats.undetected : 0;

    return (
        <motion.div
            className="relative min-h-full pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-8 max-w-6xl mx-auto">
                {/* Friendly Hero Header */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30`}>
                                        <LinkIcon size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Link Checker
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Is this link safe to click? Let's check it out! 🕵️‍♂️
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+10 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Scan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scan Input Card */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg relative overflow-hidden`}>
                        <form onSubmit={handleScan} className="flex gap-4 flex-col md:flex-row">
                            <div className="relative flex-1">
                                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none ${mutedText}`}>
                                    <Target size={22} />
                                </div>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste your link here (e.g., https://safe-site.com)"
                                    className={`block w-full pl-14 pr-6 py-5 rounded-2xl border-2 bg-transparent ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} text-lg font-bold focus:outline-none transition-all ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                    required
                                    disabled={isScanning}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={isScanning || !url}
                                className={`flex justify-center items-center gap-3 px-10 py-5 font-display text-lg font-black rounded-2xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl ${
                                    isDark
                                        ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-105'
                                        : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105'
                                }`}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isScanning ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <Scan size={24} />
                                        Scan Now!
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Progress Bar */}
                        <AnimatePresence>
                            {isScanning && (
                                <motion.div
                                    className="mt-8 space-y-3"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                                        <span className={mutedText}>Analyzing security layers...</span>
                                        <span className={headingColor}>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                        <motion.div
                                            className={`h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full relative`}
                                            style={{ width: `${scanProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer bg-[length:200%_100%]" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {errorMsg && (
                            <motion.div
                                className={`mt-6 p-4 rounded-2xl border-2 flex items-start gap-3 text-sm font-bold ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <ShieldAlert size={20} className="shrink-0" />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Scan Results Display */}
                <AnimatePresence mode="wait">
                    {hasScanned && scanResult && (
                        <motion.div 
                            key="results"
                            variants={itemVariants} 
                            className="space-y-8"
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Status Hero Card */}
                            {(() => {
                                const config = getConfig(scanResult.status);
                                const StatusIcon = config.icon;
                                return (
                                    <motion.div
                                        className={`rounded-3xl border-2 ${config.border} ${config.bg} p-8 md:p-10 shadow-2xl relative overflow-hidden`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-2xl ${config.glow} transform -rotate-6`}>
                                                    <StatusIcon size={48} />
                                                </div>
                                                <div className="text-center md:text-left space-y-2">
                                                    <div className={`text-xs font-black uppercase tracking-[0.2em] ${config.text}`}>
                                                        Security Verdict
                                                    </div>
                                                    <h2 className={`text-4xl md:text-5xl font-black font-display ${headingColor}`}>
                                                        {config.label}
                                                    </h2>
                                                    <a 
                                                        href={scanResult.target} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-current/10 text-sm font-bold ${mutedText} hover:bg-white/10 transition-colors mt-2`}
                                                    >
                                                        <span className="max-w-[200px] md:max-w-md truncate">{scanResult.target}</span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Big Score Stats */}
                                            <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                                                {[
                                                    { label: 'Threats', value: scanResult.stats.malicious, color: 'text-red-500' },
                                                    { label: 'Alerts', value: scanResult.stats.suspicious, color: 'text-orange-500' },
                                                    { label: 'Safe', value: cleanCount, color: 'text-emerald-500' }
                                                ].map((stat, i) => (
                                                    <div key={i} className={`flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-current/5`}>
                                                        <span className={`text-4xl font-black font-display ${stat.color}`}>{stat.value}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>{stat.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Reset Button */}
                                        <button 
                                            onClick={resetScan}
                                            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-primary"
                                        >
                                            <RotateCcw size={20} />
                                        </button>
                                    </motion.div>
                                );
                            })()}

                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Detection Ratio Card */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                                <BarChart3 size={24} />
                                            </div>
                                            <h3 className={`text-xl font-black ${headingColor}`}>Engine Results</h3>
                                        </div>
                                        <span className={`text-sm font-black ${mutedText}`}>{totalDetections} Flags / {totalEngines} Vendors</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-sm font-bold ${mutedText}`}>Overall Risk Level</span>
                                            <span className={`text-lg font-black ${totalDetections > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {totalDetections > 5 ? 'High Risk' : totalDetections > 0 ? 'Medium Risk' : 'Perfectly Safe'}
                                            </span>
                                        </div>
                                        <div className={`h-6 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                            <motion.div
                                                className={`h-full rounded-full ${totalDetections > 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${totalEngines > 0 ? (totalDetections / totalEngines) * 100 : 0}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Community Score Card */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                                <Globe size={24} />
                                            </div>
                                            <h3 className={`text-xl font-black ${headingColor}`}>Community Trust</h3>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full font-black text-sm ${
                                            scanResult.reputation >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {scanResult.reputation > 0 ? '+' : ''}{scanResult.reputation}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className={`text-lg font-bold leading-relaxed ${headingColor}`}>
                                            {scanResult.reputation > 50 ? 'Wow! The community loves this site. It\'s super trusted! 🌟' :
                                             scanResult.reputation > 0 ? 'Looking good! Most people say this link is fine. 👍' :
                                             scanResult.reputation === 0 ? 'We don\'t have much info from others yet. Be careful! 🤔' :
                                             'Uh oh... People have reported this link as dangerous! 🛑'}
                                        </p>
                                        <div className={`text-sm ${mutedText} font-medium`}>
                                            Based on feedback from {totalEngines} security researchers.
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Detailed Findings Table */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                                <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between bg-primary/5`}>
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-primary" />
                                        <h2 className={`font-display text-2xl font-black ${headingColor}`}>Detailed Investigation</h2>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest`}>
                                        {totalEngines} Security Checks
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                <th className={`text-left px-8 py-5 text-sm font-black uppercase tracking-wider ${mutedText}`}>Security Expert</th>
                                                <th className={`text-left px-8 py-5 text-sm font-black uppercase tracking-wider ${mutedText} hidden sm:table-cell`}>Reason</th>
                                                <th className={`text-right px-8 py-5 text-sm font-black uppercase tracking-wider ${mutedText}`}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-current/5">
                                            {scanResult.detections.map((det, i) => {
                                                const isDanger = det.category.toLowerCase() === 'malicious' || det.category.toLowerCase() === 'suspicious';
                                                return (
                                                    <tr key={i} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} transition-colors`}>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                                    {isDanger ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                                                                </div>
                                                                <span className={`font-black ${headingColor}`}>{det.engine}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 hidden sm:table-cell">
                                                            <span className={`text-sm font-medium ${mutedText}`}>{det.result || 'No threats found'}</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                                                                isDanger 
                                                                    ? 'bg-red-500/10 text-red-500' 
                                                                    : 'bg-emerald-500/10 text-emerald-500'
                                                            }`}>
                                                                {det.category}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Scans (History) */}
                    {!hasScanned && (
                        <motion.div key="history" variants={itemVariants}>
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                                <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-primary" />
                                        <h2 className={`font-display text-2xl font-black ${headingColor}`}>Recent Investigations</h2>
                                    </div>
                                    <span className={`text-sm font-bold ${mutedText}`}>{history.length} Logs Saved</span>
                                </div>

                                <div className="p-6">
                                    {history.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {history.map((scan) => {
                                                const config = getConfig(scan.status);
                                                const StatusIcon = config.icon;
                                                return (
                                                    <motion.div
                                                        key={scan.id}
                                                        className={`group flex items-center justify-between p-5 rounded-2xl border-2 ${isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-primary/30' : 'bg-gray-50 border-gray-100 hover:border-primary/30'} transition-all cursor-pointer`}
                                                        onClick={() => {
                                                            setUrl(scan.url);
                                                            handleScan(scan.url);
                                                        }}
                                                        whileHover={{ x: 5, scale: 1.02 }}
                                                    >
                                                        <div className="flex items-center gap-4 overflow-hidden">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.color} text-white shadow-lg ${config.glow} shrink-0`}>
                                                                <StatusIcon size={22} />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className={`font-black text-base truncate ${headingColor}`}>{scan.url}</p>
                                                                <p className={`text-xs font-bold ${mutedText}`}>{scan.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors ml-4`}>
                                                            <ChevronRight size={20} />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className={`py-16 text-center border-4 border-dashed ${isDark ? 'border-white/5' : 'border-gray-100'} rounded-3xl`}>
                                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Search className={`text-primary/20`} size={40} />
                                            </div>
                                            <h3 className={`text-xl font-black ${headingColor}`}>No logs yet!</h3>
                                            <p className={`text-lg ${mutedText} mt-2`}>Start your first investigation above.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
