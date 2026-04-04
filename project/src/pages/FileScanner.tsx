import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { UploadCloud, File as FileIcon, Activity, AlertCircle, CheckCircle, FileSearch, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, Clock, Search } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

interface ScanResult {
    target: string;
    status: string;
    reputation: number;
    categories: string[];
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
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const trackActivity = useTrackActivity();

    // Load history from local storage
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

    const saveToHistory = (result: ScanResult) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            target: result.target,
            date: new Date().toLocaleString(),
            status: result.status
        };
        const updated = [newItem, ...history].slice(0, 10); // Keep last 10
        setHistory(updated);
        localStorage.setItem('chea_file_history', JSON.stringify(updated));
    };

    // In Tauri v2, if you want drag-and-drop to get file paths, you listen to window events.
    // For simplicity, we just use the dialog picker here and disable native drop behavior.
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // We cannot reliably get the absolute path from dataTransfer.files in modern browsers/Tauri without plugin setup.
        // It's recommended to use select file button.
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
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">File Scanner</h1>
                <p className="text-muted-foreground">
                    Upload documents or executables to check for malware and malicious signatures.
                </p>
            </div>

            {!hasScanned && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UploadCloud />
                            Upload File for Analysis
                        </CardTitle>
                        <CardDescription>Maximum file size: 650MB. Local and cloud engines will be used.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {!isScanning ? (
                                <>
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 text-primary">
                                        <FileSearch size={32} />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Select a file to scan</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm">
                                        Checking files with VirusTotal API directly. Select any file format.
                                    </p>
                                    <button
                                        onClick={handleSelectFileClick}
                                        className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Browse Files
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-8">
                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-xl font-medium mb-2">Analyzing File...</h3>
                                    <p className="text-muted-foreground">Hashing file and consulting VirusTotal intelligence.</p>
                                </div>
                            )}

                            {errorMsg && (
                                <div className="mt-6 w-full max-w-lg p-4 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20 text-left items-start flex gap-3">
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Scan Failed</h4>
                                        <p>{errorMsg}</p>
                                        <button onClick={() => setErrorMsg(null)} className="mt-3 text-xs bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md hover:opacity-90">
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!hasScanned && (
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
                                                scan.status === 'suspicious' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                {scan.status === 'clean' ? <ShieldCheck size={16} /> :
                                                    scan.status === 'suspicious' ? <AlertTriangle size={16} /> :
                                                        <ShieldAlert size={16} />}
                                            </div>
                                            <div className="truncate pr-4">
                                                <p className="font-medium text-sm truncate">{scan.target}</p>
                                                <p className="text-xs text-muted-foreground">{scan.date}</p>
                                            </div>
                                        </div>
                                        <div className={`text-xs font-semibold px-2 py-1 rounded-md border shrink-0 ${scan.status === 'clean' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                            scan.status === 'suspicious' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                'border-destructive/20 text-destructive bg-destructive/5'
                                            }`}>
                                            {scan.status.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
                                <Search className="mx-auto mb-2 opacity-50" size={32} />
                                <p>No recent scans. Your file scan history will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {hasScanned && scanResult && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Scan Results</h2>
                        <button
                            onClick={resetScan}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
                        >
                            <Trash2 size={16} />
                            Scan Another File
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className={`md:col-span-1 border-opacity-20 ${scanResult.status === 'malicious' ? 'border-destructive bg-destructive/5' :
                            scanResult.status === 'suspicious' ? 'border-amber-500 bg-amber-500/5' :
                                'border-emerald-500 bg-emerald-500/5'
                            }`}>
                            <CardHeader>
                                <CardTitle className={`flex items-center gap-2 ${scanResult.status === 'malicious' ? 'text-destructive' :
                                    scanResult.status === 'suspicious' ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                    {scanResult.status === 'malicious' ? <ShieldAlert size={24} /> :
                                        scanResult.status === 'suspicious' ? <AlertTriangle size={24} /> :
                                            <ShieldCheck size={24} />}

                                    {scanResult.status === 'malicious' ? 'Malicious File' :
                                        scanResult.status === 'suspicious' ? 'Suspicious File' : 'Clean File'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">File Name</h4>
                                    <p className="font-medium break-all flex items-center gap-2 text-foreground">
                                        <FileIcon size={16} className={
                                            scanResult.status === 'malicious' ? 'text-destructive' :
                                                scanResult.status === 'suspicious' ? 'text-amber-500' : 'text-emerald-500'
                                        } />
                                        {scanResult.target}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">File Size</h4>
                                        <p className="text-lg font-medium">
                                            {scanResult.file_size ? `${(scanResult.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Detection Ratio</h4>
                                        <p className="text-lg font-medium">
                                            {scanResult.stats.malicious + scanResult.stats.suspicious} / {(scanResult.detections?.length || 0)}
                                        </p>
                                    </div>
                                </div>
                                {scanResult.file_hash && (
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">SHA-256 Hash</h4>
                                        <p className="font-mono text-xs bg-card p-2 rounded border border-border break-all cursor-text select-all">
                                            {scanResult.file_hash}
                                        </p>
                                    </div>
                                )}

                                {scanResult.status !== 'clean' && (
                                    <div className="pt-4 border-t border-border space-y-3">
                                        <button className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-destructive text-white font-medium rounded-md hover:bg-destructive/90 transition-colors">
                                            Move to Quarantine
                                        </button>
                                        <button className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive font-medium rounded-md hover:bg-destructive/10 transition-colors">
                                            Delete File Forever
                                        </button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity size={20} />
                                    Detection Details
                                </CardTitle>
                                <CardDescription>Behavioral and signature analysis results</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scanResult.detections && scanResult.detections.length > 0 ? (
                                    <div className="rounded-md border border-border divide-y divide-border max-h-[400px] overflow-y-auto">
                                        {scanResult.detections.map((det: Detection, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-card/50">
                                                <span className="font-medium text-sm w-1/3">{det.engine}</span>

                                                <div className="w-2/3 flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground font-mono truncate mr-2" title={det.result}>{det.result}</span>
                                                    <div className={`flex items-center gap-1.5 shrink-0 ${det.category.toLowerCase() === 'malicious' ? 'text-destructive' :
                                                        det.category.toLowerCase() === 'suspicious' ? 'text-amber-500' : 'text-emerald-500'
                                                        }`}>
                                                        {det.category.toLowerCase() === 'malicious' && <ShieldAlert size={16} />}
                                                        {det.category.toLowerCase() === 'suspicious' && <AlertTriangle size={16} />}
                                                        {(det.category.toLowerCase() === 'clean' || det.category.toLowerCase() === 'undetected') && <ShieldCheck size={16} />}
                                                        <span className="text-xs font-bold uppercase tracking-wider">{det.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                                        <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500/50" />
                                        <h3 className="text-lg font-medium mb-1">No malicious engines detected</h3>
                                        <p>This file is considered clean by all participating vendors.</p>
                                    </div>
                                )}
                                <div className="mt-4 p-3 bg-muted/30 text-center text-sm text-muted-foreground rounded">
                                    File checked against {scanResult.detections?.length || 0} registered security engines.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
