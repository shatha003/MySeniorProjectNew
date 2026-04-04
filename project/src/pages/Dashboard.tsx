import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield, ShieldAlert, Link as LinkIcon, FileSearch, KeyRound,
    Lock, Eye, Flame, Trophy, CheckCircle2, ChevronRight,
    Activity, Star, MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProgressStore } from '../store/useUserProgressStore';
import { useDailyTasksStore } from '../store/useDailyTasksStore';
import { useActivityStore } from '../store/useActivityStore';
import { ActivityType } from '../services/activityService';
import { getUserCredentials } from '../services/credentialService';
import { useTheme } from '@/components/theme-provider';
import { loadAvatar } from '../lib/avatar';

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

const Dashboard = () => {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const user = useAuthStore((state) => state.user);
    const { progress, levelInfo, fetchProgress } = useUserProgressStore();
    const { tasks, summary, fetchTasks } = useDailyTasksStore();
    const { activities, fetchActivities } = useActivityStore();
    const [credentialCount, setCredentialCount] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
            fetchTasks(user.uid);
            fetchActivities(user.uid);
            getUserCredentials(user.uid).then(creds => setCredentialCount(creds.length));
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved.data);
        }
    }, [user?.uid, fetchProgress, fetchTasks, fetchActivities]);

    useEffect(() => {
        const handler = () => {
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved.data);
        };
        window.addEventListener('chea-avatar-changed', handler);
        return () => window.removeEventListener('chea-avatar-changed', handler);
    }, []);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            let current = 0;
            const step = Math.ceil(securityScore / 40);
            const interval = setInterval(() => {
                current += step;
                if (current >= securityScore) {
                    current = securityScore;
                    clearInterval(interval);
                }
                setAnimatedScore(current);
            }, 25);
            return () => clearInterval(interval);
        }, 300);
        return () => clearTimeout(timer);
    }, [securityScore]);

    const getTierStyle = (lvl: number) => {
        if (lvl <= 3) {
            return {
                gradient: 'from-amber-500 to-orange-600',
                glow: isDark ? 'shadow-orange-500/40' : 'shadow-amber-500/30',
                badge: 'bg-gradient-to-br from-amber-500 to-orange-600',
                label: 'Bronze',
                border: isDark ? 'border-amber-500/30' : 'border-amber-400/40',
                text: isDark ? 'text-amber-400' : 'text-amber-600',
                accent: isDark ? '#F59E0B' : '#D97706',
            };
        } else if (lvl <= 6) {
            return {
                gradient: 'from-slate-400 to-blue-600',
                glow: isDark ? 'shadow-blue-400/50' : 'shadow-blue-500/30',
                badge: 'bg-gradient-to-br from-slate-400 to-blue-600',
                label: 'Silver',
                border: isDark ? 'border-blue-400/30' : 'border-blue-500/40',
                text: isDark ? 'text-blue-400' : 'text-blue-600',
                accent: isDark ? '#60A5FA' : '#2563EB',
            };
        } else {
            return {
                gradient: 'from-amber-400 via-orange-500 to-purple-600',
                glow: isDark ? 'shadow-purple-500/50' : 'shadow-purple-500/30',
                badge: 'bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500',
                label: 'Gold',
                border: isDark ? 'border-purple-400/30' : 'border-purple-500/40',
                text: isDark ? 'text-purple-400' : 'text-purple-600',
                accent: isDark ? '#A78BFA' : '#7C3AED',
            };
        }
    };

    const tierStyle = progress ? getTierStyle(levelInfo.level) : null;

    const tools = [
        { 
            name: "Link Checker", 
            description: "Check if any link is safe to click!",
            icon: <LinkIcon size={24} />, 
            to: "/dashboard/link-scanner", 
            xp: 10, 
            color: "from-blue-400 to-cyan-500",
            glow: "shadow-cyan-500/30"
        },
        { 
            name: "File Checker", 
            description: "Scan your files for hidden dangers.",
            icon: <FileSearch size={24} />, 
            to: "/dashboard/file-scanner", 
            xp: 15, 
            color: "from-purple-500 to-indigo-600",
            glow: "shadow-purple-500/30"
        },
        { 
            name: "Photo Secrets", 
            description: "Find and hide secret messages inside your pictures!",
            icon: <Eye size={24} />, 
            to: "/dashboard/image-privacy", 
            xp: 10, 
            color: "from-pink-500 to-rose-500",
            glow: "shadow-rose-500/30"
        },
        { 
            name: "Make Password", 
            description: "Create super-strong passwords easily.",
            icon: <KeyRound size={24} />, 
            to: "/dashboard/password-gen", 
            xp: 5, 
            color: "from-orange-400 to-amber-500",
            glow: "shadow-amber-500/30"
        },
        { 
            name: "Test Password", 
            description: "Test how strong your password really is.",
            icon: <Shield size={24} />, 
            to: "/dashboard/password-check", 
            xp: 3, 
            color: "from-emerald-400 to-teal-500",
            glow: "shadow-teal-500/30"
        },
        { 
            name: "Secret Codes", 
            description: "Lock your text with a secret key.",
            icon: <Lock size={24} />, 
            to: "/dashboard/encryption", 
            xp: 5, 
            color: "from-violet-500 to-purple-600",
            glow: "shadow-violet-500/30"
        },
        { 
            name: "Treasure Box", 
            description: "Keep all your secret keys in one safe place.",
            icon: <ShieldAlert size={24} />, 
            to: "/dashboard/vault", 
            xp: 20, 
            color: "from-red-500 to-orange-600",
            glow: "shadow-red-500/30"
        },
    ];

    const getActivityIcon = (type: ActivityType) => {
        const icons: Record<ActivityType, React.ReactNode> = {
            scan_link: <LinkIcon size={14} />,
            scan_file: <FileSearch size={14} />,
            scan_image: <Eye size={14} />,
            generate_password: <KeyRound size={14} />,
            check_password: <Shield size={14} />,
            generate_encryption: <Lock size={14} />,
            create_credential: <ShieldAlert size={14} />,
            chat_ai: <MessageSquare size={14} />,
        };
        return icons[type] || <Star size={14} />;
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

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

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

            <div className="relative z-10 space-y-5">
                {/* Friendly Hero Section */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-4 md:p-6 shadow-xl overflow-hidden relative`}>
                        {/* Animated background shape */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-4">
                                {/* Profile Avatar */}
                                <motion.div
                                    className="relative shrink-0"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {/* Animated ring */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-full ${
                                            isDark
                                                ? 'bg-gradient-to-r from-neon-crimson via-neon-violet to-neon-crimson'
                                                : 'bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500'
                                        }`}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        style={{ padding: '2px' }}
                                    >
                                        <div className={`w-full h-full rounded-full ${isDark ? 'bg-cyber-dark' : 'bg-card'}`} style={{ margin: '2px' }} />
                                    </motion.div>

                                    {customAvatar ? (
                                        <img
                                            src={customAvatar}
                                            alt={displayName}
                                            className="relative w-16 h-16 rounded-full object-cover border-2 border-transparent shadow-lg"
                                        />
                                    ) : (
                                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shadow-lg bg-gradient-to-br ${tierStyle?.gradient || 'from-amber-500 to-orange-500'} text-white`}>
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </motion.div>

                                <div className="space-y-2">
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Welcome back, {displayName}! 👋
                                    </h1>
                                    <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                        Ready to keep the internet safe today?
                                    </p>
                                </div>
                            </div>

                            {progress && tierStyle && (
                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Streak Badge */}
                                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500`}>
                                        <div className="relative">
                                            <Flame size={24} className="animate-bounce" />
                                            <div className="absolute inset-0 bg-orange-500 blur-md opacity-20" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black leading-none">{progress.streakDays}</span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Day Streak</span>
                                        </div>
                                    </div>

                                    {/* Level Badge */}
                                    <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 ${tierStyle.border} ${isDark ? 'bg-cyber-surface' : 'bg-white'} shadow-lg transform hover:scale-105 transition-transform`}>
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tierStyle.gradient} flex items-center justify-center text-white font-black text-2xl shadow-xl ${tierStyle.glow}`}>
                                            {levelInfo.level}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${tierStyle.text}`}>{tierStyle.label} Rank</span>
                                            <span className={`text-xl font-black ${headingColor}`}>{levelInfo.title}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Level Progress Bar */}
                        <div className="mt-10 space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    <Trophy size={18} className="text-amber-500" />
                                    <span className={`text-sm font-bold ${mutedText}`}>Level Progress</span>
                                </div>
                                <span className={`text-sm font-black font-display ${headingColor}`}>
                                    {progress?.xp || 0} / {levelInfo.xpForNext} XP
                                </span>
                            </div>
                            <div className={`h-4 w-full ${isDark ? 'bg-cyber-surface' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${tierStyle?.gradient || 'from-amber-500 to-orange-500'} rounded-full relative`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${levelInfo.progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-shimmer bg-[length:200%_100%]" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* LEFT: Quick Stats & Missions (1 column) */}
                    <div className="lg:col-span-1 space-y-5">
                        {/* Power Meter (Security Score) */}
                        <motion.div variants={itemVariants}>
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-4 text-center shadow-lg`}>
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${mutedText} mb-4`}>Security Power</h3>
                                <div className="relative w-32 h-32 mx-auto">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            className={isDark ? 'text-white/5' : 'text-gray-100'}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="transparent"
                                        />
                                        <circle
                                            stroke={isDark ? '#FF0A54' : '#4D00FF'}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="transparent"
                                            strokeDasharray="264"
                                            strokeDashoffset={264 - (264 * animatedScore) / 100}
                                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-black ${headingColor}`}>{animatedScore}%</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600'}`}>
                                        Strong Shield
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Daily Quests */}
                        <motion.div variants={itemVariants}>
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-4 shadow-lg`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-xs font-bold uppercase tracking-widest ${mutedText}`}>Today's Quests</h3>
                                    <span className={`text-xs font-black text-emerald-500`}>{summary.completed}/{summary.total}</span>
                                </div>
                                <div className="space-y-3">
                                    {tasks?.tasks.map((task) => (
                                        <div 
                                            key={task.id} 
                                            className={`group flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                                task.completed ? 'opacity-50' : 'hover:bg-primary/5'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-dashed border-gray-300'
                                            }`}>
                                                {task.completed && <CheckCircle2 size={14} />}
                                            </div>
                                            <span className={`text-sm font-bold ${task.completed ? 'line-through' : headingColor}`}>
                                                {task.description}
                                            </span>
                                            <span className="ml-auto text-[10px] font-black text-primary">+{task.points}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Tools Grid (3 columns) */}
                    <div className="lg:col-span-3 space-y-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className={`font-display text-xl font-black ${headingColor}`}>My Security Tools</h2>
                            <span className={`text-xs font-bold ${mutedText}`}>{tools.length} Awesome Tools</span>
                        </div>

                        {/* Scanning Tools */}
                        <div className="mb-4">
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${mutedText} mb-3 flex items-center gap-2`}>
                                <Eye size={12} /> Scanning Tools
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[tools[0], tools[1], tools[2]].map((tool, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className={`group relative p-4 rounded-2xl border-2 ${borderColor} ${cardBg} cursor-pointer shadow-md overflow-hidden`}
                                        onClick={() => navigate(tool.to)}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 shadow-md ${tool.glow}`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className={`text-base font-bold ${headingColor}`}>{tool.name}</h3>
                                        <p className={`text-xs ${mutedText} line-clamp-1`}>{tool.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-emerald-500">+{tool.xp} XP</span>
                                            <ChevronRight size={14} className={`${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Password Tools */}
                        <div className="mb-4">
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${mutedText} mb-3 flex items-center gap-2`}>
                                <KeyRound size={12} /> Password Tools
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[tools[3], tools[4]].map((tool, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className={`group relative p-4 rounded-2xl border-2 ${borderColor} ${cardBg} cursor-pointer shadow-md overflow-hidden`}
                                        onClick={() => navigate(tool.to)}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 shadow-md ${tool.glow}`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className={`text-base font-bold ${headingColor}`}>{tool.name}</h3>
                                        <p className={`text-xs ${mutedText} line-clamp-1`}>{tool.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-emerald-500">+{tool.xp} XP</span>
                                            <ChevronRight size={14} className={`${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Encryption & Vault */}
                        <div className="mb-4">
                            <h3 className={`text-xs font-bold uppercase tracking-widest ${mutedText} mb-3 flex items-center gap-2`}>
                                <Lock size={12} /> Encryption & Vault
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[tools[5], tools[6]].map((tool, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className={`group relative p-4 rounded-2xl border-2 ${borderColor} ${cardBg} cursor-pointer shadow-md overflow-hidden`}
                                        onClick={() => navigate(tool.to)}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 shadow-md ${tool.glow}`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className={`text-base font-bold ${headingColor}`}>{tool.name}</h3>
                                        <p className={`text-xs ${mutedText} line-clamp-1`}>{tool.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-emerald-500">+{tool.xp} XP</span>
                                            <ChevronRight size={14} className={`${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Wins (Activity Log) */}
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-5 shadow-lg`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-primary" />
                                    <h2 className={`font-display text-xl font-black ${headingColor}`}>Recent Wins</h2>
                                </div>
                                <span className={`text-xs font-bold ${mutedText}`}>Your last {activities.length > 5 ? 5 : activities.length} actions</span>
                            </div>

                            <div className="space-y-4">
                                {activities.slice(0, 5).map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-cyber-surface' : 'bg-white'} shadow-sm`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-bold ${headingColor}`}>{activity.description}</p>
                                            <p className={`text-[10px] ${mutedText} uppercase font-black tracking-widest`}>{formatTimeAgo(activity.createdAt)}</p>
                                        </div>
                                        <span className="text-xs font-black text-emerald-500">+{activity.points} XP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default Dashboard;