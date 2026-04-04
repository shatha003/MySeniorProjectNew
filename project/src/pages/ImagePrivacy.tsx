import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { openUrl } from '@tauri-apps/plugin-opener';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
    Image as ImageIcon,
    MapPin,
    Camera,
    Calendar,
    Smartphone,
    Eraser,
    AlertTriangle,
    CheckCircle,
    FileText,
    Clock,
    Ruler,
    Info,
    ExternalLink,
    Search,
    ShieldCheck,
    Sparkles,
    ShieldAlert,
    LocateFixed,
    Zap,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    History,
    SmartphoneCharging
} from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';

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

// Helper to render a row in a metadata table
function MetadataRow({ label, value, isLast = false, highlight = false }: { label: string; value: string | number; isLast?: boolean; highlight?: boolean }) {
    if (!value && value !== 0) return null;
    return (
        <div className={`flex justify-between items-center text-sm py-2.5 ${!isLast ? 'border-b border-border/50' : ''}`}>
            <span className="text-muted-foreground font-medium">{label}</span>
            <span className={`font-semibold text-right ml-4 max-w-[60%] truncate ${highlight ? 'text-primary' : ''}`} title={String(value)}>{value}</span>
        </div>
    );
}

function PrivacyTip({ title, children, icon: Icon = Lightbulb }: { title: string; children: React.ReactNode; icon?: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-3 items-start"
        >
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shrink-0">
                <Icon size={14} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
            </div>
        </motion.div>
    );
}

