import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Camera,
    Check,
    Lock,
    Clock,
    Mail,
    Smartphone,
    Sparkles,
    Save,
    Image as ImageIcon,
    X,
    AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuthStore } from '../store/useAuthStore';
import { hasVaultSetup, setupMasterPassword, verifyMasterPassword } from '../services/vaultService';
import PasswordInput from '../components/ui/PasswordInput';
import { updateProfile } from 'firebase/auth';
import { saveAvatar, loadAvatar, type SavedAvatar } from '../lib/avatar';

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

const avatarOptions = [
    { emoji: '🦊', label: 'Fox', color: 'from-orange-400 to-amber-500' },
    { emoji: '🐱', label: 'Cat', color: 'from-yellow-400 to-orange-500' },
    { emoji: '🐶', label: 'Dog', color: 'from-amber-400 to-yellow-600' },
    { emoji: '🦁', label: 'Lion', color: 'from-amber-500 to-orange-600' },
    { emoji: '🐼', label: 'Panda', color: 'from-gray-400 to-gray-600' },
    { emoji: '🐸', label: 'Frog', color: 'from-green-400 to-emerald-600' },
    { emoji: '🦄', label: 'Unicorn', color: 'from-pink-400 to-purple-500' },
    { emoji: '🐧', label: 'Penguin', color: 'from-blue-400 to-indigo-500' },
    { emoji: '🦅', label: 'Eagle', color: 'from-amber-600 to-red-700' },
    { emoji: '🐺', label: 'Wolf', color: 'from-gray-500 to-slate-700' },
    { emoji: '🦋', label: 'Butterfly', color: 'from-cyan-400 to-blue-500' },
    { emoji: '🐙', label: 'Octopus', color: 'from-purple-400 to-pink-600' },
];

type TabType = 'account' | 'security' | 'notifications';

