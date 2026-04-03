import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield, ShieldAlert, Link as LinkIcon, FileSearch, KeyRound,
    ShieldCheck, Lock, Eye, Zap, Flame, Trophy,
    Target, CheckCircle2, Circle, Star, ChevronRight, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProgressStore } from '../store/useUserProgressStore';
import { useDailyTasksStore } from '../store/useDailyTasksStore';
import { useActivityStore } from '../store/useActivityStore';
import { LEVEL_THRESHOLDS } from '../services/userProgressService';
import { ActivityType } from '../services/activityService';
import { getUserCredentials } from '../services/credentialService';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const { progress, levelInfo, fetchProgress } = useUserProgressStore();
    const { tasks, summary, fetchTasks } = useDailyTasksStore();
    const { activities, fetchActivities, loading: activityLoading } = useActivityStore();
    const [credentialCount, setCredentialCount] = useState(0);
    const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
            fetchTasks(user.uid);
            fetchActivities(user.uid);
            getUserCredentials(user.uid).then(creds => setCredentialCount(creds.length));
        }
    }, [user?.uid, fetchProgress, fetchTasks, fetchActivities]);

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

    const securityScore = useMemo(() => {
        const maxScore = 100;

        // Base score from being an active user
        const baseScore = 10;

        // XP Score: 0-25 points based on XP earned (1 XP = 0.025 points, max at 1000 XP)
        const xpScore = Math.min(Math.floor((progress?.xp || 0) * 0.025), 25);

        // Streak Score: 0-20 points (2 points per day, max at 10 days)
        const streakScore = Math.min((progress?.streakDays || 0) * 2, 20);

        // Credential Vault Score: 0-15 points (3 points per credential, max at 5)
        const vaultScore = Math.min(credentialCount * 3, 15);

        // Activity Score: 0-15 points based on total activities (3 points per activity, max at 5)
        const activityScore = Math.min(activities.length * 3, 15);

        // Daily Task Score: 0-15 points (3 points per completed task)
        const taskScore = Math.min((tasks?.tasks.filter(t => t.completed).length || 0) * 3, 15);

        const totalScore = baseScore + xpScore + streakScore + vaultScore + activityScore + taskScore;

        return Math.min(totalScore, maxScore);
    }, [progress, credentialCount, activities, tasks]);

    const scoreBreakdown = useMemo(() => ({
        base: 10,
        xp: Math.min(Math.floor((progress?.xp || 0) * 0.025), 25),
        streak: Math.min((progress?.streakDays || 0) * 2, 20),
        vault: Math.min(credentialCount * 3, 15),
        activity: Math.min(activities.length * 3, 15),
        tasks: Math.min((tasks?.tasks.filter(t => t.completed).length || 0) * 3, 15),
    }), [progress, credentialCount, activities, tasks]);

    // Tier-based styling
    const getTierStyle = (lvl: number) => {
        if (lvl <= 3) {
            return {
                gradient: 'from-amber-500 to-orange-600',
                glow: 'shadow-orange-500/40',
                badge: 'bg-gradient-to-br from-amber-500 to-orange-600',
                label: 'Bronze'
            };
        } else if (lvl <= 6) {
            return {
                gradient: 'from-slate-400 to-blue-600',
                glow: 'shadow-blue-400/50',
                badge: 'bg-gradient-to-br from-slate-400 to-blue-600',
                label: 'Silver'
            };
        } else {
            return {
                gradient: 'from-amber-400 via-orange-500 to-purple-600',
                glow: 'shadow-purple-500/50',
                badge: 'bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500',
                label: 'Gold'
            };
        }
    };

    const tierStyle = progress ? getTierStyle(levelInfo.level) : null;

    const quickActions = [
        { title: "Link Scanner", description: "Check URLs for threats", icon: <LinkIcon size={22} />, to: "/dashboard/link-scanner", color: "text-blue-500 bg-blue-500/10", points: 10 },
        { title: "File Scanner", description: "Analyze files for malware", icon: <FileSearch size={22} />, to: "/dashboard/file-scanner", color: "text-cyan-500 bg-cyan-500/10", points: 15 },
        { title: "Image Privacy", description: "Check image metadata", icon: <Eye size={22} />, to: "/dashboard/image-privacy", color: "text-purple-500 bg-purple-500/10", points: 10 },
        { title: "Password Gen", description: "Create secure passwords", icon: <KeyRound size={22} />, to: "/dashboard/password-gen", color: "text-emerald-500 bg-emerald-500/10", points: 5 },
        { title: "Password Check", description: "Check password strength", icon: <Shield size={22} />, to: "/dashboard/password-check", color: "text-amber-500 bg-amber-500/10", points: 3 },
        { title: "Encryption", description: "Encrypt sensitive text", icon: <Lock size={22} />, to: "/dashboard/encryption", color: "text-rose-500 bg-rose-500/10", points: 5 },
        { title: "Credential Vault", description: "Secure your credentials", icon: <ShieldAlert size={22} />, to: "/dashboard/vault", color: "text-orange-500 bg-orange-500/10", points: 20 },
        { title: "Settings", description: "App preferences", icon: <Zap size={22} />, to: "/dashboard/settings", color: "text-slate-500 bg-slate-500/10", points: 0 },
    ];

    const getActivityIcon = (type: ActivityType) => {
        const icons: Record<ActivityType, React.ReactNode> = {
            scan_link: <LinkIcon size={16} />,
            scan_file: <FileSearch size={16} />,
            scan_image: <Eye size={16} />,
            generate_password: <KeyRound size={16} />,
            check_password: <Shield size={16} />,
            generate_encryption: <Lock size={16} />,
            create_credential: <ShieldAlert size={16} />,
        };
        return icons[type] || <Star size={16} />;
    };

    const formatTimeAgo = (date: any) => {
        if (!date) return 'Just now';
        let time;
        if (typeof date === 'object' && 'seconds' in date) {
            time = date.seconds * 1000;
        } else {
            time = new Date(date).getTime();
        }
        if (isNaN(time)) return 'Just now';

        const now = new Date();
        const diff = now.getTime() - time;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(time).toLocaleDateString();
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header with User Info & Level */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}!</h1>
                    <p className="text-muted-foreground">Track your security progress and complete daily challenges.</p>
                </div>
                {progress && tierStyle && (
                    <div className="flex items-center gap-3 bg-card border rounded-xl p-3 pr-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${tierStyle.gradient} text-white font-bold text-lg shadow-lg ${tierStyle.glow} ${levelInfo.level >= 7 ? 'animate-pulse' : ''}`}>
                            {levelInfo.level}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{levelInfo.title}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{tierStyle.label}</span>
                                <Flame size={14} className="text-orange-500" />
                                <span className="text-sm text-muted-foreground">{progress.streakDays} day streak</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {progress.xp} XP total
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Security Score */}
                <Card
                    className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg relative overflow-hidden"
                    onMouseEnter={() => setShowScoreBreakdown(true)}
                    onMouseLeave={() => setShowScoreBreakdown(false)}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Shield size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <ShieldCheck className="text-primary" size={18} />
                            Security Score
                            <Info size={14} className="text-muted-foreground ml-auto" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-2">
                        <div className="relative flex items-center justify-center w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-muted/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                                <circle
                                    className="text-primary stroke-current"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * securityScore) / 100}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{securityScore}</span>
                            </div>
                        </div>
                    </CardContent>
                    {showScoreBreakdown && (
                        <CardContent className="pt-0 pb-4">
                            <div className="text-xs space-y-1 bg-muted/50 p-2 rounded-lg">
                                <div className="flex justify-between"><span>Base (Active User)</span><span>+{scoreBreakdown.base}</span></div>
                                <div className="flex justify-between"><span>XP ({progress?.xp || 0})</span><span>+{scoreBreakdown.xp}</span></div>
                                <div className="flex justify-between"><span>Streak ({progress?.streakDays || 0} days)</span><span>+{scoreBreakdown.streak}</span></div>
                                <div className="flex justify-between"><span>Vault ({credentialCount} credentials)</span><span>+{scoreBreakdown.vault}</span></div>
                                <div className="flex justify-between"><span>Activities ({activities.length})</span><span>+{scoreBreakdown.activity}</span></div>
                                <div className="flex justify-between"><span>Daily Tasks ({tasks?.tasks.filter(t => t.completed).length || 0}/5)</span><span>+{scoreBreakdown.tasks}</span></div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* XP Progress */}
                <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Trophy size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Star className="text-amber-500" size={18} />
                            Level Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 py-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Level {levelInfo.level}</span>
                            <span className="text-muted-foreground">
                                {levelInfo.xpInLevel} / {levelInfo.xpForNext - LEVEL_THRESHOLDS[levelInfo.level - 1]?.xp || levelInfo.xpInLevel} XP
                            </span>
                        </div>
                        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${levelInfo.progress}%` }}
                            />
                        </div>
                        {levelInfo.level < 10 && (
                            <p className="text-xs text-muted-foreground">
                                {levelInfo.xpForNext - (progress?.xp ?? 0)} XP to next level
                            </p>
                        )}
                        {levelInfo.level >= 10 && (
                            <p className="text-xs text-amber-500 font-medium">Maximum level reached!</p>
                        )}
                    </CardContent>
                </Card>

                {/* Daily Score */}
                <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Target size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="text-emerald-500" size={18} />
                            Daily Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-2">
                        <div className="relative flex items-center justify-center w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-muted/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                                <circle
                                    className="text-emerald-500 stroke-current"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * (tasks?.totalScore || 0)) / (tasks?.maxScore || 95)}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{tasks?.totalScore || 0}</span>
                                <span className="text-xs text-muted-foreground">/ {tasks?.maxScore || 95}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Grid - 8 Links */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="text-amber-500" size={20} />
                        Quick Actions
                    </CardTitle>
                    <CardDescription>Access all your security tools in one place</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.to} className="group">
                                <div className="p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer">
                                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <div className="font-medium text-sm">{action.title}</div>
                                    <div className="text-xs text-muted-foreground">{action.description}</div>
                                    {action.points > 0 && (
                                        <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                            <Star size={10} /> +{action.points} XP
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Daily Tasks */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        Daily Tasks
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                            {summary.completed}/{summary.total} completed
                        </span>
                    </CardTitle>
                    <CardDescription>Complete tasks to earn bonus XP and increase your daily score</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        {tasks?.tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${task.completed
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-card border-border'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{task.description}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {task.current}/{task.target} completed
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${task.completed ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        +{task.points} XP
                                    </span>
                                    <ChevronRight size={16} className={`text-muted-foreground transition-transform ${task.completed ? '' : 'group-hover:translate-x-1'
                                        }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest security actions and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                    {activityLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-muted rounded" />
                                        <div className="h-3 w-20 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-2 max-h-[342px] overflow-y-auto pr-2 custom-scrollbar">
                            {activities.slice(0, 50).map((activity, i) => (
                                <div
                                    key={activity.id || i}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-accent/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{activity.description}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatTimeAgo(activity.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                                        <Star size={12} />
                                        +{activity.points} XP
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Flame size={40} className="mx-auto mb-3 opacity-50" />
                            <p>No activities yet</p>
                            <p className="text-sm">Start using the tools above to track your progress!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
