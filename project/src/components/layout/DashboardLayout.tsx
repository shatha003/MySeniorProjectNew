import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserProgressStore } from '../../store/useUserProgressStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
    LayoutDashboard,
    Link as LinkIcon,
    FileSearch,
    Image as ImageIcon,
    KeyRound,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Settings,
    LogOut,
    Menu,
    X,
    Flame,
    Bot,
    Calculator as CalculatorIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    end?: boolean;
}

const NavItem = ({ to, icon, label, onClick, end }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative overflow-hidden",
                "hover:bg-primary/10 hover:text-primary",
                isActive ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground"
            )}
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                    )}
                    <span className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")}>
                        {icon}
                    </span>
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
};

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const user = useAuthStore((s) => s.user);
    const { progress, fetchProgress } = useUserProgressStore();

    // Derive display values from the Firebase user object
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const photoURL = user?.photoURL || null;
    const initials = displayName.charAt(0).toUpperCase();

    // Fetch user progress on mount
    useEffect(() => {
        if (user?.uid) {
            fetchProgress(user.uid);
        }
    }, [user?.uid, fetchProgress]);

    // Get level info
    const level = progress?.level || 1;
    const streak = progress?.streakDays || 0;

    // Tier-based styling
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
            // Clear remember-me preference so next launch starts fresh
            localStorage.removeItem('chea-remember-me');
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const navItems = [
        { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true },
        { to: "/dashboard/link-scanner", icon: <LinkIcon size={20} />, label: "Link Scanner" },
        { to: "/dashboard/file-scanner", icon: <FileSearch size={20} />, label: "File Scanner" },
        { to: "/dashboard/metadata", icon: <ImageIcon size={20} />, label: "Image Privacy" },
        { to: "/dashboard/password-gen", icon: <KeyRound size={20} />, label: "Password Gen" },
        { to: "/dashboard/password-check", icon: <ShieldCheck size={20} />, label: "Password Checker" },
        { to: "/dashboard/encryption", icon: <Lock size={20} />, label: "Encryption" },
        { to: "/dashboard/vault", icon: <ShieldAlert size={20} />, label: "Credential Vault" },
        { to: "/dashboard/ai-agent", icon: <Bot size={20} />, label: "AI Agent" },
    ];

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
                <div className="p-6 flex items-center gap-3">
                    <img src="/icon.png" alt="HyperTool Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                    <h1 className="text-xl font-bold tracking-tight">HyperTool</h1>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="mb-4 px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Main Menu
                    </div>
                    {navItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                    ))}
                </div>

                <div className="p-4 border-t border-border space-y-1">
                    <NavItem to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive group"
                    >
                        <LogOut size={20} className="transition-transform group-hover:scale-110" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 rounded-md text-foreground/70 hover:bg-accent hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-medium hidden sm:block">Welcome back, {displayName}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {/* User Avatar with Level Badge */}
                        <div className="relative group">
                            {photoURL ? (
                                <img
                                    src={photoURL}
                                    alt={displayName}
                                    referrerPolicy="no-referrer"
                                    className={cn(
                                        "h-10 w-10 rounded-full object-cover border-2 shadow-lg transition-all duration-300",
                                        tierStyle.border,
                                        tierStyle.glow,
                                        isHighTier && "animate-pulse"
                                    )}
                                />
                            ) : (
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center font-semibold shadow-lg transition-all duration-300",
                                    "bg-primary/20",
                                    tierStyle.border,
                                    tierStyle.glow,
                                    isHighTier && "animate-pulse"
                                )}>
                                    <span className={cn("text-sm", tierStyle.text)}>{initials}</span>
                                </div>
                            )}
                            {/* Level Badge */}
                            <div className={cn(
                                "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md",
                                tierStyle.bg,
                                isHighTier && "animate-bounce"
                            )}>
                                {level}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-card border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{level}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm">{level <= 3 ? 'Bronze' : level <= 6 ? 'Silver' : 'Gold'}</span>
                                </div>
                                {streak > 0 && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                        <Flame size={12} className="text-orange-500" />
                                        <span>{streak} day streak</span>
                                    </div>
                                )}
                            </div>
                        </div>
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
            {isMobileMenuOpen && (
                <div className="md:hidden absolute inset-0 z-50 flex overflow-hidden">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="relative w-[280px] max-w-[85%] bg-card border-r border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="p-6 flex items-center justify-between border-b border-border">
                            <div className="flex items-center gap-3">
                                <img src="/icon.png" alt="CHEA Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                                <h1 className="text-xl font-bold">CHEA</h1>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-md hover:bg-accent hover:text-foreground text-muted-foreground transition-all"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            <div className="mb-4 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                Main Menu
                            </div>
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.to}
                                    {...item}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            ))}
                        </div>

                        <div className="p-6 border-t border-border space-y-2">
                            <NavItem
                                to="/dashboard/settings"
                                icon={<Settings size={20} />}
                                label="Settings"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive group"
                            >
                                <LogOut size={20} className="transition-transform group-hover:scale-110" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
