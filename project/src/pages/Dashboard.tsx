import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useTheme } from '@/components/theme-provider';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

const Dashboard = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

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
        const baseScore = 10;
        const xpScore = Math.min(Math.floor((progress?.xp || 0) * 0.025), 25);
        const streakScore = Math.min((progress?.streakDays || 0) * 2, 20);
        const vaultScore = Math.min(credentialCount * 3, 15);
        const activityScore = Math.min(activities.length * 3, 15);
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

    const getTierStyle = (lvl: number) => {
        if (lvl <= 3) {
            return {
                gradient: isDark ? 'from-amber-500 to-orange-600' : 'from-amber-400 to-orange-500',
                glow: isDark ? 'shadow-orange-500/40' : 'shadow-amber-500/30',
                badge: isDark ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-amber-400 to-orange-500',
                label: 'Bronze',
                border: isDark ? 'border-amber-500/30' : 'border-amber-400/40',
                text: isDark ? 'text-amber-400' : 'text-amber-600',
            };
        } else if (lvl <= 6) {
            return {
                gradient: isDark ? 'from-slate-400 to-blue-600' : 'from-slate-400 to-blue-500',
                glow: isDark ? 'shadow-blue-400/50' : 'shadow-blue-500/30',
                badge: isDark ? 'bg-gradient-to-br from-slate-400 to-blue-600' : 'bg-gradient-to-br from-slate-400 to-blue-500',
                label: 'Silver',
                border: isDark ? 'border-blue-400/30' : 'border-blue-500/40',
                text: isDark ? 'text-blue-400' : 'text-blue-600',
            };
        } else {
            return {
                gradient: 'from-amber-400 via-orange-500 to-purple-600',
                glow: isDark ? 'shadow-purple-500/50' : 'shadow-purple-500/30',
                badge: 'bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500',
                label: 'Gold',
                border: isDark ? 'border-purple-400/30' : 'border-purple-500/40',
                text: isDark ? 'text-purple-400' : 'text-purple-600',
            };
        }
    };

    const tierStyle = progress ? getTierStyle(levelInfo.level) : null;

    const neonPrimary = isDark ? '#FF0A54' : '#4D00FF';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const cardBgHover = isDark ? 'hover:bg-cyber-surface' : 'hover:bg-accent/50';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';

    const quickActions = [
        { title: "Link Scanner", description: "Check URLs for threats", icon: <LinkIcon size={22} />, to: "/dashboard/link-scanner", color: isDark ? "text-neon-cyan bg-neon-cyan/10" : "text-neon-violet bg-neon-violet/10", points: 10 },
        { title: "File Scanner", description: "Analyze files for malware", icon: <FileSearch size={22} />, to: "/dashboard/file-scanner", color: isDark ? "text-neon-cyan bg-neon-cyan/10" : "text-blue-600 bg-blue-500/10", points: 15 },
        { title: "Image Privacy", description: "Check image metadata", icon: <Eye size={22} />, to: "/dashboard/image-privacy", color: isDark ? "text-neon-violet bg-neon-violet/10" : "text-purple-600 bg-purple-500/10", points: 10 },
        { title: "Password Gen", description: "Create secure passwords", icon: <KeyRound size={22} />, to: "/dashboard/password-gen", color: isDark ? "text-emerald-400 bg-emerald-400/10" : "text-emerald-600 bg-emerald-500/10", points: 5 },
        { title: "Password Check", description: "Check password strength", icon: <Shield size={22} />, to: "/dashboard/password-check", color: isDark ? "text-amber-400 bg-amber-400/10" : "text-amber-600 bg-amber-500/10", points: 3 },
        { title: "Encryption", description: "Encrypt sensitive text", icon: <Lock size={22} />, to: "/dashboard/encryption", color: isDark ? "text-neon-crimson bg-neon-crimson/10" : "text-rose-600 bg-rose-500/10", points: 5 },
        { title: "Credential Vault", description: "Secure your credentials", icon: <ShieldAlert size={22} />, to: "/dashboard/vault", color: isDark ? "text-orange-400 bg-orange-400/10" : "text-orange-600 bg-orange-500/10", points: 20 },
        { title: "Settings", description: "App preferences", icon: <Zap size={22} />, to: "/dashboard/settings", color: isDark ? "text-[#8AB4F8]/60 bg-[#8AB4F8]/10" : "text-gray-500 bg-gray-500/10", points: 0 },
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

    const ringBgColor = isDark ? 'text-[#8AB4F8]/15' : 'text-gray-200';
    const ringPrimaryColor = isDark ? 'text-neon-crimson' : 'text-neon-violet';
    const ringDailyColor = isDark ? 'text-emerald-400' : 'text-emerald-500';
    const xpBarBg = isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200';
    const xpBarFill = isDark ? 'from-neon-crimson to-neon-violet' : 'from-neon-violet to-purple-500';
    const taskCompletedBg = isDark ? 'bg-neon-crimson/5 border-neon-crimson/20' : 'bg-emerald-50 border-emerald-200/60';
    const taskPendingBg = isDark ? 'bg-cyber-surface/50 border-[#8AB4F8]/10' : 'bg-card border-border';
    const activityItemBg = isDark ? 'bg-cyber-dark/50 hover:bg-cyber-surface/50' : 'bg-card/50 hover:bg-accent/30';
    const iconBg = isDark ? 'bg-neon-crimson/10 text-neon-crimson' : 'bg-neon-violet/10 text-neon-violet';
    const xpTextColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
    const skeletonBg = isDark ? 'bg-[#8AB4F8]/10' : 'bg-gray-200';

    return (
        <motion.div
            className="space-y-6 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
                style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.08), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.06), transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
                style={{ background: isDark ? 'radial-gradient(circle, rgba(77,0,255,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(255,10,84,0.04), transparent 70%)' }} />

            {/* Header with User Info & Level */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className={`font-cyber text-2xl md:text-3xl font-bold tracking-wider ${headingColor}`}>
                        Welcome back, {displayName}
                    </h1>
                    <p className={`text-sm mt-1 ${mutedText}`}>
                        Track your security progress and complete daily challenges.
                    </p>
                </div>
                {progress && tierStyle && (
                    <motion.div
                        className={`flex items-center gap-3 ${cardBg} border ${borderColor} rounded-xl p-3 pr-4 backdrop-blur-sm relative overflow-hidden`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        {/* Corner accents */}
                        <div className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 ${tierStyle.border} rounded-tl-lg`} />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 ${tierStyle.border} rounded-br-lg`} />

                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${tierStyle.gradient} text-white font-bold text-lg shadow-lg ${tierStyle.glow} ${levelInfo.level >= 7 ? 'animate-pulse' : ''}`}>
                            {levelInfo.level}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${headingColor}`}>{levelInfo.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]/80' : 'bg-gray-100 text-gray-600'}`}>{tierStyle.label}</span>
                                <Flame size={14} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
                                <span className={`text-sm ${mutedText}`}>{progress.streakDays} day streak</span>
                            </div>
                            <div className={`text-xs ${mutedText}`}>
                                {progress.xp} XP total
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Main Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
                {/* Security Score */}
                <Card
                    className={`${borderColor} ${cardBg} shadow-lg relative overflow-hidden backdrop-blur-sm group`}
                    onMouseEnter={() => setShowScoreBreakdown(true)}
                    onMouseLeave={() => setShowScoreBreakdown(false)}
                >
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    {/* Background glow */}
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                        <Shield size={100} />
                    </div>

                    <CardHeader className="pb-2">
                        <CardTitle className={`text-base flex items-center gap-2 ${headingColor}`}>
                            <ShieldCheck style={{ color: neonPrimary }} size={18} />
                            <span className="font-cyber text-sm tracking-wider">Security Score</span>
                            <Info size={14} className={`${mutedText} ml-auto`} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-2">
                        <div className="relative flex items-center justify-center w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className={`${ringBgColor} stroke-current`} strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                                <circle
                                    className={`${ringPrimaryColor} stroke-current`}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * securityScore) / 100}
                                    style={{ filter: isDark ? `drop-shadow(0 0 6px ${neonPrimary})` : 'none' }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-3xl font-bold font-cyber ${headingColor}`}>{securityScore}</span>
                            </div>
                        </div>
                    </CardContent>
                    {showScoreBreakdown && (
                        <CardContent className="pt-0 pb-4">
                            <div className={`text-xs space-y-1 ${isDark ? 'bg-cyber-surface/50' : 'bg-muted/50'} p-2 rounded-lg border ${isDark ? 'border-[#8AB4F8]/10' : 'border-border'}`}>
                                <div className={`flex justify-between ${mutedText}`}><span>Base (Active User)</span><span>+{scoreBreakdown.base}</span></div>
                                <div className={`flex justify-between ${mutedText}`}><span>XP ({progress?.xp || 0})</span><span>+{scoreBreakdown.xp}</span></div>
                                <div className={`flex justify-between ${mutedText}`}><span>Streak ({progress?.streakDays || 0} days)</span><span>+{scoreBreakdown.streak}</span></div>
                                <div className={`flex justify-between ${mutedText}`}><span>Vault ({credentialCount} credentials)</span><span>+{scoreBreakdown.vault}</span></div>
                                <div className={`flex justify-between ${mutedText}`}><span>Activities ({activities.length})</span><span>+{scoreBreakdown.activity}</span></div>
                                <div className={`flex justify-between ${mutedText}`}><span>Daily Tasks ({tasks?.tasks.filter(t => t.completed).length || 0}/5)</span><span>+{scoreBreakdown.tasks}</span></div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* XP Progress */}
                <Card className={`${borderColor} ${cardBg} shadow-lg relative overflow-hidden backdrop-blur-sm`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                        <Trophy size={100} />
                    </div>

                    <CardHeader className="pb-2">
                        <CardTitle className={`text-base flex items-center gap-2 ${headingColor}`}>
                            <Star style={{ color: isDark ? '#FFA500' : '#F59E0B' }} size={18} />
                            <span className="font-cyber text-sm tracking-wider">Level Progress</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 py-2">
                        <div className={`flex items-center justify-between text-sm ${headingColor}`}>
                            <span className="font-medium font-cyber">Level {levelInfo.level}</span>
                            <span className={mutedText}>
                                {levelInfo.xpInLevel} / {levelInfo.xpForNext - LEVEL_THRESHOLDS[levelInfo.level - 1]?.xp || levelInfo.xpInLevel} XP
                            </span>
                        </div>
                        <div className={`h-3 ${xpBarBg} rounded-full overflow-hidden`}>
                            <div
                                className={`h-full bg-gradient-to-r ${xpBarFill} rounded-full transition-all duration-500`}
                                style={{
                                    width: `${levelInfo.progress}%`,
                                    boxShadow: isDark ? `0 0 8px ${neonPrimary}40` : 'none'
                                }}
                            />
                        </div>
                        {levelInfo.level < 10 && (
                            <p className={`text-xs ${mutedText}`}>
                                {levelInfo.xpForNext - (progress?.xp ?? 0)} XP to next level
                            </p>
                        )}
                        {levelInfo.level >= 10 && (
                            <p className={`text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Maximum level reached!</p>
                        )}
                    </CardContent>
                </Card>

                {/* Daily Score */}
                <Card className={`${borderColor} ${cardBg} shadow-lg relative overflow-hidden backdrop-blur-sm`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                        <Target size={100} />
                    </div>

                    <CardHeader className="pb-2">
                        <CardTitle className={`text-base flex items-center gap-2 ${headingColor}`}>
                            <Target style={{ color: isDark ? '#34D399' : '#10B981' }} size={18} />
                            <span className="font-cyber text-sm tracking-wider">Daily Score</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-2">
                        <div className="relative flex items-center justify-center w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className={`${ringBgColor} stroke-current`} strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                                <circle
                                    className={`${ringDailyColor} stroke-current`}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * (tasks?.totalScore || 0)) / (tasks?.maxScore || 95)}
                                    style={{ filter: isDark ? 'drop-shadow(0 0 6px #34D399)' : 'none' }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-3xl font-bold font-cyber ${headingColor}`}>{tasks?.totalScore || 0}</span>
                                <span className={`text-xs ${mutedText}`}>/ {tasks?.maxScore || 95}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants} className="relative z-10">
                <Card className={`${borderColor} ${cardBg} backdrop-blur-sm relative overflow-hidden`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    <CardHeader className="pb-3">
                        <CardTitle className={`text-lg flex items-center gap-2 ${headingColor}`}>
                            <Zap style={{ color: isDark ? '#FBBF24' : '#F59E0B' }} size={20} />
                            <span className="font-cyber tracking-wider">Quick Actions</span>
                        </CardTitle>
                        <CardDescription className={mutedText}>Access all your security tools in one place</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {quickActions.map((action, i) => (
                                <Link key={i} to={action.to} className="group">
                                    <motion.div
                                        className={`p-4 rounded-xl border ${isDark ? 'border-[#8AB4F8]/10 bg-cyber-surface/40' : 'border-border bg-card'} ${cardBgHover} transition-all cursor-pointer relative overflow-hidden`}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                        {/* Hover glow effect */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                            style={{ background: isDark ? 'radial-gradient(circle at center, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle at center, rgba(77,0,255,0.04), transparent 70%)' }} />

                                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10`}>
                                            {action.icon}
                                        </div>
                                        <div className={`font-medium text-sm relative z-10 ${headingColor}`}>{action.title}</div>
                                        <div className={`text-xs ${mutedText} relative z-10`}>{action.description}</div>
                                        {action.points > 0 && (
                                            <div className={`text-xs ${xpTextColor} mt-1 flex items-center gap-1 relative z-10`}>
                                                <Star size={10} /> +{action.points} XP
                                            </div>
                                        )}
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div variants={itemVariants} className="relative z-10">
                <Card className={`${borderColor} ${cardBg} backdrop-blur-sm relative overflow-hidden`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    <CardHeader className="pb-3">
                        <CardTitle className={`text-lg flex items-center gap-2 ${headingColor}`}>
                            <CheckCircle2 style={{ color: isDark ? '#34D399' : '#10B981' }} size={20} />
                            <span className="font-cyber tracking-wider">Daily Tasks</span>
                            <span className={`ml-auto text-sm font-normal ${mutedText}`}>
                                {summary.completed}/{summary.total} completed
                            </span>
                        </CardTitle>
                        <CardDescription className={mutedText}>Complete tasks to earn bonus XP and increase your daily score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            {tasks?.tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${task.completed ? taskCompletedBg : taskPendingBg}`}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed
                                            ? isDark ? 'bg-neon-crimson/20 text-neon-crimson' : 'bg-emerald-500 text-white'
                                            : isDark ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]/40' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                        </div>
                                        <div>
                                            <div className={`font-medium text-sm ${headingColor}`}>{task.description}</div>
                                            <div className={`text-xs ${mutedText}`}>
                                                {task.current}/{task.target} completed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${task.completed ? xpTextColor : mutedText}`}>
                                            +{task.points} XP
                                        </span>
                                        <ChevronRight size={16} className={`${mutedText} transition-transform`} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="relative z-10">
                <Card className={`${borderColor} ${cardBg} backdrop-blur-sm relative overflow-hidden`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tl-lg`} />
                    <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-tr-lg`} />
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-bl-lg`} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 ${isDark ? 'border-neon-crimson/30' : 'border-neon-violet/30'} rounded-br-lg`} />

                    <CardHeader className="pb-3">
                        <CardTitle className={`text-lg flex items-center gap-2 ${headingColor}`}>
                            <Flame style={{ color: isDark ? '#FB923C' : '#F97316' }} size={20} />
                            <span className="font-cyber tracking-wider">Recent Activity</span>
                        </CardTitle>
                        <CardDescription className={mutedText}>Your latest security actions and achievements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activityLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        className={`flex items-center gap-4 p-3 rounded-lg border ${isDark ? 'border-[#8AB4F8]/10' : 'border-border'} animate-pulse`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className={`w-10 h-10 rounded-full ${skeletonBg}`} />
                                        <div className="flex-1 space-y-2">
                                            <div className={`h-4 w-32 ${skeletonBg} rounded`} />
                                            <div className={`h-3 w-20 ${skeletonBg} rounded`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : activities.length > 0 ? (
                            <div className="space-y-2 max-h-[342px] overflow-y-auto pr-2 custom-scrollbar">
                                {activities.slice(0, 50).map((activity, i) => (
                                    <motion.div
                                        key={activity.id || i}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'border-[#8AB4F8]/10' : 'border-border'} ${activityItemBg} transition-colors`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center`}>
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div>
                                                <div className={`font-medium text-sm ${headingColor}`}>{activity.description}</div>
                                                <div className={`text-xs ${mutedText}`}>
                                                    {formatTimeAgo(activity.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm ${xpTextColor} font-medium`}>
                                            <Star size={12} />
                                            +{activity.points} XP
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                <Flame size={40} className={`mx-auto mb-3 ${isDark ? 'text-[#8AB4F8]/20' : 'text-gray-300'}`} />
                                <p className={mutedText}>No activities yet</p>
                                <p className={`text-sm ${mutedText}`}>Start using the tools above to track your progress!</p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;