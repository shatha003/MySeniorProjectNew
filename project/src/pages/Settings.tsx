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
    Music,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuthStore } from '../store/useAuthStore';
import { hasVaultSetup, setupMasterPassword, verifyMasterPassword } from '../services/vaultService';
import PasswordInput from '../components/ui/PasswordInput';
import { updateProfile } from 'firebase/auth';
import { saveAvatar, loadAvatar, type SavedAvatar } from '../lib/avatar';
import { useTranslation } from 'react-i18next';

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

const avatarOptions = Array.from({ length: 17 }, (_, i) => ({
    src: `/avatars/avatar${i + 1}.png`,
    label: `Avatar ${i + 1}`,
}));

type TabType = 'account' | 'security' | 'notifications';

export default function Settings() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation(['settings', 'common']);

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
    const [musicPlayerEnabled, setMusicPlayerEnabled] = useState(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('chea-music-player-enabled');
        return saved ? saved === 'true' : true;
    });
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
                setMasterMsg(t('settings:enterCurrentMaster'));
                return;
            }
            try {
                const isValid = await verifyMasterPassword(user.uid, currentMaster);
                if (!isValid) {
                    setMasterMsg(t('settings:currentMasterIncorrect'));
                    return;
                }
            } catch (error) {
                setMasterMsg(t('settings:errorVerifying'));
                return;
            }
        }

        if (newMaster.length < 4) {
            setMasterMsg(t('settings:mustBe4Chars'));
            return;
        }
        if (newMaster !== confirmMaster) {
            setMasterMsg(t('settings:passwordsNoMatch'));
            return;
        }

        setIsSavingMaster(true);
        setMasterMsg('');
        const success = await setupMasterPassword(user.uid, newMaster);
        if (success) {
            setVaultSetup(true);
            setMasterMsg(vaultSetup ? t('settings:masterUpdated') : t('settings:masterSet'));
            setNewMaster('');
            setConfirmMaster('');
            setCurrentMaster('');
        } else {
            setMasterMsg(vaultSetup ? t('settings:failedUpdate') : t('settings:failedSet'));
        }
        setIsSavingMaster(false);
    };

    const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith('image/')) {
            setMasterMsg(t('settings:selectImage'));
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMasterMsg(t('settings:imageTooLarge'));
            return;
        }

        setIsSavingAvatar(true);
        setMasterMsg('');

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            saveAvatar('photo', base64String);
            setCustomAvatar({ type: 'photo', data: base64String });
                setMasterMsg(t('settings:avatarUpdated'));
        };
            reader.onerror = () => {
                setMasterMsg(t('settings:failedProcessImage'));
            setIsSavingAvatar(false);
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    };

    const handlePresetAvatarSelect = async (avatarSrc: string) => {
        if (!user) return;

        setIsSavingAvatar(true);
        setMasterMsg('');

        try {
            const response = await fetch(avatarSrc);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                saveAvatar('photo', base64String);
                setCustomAvatar({ type: 'photo', data: base64String });
            setMasterMsg(t('settings:avatarUpdated'));
                setShowAvatarPicker(false);
                setIsSavingAvatar(false);
            };
            reader.onerror = () => {
                setMasterMsg('Failed to process avatar');
                setIsSavingAvatar(false);
            };
            reader.readAsDataURL(blob);
        } catch (err: any) {
            console.error('Failed to update avatar:', err);
            setMasterMsg(t('settings:failedUpdateAvatar'));
            setIsSavingAvatar(false);
        }
    };

    const handleMusicPlayerToggle = (enabled: boolean) => {
        setMusicPlayerEnabled(enabled);
        localStorage.setItem('chea-music-player-enabled', String(enabled));
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
            setMasterMsg(t('settings:failedSave'));
        }
    };

    const tabs = [
        { id: 'account' as TabType, label: t('settings:tabProfile'), emoji: '👤' },
        { id: 'security' as TabType, label: t('settings:tabSecurity'), emoji: '🔒' },
        { id: 'notifications' as TabType, label: t('settings:tabPreferences'), emoji: '🔔' },
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
                                        {t('settings:title')}
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    {t('settings:subtitle')}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                <Sparkles size={20} className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">{t('settings:yourSpace')}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{t('settings:makeItYours')}</span>
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
                                            <h2 className={`text-2xl font-black ${headingColor}`}>{t('settings:myProfile')}</h2>
                                            <p className={`text-sm font-medium ${mutedText}`}>{t('settings:howOthersSeeYou')}</p>
                                        </div>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pt-8">
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
                                                {t('settings:accountActive')}
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
                                                    <h4 className={`text-lg font-black ${headingColor}`}>{t('settings:pickAvatar')}</h4>
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
                                                        <p className={`font-black ${headingColor}`}>{t('settings:uploadPhoto')}</p>
                                                        <p className={`text-xs font-medium ${mutedText}`}>{t('settings:pngJpg2mb')}</p>
                                                    </div>
                                                </motion.label>

                                                {/* Emoji Avatars */}
                                                <p className={`text-sm font-bold ${mutedText} mb-3`}>{t('settings:orPresetAvatar')}</p>
                                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                                    {avatarOptions.map((avatar) => (
                                                        <motion.button
                                                            key={avatar.src}
                                                            onClick={() => handlePresetAvatarSelect(avatar.src)}
                                                            disabled={isSavingAvatar}
                                                            className={`p-2 rounded-2xl border-2 transition-all overflow-hidden ${
                                                                isDark
                                                                    ? 'border-white/10 hover:border-primary/30 bg-white/5'
                                                                    : 'border-gray-200 hover:border-primary/30 bg-gray-50'
                                                            } disabled:opacity-50`}
                                                            whileHover={{ scale: 1.1, y: -4 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <img
                                                                src={avatar.src}
                                                                alt={avatar.label}
                                                                className="w-full aspect-square rounded-xl object-cover"
                                                            />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Name & Email Fields */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className={`text-sm font-black ${headingColor}`}>{t('settings:yourName')}</label>
                                            <div className="relative">
                                                <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`} />
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    placeholder={t('settings:enterName')}
                                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-transparent ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} text-base font-bold focus:outline-none transition-all ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`text-sm font-black ${headingColor}`}>{t('settings:emailAddress')}</label>
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
                                                {t('settings:emailCantChange')}
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
                                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('settings:vaultPassword')}</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>
                                            {vaultSetup
                                                ? t('settings:vaultLockedSafe')
                                                : t('settings:setUpVault')}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {vaultSetup && (
                                        <div className="space-y-2">
                                            <PasswordInput
                                                label={t('settings:currentVaultPassword')}
                                                placeholder={t('settings:enterCurrentPassword')}
                                                value={currentMaster}
                                                onChange={(e: any) => setCurrentMaster(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label={t('settings:newVaultPassword')}
                                            placeholder={t('settings:pickStrongNew')}
                                            value={newMaster}
                                            onChange={(e: any) => setNewMaster(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label={t('settings:confirmNewPassword')}
                                            placeholder={t('settings:typeAgainConfirm')}
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
                                                {vaultSetup ? t('settings:updateVaultPassword') : t('settings:setUpVaultPassword')}
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
                                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('settings:autoLockTimer')}</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>{t('settings:lockVaultAway')}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className={`text-base font-black ${headingColor}`}>{t('settings:autoLockVault')}</h4>
                                            <p className={`text-sm font-medium ${mutedText}`}>{t('settings:autoLockDesc')}</p>
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
                                                <label className={`text-sm font-bold ${mutedText}`}>{t('settings:lockAfterHowLong')}</label>
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

                    {/* NOTIFICATIONS/PREFERENCES TAB */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            variants={itemVariants}
                            className="space-y-8"
                        >
                            {/* Music Player Section */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-400 to-purple-500" />

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
                                        <Music size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('settings:musicPlayer')}</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>{t('settings:musicPlayerDesc')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Music Player Toggle */}
                                    <div className={`flex items-center justify-between p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                                                <Music size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`text-base font-black ${headingColor}`}>{t('settings:showMusicPlayer')}</h4>
                                                <p className={`text-sm font-medium ${mutedText}`}>{t('settings:showMusicPlayerDesc')}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleMusicPlayerToggle(!musicPlayerEnabled)}
                                            className={`relative w-16 h-8 rounded-full transition-colors ${
                                                musicPlayerEnabled ? 'bg-gradient-to-r from-violet-400 to-purple-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
                                            }`}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                animate={{ left: musicPlayerEnabled ? '36px' : '4px' }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications Section */}
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 shadow-lg relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('settings:notifications')}</h2>
                                        <p className={`text-sm font-medium ${mutedText}`}>{t('settings:notificationsDesc')}</p>
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
                                                <h4 className={`text-base font-black ${headingColor}`}>{t('settings:emailAlerts')}</h4>
                                                <p className={`text-sm font-medium ${mutedText}`}>{t('settings:emailAlertsDesc')}</p>
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
                                                <h4 className={`text-base font-black ${headingColor}`}>{t('settings:pushNotifications')}</h4>
                                                <p className={`text-sm font-medium ${mutedText}`}>{t('settings:pushNotificationsDesc')}</p>
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
                                {t('settings:saved')}
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {t('settings:saveChanges')}
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}
