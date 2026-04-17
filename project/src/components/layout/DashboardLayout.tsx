import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserProgressStore } from '../../store/useUserProgressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme-provider';
import { loadAvatar } from '../../lib/avatar';
import {
    Home,
    ScanSearch,
    FileCheck,
    Camera,
    Wand2,
    Shield,
    LockKeyhole,
    Vault,
    BotMessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Flame,
    Zap,
    Brain,
    Mail,
    FolderOpen,
    KeyRound,
    Lock,
    Gamepad2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NovaChat } from '../ui/NovaChat';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    end?: boolean;
    isDark: boolean;
}

const NavItem = ({ to, icon, label, onClick, end, isDark }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
                "sidebar-nav-item flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative overflow-hidden font-display",
                isActive
                    ? "sidebar-nav-active font-black"
                    : isDark
                        ? "text-[#8AB4F8]/60 hover:text-[#F4F6FF] font-bold"
                        : "text-gray-600 hover:text-gray-900 font-bold"
            )}
        >
            {({ isActive }) => (
                <>
                    <motion.span
                        className={cn(
                            "transition-transform",
                            isActive
                                ? "text-[#FF0A54]"
                                : isDark
                                    ? "group-hover:text-[#FF0A54]/80"
                                    : "group-hover:text-[#4D00FF]/80"
                        )}
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        {icon}
                    </motion.span>
                    <span className="text-sm">{label}</span>
                    {isActive && (
                        <motion.div
                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#FF0A54]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const user = useAuthStore((s) => s.user);
    const { progress, fetchProgress } = useUserProgressStore();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // Hide NovaChat on AI Agent page since it has its own chat interface
    const isAIAgentPage = location.pathname === '/dashboard/ai-agent';

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved.data);
        }
    }, [user?.uid, fetchProgress]);

    useEffect(() => {
        const handler = () => {
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved.data);
        };
        window.addEventListener('chea-avatar-changed', handler);
        return () => window.removeEventListener('chea-avatar-changed', handler);
    }, []);

    const level = progress?.level || 1;
    const streak = progress?.streakDays || 0;

    const getTierStyle = (lvl: number) => {
        if (lvl <= 3) {
            return {
                border: 'border-amber-600',
                bg: 'bg-amber-600',
                glow: 'shadow-orange-500/40',
                text: 'text-amber-700',
                gradient: 'from-amber-500 to-orange-600'
            };
        } else if (lvl <= 6) {
            return {
                border: 'border-slate-400',
                bg: 'bg-blue-500',
                glow: 'shadow-blue-400/50',
                text: 'text-blue-600',
                gradient: 'from-slate-400 to-blue-600'
            };
        } else {
            return {
                border: 'border-amber-400',
                bg: 'bg-gradient-to-r from-amber-400 to-purple-500',
                glow: 'shadow-purple-500/60',
                text: 'text-amber-600',
                gradient: 'from-amber-400 via-orange-500 to-purple-600'
            };
        }
    };

    const tierStyle = getTierStyle(level);
    const isHighTier = level >= 7;

    const handleLogout = async () => {
        try {
            localStorage.removeItem('chea-remember-me');
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const navSections = [
        {
            label: "Scanning Tools",
            icon: <FolderOpen size={14} />,
            items: [
                { to: "/dashboard/link-scanner", icon: <ScanSearch size={18} />, label: "Link Checker" },
                { to: "/dashboard/file-scanner", icon: <FileCheck size={18} />, label: "File Checker" },
                { to: "/dashboard/metadata", icon: <Camera size={18} />, label: "Photo Secrets" },
            ]
        },
        {
            label: "Password Tools",
            icon: <KeyRound size={14} />,
            items: [
                { to: "/dashboard/password-gen", icon: <Wand2 size={18} />, label: "Make Password" },
                { to: "/dashboard/password-check", icon: <Shield size={18} />, label: "Test Password" },
            ]
        },
        {
            label: "Encryption & Vault",
            icon: <Lock size={14} />,
            items: [
                { to: "/dashboard/encryption", icon: <LockKeyhole size={18} />, label: "Secret Codes" },
                { to: "/dashboard/vault", icon: <Vault size={18} />, label: "Treasure Box" },
            ]
        },
        {
            label: "Game Zone",
            icon: <Gamepad2 size={14} />,
            items: [
                { to: "/dashboard/quiz-arena", icon: <Brain size={18} />, label: "Quiz Arena" },
                { to: "/dashboard/phishing-dojo", icon: <Mail size={18} />, label: "Phishing Dojo" },
            ]
        },
    ];

    const sidebarBg = isDark ? 'bg-[#0A1128]' : 'bg-card';
    const sectionLabelColor = isDark ? 'text-[#8AB4F8]/40' : 'text-muted-foreground';
    const logoutHover = isDark
        ? 'hover:bg-red-500/10 hover:text-red-400'
        : 'hover:bg-destructive/10 hover:text-destructive';
    const footerBorderColor = isDark ? 'border-[#FF0A54]/10' : 'border-border';
    const footerTextColor = isDark ? 'text-[#8AB4F8]/30' : 'text-gray-400';

    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex flex-col h-full relative z-10">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-2 py-5 px-4"
            >
                <motion.div
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: isDark
                                ? 'radial-gradient(circle, rgba(255,10,84,0.25) 0%, rgba(255,10,84,0.08) 50%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(77,0,255,0.15) 0%, rgba(77,0,255,0.05) 50%, transparent 70%)',
                            filter: 'blur(20px)',
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1.2 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    <img
                        src="/icon.png"
                        alt="CHEA"
                        className="w-40 h-40 object-contain relative z-10"
                    />
                </motion.div>
                <span className="font-cyber text-sm font-bold tracking-[0.25em] uppercase" style={{ color: isDark ? '#F4F6FF' : '#121A33' }}>
                    CHEA
                </span>
            </motion.div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                {/* Standalone items */}
                <NavItem to="/dashboard" icon={<Home size={18} />} label="Home" end isDark={isDark} onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined} />
                <NavItem to="/dashboard/ai-agent" icon={<BotMessageSquare size={18} />} label="Ask Nova" isDark={isDark} onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined} />

                {/* Sections */}
                {navSections.map((section) => (
                    <div key={section.label} className="mb-2">
                        <div className={`flex items-center gap-2 mb-1.5 px-4 text-[0.6rem] font-display font-bold uppercase tracking-[0.15em] ${sectionLabelColor}`}>
                            {section.icon}
                            <span>{section.label}</span>
                        </div>
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavItem key={item.to} {...item} isDark={isDark} onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className={`px-3 py-3 border-t ${footerBorderColor} space-y-0.5`}>
                <NavItem to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" isDark={isDark} />
                <button
                    onClick={handleLogout}
                    className={`sidebar-nav-item font-display flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all w-full text-left text-sm font-bold ${sectionLabelColor} ${logoutHover}`}
                >
                    <motion.span
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <LogOut size={18} />
                    </motion.span>
                    <span className="font-display font-bold">Log Out</span>
                </button>
            </div>

            {/* Encryption badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`px-4 py-3 flex items-center gap-2 text-[0.6rem] ${footerTextColor}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="font-body tracking-wide">AES-256 Encrypted</span>
            </motion.div>
        </div>
    );

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className={`hidden md:flex flex-col w-64 ${sidebarBg} sidebar-cyber ${isDark ? '' : 'sidebar-cyber-light'}`}>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Fun Kid-Friendly Header */}
                <header className={`relative h-20 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between px-4 md:px-6 z-10 overflow-hidden`}>
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 ${isDark
                        ? 'bg-gradient-to-r from-[#0A1128] via-[#0F1B3D] to-[#0A1128]'
                        : 'bg-gradient-to-r from-white via-violet-50/30 to-white'
                    }`} />
                    {/* Floating decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-2 left-[15%] text-2xl opacity-10"
                            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            ⭐
                        </motion.div>
                        <motion.div
                            className="absolute top-3 right-[25%] text-xl opacity-10"
                            animate={{ y: [0, -6, 0], rotate: [0, -15, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            🛡️
                        </motion.div>
                        <motion.div
                            className="absolute bottom-1 left-[40%] text-lg opacity-8"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            🔐
                        </motion.div>
                    </div>

                    {/* Left side - Greeting */}
                    <div className="flex items-center gap-4 relative z-10">
                        <motion.button
                            className="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Menu size={20} />
                        </motion.button>

                        <motion.div
                            className="hidden sm:flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.span
                                className="text-2xl"
                                animate={{ rotate: [0, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                👋
                            </motion.span>
                            <div>
                                <h2 className={`text-lg font-black ${isDark ? 'text-[#F4F6FF]' : 'text-gray-900'}`}>
                                    Hey, {displayName}!
                                </h2>
                                <p className={`text-xs font-bold ${isDark ? 'text-[#8AB4F8]/50' : 'text-gray-400'}`}>
                                    Ready for today's mission? 🚀
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side - Stats + Avatar */}
                    <div className="flex items-center gap-3 relative z-10">
                        {/* Streak Pill */}
                        {streak > 0 && (
                            <motion.div
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Flame size={14} className="text-orange-500" />
                                <span className="text-xs font-black text-orange-500">{streak}</span>
                            </motion.div>
                        )}

                        {/* XP Pill */}
                        {progress && (
                            <motion.div
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Zap size={14} className="text-emerald-500" />
                                <span className="text-xs font-black text-emerald-500">{progress.xp} XP</span>
                            </motion.div>
                        )}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Avatar with animated ring */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
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
                                <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#0A1128]' : 'bg-white'}`} style={{ margin: '2px' }} />
                            </motion.div>

                            {/* Avatar */}
                            {customAvatar ? (
                                <img
                                    src={customAvatar}
                                    alt={displayName}
                                    className="relative w-11 h-11 rounded-full object-cover border-2 border-transparent shadow-lg"
                                />
                            ) : (
                                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shadow-lg bg-gradient-to-br ${tierStyle.gradient} text-white`}>
                                    {initials}
                                </div>
                            )}

                            {/* Level Badge */}
                            <motion.div
                                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-md border-2 ${isDark ? 'border-[#0A1128]' : 'border-white'} ${tierStyle.bg}`}
                                animate={isHighTier ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {level}
                            </motion.div>
                        </motion.div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
                    {/* Subtle background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-3xl -z-10 pointer-events-none" />

                    <Outlet />
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden absolute inset-0 z-50 flex overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.aside
                            className={`relative w-[280px] max-w-[85%] ${sidebarBg} h-full flex flex-col shadow-2xl sidebar-cyber ${isDark ? '' : 'sidebar-cyber-light'}`}
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className="absolute top-4 right-4 z-20">
                                <motion.button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-md hover:bg-accent/50 text-muted-foreground transition-all"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                            <SidebarContent mobile />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nova AI Chat - Floating on all dashboard pages except AI Agent */}
            {!isAIAgentPage && <NovaChat />}
        </div>
    );
}
