import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldAlert, ShieldCheck, Link as LinkIcon, AlertTriangle, ExternalLink, Globe, Search, Clock } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { invoke } from '@tauri-apps/api/core';

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
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const trackActivity = useTrackActivity();

    // Load history from local storage
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

    const saveToHistory = (result: ScanResult) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            url: result.target,
            date: new Date().toLocaleString(),
            status: result.status
        };
        const updated = [newItem, ...history].slice(0, 10); // Keep last 10
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
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Link Scanner</h1>
                <p className="text-muted-foreground">
                    Analyze URLs for malware, phishing attempts, and poor reputation using VirusTotal.
                </p>
            </div>

            <Card className="border-primary/20 shadow-md">
                <CardContent className="pt-6">
                    <form onSubmit={handleScan} className="flex gap-4 flex-col sm:flex-row">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                <LinkIcon size={20} />
                            </div>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="block w-full pl-10 pr-3 py-3 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isScanning || !url}
                            className="flex justify-center items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {isScanning ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></span>
                            ) : (
                                <Search size={20} />
                            )}
                            Scan URL
                        </button>
                    </form>
                    {errorMsg && (
                        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20 flex items-start gap-2">
                            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {hasScanned && scanResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    <Card className={`md:col-span-1 border-opacity-20 ${scanResult.status === 'malicious' ? 'border-destructive bg-destructive/5' :
                            scanResult.status === 'suspicious' ? 'border-amber-500 bg-amber-500/5' :
                                'border-emerald-500 bg-emerald-500/5'
                        }`}>
                        <CardHeader className="pb-3">
                            <CardTitle className={`flex items-center gap-2 ${scanResult.status === 'malicious' ? 'text-destructive' :
                                    scanResult.status === 'suspicious' ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                {scanResult.status === 'malicious' ? <ShieldAlert size={24} /> :
                                    scanResult.status === 'suspicious' ? <AlertTriangle size={24} /> :
                                        <ShieldCheck size={24} />}

                                {scanResult.status === 'malicious' ? 'Malicious Site' :
                                    scanResult.status === 'suspicious' ? 'Suspicious Site' : 'Clean Site'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Scanned URL</h4>
                                <a href={scanResult.target} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline break-all flex items-start gap-1">
                                    {scanResult.target}
                                    <ExternalLink size={14} className="shrink-0 mt-1" />
                                </a>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Detection Ratio</h4>
                                    <p className="text-xl font-bold">
                                        {scanResult.stats.malicious + scanResult.stats.suspicious} / {(scanResult.detections?.length || 0)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Community Score</h4>
                                    <p className={`text-xl font-bold ${scanResult.reputation < 0 ? 'text-destructive' : scanResult.reputation > 0 ? 'text-emerald-500' : ''}`}>
                                        {scanResult.reputation}
                                    </p>
                                </div>
                            </div>

                            <button onClick={resetScan} className="w-full py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded hover:bg-secondary/80 mt-4 transition-colors">
                                Scan Another URL
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Security Engine Analysis</CardTitle>
                            <CardDescription>Results from checking the URL against up to 90 security vendors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-border divide-y divide-border max-h-[350px] overflow-y-auto">
                                {scanResult.detections && scanResult.detections.length > 0 ? (
                                    scanResult.detections.map((det: Detection, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-card/50">
                                            <div className="flex items-center gap-3">
                                                <Globe size={18} className="text-muted-foreground" />
                                                <span className="font-medium text-sm">{det.engine}</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${det.category.toLowerCase() === 'malicious' ? 'text-destructive' :
                                                    det.category.toLowerCase() === 'suspicious' ? 'text-amber-500' : 'text-emerald-500'
                                                }`}>
                                                {det.category.toLowerCase() === 'malicious' && <ShieldAlert size={16} />}
                                                {det.category.toLowerCase() === 'suspicious' && <AlertTriangle size={16} />}
                                                {(det.category.toLowerCase() === 'clean' || det.category.toLowerCase() === 'undetected') && <ShieldCheck size={16} />}
                                                <span className="text-xs font-bold uppercase tracking-wider">{det.category}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl m-2">
                                        <ShieldCheck size={48} className="mx-auto mb-4 text-emerald-500/50" />
                                        <h3 className="text-lg font-medium mb-1">No findings</h3>
                                        <p>No security vendors flagged this URL as malicious.</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 p-3 bg-muted/30 text-center text-sm text-muted-foreground rounded">
                                Checked against {scanResult.detections?.length || 0} security vendors.
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
                                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setUrl(scan.url);
                                            handleScan(scan.url);
                                        }}
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
                                                <p className="font-medium text-sm truncate">{scan.url}</p>
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
                                <p>No recent scans. Your link scan history will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