export default function ImagePrivacy() {
    const [hasImage, setHasImage] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCleaned, setIsCleaned] = useState(false);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const trackActivity = useTrackActivity();

    // Load history from local storage
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

    const saveToHistory = (itemData: { fileName: string, status: 'clean' | 'has_exif' | 'cleaned' }) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            fileName: itemData.fileName,
            date: new Date().toLocaleString(),
            status: itemData.status
        };
        setHistory(prev => {
            const updated = [newItem, ...prev].slice(0, 10); // Keep last 10
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
                setSuccessMessage("Mission Accomplished! Your photo is now private and super safe to share! 🚀");
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
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto mb-10">
            <div className="flex flex-col gap-3">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3">
                        <Search size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Photo Detective 🕵️</h1>
                        <p className="text-muted-foreground font-medium">
                            Find and erase hidden secrets in your photos before sharing them!
                        </p>
                    </div>
                </motion.div>
            </div>

            {error && (
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive"
                >
                    <ShieldAlert size={24} className="animate-pulse" />
                    <p className="font-bold">{error}</p>
                </motion.div>
            )}

            {!hasImage || !metadata ? (
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-primary/5 via-background to-accent/20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                <ImageIcon className="text-primary" />
                                Start Your Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="border-3 border-dashed border-primary/20 hover:border-primary/50 rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all bg-background/40 backdrop-blur-sm cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5" 
                                onClick={handleUpload}
                            >
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary relative">
                                    {isProcessing ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                            <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></span>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon size={48} className="relative z-10" />
                                            <Sparkles size={24} className="absolute -top-1 -right-1 text-amber-500 animate-bounce" />
                                        </>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Select a Photo to Scan</h3>
                                <p className="text-base text-muted-foreground mb-6 font-medium max-w-md">
                                    We'll search for hidden map data, camera info, and other secrets.
                                </p>
                                <button className="px-8 py-3 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all transform pointer-events-none flex items-center gap-2">
                                    <Zap size={20} />
                                    Choose Photo
                                </button>
                            </motion.div>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/30">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2 font-bold">
                                <History size={20} className="text-primary" />
                                Your Recent Missions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {history.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {history.map((scan) => (
                                        <motion.div
                                            key={scan.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/30 hover:bg-accent/30 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-2 rounded-xl shrink-0 ${scan.status === 'clean' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    scan.status === 'has_exif' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                    {scan.status === 'clean' ? <ShieldCheck size={18} /> :
                                                        scan.status === 'has_exif' ? <ShieldAlert size={18} /> :
                                                            <Sparkles size={18} />}
                                                </div>
                                                <div className="truncate pr-2">
                                                    <p className="font-bold text-sm truncate">{scan.fileName}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {scan.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border shrink-0 ${scan.status === 'clean' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                scan.status === 'has_exif' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                    'border-primary/20 text-primary bg-primary/5'
                                                }`}>
                                                {scan.status === 'clean' ? 'SAFE' :
                                                    scan.status === 'has_exif' ? 'FOUND SECRETS' :
                                                        'CLEARED!'}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-muted/20 rounded-2xl bg-muted/5">
                                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="opacity-50" size={32} />
                                    </div>
                                    <p className="font-bold">No missions yet!</p>
                                    <p className="text-xs">Your photo scan history will appear here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Header bar */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-card/50 backdrop-blur-md border border-primary/10 rounded-3xl shadow-xl shadow-primary/5"
                    >
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="p-4 bg-primary rounded-2xl text-primary-foreground shadow-lg shadow-primary/20 rotate-2">
                                <ImageIcon size={32} />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-2xl font-black truncate max-w-[200px] md:max-w-md" title={metadata.fileName}>{metadata.fileName}</h2>
                                <p className="text-sm font-bold text-primary/60">
                                    {metadata.dimensions} • {metadata.fileProperties.megapixels} Megapixels
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                            {!isCleaned ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClean}
                                    disabled={isProcessing || !metadata.hasExif}
                                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {isProcessing ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    ) : (
                                        <Sparkles size={20} />
                                    )}
                                    Magic Eraser
                                </motion.button>
                            ) : (
                                <div
                                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle size={20} />
                                    Photo Safe!
                                </div>
                            )}
                            <button
                                onClick={resetState}
                                className="flex-1 md:flex-none justify-center px-6 py-3.5 border-2 border-border bg-background hover:bg-accent font-bold rounded-2xl transition-all"
                            >
                                Start Over
                            </button>
                        </div>
                    </motion.div>

                    {successMessage && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4 text-emerald-600 dark:text-emerald-400"
                        >
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <p className="text-xl font-black">Success!</p>
                                <p className="font-medium opacity-80">{successMessage}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== ALWAYS-VISIBLE FILE INFO ========== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* File Properties */}
                        <Card className="border-none shadow-md shadow-primary/5 bg-card/40 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-black flex items-center gap-2">
                                    <FileText size={18} className="text-primary" />
                                    File Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <MetadataRow label="Type" value={metadata.fileProperties.fileType} />
                                    <MetadataRow label="Format" value={metadata.fileProperties.fileTypeExtension} />
                                    <MetadataRow label="Size" value={metadata.fileProperties.fileSizeDisplay} isLast highlight />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Details */}
                        <Card className="border-none shadow-md shadow-primary/5 bg-card/40 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-black flex items-center gap-2">
                                    <Ruler size={18} className="text-primary" />
                                    Photo Shape
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <MetadataRow label="Width" value={metadata.fileProperties.imageWidth} />
                                    <MetadataRow label="Height" value={metadata.fileProperties.imageHeight} />
                                    <MetadataRow label="Quality" value={`${metadata.fileProperties.megapixels} MP`} isLast highlight />
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Timestamps */}
                        <Card className="border-none shadow-md shadow-primary/5 bg-card/40 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-black flex items-center gap-2">
                                    <Clock size={18} className="text-primary" />
                                    System Times
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <MetadataRow label="Created" value={metadata.datetime.created} />
                                    <MetadataRow label="Modified" value={metadata.datetime.modified} isLast highlight />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ========== EXIF STATUS ========== */}
                    <AnimatePresence>
                        {!metadata.hasExif && !isCleaned && (
                            <motion.div 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            >
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-lg font-black tracking-tight">Super Clean!</p>
                                    <p className="text-sm font-medium opacity-80">Detective found no secret info in this photo. It's safe to share!</p>
                                </div>
                            </motion.div>
                        )}

                        {metadata.hasExif && !isCleaned && (
                            <motion.div 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center gap-4 text-amber-600 dark:text-amber-400 shadow-sm"
                            >
                                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <p className="text-lg font-black tracking-tight">Secrets Detected!</p>
                                    <p className="text-sm font-medium opacity-80">We found {metadata.exifFieldCount} hidden bits of info that could reveal your privacy.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ========== EXIF METADATA CARDS ========== */}
                    {metadata.hasExif && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* GPS Location Data — HIGH RISK */}
                            <Card className={`relative overflow-hidden transition-all duration-500 border-none shadow-lg ${isCleaned ? 'opacity-40 grayscale-[0.5]' : 'ring-2 ring-destructive/20 bg-destructive/5'}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px] z-10"><span className="font-black text-2xl rotate-12 bg-emerald-500 text-white px-6 py-2 shadow-xl rounded-2xl">ERASED! ✨</span></div>}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-black text-destructive flex items-center gap-2">
                                        <LocateFixed size={20} />
                                        Hidden Map Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-background/50 rounded-2xl border border-destructive/10 shadow-inner">
                                        <p className="font-bold text-sm mb-3 text-destructive/80">{metadata.gps.location || 'Location Found'}</p>
                                        <div className="space-y-1.5 text-xs text-muted-foreground font-mono bg-destructive/5 p-2 rounded-lg">
                                            <p>Latitude: {metadata.gps.latitude || 'Secret'}</p>
                                            <p>Longitude: {metadata.gps.longitude || 'Secret'}</p>
                                        </div>
                                        {metadata.gps.googleMapsUrl && !isCleaned && (
                                            <button
                                                onClick={() => openUrl(metadata.gps.googleMapsUrl)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground font-bold text-sm rounded-xl transition-all shadow-md shadow-destructive/20 hover:shadow-destructive/40 active:scale-95"
                                            >
                                                <ExternalLink size={14} />
                                                See on Map
                                            </button>
                                        )}
                                    </div>
                                    {!isCleaned && (
                                        <PrivacyTip title="Why this is a secret?">
                                            This shows exactly where you took the photo. If you're at home, others might find out where you live!
                                        </PrivacyTip>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Device Info — MEDIUM RISK */}
                            <Card className={`relative overflow-hidden transition-all duration-500 border-none shadow-lg ${isCleaned ? 'opacity-40 grayscale-[0.5]' : 'ring-2 ring-amber-500/20 bg-amber-500/5'}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px] z-10"><span className="font-black text-2xl rotate-12 bg-emerald-500 text-white px-6 py-2 shadow-xl rounded-2xl">ERASED! ✨</span></div>}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-black text-amber-600 flex items-center gap-2">
                                        <SmartphoneCharging size={20} />
                                        Camera Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-background/50 rounded-2xl p-2 border border-amber-500/10 shadow-inner">
                                        <MetadataRow label="Brand" value={metadata.camera.make || 'Secret'} />
                                        <MetadataRow label="Model" value={metadata.camera.model || 'Secret'} />
                                        <MetadataRow label="App Used" value={metadata.camera.software || 'Secret'} isLast />
                                    </div>
                                    {!isCleaned && (
                                        <PrivacyTip title="Did you know?" icon={Smartphone}>
                                            This info tells people what kind of phone or camera you use.
                                        </PrivacyTip>
                                    )}
                                </CardContent>
                            </Card>

                            {/* EXIF Timestamps */}
                            <Card className={`relative overflow-hidden transition-all duration-500 border-none shadow-lg ${isCleaned ? 'opacity-40' : 'bg-card/40'}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px] z-10"><span className="font-black text-2xl rotate-12 bg-emerald-500 text-white px-6 py-2 shadow-xl rounded-2xl">ERASED! ✨</span></div>}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-black text-primary/80 flex items-center gap-2">
                                        <Calendar size={20} />
                                        Time Record
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-background/30 rounded-2xl p-2 border border-primary/5">
                                        <MetadataRow label="Taken on" value={metadata.datetime.original || 'Secret'} />
                                        <MetadataRow label="Saved on" value={metadata.datetime.digitized || 'Secret'} isLast />
                                    </div>
                                    {!isCleaned && (
                                        <PrivacyTip title="Time Travel" icon={Clock}>
                                            This shows the exact second you clicked the photo!
                                        </PrivacyTip>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Camera Settings */}
                            <Card className={`relative overflow-hidden transition-all duration-500 border-none shadow-lg ${isCleaned ? 'opacity-40' : 'bg-card/40'}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px] z-10"><span className="font-black text-2xl rotate-12 bg-emerald-500 text-white px-6 py-2 shadow-xl rounded-2xl">ERASED! ✨</span></div>}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-black text-primary/80 flex items-center gap-2">
                                        <Camera size={20} />
                                        Photo Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-background/30 rounded-2xl p-2 border border-primary/5">
                                        <MetadataRow label="Eye (Aperture)" value={metadata.settings.aperture || 'Secret'} />
                                        <MetadataRow label="ISO (Light)" value={metadata.settings.iso || 'Secret'} />
                                        <MetadataRow label="Focus" value={metadata.settings.focalLength || 'Secret'} isLast />
                                    </div>
                                    {!isCleaned && (
                                        <PrivacyTip title="Tech Talk" icon={Zap}>
                                            These are technical settings your camera used to make the photo look good.
                                        </PrivacyTip>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Additional Technical Info Toggle */}
                            <div className="md:col-span-2">
                                <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mx-auto mb-2 uppercase tracking-widest"
                                >
                                    {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    {showAdvanced ? 'Hide Advanced Tech Info' : 'Show Advanced Tech Info'}
                                </button>
                                
                                <AnimatePresence>
                                    {showAdvanced && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <Card className={`relative overflow-hidden transition-all duration-500 border-none shadow-md ${isCleaned ? 'opacity-40' : 'bg-muted/30'}`}>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-sm font-black text-muted-foreground flex items-center gap-2">
                                                        <Info size={16} />
                                                        Extra Technical Bits
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                                        <div>
                                                            <MetadataRow label="Flash" value={metadata.settings.flash || 'N/A'} />
                                                            <MetadataRow label="White Balance" value={metadata.settings.whiteBalance || 'N/A'} />
                                                            <MetadataRow label="Orientation" value={metadata.settings.orientation || 'N/A'} isLast />
                                                        </div>
                                                        <div>
                                                            <MetadataRow label="X Res" value={metadata.settings.xResolution || 'N/A'} />
                                                            <MetadataRow label="Y Res" value={metadata.settings.yResolution || 'N/A'} />
                                                            <MetadataRow label="Unit" value={metadata.settings.resolutionUnit || 'N/A'} isLast />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
