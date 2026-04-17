import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    KeyRound,
    Lock,
    Plus,
    Search,
    Trash2,
    Copy,
    Check,
    ShieldAlert,
    Globe,
    ArrowLeft,
    Star,
    Eye,
    EyeOff,
    CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { addCredential, getUserCredentials, deleteCredential, CredentialItem } from '../services/credentialService';
import { invoke } from '@tauri-apps/api/core';
import { hasVaultSetup, verifyMasterPassword } from '../services/vaultService';
import { useNavigate } from 'react-router-dom';
import { getServiceById, ServiceInfo, POPULAR_SERVICES } from '../data/serviceIcons';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';

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

interface DecryptedCard {
    cardNumber: string;
    cardholderName: string;
    expiry: string;
    cvv: string;
}

const CARD_BRANDS = [
    { name: 'Visa', pattern: /^4/, gradient: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', accent: '#4fc3f7', logo: 'VISA', emoji: '💙' },
    { name: 'Mastercard', pattern: /^5[1-5]/, gradient: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)', accent: '#ff6f00', logo: 'MC', emoji: '🧡' },
    { name: 'Amex', pattern: /^3[47]/, gradient: 'linear-gradient(135deg, #006fcf 0%, #00aeef 100%)', accent: '#00d4aa', logo: 'AMEX', emoji: '💚' },
    { name: 'Discover', pattern: /^6(?:011|5)/, gradient: 'linear-gradient(135deg, #ff6000 0%, #ff8c00 100%)', accent: '#ffab40', logo: 'DISC', emoji: '🧡' },
];

function getCardBrand(number: string) {
    const clean = number.replace(/\D/g, '');
    for (const brand of CARD_BRANDS) {
        if (brand.pattern.test(clean)) return brand;
    }
    return { name: 'Card', pattern: /^/, gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', accent: '#c084fc', logo: 'CARD', emoji: '💜' };
}

function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiryDate(value: string) {
    let clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
        const mm = parseInt(clean.substring(0, 2));
        if (mm > 12) clean = '12' + clean.substring(2);
        if (mm === 0 && clean.length >= 2) clean = '01' + clean.substring(2);
        return clean.substring(0, 2) + '/' + clean.substring(2);
    }
    return clean;
}

export default function CredentialVault() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const { t } = useTranslation(['vault', 'common']);

    const { user, masterPassword, setMasterPassword } = useAuthStore();
    const [search, setSearch] = useState('');
    const [credentials, setCredentials] = useState<CredentialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const trackActivity = useTrackActivity();
    const navigate = useNavigate();

    const [unlockPassword, setUnlockPassword] = useState('');
    const [unlockError, setUnlockError] = useState('');
    const [vaultSetup, setVaultSetup] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<'type' | 'service' | 'form' | 'card-form'>('type');
    const [serviceSearch, setServiceSearch] = useState('');
    const [newCred, setNewCred] = useState({ name: '', username: '', domain: '', password: '' });
    const [newCard, setNewCard] = useState({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    const [isSaving, setIsSaving] = useState(false);

    const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
    const [decryptedCards, setDecryptedCards] = useState<Record<string, DecryptedCard>>({});
    const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            hasVaultSetup(user.uid).then(setVaultSetup);
        }
        if (user && masterPassword) {
            loadCredentials();
        }
    }, [user, masterPassword]);

    const loadCredentials = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const items = await getUserCredentials(user.uid);
            setCredentials(items);
        } catch (error) {
            console.error('Failed to load credentials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (unlockPassword.length < 4) {
            setUnlockError(t('vault:passwordTooShort'));
            return;
        }
        setIsVerifying(true);
        try {
            const isValid = await verifyMasterPassword(user.uid, unlockPassword);
            if (isValid) {
                setMasterPassword(unlockPassword);
                setUnlockError('');
                setUnlockPassword('');
            } else {
                setUnlockError(t('vault:wrongPassword'));
            }
        } catch (error: any) {
            if (error.message === 'vault_not_initialized') {
                setVaultSetup(false);
            } else {
                setUnlockError(t('vault:somethingWentWrong'));
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        setModalStep('type');
        setServiceSearch('');
        setNewCred({ name: '', username: '', domain: '', password: '' });
        setNewCard({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalStep('type');
        setServiceSearch('');
        setNewCred({ name: '', username: '', domain: '', password: '' });
        setNewCard({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    };

    const handleSelectService = (service: ServiceInfo) => {
        setNewCred({ name: service.name, username: '', domain: service.domain, password: '' });
        setModalStep('form');
    };

    const handleSaveCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !masterPassword) return;
        try {
            setIsSaving(true);
            const encryptedData = await invoke<string>('encrypt_text', {
                plaintext: newCred.password,
                password: masterPassword,
                algorithm: 'AES-256-GCM'
            });
            await addCredential(user.uid, {
                type: 'login',
                name: newCred.name,
                username: newCred.username,
                domain: newCred.domain,
                encryptedData,
            });
            await trackActivity('create_credential', { name: newCred.name });
            closeModal();
            loadCredentials();
        } catch (error: any) {
            console.error('Failed to save credential:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !masterPassword) return;
        try {
            setIsSaving(true);
            const cardData = JSON.stringify({
                cardNumber: newCard.cardNumber.replace(/\s/g, ''),
                cardholderName: newCard.cardholderName,
                expiry: newCard.expiry,
                cvv: newCard.cvv,
            });
            const encryptedData = await invoke<string>('encrypt_text', {
                plaintext: cardData,
                password: masterPassword,
                algorithm: 'AES-256-GCM'
            });
            const brand = getCardBrand(newCard.cardNumber);
            await addCredential(user.uid, {
                type: 'card',
                name: newCard.name || `${brand.name} Card`,
                username: newCard.cardholderName,
                domain: brand.name,
                encryptedData,
            });
            await trackActivity('create_credential', { name: newCard.name, type: 'card' });
            closeModal();
            loadCredentials();
        } catch (error: any) {
            console.error('Failed to save card:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user || !id) return;
        try {
            await deleteCredential(user.uid, id);
            setCredentials(credentials.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete credential:', error);
        }
    };

    const handleCopy = async (item: CredentialItem, type: 'username' | 'password') => {
        if (!user || !masterPassword) return;
        if (type === 'username') {
            navigator.clipboard.writeText(item.username);
            setCopiedId(`${item.id}-user`);
            setTimeout(() => setCopiedId(null), 2000);
            return;
        }
        try {
            let plainText = decryptedPasswords[item.id!];
            if (!plainText) {
                plainText = await invoke<string>('decrypt_text', {
                    encoded: item.encryptedData,
                    password: masterPassword
                });
                setDecryptedPasswords(prev => ({ ...prev, [item.id!]: plainText }));
            }
            await navigator.clipboard.writeText(plainText);
            setCopiedId(`${item.id}-pass`);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Decryption failed:', error);
        }
    };

    const toggleReveal = async (item: CredentialItem) => {
        if (!user || !masterPassword || !item.id) return;
        const id = item.id;
        if (revealedPasswords[id]) {
            setRevealedPasswords(prev => ({ ...prev, [id]: false }));
            return;
        }
        try {
            let plainText = decryptedPasswords[id];
            if (!plainText) {
                plainText = await invoke<string>('decrypt_text', {
                    encoded: item.encryptedData,
                    password: masterPassword
                });
                setDecryptedPasswords(prev => ({ ...prev, [id]: plainText }));
            }
            setRevealedPasswords(prev => ({ ...prev, [id]: true }));
        } catch (error) {
            console.error('Decryption failed:', error);
        }
    };

    const toggleRevealCard = async (item: CredentialItem) => {
        if (!user || !masterPassword || !item.id) return;
        const id = item.id;
        if (revealedCards[id]) {
            setRevealedCards(prev => ({ ...prev, [id]: false }));
            return;
        }
        try {
            let plainText = decryptedCards[id];
            if (!plainText) {
                const decrypted = await invoke<string>('decrypt_text', {
                    encoded: item.encryptedData,
                    password: masterPassword
                });
                plainText = JSON.parse(decrypted);
                setDecryptedCards(prev => ({ ...prev, [id]: plainText }));
            }
            setRevealedCards(prev => ({ ...prev, [id]: true }));
        } catch (error) {
            console.error('Card decryption failed:', error);
        }
    };

    const handleCopyCardField = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(fieldId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const logins = credentials.filter(c => c.type !== 'card');
    const cards = credentials.filter(c => c.type === 'card');

    const filteredLogins = logins.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase())
    );

    const filteredCards = cards.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase())
    );

    const filteredServices = POPULAR_SERVICES.filter(s =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.domain.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    if (!masterPassword) {
        return (
            <motion.div
                className="relative min-h-full pb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                        style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
                        style={{ background: isDark ? 'radial-gradient(circle, rgba(138,180,248,0.04), transparent 70%)' : 'radial-gradient(circle, rgba(255,10,84,0.03), transparent 70%)' }} />
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
                    <motion.div variants={itemVariants} className="w-full max-w-md">
                        {!vaultSetup ? (
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden`}>
                                <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <motion.div
                                        className="w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20"
                                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        <ShieldAlert className="text-white" size={52} />
                                    </motion.div>
                                    <div className="space-y-3 mt-8">
                                        <h2 className={`text-3xl font-black ${headingColor}`}>{t('vault:almostThere')}</h2>
                                        <p className={`text-lg font-medium ${mutedText}`}>
                                            {t('vault:setUpMaster')}
                                        </p>
                                    </div>
                                    <Button onClick={() => navigate('/dashboard/settings')} className="w-full py-5 rounded-2xl font-display text-lg font-black shadow-xl mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-105 transition-transform">
                                        {t('vault:goToSettings')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden`}>
                                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                                <div className="relative z-10">
                                    <motion.div
                                        className="w-28 h-28 bg-gradient-to-br from-neon-crimson to-neon-violet rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-neon-crimson/20 relative"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Lock className="text-white" size={52} />
                                        <div className="absolute inset-0 bg-white/10 rounded-3xl animate-pulse" />
                                    </motion.div>

                                    <div className="space-y-3 mt-8">
                                        <h2 className={`text-3xl font-black ${headingColor}`}>{t('vault:vaultLocked')}</h2>
                                        <p className={`text-lg font-medium ${mutedText}`}>
                                            {t('vault:unlockSecrets')}
                                        </p>
                                    </div>

                                    <form onSubmit={handleUnlock} className="space-y-5 mt-8">
                                        <PasswordInput
                                            label=""
                                            placeholder={t('vault:masterPasswordPlaceholder')}
                                            value={unlockPassword}
                                            onChange={(e: any) => { setUnlockPassword(e.target.value); setUnlockError(''); }}
                                            required
                                        />
                                        <AnimatePresence>
                                            {unlockError && (
                                                <motion.div
                                                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <span>😟</span>
                                                    <span>{unlockError}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.button
                                            type="submit"
                                            disabled={isVerifying || unlockPassword.length < 4}
                                            className={`w-full flex justify-center items-center gap-3 py-5 rounded-2xl font-display text-lg font-black transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${isDark
                                                    ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white'
                                                    : 'bg-gradient-to-r from-primary to-violet-600 text-white'
                                                }`}
                                            whileHover={!isVerifying && unlockPassword.length >= 4 ? { y: -4, scale: 1.02 } : {}}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isVerifying ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white" />
                                                    {t('vault:checking')}
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={22} />
                                                    {t('vault:unlocking')}
                                                </>
                                            )}
                                        </motion.button>
                                    </form>

                                    <div className={`mt-8 p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <p className={`text-sm font-medium ${mutedText}`}>
                                            <span className="text-lg">💡</span> <strong className={headingColor}>{t('vault:masterTip')}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="relative min-h-full pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-8 max-w-6xl mx-auto">
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30`}>
                                        <KeyRound size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        {t('vault:title')}
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    {t('vault:subtitle')}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                    <Star size={20} fill="currentColor" className="animate-bounce" />
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black leading-none">+10 XP</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{t('common:perSave')}</span>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setMasterPassword(null)} className="rounded-2xl font-black">
                                    <Lock size={16} />
                                    {t('vault:lock')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-6 md:p-8 shadow-lg relative overflow-hidden`}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none ${mutedText}`}>
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={t('vault:searchVault')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`block w-full pl-14 pr-6 py-4 rounded-2xl border-2 bg-transparent text-lg font-bold focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                />
                            </div>
                            <motion.button
                                onClick={openModal}
                                className={`flex justify-center items-center gap-3 px-8 py-4 font-display text-lg font-black rounded-2xl transition-all shadow-xl ${isDark
                                        ? 'bg-gradient-to-r from-neon-crimson to-neon-violet text-white hover:scale-105'
                                        : 'bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105'
                                    }`}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus size={22} />
                                {t('vault:addNew')}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Cards Section */}
                {cards.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-3 bg-primary/5`}>
                                <span className="text-3xl">💳</span>
                                <h2 className={`font-display text-2xl font-black ${headingColor}`}>{t('vault:myCards')}</h2>
                                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isDark ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>{t('vault:saved', { count: cards.length })}</span>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredCards.map((item) => {
                                        const isRevealed = revealedCards[item.id!];
                                        const cardData = decryptedCards[item.id!];
                                        const brand = getCardBrand(cardData?.cardNumber || '');
                                        const isCopied = copiedId === `${item.id}-cardnum`;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                className="relative rounded-3xl overflow-hidden shadow-xl transition-all cursor-default"
                                                whileHover={{ y: -5, scale: 1.02 }}
                                                style={{ background: brand.gradient }}
                                            >
                                                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
                                                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/5 blur-xl" />

                                                <div className="relative z-10 p-6 text-white space-y-5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm">
                                                            <span className="text-sm">{brand.emoji}</span>
                                                            <span className="text-xs font-black uppercase tracking-wider">{item.name || brand.name}</span>
                                                        </div>
                                                        <span className="text-lg font-black italic tracking-wider opacity-70">{brand.logo}</span>
                                                    </div>

                                                    <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#e0be70] via-[#cbad60] to-[#b39548] shadow-sm border border-black/20 relative overflow-hidden">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-6 h-full border-x border-black/15 rounded-[2px]" />
                                                        </div>
                                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/15" />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:cardNumber')}</p>
                                                        <p className="font-mono text-xl sm:text-2xl tracking-[0.15em] drop-shadow-md text-white/95">
                                                            {isRevealed && cardData ?
                                                                cardData.cardNumber.replace(/(.{4})/g, '$1 ').trim() :
                                                                '•••• •••• •••• ••••'
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-1">
                                                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:yourName')}</p>
                                                            <p className="tracking-wider uppercase font-bold text-white/90 text-sm">
                                                                {isRevealed && cardData ? cardData.cardholderName : '••••••••'}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-4 text-right">
                                                            <div className="space-y-1">
                                                                 <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:expires')}</p>
                                                                <p className="tracking-wider font-mono text-sm font-bold text-white/90">
                                                                    {isRevealed && cardData ? cardData.expiry : '••/••'}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:secret')}</p>
                                                                <p className="tracking-wider font-mono text-sm font-bold text-white/90">
                                                                    {isRevealed && cardData ? '•'.repeat(cardData.cvv.length) : '•••'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-3 border-t border-white/15">
                                                        <motion.button
                                                            onClick={() => toggleRevealCard(item)}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${isRevealed ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            {isRevealed ? t('vault:hide') : t('vault:show')}
                                                        </motion.button>

                                                        {isRevealed && cardData && (
                                                            <motion.button
                                                                onClick={() => handleCopyCardField(cardData.cardNumber, `${item.id}-cardnum`)}
                                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${isCopied ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                                                {isCopied ? t('common:copied') : t('common:copy')}
                                                            </motion.button>
                                                        )}

                                                        <motion.button
                                                            onClick={() => handleDelete(item.id!)}
                                                            className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-all"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Logins Section */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            variants={itemVariants}
                            className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-16 text-center shadow-lg`}
                        >
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-primary">
                                    <KeyRound size={32} className="animate-pulse" />
                                </div>
                            </div>
                            <h3 className={`text-2xl font-black ${headingColor}`}>{t('vault:loadingVault')}</h3>
                        </motion.div>
                    ) : filteredLogins.length === 0 && filteredCards.length === 0 ? (
                        <motion.div
                            key="empty"
                            variants={itemVariants}
                            className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}
                        >
                            <div className="p-16 text-center">
                                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Globe className="text-primary/20" size={48} />
                                </div>
                                <h3 className={`text-2xl font-black ${headingColor}`}>
                                    {search ? t('vault:noMatches') : t('vault:emptyVault')}
                                </h3>
                                <p className={`text-lg ${mutedText} mt-2`}>
                                    {search ? t('vault:tryDifferent') : t('vault:tapAddNew')}
                                </p>
                            </div>
                        </motion.div>
                    ) : filteredLogins.length > 0 ? (
                        <motion.div
                            key="list"
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <div className={`p-4 flex items-center gap-3`}>
                                <KeyRound className="text-primary" size={20} />
                                <h2 className={`font-display text-xl font-black ${headingColor}`}>{t('vault:savedLogins')}</h2>
                                <span className={`ml-auto text-sm font-bold ${mutedText}`}>{t('vault:total', { count: filteredLogins.length })}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredLogins.map((item) => {
                                    const serviceId = (item as any).serviceId;
                                    const service = serviceId ? getServiceById(serviceId) : null;
                                    const isRevealed = revealedPasswords[item.id!];
                                    const plainText = decryptedPasswords[item.id!];

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className={`group rounded-3xl border-2 ${borderColor} ${cardBg} p-6 shadow-lg transition-all hover:border-primary/30`}
                                            whileHover={{ y: -5 }}
                                            layout
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                                    {service ? (
                                                        <div className="w-8 h-8">{service.icon}</div>
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                                                            {item.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-black text-lg truncate ${headingColor}`}>{item.name}</h3>
                                                    <p className={`text-sm font-medium truncate ${mutedText}`}>{item.username}</p>
                                                    <p className={`text-xs font-bold mt-1 ${mutedText} opacity-60`}>{item.domain}</p>
                                                </div>
                                            </div>

                                            <div className={`mt-5 flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <Lock size={14} className={mutedText} />
                                                    <span className="font-mono text-sm tracking-wider truncate">
                                                        {isRevealed && plainText ? plainText : '••••••••••••'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 ml-3 shrink-0">
                                                    <button
                                                        onClick={() => toggleReveal(item)}
                                                        className={`p-2 rounded-xl transition-all hover:scale-110 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'} ${mutedText}`}
                                                    >
                                                        {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item, 'password')}
                                                        className={`p-2 rounded-xl transition-all hover:scale-110 ${copiedId === `${item.id}-pass` ? 'text-emerald-500 bg-emerald-500/10' : `${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'} ${mutedText}`}`}
                                                    >
                                                        {copiedId === `${item.id}-pass` ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(item, 'username')}
                                                        className={`p-2 rounded-xl transition-all hover:scale-110 ${copiedId === `${item.id}-user` ? 'text-emerald-500 bg-emerald-500/10' : `${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'} ${mutedText}`}`}
                                                    >
                                                        {copiedId === `${item.id}-user` ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id!)}
                                                        className="p-2 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all hover:scale-110"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Add Credential Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className={`rounded-3xl border-2 ${borderColor} ${cardBg} w-full max-w-lg mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Step 1: Pick Type */}
                            {modalStep === 'type' && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className={`text-2xl font-black ${headingColor}`}>{t('vault:whatToAdd')}</h2>
                                            <p className={`text-sm font-medium ${mutedText} mt-1`}>{t('vault:pickWhatToSave')}</p>
                                        </div>
                                        <button onClick={closeModal} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <motion.button
                                            onClick={() => setModalStep('service')}
                                            className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all ${isDark ? 'border-white/10 hover:border-primary/50 hover:bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'}`}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-crimson to-neon-violet flex items-center justify-center text-white shadow-lg">
                                                <KeyRound size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className={`font-black text-lg ${headingColor}`}>{t('vault:loginAccount')}</h3>
                                                <p className={`text-xs font-medium ${mutedText} mt-1`}>{t('vault:loginAccountDesc')}</p>
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            onClick={() => setModalStep('card-form')}
                                            className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all ${isDark ? 'border-white/10 hover:border-primary/50 hover:bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'}`}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                                <CreditCard size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className={`font-black text-lg ${headingColor}`}>{t('vault:bankCard')}</h3>
                                                <p className={`text-xs font-medium ${mutedText} mt-1`}>{t('vault:bankCardDesc')}</p>
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Pick Service */}
                            {modalStep === 'service' && (
                                <div className="p-6 md:p-8">
                                    {/* Fun Header */}
                                    <div className="text-center mb-6">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <button onClick={() => setModalStep('type')} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                                <ArrowLeft size={18} />
                                            </button>
                                            <span className="text-3xl">🎯</span>
                                        </div>
                                        <h2 className={`text-2xl font-black ${headingColor}`}>{t('vault:whichApp')}</h2>
                                        <p className={`text-sm font-medium ${mutedText} mt-1`}>{t('vault:pickAppOrCustom')}</p>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative mb-6">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
                                        <input
                                            type="text"
                                            placeholder={t('vault:searchApps')}
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 bg-transparent text-sm font-bold focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                            autoFocus
                                        />
                                    </div>

                                    {/* Service Grid */}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1 pb-2">
                                        {/* Custom Option - Stands Out */}
                                        <motion.button
                                            onClick={() => { setNewCred({ name: '', username: '', domain: '', password: '' }); setModalStep('form'); }}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all ${isDark ? 'border-primary/30 bg-primary/5 hover:bg-primary/10' : 'border-primary/40 bg-primary/5 hover:bg-primary/10'}`}
                                            whileHover={{ y: -3, scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-lg">
                                                <Plus size={24} />
                                            </div>
                                            <span className={`text-[10px] font-black ${isDark ? 'text-primary' : 'text-primary'}`}>{t('vault:myOwn')}</span>
                                        </motion.button>

                                        {/* Service Icons */}
                                        {filteredServices.map((service) => (
                                            <motion.button
                                                key={service.id}
                                                onClick={() => handleSelectService(service)}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${isDark ? 'border-white/5 bg-white/5 hover:border-primary/30 hover:bg-primary/5' : 'border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-primary/5'}`}
                                                whileHover={{ y: -3, scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md bg-white p-1">
                                                    <div className="w-full h-full">{service.icon}</div>
                                                </div>
                                                <span className={`text-[10px] font-bold truncate w-full text-center ${headingColor}`}>{service.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* No Results */}
                                    {filteredServices.length === 0 && serviceSearch && (
                                        <div className="text-center py-8">
                                            <span className="text-4xl">🤷</span>
                                            <p className={`text-sm font-bold mt-3 ${mutedText}`}>
                                                {t('vault:noAppsMatch', { search: serviceSearch })}
                                            </p>
                                            <button
                                                onClick={() => { setNewCred({ name: '', username: '', domain: '', password: '' }); setModalStep('form'); }}
                                                className="text-sm font-black text-primary hover:underline mt-2"
                                            >
                                                {t('vault:addAnyway')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Login Form */}
                            {modalStep === 'form' && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setModalStep('service')} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                                <ArrowLeft size={18} />
                                            </button>
                                            <div>
                                                <h2 className={`text-xl font-black ${headingColor}`}>
                                                    {newCred.name || t('vault:customLogin')}
                                                </h2>
                                                <p className={`text-xs font-medium ${mutedText}`}>
                                                    {newCred.domain || t('vault:enterDetails')}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={closeModal} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                            ✕
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveCredential} className="space-y-5">
                                        <Input
                                            label={t('vault:usernameOrEmail')}
                                            placeholder={t('vault:usernamePlaceholder')}
                                            value={newCred.username}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, username: e.target.value })}
                                            required
                                        />
                                        <PasswordInput
                                            label={t('vault:passwordLabel')}
                                            placeholder={t('vault:passwordPlaceholder')}
                                            value={newCred.password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, password: e.target.value })}
                                            required
                                        />
                                        <div className="flex gap-3 pt-4">
                                            <Button type="button" variant="outline" onClick={closeModal} className="flex-1 rounded-2xl font-black">
                                                {t('vault:cancel')}
                                            </Button>
                                            <Button type="submit" disabled={isSaving} className="flex-1 rounded-2xl font-black shadow-xl">
                                                {isSaving ? t('vault:saving') : t('vault:saveIt')}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Step 4: Card Form - Kid Friendly */}
                            {modalStep === 'card-form' && (
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setModalStep('type')} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                                <ArrowLeft size={18} />
                                            </button>
                                            <div>
                                                <h2 className={`text-xl font-black ${headingColor}`}>{t('vault:addYourCard')}</h2>
                                                <p className={`text-xs font-medium ${mutedText}`}>{t('vault:cardInfoEncrypted')}</p>
                                            </div>
                                        </div>
                                        <button onClick={closeModal} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                            ✕
                                        </button>
                                    </div>

                                    {/* Live Card Preview */}
                                    <motion.div
                                        className="mb-6 rounded-2xl overflow-hidden shadow-xl relative"
                                        style={{ background: getCardBrand(newCard.cardNumber).gradient }}
                                        layout
                                    >
                                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                                        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-white/5 blur-xl" />

                                        <div className="relative z-10 p-5 text-white space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#e0be70] via-[#cbad60] to-[#b39548] shadow-sm border border-black/20 relative overflow-hidden">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-4 h-full border-x border-black/15 rounded-[1px]" />
                                                        </div>
                                                    </div>
                                                    <span className="text-sm">{getCardBrand(newCard.cardNumber).emoji}</span>
                                                </div>
                                                <span className="text-lg font-black italic tracking-wider opacity-70">
                                                    {getCardBrand(newCard.cardNumber).logo}
                                                </span>
                                            </div>

                                            <p className="font-mono text-lg sm:text-xl tracking-[0.15em] drop-shadow-md text-white/95">
                                                {newCard.cardNumber ? formatCardNumber(newCard.cardNumber) : '•••• •••• •••• ••••'}
                                            </p>

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:yourName')}</p>
                                                    <p className="tracking-wider uppercase font-bold text-white/90 text-xs">
                                                        {newCard.cardholderName || 'YOUR NAME'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black">{t('vault:expires')}</p>
                                                    <p className="tracking-wider font-mono text-xs font-bold text-white/90">
                                                        {newCard.expiry || 'MM/YY'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <form onSubmit={handleSaveCard} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className={`flex items-center gap-2 text-sm font-black ${headingColor}`}>
                                                <span className="text-lg">🏷️</span>
                                                {t('vault:cardNameLabel')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t('vault:cardNamePlaceholder')}
                                                value={newCard.name}
                                                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-sm font-bold focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`flex items-center gap-2 text-sm font-black ${headingColor}`}>
                                                <span className="text-lg">🔢</span>
                                                {t('vault:cardNumberLabelShort')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                value={formatCardNumber(newCard.cardNumber)}
                                                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                                                maxLength={19}
                                                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-sm font-mono font-bold tracking-wider focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`flex items-center gap-2 text-sm font-black ${headingColor}`}>
                                                <span className="text-lg">👤</span>
                                                {t('vault:yourNameLabel')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t('vault:nameOnCard')}
                                                value={newCard.cardholderName}
                                                onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                                                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-sm font-bold focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className={`flex items-center gap-2 text-sm font-black ${headingColor}`}>
                                                    <span className="text-lg">📅</span>
                                                    {t('vault:expiresLabel')}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={newCard.expiry}
                                                    onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiryDate(e.target.value) })}
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-sm font-mono font-bold tracking-wider focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`flex items-center gap-2 text-sm font-black ${headingColor}`}>
                                                    <span className="text-lg">🔒</span>
                                                    {t('vault:secretCode')}
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    value={newCard.cvv}
                                                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                    maxLength={4}
                                                    className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-sm font-mono font-bold tracking-wider focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <motion.button
                                                type="button"
                                                onClick={closeModal}
                                                className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${isDark ? 'border-2 border-white/10 text-white/70 hover:bg-white/5' : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {t('vault:cancel')}
                                            </motion.button>
                                            <motion.button
                                                type="submit"
                                                disabled={isSaving || !newCard.cardNumber || !newCard.cardholderName || !newCard.expiry || !newCard.cvv}
                                                className="flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl font-display text-sm font-black transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                                whileHover={!isSaving && newCard.cardNumber && newCard.cardholderName && newCard.expiry && newCard.cvv ? { y: -4, scale: 1.02 } : {}}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                                        {t('vault:saving')}
                                                    </>
                                                ) : (
                                                    <>{t('vault:saveCard')}</>
                                                )}
                                            </motion.button>
                                        </div>

                                        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'} text-center`}>
                                            <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {t('vault:cardSafe')}
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
