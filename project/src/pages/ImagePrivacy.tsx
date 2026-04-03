import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { openUrl } from '@tauri-apps/plugin-opener';
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
    ShieldCheck
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
function MetadataRow({ label, value, isLast = false }: { label: string; value: string | number; isLast?: boolean }) {
    if (!value && value !== 0) return null;
    return (
        <div className={`flex justify-between items-center text-sm py-2 ${!isLast ? 'border-b border-border' : ''}`}>
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right ml-4 max-w-[60%] truncate" title={String(value)}>{value}</span>
        </div>
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

    const trackActivity = useTrackActivity();

    // Load history from local storage
    useEffect(() => {
        const savedHistory = localStorage.getItem('hypertool_image_history');
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
            localStorage.setItem('hypertool_image_history', JSON.stringify(updated));
            return updated;
        });
    };

    const updateLatestHistoryStatus = (newStatus: 'clean' | 'has_exif' | 'cleaned') => {
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[0] = { ...updated[0], status: newStatus };
            localStorage.setItem('hypertool_image_history', JSON.stringify(updated));
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
                setSuccessMessage("Success! EXIF metadata completely removed and image saved.");
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
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Image Privacy</h1>
                <p className="text-muted-foreground">
                    Extract, review, and remove sensitive EXIF metadata hidden inside your images.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                    <AlertTriangle size={20} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {!hasImage || !metadata ? (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon />
                                Select an Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer" onClick={handleUpload}>
                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 text-primary">
                                    {isProcessing ? (
                                        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
                                    ) : (
                                        <ImageIcon size={32} />
                                    )}
                                </div>
                                <h3 className="text-xl font-medium mb-2">Upload a photo to analyze</h3>
                                <p className="text-sm text-muted-foreground mb-4">Supports JPEG and PNG formats</p>
                                <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md pointer-events-none">
                                    Select Image
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock size={20} />
                                Recent Scans
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {history.length > 0 ? (
                                <div className="space-y-3">
                                    {history.map((scan) => (
                                        <div
                                            key={scan.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-1.5 rounded-full shrink-0 ${scan.status === 'clean' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    scan.status === 'has_exif' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                    {scan.status === 'clean' ? <ShieldCheck size={16} /> :
                                                        scan.status === 'has_exif' ? <AlertTriangle size={16} /> :
                                                            <CheckCircle size={16} />}
                                                </div>
                                                <div className="truncate pr-4">
                                                    <p className="font-medium text-sm truncate">{scan.fileName}</p>
                                                    <p className="text-xs text-muted-foreground">{scan.date}</p>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-semibold px-2 py-1 rounded-md border shrink-0 ${scan.status === 'clean' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                scan.status === 'has_exif' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                    'border-primary/20 text-primary bg-primary/5'
                                                }`}>
                                                {scan.status.toUpperCase().replace('_', ' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
                                    <Search className="mx-auto mb-2 opacity-50" size={32} />
                                    <p>No recent scans. Your image scan history will appear here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-5 animate-in fade-in duration-500">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                                <ImageIcon size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-lg font-semibold truncate" title={metadata.fileName}>{metadata.fileName}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {metadata.dimensions} • {metadata.fileSize} • {metadata.fileProperties.megapixels} MP
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                            {!isCleaned ? (
                                <button
                                    onClick={handleClean}
                                    disabled={isProcessing || !metadata.hasExif}
                                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground font-medium rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    ) : (
                                        <Eraser size={18} />
                                    )}
                                    Strip Metadata
                                </button>
                            ) : (
                                <button
                                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-md"
                                    disabled
                                >
                                    <CheckCircle size={18} />
                                    Cleaned
                                </button>
                            )}
                            <button
                                onClick={resetState}
                                className="flex-1 md:flex-none justify-center px-5 py-2.5 border border-border bg-background hover:bg-accent font-medium rounded-md transition-colors"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={20} />
                            <p className="font-medium">{successMessage}</p>
                        </div>
                    )}

                    {/* ========== ALWAYS-VISIBLE FILE INFO ========== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* File Properties */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <FileText size={16} className="text-primary" />
                                    File Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <MetadataRow label="File Name" value={metadata.fileName} />
                                    <MetadataRow label="File Type" value={metadata.fileProperties.fileType} />
                                    <MetadataRow label="Extension" value={metadata.fileProperties.fileTypeExtension} />
                                    <MetadataRow label="MIME Type" value={metadata.fileProperties.mimeType} />
                                    <MetadataRow label="File Size" value={metadata.fileProperties.fileSizeDisplay} isLast />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Details */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Ruler size={16} className="text-primary" />
                                    Image Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <MetadataRow label="Image Width" value={metadata.fileProperties.imageWidth} />
                                    <MetadataRow label="Image Height" value={metadata.fileProperties.imageHeight} />
                                    <MetadataRow label="Image Size" value={metadata.fileProperties.imageSize} />
                                    <MetadataRow label="Megapixels" value={metadata.fileProperties.megapixels} />
                                    <MetadataRow label="Color Type" value={metadata.fileProperties.colorType} />
                                    <MetadataRow label="Bit Depth" value={metadata.fileProperties.bitDepth} isLast />
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Timestamps */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock size={16} className="text-primary" />
                                    System Timestamps
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <MetadataRow label="Created" value={metadata.datetime.created} />
                                    <MetadataRow label="Modified" value={metadata.datetime.modified} />
                                    <MetadataRow label="Accessed" value={metadata.datetime.accessed} isLast />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ========== EXIF STATUS ========== */}
                    {!metadata.hasExif && !isCleaned && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={20} />
                            <div>
                                <p className="font-medium">No sensitive EXIF metadata was found in this image.</p>
                                <p className="text-sm opacity-80 mt-0.5">The file properties above are standard and cannot be stripped.</p>
                            </div>
                        </div>
                    )}

                    {metadata.hasExif && !isCleaned && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={20} />
                            <div>
                                <p className="font-medium">EXIF metadata detected — {metadata.exifFieldCount} fields found</p>
                                <p className="text-sm opacity-80 mt-0.5">This image contains embedded metadata that may reveal private info. Review below and strip if needed.</p>
                            </div>
                        </div>
                    )}

                    {/* ========== EXIF METADATA CARDS ========== */}
                    {metadata.hasExif && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* GPS Location Data — HIGH RISK */}
                            <Card className={`relative overflow-hidden transition-opacity ${isCleaned ? 'opacity-50' : ''}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10"><span className="font-bold text-lg rotate-12 bg-destructive/20 text-destructive px-4 py-1 border-2 border-destructive rounded-md">CLEARED</span></div>}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                                        <MapPin size={16} />
                                        HIGH RISK: GPS Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                                        <p className="font-medium mb-2">{metadata.gps.location}</p>
                                        <div className="space-y-1 text-sm text-muted-foreground font-mono">
                                            <p>Lat: {metadata.gps.latitude || 'N/A'}</p>
                                            <p>Lon: {metadata.gps.longitude || 'N/A'}</p>
                                        </div>
                                        {metadata.gps.googleMapsUrl && (
                                            <button
                                                onClick={() => openUrl(metadata.gps.googleMapsUrl)}
                                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium text-sm rounded-md transition-colors border border-destructive/20"
                                            >
                                                <ExternalLink size={14} />
                                                View on Google Maps
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Device Info — MEDIUM RISK */}
                            <Card className={`relative overflow-hidden transition-opacity ${isCleaned ? 'opacity-50' : ''}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10"><span className="font-bold text-lg rotate-12 bg-destructive/20 text-destructive px-4 py-1 border-2 border-destructive rounded-md">CLEARED</span></div>}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
                                        <Smartphone size={16} />
                                        MEDIUM RISK: Device Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <MetadataRow label="Make" value={metadata.camera.make || 'N/A'} />
                                        <MetadataRow label="Model" value={metadata.camera.model || 'N/A'} />
                                        <MetadataRow label="Software" value={metadata.camera.software || 'N/A'} isLast />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* EXIF Timestamps */}
                            <Card className={`relative overflow-hidden transition-opacity ${isCleaned ? 'opacity-50' : ''}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10"><span className="font-bold text-lg rotate-12 bg-destructive/20 text-destructive px-4 py-1 border-2 border-destructive rounded-md">CLEARED</span></div>}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar size={16} />
                                        EXIF Timestamps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <MetadataRow label="Original" value={metadata.datetime.original || 'N/A'} />
                                        <MetadataRow label="Digitized" value={metadata.datetime.digitized || 'N/A'} isLast />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Camera Settings */}
                            <Card className={`relative overflow-hidden transition-opacity ${isCleaned ? 'opacity-50' : ''}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10"><span className="font-bold text-lg rotate-12 bg-destructive/20 text-destructive px-4 py-1 border-2 border-destructive rounded-md">CLEARED</span></div>}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Camera size={16} />
                                        Camera Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <MetadataRow label="Aperture" value={metadata.settings.aperture || 'N/A'} />
                                        <MetadataRow label="Exposure" value={metadata.settings.exposure || 'N/A'} />
                                        <MetadataRow label="ISO" value={metadata.settings.iso || 'N/A'} />
                                        <MetadataRow label="Focal Length" value={metadata.settings.focalLength || 'N/A'} isLast />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Technical Info */}
                            <Card className={`md:col-span-2 relative overflow-hidden transition-opacity ${isCleaned ? 'opacity-50' : ''}`}>
                                {isCleaned && <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10"><span className="font-bold text-lg rotate-12 bg-destructive/20 text-destructive px-4 py-1 border-2 border-destructive rounded-md">CLEARED</span></div>}
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Info size={16} />
                                        Additional EXIF Data
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
                                            <MetadataRow label="X Resolution" value={metadata.settings.xResolution || 'N/A'} />
                                            <MetadataRow label="Y Resolution" value={metadata.settings.yResolution || 'N/A'} />
                                            <MetadataRow label="Resolution Unit" value={metadata.settings.resolutionUnit || 'N/A'} isLast />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
