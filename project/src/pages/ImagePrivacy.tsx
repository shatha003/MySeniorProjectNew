import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { openUrl } from '@tauri-apps/plugin-opener';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon,
    Camera,
    Calendar,
    Smartphone,
    Eraser,
    CheckCircle,
    FileText,
    Clock,
    Ruler,
    Info,
    ExternalLink,
    Search,
    ShieldCheck,
    ShieldAlert,
    LocateFixed,
    Zap,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    History,
    SmartphoneCharging,
    RotateCcw,
    Star
} from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
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

interface GpsData {
    latitude: string;
    longitude: string;
    latitudeDecimal: number;
    longitudeDecimal: number;
    location: string;
    googleMapsUrl: string;
}

interface CameraData {
    make: string;
    model: string;
    software: string;
}

interface CameraSettings {
    aperture: string;
    exposure: string;
    iso: string;
    focalLength: string;
    flash: string;
    whiteBalance: string;
    orientation: string;
    xResolution: string;
    yResolution: string;
    resolutionUnit: string;
}

interface FileProperties {
    fileType: string;
    fileTypeExtension: string;
    mimeType: string;
    bitDepth: string;
    colorType: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: string;
    megapixels: string;
    fileSizeBytes: number;
    fileSizeDisplay: string;
}

interface DatetimeData {
    original: string;
    digitized: string;
    modified: string;
    accessed: string;
    created: string;
}

interface ImageMetadata {
    fileName: string;
    fileSize: string;
    dimensions: string;
    gps: GpsData;
    camera: CameraData;
    datetime: DatetimeData;
    settings: CameraSettings;
    fileProperties: FileProperties;
    hasExif: boolean;
    exifFieldCount: number;
}

interface HistoryItem {
    id: string;
    fileName: string;
    date: string;
    status: 'clean' | 'has_exif' | 'cleaned';
}

function MetadataRow({ label, value, isLast = false, highlight = false, mutedText, headingColor }: { label: string; value: string | number; isLast?: boolean; highlight?: boolean; mutedText: string; headingColor: string }) {
    if (!value && value !== 0) return null;
    return (
        <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-current/5' : ''}`}>
            <span className={`text-sm font-bold ${mutedText}`}>{label}</span>
            <span className={`text-sm font-black text-right ml-4 max-w-[60%] truncate ${highlight ? 'text-primary' : headingColor}`} title={String(value)}>{value}</span>
        </div>
    );
}

