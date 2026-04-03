import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle, Eye, EyeOff, CheckCircle2, XCircle, Zap, Hourglass, Clock, Calendar, Infinity as InfinityIcon } from 'lucide-react';
import { useTrackActivity } from '../hooks/useTrackActivity';

const formatTimeToCrack = (entropy: number) => {
    // Assume offline cracking speed of ~10 billion guesses/second
    const guessesPerSecond = 1e10;
    const totalCombinations = Math.pow(2, Math.min(entropy, 1024));
    const seconds = totalCombinations / guessesPerSecond;

    if (seconds < 1) return { value: "Instantly", unit: "", color: "bg-destructive/10 text-destructive", icon: <Zap size={0} /> };
    if (seconds < 60) return { value: Math.max(1, Math.round(seconds)).toString(), unit: "seconds", color: "bg-destructive/10 text-destructive", icon: <Hourglass size={0} /> };
    if (seconds < 3600) return { value: Math.max(1, Math.round(seconds / 60)).toString(), unit: "minutes", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: <Hourglass size={0} /> };
    if (seconds < 86400) return { value: Math.max(1, Math.round(seconds / 3600)).toString(), unit: "hours", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: <Clock size={0} /> };
    if (seconds < 31536000) return { value: Math.max(1, Math.round(seconds / 86400)).toString(), unit: "days", color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: <Clock size={0} /> };
    if (seconds < 3153600000) return { value: Math.max(1, Math.round(seconds / 31536000)).toString(), unit: "years", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: <Calendar size={0} /> };
    if (seconds < 315360000000) return { value: Math.max(1, Math.round(seconds / 3153600000)).toString(), unit: "centuries", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: <Calendar size={0} /> };

    return { value: "Forever", unit: "(\u221E)", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", icon: <InfinityIcon size={0} /> };
};

export default function PasswordChecker() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [strengthLabel, setStrengthLabel] = useState('Enter a password');
    const [strengthColor, setStrengthColor] = useState('bg-muted');
    const [hasChecked, setHasChecked] = useState(false);
    const trackActivity = useTrackActivity();

    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    let poolSize = 0;
    if (checks.uppercase) poolSize += 26;
    if (checks.lowercase) poolSize += 26;
    if (checks.number) poolSize += 10;
    if (checks.special) poolSize += 32;

    const entropy = password.length > 0 && poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
    const timeToCrack = formatTimeToCrack(entropy);

    useEffect(() => {
        if (!password) {
            setScore(0);
            setStrengthLabel('Enter a password');
            setStrengthColor('bg-muted');
            setFeedback([]);
            return;
        }

        let currentScore = 0;
        const currentFeedback: string[] = [];

        // Base score for length
        if (password.length > 0) currentScore += 1;
        if (password.length >= 8) currentScore += 1;
        if (password.length >= 12) currentScore += 1;
        if (password.length >= 16) currentScore += 1;

        // Score for variety
        if (checks.uppercase) currentScore += 1;
        else currentFeedback.push('Add uppercase letters (A-Z)');

        if (checks.lowercase) currentScore += 1;
        else currentFeedback.push('Add lowercase letters (a-z)');

        if (checks.number) currentScore += 1;
        else currentFeedback.push('Add numbers (0-9)');

        if (checks.special) currentScore += 2;
        else currentFeedback.push('Add special characters (!@#$%^&*)');

        if (password.length < 12 && password.length > 0) {
            currentFeedback.push('Make it longer (at least 12 characters recommended)');
        }

        // Penalty for common patterns (simplified)
        if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) {
            currentScore = Math.min(currentScore, 2); // Cap score if only letters or only numbers
            currentFeedback.push('Mix letters, numbers, and symbols');
        }

        setScore(currentScore);

        // Track activity when password is checked
        if (password && !hasChecked) {
            setHasChecked(true);
            trackActivity('check_password');
        }

        // Determine label and color
        if (currentScore <= 2) {
            setStrengthLabel('Weak');
            setStrengthColor('bg-destructive');
        } else if (currentScore <= 4) {
            setStrengthLabel('Fair');
            setStrengthColor('bg-amber-500');
        } else if (currentScore <= 6) {
            setStrengthLabel('Good');
            setStrengthColor('bg-emerald-400');
        } else {
            setStrengthLabel('Excellent');
            setStrengthColor('bg-emerald-600');
            if (currentFeedback.length === 0) {
                currentFeedback.push('Your password is very strong!');
            }
        }

        setFeedback(currentFeedback);
    }, [password, hasChecked, trackActivity]);
    const getStrengthWidth = () => {
        if (!password) return '0%';
        // Max score is 8, convert to percentage
        return `${Math.min((score / 8) * 100, 100)}%`;
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Password Checker</h1>
                <p className="text-muted-foreground">
                    Evaluate the strength of your passwords and get actionable recommendations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-md h-fit">
                    <CardHeader>
                        <CardTitle>Test your password</CardTitle>
                        <CardDescription>Enter a password to check its strength offline. We never store this data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password to test"
                                className="block w-full pl-4 pr-12 py-3 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Strength Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-muted-foreground">Strength</span>
                                <span className={
                                    score === 0 ? 'text-muted-foreground' :
                                        score <= 2 ? 'text-destructive' :
                                            score <= 4 ? 'text-amber-500' :
                                                score <= 6 ? 'text-emerald-400' : 'text-emerald-600'
                                }>
                                    {strengthLabel}
                                </span>
                            </div>
                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${strengthColor}`}
                                    style={{ width: getStrengthWidth() }}
                                />
                            </div>
                        </div>

                        {/* Time to Crack Visualization */}
                        <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border transition-all duration-700 ease-out ${timeToCrack.color.split(' ')[0]} border-current/10 hover:shadow-md transform hover:-translate-y-0.5 relative overflow-hidden group`}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-current to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-opacity duration-700 pointer-events-none"></div>

                            <div className="flex items-center gap-4 mb-2 sm:mb-0 relative z-10 w-full sm:w-auto">
                                <div className={`p-3 rounded-full bg-background/80 shadow-sm transition-transform duration-500 group-hover:scale-110 ${timeToCrack.color.split(' ')[1]}`}>
                                    {timeToCrack.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Time to Crack</p>
                                    <p className="text-xs text-muted-foreground font-medium">Estimated offline attack time</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1.5 relative z-10 w-full sm:w-auto justify-end flex-wrap overflow-visible" key={timeToCrack.value + timeToCrack.unit}>
                                <span className={`text-4xl sm:text-5xl font-black tracking-tight pl-1 ${timeToCrack.color.split(' ')[1]} drop-shadow-sm animate-in slide-in-from-bottom-6 fade-in zoom-in-75 duration-500 ease-out`}>
                                    {timeToCrack.value}
                                </span>
                                {timeToCrack.unit && (
                                    <span className={`text-sm sm:text-base font-bold uppercase tracking-widest ${timeToCrack.color.split(' ')[1]} opacity-90 backdrop-blur-md px-2.5 py-1 rounded-md bg-background/40 shadow-sm animate-in slide-in-from-left-4 fade-in duration-700 delay-150 fill-mode-backwards border border-current/10`}>
                                        {timeToCrack.unit}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Instant Feedback Grid */}
                        <div className="grid grid-cols-2 text-sm gap-3 pt-4 border-t border-border">
                            <div className={`flex items-center gap-2 ${checks.length ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {checks.length ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>12+ Characters</span>
                            </div>
                            <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {checks.uppercase ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>Uppercase Letter</span>
                            </div>
                            <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {checks.lowercase ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>Lowercase Letter</span>
                            </div>
                            <div className={`flex items-center gap-2 ${checks.number ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {checks.number ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>Number</span>
                            </div>
                            <div className={`flex items-center gap-2 ${checks.special ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {checks.special ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                <span>Special Character</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {score <= 4 && password ? <AlertTriangle className="text-amber-500" /> : <ShieldCheck className="text-emerald-500" />}
                            Recommendations
                        </CardTitle>
                        <CardDescription>Tips to improve your password security</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!password ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground space-y-3">
                                <Shield size={48} className="opacity-20" />
                                <p>Start typing a password to see recommendations here.</p>
                            </div>
                        ) : score >= 7 ? (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                                <p className="font-medium text-sm leading-relaxed">
                                    Excellent! Your password meets all best practices for security and complexity. It would take a supercomputer millions of years to crack this.
                                </p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {feedback.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm p-3 bg-muted/50 rounded-md border border-border">
                                        <div className="shrink-0 mt-0.5">
                                            {tip.includes('strong') ? (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            ) : (
                                                <AlertTriangle size={16} className="text-amber-500" />
                                            )}
                                        </div>
                                        <span className="text-foreground">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {password && score <= 4 && (
                            <div className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <h4 className="text-sm font-bold text-destructive flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} /> Vulnerability Warning
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    Passwords with a "Weak" or "Fair" rating are highly susceptible to dictionary attacks and brute-forcing. Consider using the Password Generator to create a secure alternative.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
