import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Lock, Unlock, Copy, Check, ArrowLeftRight, Eye, EyeOff, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';

type Mode = 'encrypt' | 'decrypt';
type Algorithm = 'AES-256-GCM' | 'AES-128-CBC' | 'ChaCha20-Poly1305';

export default function Encryption() {
    const [mode, setMode] = useState<Mode>('encrypt');
    const [inputText, setInputText] = useState('');
    const [password, setPassword] = useState('');
    const [outputText, setOutputText] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [algorithm, setAlgorithm] = useState<Algorithm>('AES-256-GCM');
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [error, setError] = useState('');
    const [timeTaken, setTimeTaken] = useState(0);
    const trackActivity = useTrackActivity();

    const handleProcess = async () => {
        if (!inputText.trim() || !password.trim()) return;

        setIsProcessing(true);
        setError('');
        setHasResult(false);
        const start = performance.now();

        try {
            if (mode === 'encrypt') {
                const result = await invoke<string>('encrypt_text', {
                    plaintext: inputText,
                    password: password,
                    algorithm: algorithm,
                });
                setOutputText(result);
                await trackActivity('generate_encryption');
            } else {
                const result = await invoke<string>('decrypt_text', {
                    encoded: inputText,
                    password: password,
                });
                setOutputText(result);
            }
            setHasResult(true);
        } catch (err) {
            const msg = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Unknown error');
            setError(msg);
        } finally {
            setTimeTaken(Math.round(performance.now() - start));
            setIsProcessing(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSwap = () => {
        setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
        setInputText(outputText);
        setOutputText('');
        setHasResult(false);
        setError('');
    };

    const handleClear = () => {
        setInputText('');
        setPassword('');
        setOutputText('');
        setHasResult(false);
        setError('');
        setTimeTaken(0);
    };

    const algorithms: { value: Algorithm; label: string; description: string }[] = [
        { value: 'AES-256-GCM', label: 'AES-256-GCM', description: 'Military-grade (Recommended)' },
        { value: 'AES-128-CBC', label: 'AES-128-CBC', description: 'Standard encryption' },
        { value: 'ChaCha20-Poly1305', label: 'ChaCha20-Poly1305', description: 'High performance' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Encryption Tool</h1>
                <p className="text-muted-foreground">
                    Encrypt and decrypt text securely using industry-standard algorithms. All operations run locally via the Rust backend.
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                    onClick={() => { setMode('encrypt'); setOutputText(''); setHasResult(false); setError(''); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'encrypt'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Lock size={16} />
                    Encrypt
                </button>
                <button
                    onClick={() => { setMode('decrypt'); setOutputText(''); setHasResult(false); setError(''); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'decrypt'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Unlock size={16} />
                    Decrypt
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Input/Output Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Input */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                {mode === 'encrypt' ? <Lock size={18} /> : <Unlock size={18} />}
                                {mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'encrypt'
                                    ? 'Enter the text you want to encrypt.'
                                    : 'Paste the encrypted text to decrypt.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={inputText}
                                onChange={(e) => { setInputText(e.target.value); setHasResult(false); setError(''); }}
                                placeholder={mode === 'encrypt' ? 'Type or paste your plaintext here...' : 'Paste the encrypted ciphertext here...'}
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm font-mono resize-none focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                            />
                        </CardContent>
                    </Card>

                    {/* Password */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Encryption Key</CardTitle>
                            <CardDescription>
                                {mode === 'encrypt'
                                    ? 'Set a strong password to protect your data. You will need this to decrypt.'
                                    : 'Enter the same password that was used during encryption.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter encryption password..."
                                    className="w-full rounded-md border border-input bg-background pl-4 pr-12 py-3 text-sm font-mono focus:ring-primary focus:border-primary transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleProcess}
                            disabled={!inputText.trim() || !password.trim() || isProcessing}
                            className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'encrypt'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {mode === 'encrypt' ? <Lock size={16} /> : <Unlock size={16} />}
                                    {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
                                </>
                            )}
                        </button>

                        {hasResult && (
                            <button
                                onClick={handleSwap}
                                className="flex items-center gap-2 px-4 py-3 rounded-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                <ArrowLeftRight size={16} />
                                Swap & {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
                            </button>
                        )}

                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-4 py-3 rounded-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="animate-in fade-in duration-300 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                            <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive font-medium">{error}</p>
                        </div>
                    )}

                    {/* Output */}
                    {hasResult && (
                        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 border-emerald-500/20">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-500" />
                                        {mode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
                                    </CardTitle>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-md border border-border p-4 font-mono text-sm break-all max-h-48 overflow-y-auto whitespace-pre-wrap">
                                    {outputText}
                                </div>
                                {mode === 'encrypt' && (
                                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                                        <Info size={12} />
                                        Save this output and your password. Without the password, data cannot be recovered.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Details — shown below output */}
                    {hasResult && (
                        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Operation Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Mode</p>
                                        <p className="font-semibold capitalize">{mode}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Algorithm</p>
                                        <p className="font-mono text-xs font-semibold">{algorithm}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Time Taken</p>
                                        <p className="font-semibold">{timeTaken} ms</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Input Length</p>
                                        <p className="font-semibold">{inputText.length} chars</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Output Length</p>
                                        <p className="font-semibold">{outputText.length} chars</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Password Strength</p>
                                        <p className={`font-semibold ${password.length < 8 ? 'text-destructive' :
                                                password.length < 12 ? 'text-amber-500' : 'text-emerald-500'
                                            }`}>
                                            {password.length < 8 ? 'Weak' :
                                                password.length < 12 ? 'Fair' : 'Strong'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Algorithm</CardTitle>
                            <CardDescription>Choose the encryption standard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {algorithms.map((alg) => (
                                <button
                                    key={alg.value}
                                    onClick={() => setAlgorithm(alg.value)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${algorithm === alg.value
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                            : 'border-border hover:border-primary/30 hover:bg-accent/50'
                                        }`}
                                >
                                    <div>
                                        <p className={`text-sm font-medium ${algorithm === alg.value ? 'text-primary' : 'text-foreground'}`}>
                                            {alg.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{alg.description}</p>
                                    </div>
                                    {algorithm === alg.value && (
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    )}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle size={16} className="text-amber-500" />
                                Security Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                                <span>All encryption runs <strong className="text-foreground">natively in Rust</strong> — nothing is sent to any server.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                                <span>Key derivation uses <strong className="text-foreground">Argon2id</strong> for maximum resistance against brute-force.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                                <span>A random <strong className="text-foreground">salt + IV</strong> is generated per encryption — identical inputs produce different outputs.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500" />
                                <span>If you lose your password, <strong className="text-foreground">data cannot be recovered</strong>.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Info size={14} className="shrink-0 mt-0.5 text-primary" />
                                <span>Use a long, unique password for best results.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