export default function Settings() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [activeTab, setActiveTab] = useState<TabType>('account');
    const [autoLockEnabled, setAutoLockEnabled] = useState(true);
    const [autoLockTime, setAutoLockTime] = useState('15');
    const [vaultSetup, setVaultSetup] = useState(false);
    const [currentMaster, setCurrentMaster] = useState('');
    const [newMaster, setNewMaster] = useState('');
    const [confirmMaster, setConfirmMaster] = useState('');
    const [isSavingMaster, setIsSavingMaster] = useState(false);
    const [masterMsg, setMasterMsg] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Avatar picker
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [customAvatar, setCustomAvatar] = useState<SavedAvatar | null>(null);

    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);

    const displayUser = user?.displayName || user?.email?.split('@')[0] || 'User';
    const initials = displayUser.charAt(0).toUpperCase();

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || user.email?.split('@')[0] || '');
            hasVaultSetup(user.uid).then(setVaultSetup);
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved);
        }
    }, [user]);

    useEffect(() => {
        const handler = () => {
            const saved = loadAvatar();
            if (saved) setCustomAvatar(saved);
        };
        window.addEventListener('chea-avatar-changed', handler);
        return () => window.removeEventListener('chea-avatar-changed', handler);
    }, []);

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const handleSetupMaster = async () => {
        if (!user) return;

        if (vaultSetup) {
            if (!currentMaster) {
                setMasterMsg('Please enter your current master password');
                return;
            }
            try {
                const isValid = await verifyMasterPassword(user.uid, currentMaster);
                if (!isValid) {
                    setMasterMsg('Current master password is incorrect');
                    return;
                }
            } catch (error) {
                setMasterMsg('Error verifying current password');
                return;
            }
        }

        if (newMaster.length < 4) {
            setMasterMsg('Password must be at least 4 characters');
            return;
        }
        if (newMaster !== confirmMaster) {
            setMasterMsg('Passwords do not match');
            return;
        }

        setIsSavingMaster(true);
        setMasterMsg('');
        const success = await setupMasterPassword(user.uid, newMaster);
        if (success) {
            setVaultSetup(true);
            setMasterMsg(vaultSetup ? 'Master password updated successfully!' : 'Master password set successfully!');
            setNewMaster('');
            setConfirmMaster('');
            setCurrentMaster('');
        } else {
            setMasterMsg(vaultSetup ? 'Failed to update master password.' : 'Failed to set master password.');
        }
        setIsSavingMaster(false);
    };

    const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith('image/')) {
            setMasterMsg('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMasterMsg('Image is too large. Please choose one under 2MB');
            return;
        }

        setIsSavingAvatar(true);
        setMasterMsg('');

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            saveAvatar('photo', base64String);
            setCustomAvatar({ type: 'photo', data: base64String });
            setMasterMsg('Avatar updated! 🎉');
            setShowAvatarPicker(false);
            setIsSavingAvatar(false);
        };
        reader.onerror = () => {
            setMasterMsg('Failed to process image');
            setIsSavingAvatar(false);
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    };

    const handleEmojiAvatarSelect = async (emoji: string) => {
        if (!user) return;

        setIsSavingAvatar(true);
        setMasterMsg('');

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f9fa';
            ctx.fillRect(0, 0, 200, 200);

            ctx.font = '120px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, 100, 105);

            const dataUrl = canvas.toDataURL('image/png');
            saveAvatar('emoji', dataUrl);
            setCustomAvatar({ type: 'emoji', data: dataUrl });
            setMasterMsg('Avatar updated! 🎉');
            setShowAvatarPicker(false);
        } catch (err: any) {
            console.error('Failed to update emoji avatar:', err);
            setMasterMsg('Failed to update avatar');
        } finally {
            setIsSavingAvatar(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!user) return;

        try {
            if (displayName !== (user.displayName || '')) {
                await updateProfile(user, { displayName });
                setUser({ ...user, displayName });
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save:', err);
            setMasterMsg('Failed to save changes');
        }
    };

    const tabs = [
        { id: 'account' as TabType, label: 'My Profile', emoji: '👤' },
        { id: 'security' as TabType, label: 'Security', emoji: '🔒' },
        { id: 'notifications' as TabType, label: 'Alerts', emoji: '🔔' },
    ];

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

            <div className="relative z-10 space-y-8 max-w-5xl mx-auto">
                {/* Hero Header */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                        <SettingsIcon size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        Settings
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Customize your CHEA experience and keep your account safe! 🛠️
                                </p>
                            </div>

                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                <Sparkles size={20} className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">Your Space</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Make it yours!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation - Emoji Only */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-3 shadow-lg`}>
                        <div className="flex gap-2 overflow-x-auto">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                                            isActive
                                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white shadow-lg'
                                                : `${mutedText} hover:bg-white/5`
                                        }`}
                                        whileHover={{ scale: isActive ? 1 : 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="text-xl">{tab.emoji}</span>
                                        {tab.label}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Hidden file input - always in DOM */}
                <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                />

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <motion.div
                            key="account"
                            variants={itemVariants}
                            className="space-y-8"
                        >
                            {/* Profile Card */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 className={`text-2xl font-black ${headingColor}`}>My Profile</h2>
                                            <p className={`text-sm font-medium ${mutedText}`}>This is how others see you</p>
                                        </div>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                        <div className="relative group">
                                            {customAvatar ? (
                                                <img
                                                    src={customAvatar.data}
                                                    alt={displayUser}
                                                    className="h-24 w-24 rounded-3xl object-cover border-4 border-violet-500/30 shadow-xl shadow-violet-500/20"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-3xl font-black border-4 border-violet-500/30 shadow-xl shadow-violet-500/20">
                                                    {initials}
                                                </div>
                                            )}
                                            <motion.button
                                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                                className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Camera size={16} />
                                            </motion.button>
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className={`text-xl font-black ${headingColor}`}>{displayUser}</h3>
                                            <p className={`text-sm font-medium ${mutedText}`}>{user?.email}</p>
                                            <p className={`text-xs font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                ✨ Account Active
                                            </p>
                                        </div>
                                    </div>

                                    {/* Avatar Picker */}
                                    <AnimatePresence>
                                        {showAvatarPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={`rounded-2xl border-2 ${borderColor} p-6 mb-6 overflow-hidden`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className={`text-lg font-black ${headingColor}`}>Pick Your Avatar</h4>
                                                    <button
                                                        onClick={() => setShowAvatarPicker(false)}
                                                        className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${mutedText}`}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                {/* Upload Photo Option */}
                                                <motion.label
                                                    htmlFor="avatar-file-input"
                                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all mb-4 ${
                                                        isSavingAvatar
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : isDark
                                                            ? 'border-white/10 hover:border-primary/30 hover:bg-white/5'
                                                            : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'
                                                    }`}
                                                    whileHover={isSavingAvatar ? undefined : { scale: 1.02 }}
                                                    whileTap={isSavingAvatar ? undefined : { scale: 0.98 }}
                                                >
                                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`font-black ${headingColor}`}>Upload Your Photo</p>
                                                        <p className={`text-xs font-medium ${mutedText}`}>PNG, JPG up to 2MB</p>
                                                    </div>
                                                </motion.label>

                                                {/* Emoji Avatars */}
                                                <p className={`text-sm font-bold ${mutedText} mb-3`}>Or pick a fun emoji:</p>
                                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                                    {avatarOptions.map((avatar) => (
                                                        <motion.button
                                                            key={avatar.emoji}
                                                            onClick={() => handleEmojiAvatarSelect(avatar.emoji)}
                                                            disabled={isSavingAvatar}
                                                            className={`flex flex-col items-center gap-1 p-3 rounded-2xl bg-gradient-to-br ${avatar.color} text-white shadow-lg disabled:opacity-50`}
                                                            whileHover={{ scale: 1.1, y: -4 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <span className="text-2xl">{avatar.emoji}</span>
                                                            <span className="text-[10px] font-bold">{avatar.label}</span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Name & Email Fields */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className={`text-sm font-black ${headingColor}`}>Your Name</label>
                                            <div className="relative">
                                                <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`} />
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    placeholder="Enter your name"
                                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-transparent ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} text-base font-bold focus:outline-none transition-all ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`text-sm font-black ${headingColor}`}>Email Address</label>
                                            <div className="relative">
                                                <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`} />
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    readOnly
                                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} text-base font-bold ${mutedText} cursor-not-allowed`}
                                                />
                                            </div>
                                            <p className={`text-xs font-medium ${mutedText}`}>
                                                Your email can't be changed. Contact support if needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            variants={itemVariants}
                            className="space-y-8"
                        >
                            {/* Master Password Card */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>Vault Password</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>
                                            {vaultSetup
                                                ? "Your vault is locked and safe! 🔒"
                                                : "Set up your vault password to keep secrets safe! 🔐"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {vaultSetup && (
                                        <div className="space-y-2">
                                            <PasswordInput
                                                label="Current Vault Password"
                                                placeholder="Enter your current password"
                                                value={currentMaster}
                                                onChange={(e: any) => setCurrentMaster(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label="New Vault Password"
                                            placeholder="Pick a strong new password"
                                            value={newMaster}
                                            onChange={(e: any) => setNewMaster(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label="Confirm New Password"
                                            placeholder="Type it again to confirm"
                                            value={confirmMaster}
                                            onChange={(e: any) => setConfirmMaster(e.target.value)}
                                        />
                                    </div>

                                    {masterMsg && (
                                        <motion.div
                                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-sm font-bold ${
                                                masterMsg.includes('success') || masterMsg.includes('🎉')
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            {masterMsg.includes('success') || masterMsg.includes('🎉') ? <Check size={18} /> : <AlertCircle size={18} />}
                                            <span>{masterMsg}</span>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        onClick={handleSetupMaster}
                                        disabled={isSavingMaster || !newMaster || !confirmMaster || (vaultSetup && !currentMaster)}
                                        className={`w-full flex justify-center items-center gap-3 px-6 py-4 font-display text-base font-black rounded-2xl transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
                                            isDark
                                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:scale-[1.02]'
                                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-[1.02]'
                                        }`}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSavingMaster ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={20} />
                                                {vaultSetup ? 'Update Vault Password' : 'Set Up Vault Password'}
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Auto-Lock Card */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>Auto-Lock Timer</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>Lock your vault when you step away</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className={`text-base font-black ${headingColor}`}>Auto-Lock Vault</h4>
                                            <p className={`text-sm font-medium ${mutedText}`}>Automatically lock when you're idle</p>
                                        </div>
                                        <motion.button
                                            onClick={() => setAutoLockEnabled(!autoLockEnabled)}
                                            className={`relative w-16 h-8 rounded-full transition-colors ${
                                                autoLockEnabled ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                animate={{ left: autoLockEnabled ? '36px' : '4px' }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            />
                                        </motion.button>
                                    </div>

                                    <AnimatePresence>
                                        {autoLockEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-3"
                                            >
                                                <label className={`text-sm font-bold ${mutedText}`}>Lock after how long?</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {[
                                                        { value: '5', label: '5 min', emoji: '⚡' },
                                                        { value: '15', label: '15 min', emoji: '🕐' },
                                                        { value: '30', label: '30 min', emoji: '🕑' },
                                                        { value: '60', label: '1 hour', emoji: '🕒' },
                                                    ].map((option) => (
                                                        <motion.button
                                                            key={option.value}
                                                            onClick={() => setAutoLockTime(option.value)}
                                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                                                autoLockTime === option.value
                                                                    ? 'border-blue-500/50 bg-blue-500/10'
                                                                    : isDark
                                                                    ? 'border-white/10 hover:border-white/20'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <span className="text-xl">{option.emoji}</span>
                                                            <span className={`text-sm font-black ${headingColor}`}>{option.label}</span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            variants={itemVariants}
                            className="space-y-8"
                        >
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>Notifications</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>Choose how you want to hear from us</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Email Alerts */}
                                    <div className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`text-base font-black ${headingColor}`}>Email Alerts</h4>
                                                <p className={`text-sm font-medium ${mutedText}`}>Get updates about your account</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => setEmailAlerts(!emailAlerts)}
                                            className={`relative w-16 h-8 rounded-full transition-colors ${
                                                emailAlerts ? 'bg-gradient-to-r from-amber-400 to-orange-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                animate={{ left: emailAlerts ? '36px' : '4px' }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            />
                                        </motion.button>
                                    </div>

                                    {/* Push Notifications */}
                                    <div className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`text-base font-black ${headingColor}`}>Push Notifications</h4>
                                                <p className={`text-sm font-medium ${mutedText}`}>Get alerts on your screen</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => setPushNotifications(!pushNotifications)}
                                            className={`relative w-16 h-8 rounded-full transition-colors ${
                                                pushNotifications ? 'bg-gradient-to-r from-amber-400 to-orange-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                animate={{ left: pushNotifications ? '36px' : '4px' }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button */}
                <motion.div variants={itemVariants} className="flex justify-end">
                    <motion.button
                        onClick={handleSaveChanges}
                        className={`flex items-center gap-3 px-8 py-4 font-display text-base font-black rounded-2xl transition-all shadow-xl ${
                            saveSuccess
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                                : isDark
                                ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-105'
                                : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105'
                        }`}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {saveSuccess ? (
                            <>
                                <Check size={20} />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}
