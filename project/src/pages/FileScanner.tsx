import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UploadCloud, 
    File as FileIcon, 
    Activity, 
    AlertCircle, 
    CheckCircle, 
    FileSearch, 
    Trash2, 
    ShieldAlert, 
    ShieldCheck, 
    AlertTriangle, 
    Clock, 
    Search,
    Star,
    ChevronRight,
    BarChart3,
    Fingerprint,
    HardDrive,
    Shield
} from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
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
    categories?: string[];
    detections: Detection[];
    scan_date: string;
    file_size: number | null;
    file_hash: string | null;
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
    target: string;
    date: string;
    status: string;
}

export default function FileScanner() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [isScanning, setIsScanning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [scanProgress, setScanProgress] = useState(0);

    const trackActivity = useTrackActivity();

    useEffect(() => {
        const savedHistory = localStorage.getItem('chea_file_history');
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
                    return prev + Math.random() * 10;
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [isScanning]);

    const saveToHistory = (result: ScanResult) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            target: result.target,
            date: new Date().toLocaleString(),
            status: result.status
        };
        const updated = [newItem, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem('chea_file_history', JSON.stringify(updated));
    };

    const handleSelectFileClick = async () => {
        try {
            const selected = await open({
                multiple: false,
                directory: false,
            });

            if (selected && typeof selected === 'string') {
                await startScan(selected);
            }
        } catch (err) {
            console.error('Failed to open file dialog', err);
        }
    };

    const startScan = async (filePath: string) => {
        setIsScanning(true);
        setErrorMsg(null);
        setHasScanned(false);
        try {
            const result: ScanResult = await invoke('scan_file', { filePath });
            setScanResult(result);
            setHasScanned(true);
            setScanProgress(100);
            saveToHistory(result);
            await trackActivity('scan_file', { fileName: result.target });
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
            label: 'DANGER FOUND!',
            icon: ShieldAlert,
        },
        suspicious: {
            color: 'from-orange-400 to-amber-500',
            glow: 'shadow-amber-500/30',
            bg: isDark ? 'bg-orange-500/10' : 'bg-amber-50',
            border: 'border-orange-500/20',
            text: 'text-orange-500',
            label: 'STAY ALERT...',
            icon: AlertTriangle,
        },
        clean: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'TOTALLY SAFE!',
            icon: ShieldCheck,
        },
    };

    const getConfig = (status: string) => {
        const key = status?.toLowerCase();
        if (key === 'malicious') return statusConfig.malicious;
        if (key === 'suspicious') return statusConfig.suspicious;
        return statusConfig.clean;
    };

    const totalDetections = scanResult?.stats ? (scanResult.stats.malicious + scanResult.stats.suspicious) : 0;
    const totalEngines = scanResult?.detections?.length || 0;
    const cleanCount = scanResult?.stats ? (scanResult.stats.harmless + scanResult.stats.undetected) : 0;

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
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30`}>
                                        <FileSearch size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        File Scanner
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Let's check your files for hidden monsters! 🛡️
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+15 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Scan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Upload Card */}
                {!hasScanned && (
                    <motion.div variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-10 shadow-lg relative overflow-hidden text-center`}>
                            {!isScanning ? (
                                <div className="space-y-8">
                                    <motion.div 
                                        className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary relative"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                    >
                                        <UploadCloud size={64} />
                                        <div className="absolute inset-0 bg-primary blur-2xl opacity-10" />
                                    </motion.div>

                                    <div className="space-y-3">
                                        <h3 className={`text-3xl font-black ${headingColor}`}>Ready to scan?</h3>
                                        <p className={`text-lg font-medium ${mutedText} max-w-md mx-auto`}>
                                            Choose any file and we'll make sure it's safe for you. 
                                            We check against 70+ security experts!
                                        </p>
                                    </div>

                                    <motion.button
                                        onClick={handleSelectFileClick}
                                        className={`px-12 py-5 font-display text-xl font-black rounded-2xl transition-all shadow-xl ${
                                            isDark
                                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white'
                                                : 'bg-gradient-to-r from-primary to-violet-600 text-white'
                                        }`}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Pick a File!
                                    </motion.button>
                                    
                                    <p className={`text-xs font-bold uppercase tracking-widest ${mutedText} opacity-50`}>
                                        Max size: 650MB • All file types welcome
                                    </p>
                                </div>
                            ) : (
                                <div className="py-12 space-y-8">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                                            <Shield size={32} className="animate-pulse" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className={`text-2xl font-black ${headingColor}`}>Analyzing your file...</h3>
                                        <div className="max-w-md mx-auto space-y-3">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                <span className={mutedText}>Deep Inspection</span>
                                                <span className={headingColor}>{Math.round(scanProgress)}%</span>
                                            </div>
                                            <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                                <motion.div
                                                    className={`h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full relative`}
                                                    style={{ width: `${scanProgress}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-shimmer bg-[length:200%_100%]" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {errorMsg && (
                                <motion.div
                                    className={`mt-10 p-5 rounded-2xl border-2 flex items-start gap-4 text-left max-w-lg mx-auto ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <AlertCircle size={24} className="shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="font-black text-lg">Oops! Something went wrong</h4>
                                        <p className="font-medium text-sm">{errorMsg}</p>
                                        <button onClick={() => setErrorMsg(null)} className="mt-2 text-xs font-black uppercase tracking-widest bg-current/10 px-4 py-2 rounded-xl">
                                            Try Again
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Results Display */}
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
                                                        Security Report
                                                    </div>
                                                    <h2 className={`text-4xl md:text-5xl font-black font-display ${headingColor}`}>
                                                        {config.label}
                                                    </h2>
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-current/10 text-sm font-bold ${mutedText} mt-2`}>
                                                        <FileIcon size={14} className={config.text} />
                                                        <span className="max-w-[200px] md:max-w-md truncate">{scanResult.target}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Big Score Stats */}
                                            <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                                                {[
                                                    { label: 'Dangers', value: scanResult.stats?.malicious || 0, color: 'text-red-500' },
                                                    { label: 'Warnings', value: scanResult.stats?.suspicious || 0, color: 'text-orange-500' },
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
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                );
                            })()}

                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* File Stats */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                            <HardDrive size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>File Info</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-bold ${mutedText}`}>Size</span>
                                            <span className={`text-lg font-black ${headingColor}`}>
                                                {scanResult.file_size ? `${(scanResult.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-bold ${mutedText}`}>Status</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                                scanResult.status === 'clean' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {scanResult.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Detection Meter */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                            <BarChart3 size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Detection</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-sm font-bold ${mutedText}`}>Engine Flags</span>
                                            <span className={`text-lg font-black ${totalDetections > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {totalDetections} / {totalEngines}
                                            </span>
                                        </div>
                                        <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                            <motion.div
                                                className={`h-full rounded-full ${totalDetections > 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${totalEngines > 0 ? (totalDetections / totalEngines) * 100 : 0}%` }}
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* File Fingerprint */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                            <Fingerprint size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Fingerprint</h3>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>SHA-256 Hash</span>
                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border border-current/5 break-all text-[10px] font-mono leading-relaxed opacity-70`}>
                                            {scanResult.file_hash || 'Calculating...'}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Dangerous Actions (If malicious) */}
                            {scanResult.status !== 'clean' && (
                                <motion.div 
                                    variants={itemVariants}
                                    className={`rounded-3xl border-2 border-red-500/30 bg-red-500/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-black ${headingColor}`}>Safety First!</h3>
                                            <p className={`text-sm font-medium ${mutedText}`}>This file could harm your computer. Choose an action:</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none px-6 py-3 bg-orange-500 text-white font-black rounded-xl hover:scale-105 transition-all text-sm uppercase tracking-wider">
                                            Quarantine
                                        </button>
                                        <button className="flex-1 md:flex-none px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-lg shadow-red-600/20">
                                            Delete Forever
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Detailed Engines Table */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                                <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between bg-primary/5`}>
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-primary" />
                                        <h2 className={`font-display text-2xl font-black ${headingColor}`}>Expert Analysis</h2>
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
                                                <th className={`text-left px-8 py-5 text-sm font-black uppercase tracking-wider ${mutedText} hidden sm:table-cell`}>Finding</th>
                                                <th className={`text-right px-8 py-5 text-sm font-black uppercase tracking-wider ${mutedText}`}>Verdict</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-current/5">
                                            {scanResult.detections && scanResult.detections.length > 0 ? (
                                                scanResult.detections.map((det, i) => {
                                                    const isDanger = det.category?.toLowerCase() === 'malicious' || det.category?.toLowerCase() === 'suspicious';
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
                                                                <span className={`text-sm font-medium ${mutedText} truncate max-w-[300px] block`}>{det.result || 'No threats detected'}</span>
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
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-8 py-20 text-center">
                                                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                            <CheckCircle className="text-emerald-500" size={40} />
                                                        </div>
                                                        <h3 className={`text-xl font-black ${headingColor}`}>Clean as a whistle!</h3>
                                                        <p className={`text-lg ${mutedText} mt-2`}>No security experts found any issues with this file.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* History Section */}
                {!hasScanned && (
                    <motion.div key="history" variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-primary" />
                                    <h2 className={`font-display text-2xl font-black ${headingColor}`}>Recent Scans</h2>
                                </div>
                                <span className={`text-sm font-bold ${mutedText}`}>{history.length} Files Tracked</span>
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
                                                    className={`group flex items-center justify-between p-5 rounded-2xl border-2 ${isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-primary/30' : 'bg-gray-50 border-gray-100 hover:border-primary/30'} transition-all`}
                                                    whileHover={{ x: 5, scale: 1.02 }}
                                                >
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.color} text-white shadow-lg shrink-0`}>
                                                            <StatusIcon size={22} />
                                                        </div>
                                                        <div className="truncate">
                                                            <p className={`font-black text-base truncate ${headingColor}`}>{scan.target}</p>
                                                            <p className={`text-xs font-bold ${mutedText}`}>{scan.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${config.bg} ${config.text} border border-current/10 ml-4`}>
                                                        {scan.status}
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
                                        <h3 className={`text-xl font-black ${headingColor}`}>No history yet!</h3>
                                        <p className={`text-lg ${mutedText} mt-2`}>Your scanned files will appear here.</p>
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