export default function ImagePrivacy() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [hasImage, setHasImage] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCleaned, setIsCleaned] = useState(false);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    const trackActivity = useTrackActivity();

    useEffect(() => {
        const savedHistory = localStorage.getItem('chea_image_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isProcessing) {
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
    }, [isProcessing]);

    const saveToHistory = (itemData: { fileName: string, status: 'clean' | 'has_exif' | 'cleaned' }) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            fileName: itemData.fileName,
            date: new Date().toLocaleString(),
            status: itemData.status
        };
        setHistory(prev => {
            const updated = [newItem, ...prev].slice(0, 10);
            localStorage.setItem('chea_image_history', JSON.stringify(updated));
            return updated;
        });
    };

    const updateLatestHistoryStatus = (newStatus: 'clean' | 'has_exif' | 'cleaned') => {
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[0] = { ...updated[0], status: newStatus };
            localStorage.setItem('chea_image_history', JSON.stringify(updated));
            return updated;
        });
    };

    const handleUpload = async () => {
        try {
            setError(null);

            const selectedPath = await open({
                multiple: false,
                filters: [{
                    name: 'Image',
                    extensions: ['png', 'jpg', 'jpeg']
                }]
            });

            if (selectedPath) {
                const pathStr = Array.isArray(selectedPath) ? selectedPath[0] : selectedPath;
                setIsProcessing(true);

                try {
                    const data: ImageMetadata = await invoke('scan_image_metadata', { path: pathStr });
                    setMetadata(data);
                    setSelectedFilePath(pathStr);
                    setHasImage(true);
                    setIsCleaned(false);
                    setSuccessMessage(null);
                    setScanProgress(100);
                    saveToHistory({ fileName: data.fileName, status: data.hasExif ? 'has_exif' : 'clean' });
                    await trackActivity('scan_image');
                } catch (invokeError) {
                    console.error("Failed to scan image metadata", invokeError);
                    setError(String(invokeError));
                } finally {
                    setIsProcessing(false);
                }
            }
        } catch (e) {
            console.error(e);
            setError("Failed to open file dialog.");
        }
    };

    const handleClean = () => {
        if (!metadata || !metadata.hasExif) {
            setError("No EXIF metadata found to strip.");
            return;
        }
        stripAndSave();
    };

    const stripAndSave = async () => {
        if (!selectedFilePath || !metadata) return;

        setIsProcessing(true);
        setError(null);

        try {
            const fileNameParts = metadata.fileName.split('.');
            const ext = fileNameParts.length > 1 ? fileNameParts.pop() : 'jpg';
            const baseName = fileNameParts.join('.');

            const savePath = await save({
                filters: [{
                    name: 'Image',
                    extensions: [ext as string]
                }],
                defaultPath: `${baseName}_cleaned.${ext}`
            });

            if (savePath) {
                await invoke('strip_image_metadata', { path: selectedFilePath, outputPath: savePath });
                setIsCleaned(true);
                updateLatestHistoryStatus('cleaned');
                setSuccessMessage("Photo cleaned successfully! All hidden metadata removed.");
            }
        } catch (e) {
            console.error(e);
            setError(String(e));
        } finally {
            setIsProcessing(false);
        }
    };

    const resetState = () => {
        setHasImage(false);
        setSelectedFilePath(null);
        setMetadata(null);
        setIsCleaned(false);
        setSuccessMessage(null);
        setError(null);
        setScanProgress(0);
    };

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const exifStatusConfig = {
        has_exif: {
            color: 'from-amber-400 to-orange-500',
            glow: 'shadow-amber-500/30',
            bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            border: 'border-amber-500/20',
            text: 'text-amber-500',
            label: 'SECRETS FOUND!',
            icon: ShieldAlert,
        },
        clean: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'PHOTO IS CLEAN!',
            icon: ShieldCheck,
        },
        cleaned: {
            color: 'from-emerald-400 to-teal-500',
            glow: 'shadow-teal-500/30',
            bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            label: 'CLEANED & SAFE!',
            icon: CheckCircle,
        },
    };

    const getExifConfig = (status: 'clean' | 'has_exif' | 'cleaned') => exifStatusConfig[status];

    const currentStatus: 'clean' | 'has_exif' | 'cleaned' = isCleaned ? 'cleaned' : (metadata?.hasExif ? 'has_exif' : 'clean');
    const exifConfig = getExifConfig(currentStatus);
    const StatusIcon = exifConfig.icon;

    const exifItemCount = metadata?.hasExif ? metadata.exifFieldCount : 0;
    const privacyRiskCount = metadata?.hasExif ? (
        (metadata.gps.latitude ? 1 : 0) + 
        (metadata.camera.make ? 1 : 0) + 
        (metadata.datetime.original ? 1 : 0)
    ) : 0;

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
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30`}>
                                        <ImageIcon size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Image Privacy
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Find and erase hidden secrets in your photos before sharing! 🕵️‍♂️
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

                {/* Upload / Processing Card */}
                {!hasImage || !metadata ? (
                    <motion.div variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-10 shadow-lg relative overflow-hidden text-center`}>
                            {!isProcessing ? (
                                <div className="space-y-8">
                                    <motion.div 
                                        className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary relative"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                    >
                                        <Search size={64} />
                                        <div className="absolute inset-0 bg-primary blur-2xl opacity-10" />
                                    </motion.div>

                                    <div className="space-y-3">
                                        <h3 className={`text-3xl font-black ${headingColor}`}>Ready to scan?</h3>
                                        <p className={`text-lg font-medium ${mutedText} max-w-md mx-auto`}>
                                            Select a photo and we'll search for hidden location data, camera info, and other secrets that could reveal your privacy!
                                        </p>
                                    </div>

                                    <motion.button
                                        onClick={handleUpload}
                                        className={`px-12 py-5 font-display text-xl font-black rounded-2xl transition-all shadow-xl ${
                                            isDark
                                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white'
                                                : 'bg-gradient-to-r from-primary to-violet-600 text-white'
                                        }`}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Pick a Photo!
                                    </motion.button>
                                    
                                    <p className={`text-xs font-bold uppercase tracking-widest ${mutedText} opacity-50`}>
                                        Supports: PNG, JPG, JPEG
                                    </p>
                                </div>
                            ) : (
                                <div className="py-12 space-y-8">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                                            <ImageIcon size={32} className="animate-pulse" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className={`text-2xl font-black ${headingColor}`}>Analyzing your photo...</h3>
                                        <div className="max-w-md mx-auto space-y-3">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                <span className={mutedText}>Scanning Metadata</span>
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

                            {error && (
                                <motion.div
                                    className={`mt-10 p-5 rounded-2xl border-2 flex items-start gap-4 text-left max-w-lg mx-auto ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <ShieldAlert size={24} className="shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="font-black text-lg">Oops! Something went wrong</h4>
                                        <p className="font-medium text-sm">{error}</p>
                                        <button onClick={() => setError(null)} className="mt-2 text-xs font-black uppercase tracking-widest bg-current/10 px-4 py-2 rounded-xl">
                                            Try Again
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="results"
                        variants={itemVariants} 
                        className="space-y-8"
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Status Hero Card */}
                        <motion.div
                            className={`rounded-3xl border-2 ${exifConfig.border} ${exifConfig.bg} p-8 md:p-10 shadow-2xl relative overflow-hidden`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${exifConfig.color} flex items-center justify-center text-white shadow-2xl ${exifConfig.glow} transform -rotate-6`}>
                                        <StatusIcon size={48} />
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <div className={`text-xs font-black uppercase tracking-[0.2em] ${exifConfig.text}`}>
                                            Privacy Report
                                        </div>
                                        <h2 className={`text-4xl md:text-5xl font-black font-display ${headingColor}`}>
                                            {exifConfig.label}
                                        </h2>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-current/10 text-sm font-bold ${mutedText} mt-2`}>
                                            <ImageIcon size={14} className={exifConfig.text} />
                                            <span className="max-w-[200px] md:max-w-md truncate">{metadata.fileName}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Big Score Stats */}
                                <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                                    {[
                                        { label: 'Secrets', value: exifItemCount, color: metadata?.hasExif && !isCleaned ? 'text-amber-500' : 'text-emerald-500' },
                                        { label: 'Risks', value: privacyRiskCount, color: privacyRiskCount > 0 ? 'text-red-500' : 'text-emerald-500' },
                                        { label: 'Status', value: isCleaned ? 'Clean' : (metadata?.hasExif ? 'Found' : 'Safe'), color: isCleaned ? 'text-emerald-500' : (metadata?.hasExif ? 'text-amber-500' : 'text-emerald-500') }
                                    ].map((stat, i) => (
                                        <div key={i} className={`flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-current/5`}>
                                            <span className={`text-2xl md:text-4xl font-black font-display ${stat.color}`}>{stat.value}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8">
                                {!isCleaned ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleClean}
                                        disabled={isProcessing || !metadata.hasExif}
                                        className={`flex items-center gap-3 px-8 py-4 font-display text-lg font-black rounded-2xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
                                            isDark
                                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-105'
                                                : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105'
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                                                Cleaning...
                                            </>
                                        ) : (
                                            <>
                                                <Eraser size={24} />
                                                Clean Photo!
                                            </>
                                        )}
                                    </motion.button>
                                ) : (
                                    <div className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20">
                                        <CheckCircle size={24} />
                                        Photo Cleaned!
                                    </div>
                                )}
                                <button
                                    onClick={resetState}
                                    className={`px-6 py-4 rounded-2xl border-2 font-display font-black transition-all ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </div>
                        </motion.div>

                        {successMessage && (
                            <motion.div
                                className={`rounded-3xl border-2 border-emerald-500/20 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} p-6 flex items-center gap-4`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-black ${headingColor}`}>Success!</h3>
                                    <p className={`text-sm font-medium ${mutedText}`}>{successMessage}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Detailed Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* File Properties */}
                            <motion.div
                                className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className={`text-xl font-black ${headingColor}`}>File Info</h3>
                                </div>
                                
                                <div className="space-y-1">
                                    <MetadataRow label="Type" value={metadata.fileProperties.fileType} mutedText={mutedText} headingColor={headingColor} />
                                    <MetadataRow label="Format" value={metadata.fileProperties.fileTypeExtension} mutedText={mutedText} headingColor={headingColor} />
                                    <MetadataRow label="Size" value={metadata.fileProperties.fileSizeDisplay} mutedText={mutedText} headingColor={headingColor} isLast highlight />
                                </div>
                            </motion.div>

                            {/* Image Details */}
                            <motion.div
                                className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                        <Ruler size={24} />
                                    </div>
                                    <h3 className={`text-xl font-black ${headingColor}`}>Photo Shape</h3>
                                </div>
                                
                                <div className="space-y-1">
                                    <MetadataRow label="Width" value={metadata.fileProperties.imageWidth} mutedText={mutedText} headingColor={headingColor} />
                                    <MetadataRow label="Height" value={metadata.fileProperties.imageHeight} mutedText={mutedText} headingColor={headingColor} />
                                    <MetadataRow label="Quality" value={`${metadata.fileProperties.megapixels} MP`} mutedText={mutedText} headingColor={headingColor} isLast highlight />
                                </div>
                            </motion.div>

                            {/* System Timestamps */}
                            <motion.div
                                className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg space-y-6`}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                        <Clock size={24} />
                                    </div>
                                    <h3 className={`text-xl font-black ${headingColor}`}>System Times</h3>
                                </div>
                                
                                <div className="space-y-1">
                                    <MetadataRow label="Created" value={metadata.datetime.created} mutedText={mutedText} headingColor={headingColor} />
                                    <MetadataRow label="Modified" value={metadata.datetime.modified} mutedText={mutedText} headingColor={headingColor} isLast highlight />
                                </div>
                            </motion.div>
                        </div>

                        {/* EXIF Metadata Cards */}
                        {metadata.hasExif && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* GPS Location Data — HIGH RISK */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${isCleaned ? 'border-emerald-500/20' : 'border-red-500/20'} ${isCleaned ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50') : (isDark ? 'bg-red-500/5' : 'bg-red-50')} p-8 shadow-lg relative overflow-hidden ${isCleaned ? 'opacity-50' : ''}`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                                            <LocateFixed size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>GPS Location</h3>
                                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-black uppercase ${isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-600'}`}>
                                            High Risk
                                        </span>
                                    </div>
                                    
                                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} space-y-3`}>
                                        <p className={`font-bold text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{metadata.gps.location || 'Location Found'}</p>
                                        <div className={`text-xs font-mono space-y-1 p-3 rounded-xl ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                                            <p className={mutedText}>Latitude: {metadata.gps.latitude || 'N/A'}</p>
                                            <p className={mutedText}>Longitude: {metadata.gps.longitude || 'N/A'}</p>
                                        </div>
                                        {metadata.gps.googleMapsUrl && !isCleaned && (
                                            <button
                                                onClick={() => openUrl(metadata.gps.googleMapsUrl)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:scale-[1.02]"
                                            >
                                                <ExternalLink size={14} />
                                                View on Map
                                            </button>
                                        )}
                                    </div>

                                    {!isCleaned && (
                                        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 items-start">
                                            <Lightbulb size={16} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Privacy Tip</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">This shows exactly where you took the photo. If you're at home, others might find out where you live!</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Device Info — MEDIUM RISK */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${isCleaned ? 'border-emerald-500/20' : 'border-amber-500/20'} ${isCleaned ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50') : (isDark ? 'bg-amber-500/5' : 'bg-amber-50')} p-8 shadow-lg relative overflow-hidden ${isCleaned ? 'opacity-50' : ''}`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                            <SmartphoneCharging size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Camera Identity</h3>
                                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-black uppercase ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                                            Medium Risk
                                        </span>
                                    </div>
                                    
                                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} space-y-1`}>
                                        <MetadataRow label="Brand" value={metadata.camera.make || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                        <MetadataRow label="Model" value={metadata.camera.model || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                        <MetadataRow label="Software" value={metadata.camera.software || 'N/A'} mutedText={mutedText} headingColor={headingColor} isLast />
                                    </div>

                                    {!isCleaned && (
                                        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 items-start">
                                            <Smartphone size={16} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Did You Know?</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">This info tells people what kind of phone or camera you use.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* EXIF Timestamps */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden ${isCleaned ? 'opacity-50' : ''}`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                                            <Calendar size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Time Record</h3>
                                    </div>
                                    
                                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} space-y-1`}>
                                        <MetadataRow label="Taken On" value={metadata.datetime.original || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                        <MetadataRow label="Digitized" value={metadata.datetime.digitized || 'N/A'} mutedText={mutedText} headingColor={headingColor} isLast />
                                    </div>

                                    {!isCleaned && (
                                        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 items-start">
                                            <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Time Travel</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">This shows the exact second you clicked the photo!</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Camera Settings */}
                                <motion.div
                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden ${isCleaned ? 'opacity-50' : ''}`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
                                            <Camera size={24} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>Camera Settings</h3>
                                    </div>
                                    
                                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} space-y-1`}>
                                        <MetadataRow label="Aperture" value={metadata.settings.aperture || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                        <MetadataRow label="ISO" value={metadata.settings.iso || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                        <MetadataRow label="Focal Length" value={metadata.settings.focalLength || 'N/A'} mutedText={mutedText} headingColor={headingColor} isLast />
                                    </div>

                                    {!isCleaned && (
                                        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 items-start">
                                            <Zap size={16} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Tech Talk</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">These are technical settings your camera used to make the photo look good.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Additional Technical Info Toggle */}
                                <div className="md:col-span-2">
                                    <button 
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${mutedText} hover:text-primary transition-colors mx-auto mb-4`}
                                    >
                                        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {showAdvanced ? 'Hide Advanced Info' : 'Show Advanced Info'}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showAdvanced && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <motion.div
                                                    className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg ${isCleaned ? 'opacity-50' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-3 rounded-2xl bg-gray-500/10 text-gray-500">
                                                            <Info size={24} />
                                                        </div>
                                                        <h3 className={`text-xl font-black ${headingColor}`}>Extra Technical Bits</h3>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                                        <div className="space-y-1">
                                                            <MetadataRow label="Flash" value={metadata.settings.flash || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                                            <MetadataRow label="White Balance" value={metadata.settings.whiteBalance || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                                            <MetadataRow label="Orientation" value={metadata.settings.orientation || 'N/A'} mutedText={mutedText} headingColor={headingColor} isLast />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <MetadataRow label="X Resolution" value={metadata.settings.xResolution || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                                            <MetadataRow label="Y Resolution" value={metadata.settings.yResolution || 'N/A'} mutedText={mutedText} headingColor={headingColor} />
                                                            <MetadataRow label="Unit" value={metadata.settings.resolutionUnit || 'N/A'} mutedText={mutedText} headingColor={headingColor} isLast />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* History Section */}
                {(!hasImage || !metadata) && (
                    <motion.div key="history" variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <History className="text-primary" />
                                    <h2 className={`font-display text-2xl font-black ${headingColor}`}>Recent Scans</h2>
                                </div>
                                <span className={`text-sm font-bold ${mutedText}`}>{history.length} Photos Tracked</span>
                            </div>

                            <div className="p-6">
                                {history.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {history.map((scan) => {
                                            const scanStatus: 'clean' | 'has_exif' | 'cleaned' = scan.status;
                                            const scanConfig = getExifConfig(scanStatus);
                                            const ScanIcon = scanConfig.icon;
                                            return (
                                                <motion.div
                                                    key={scan.id}
                                                    className={`group flex items-center justify-between p-5 rounded-2xl border-2 ${isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-primary/30' : 'bg-gray-50 border-gray-100 hover:border-primary/30'} transition-all`}
                                                    whileHover={{ x: 5, scale: 1.02 }}
                                                >
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${scanConfig.color} text-white shadow-lg shrink-0`}>
                                                            <ScanIcon size={22} />
                                                        </div>
                                                        <div className="truncate">
                                                            <p className={`font-black text-base truncate ${headingColor}`}>{scan.fileName}</p>
                                                            <p className={`text-xs font-bold ${mutedText}`}>{scan.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${scanConfig.bg} ${scanConfig.text} border border-current/10 ml-4`}>
                                                        {scan.status === 'clean' ? 'Clean' : scan.status === 'has_exif' ? 'Found' : 'Cleaned'}
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
                                        <p className={`text-lg ${mutedText} mt-2`}>Your photo scan history will appear here.</p>
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
