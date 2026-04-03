import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import { ShieldAlert, Plus, Search, Trash2, Copy, ExternalLink, Lock, Check, ArrowLeft, PenLine, Globe, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTrackActivity } from '../hooks/useTrackActivity';
import { addCredential, getUserCredentials, deleteCredential, CredentialItem } from '../services/credentialService';
import { invoke } from '@tauri-apps/api/core';
import { hasVaultSetup, verifyMasterPassword } from '../services/vaultService';
import { useNavigate } from 'react-router-dom';
import { POPULAR_SERVICES, getServiceById, ServiceInfo } from '../data/serviceIcons';

type ModalStep = 'pick-type' | 'pick-service' | 'fill-details' | 'fill-card-details';

export default function CredentialVault() {
    const { user, masterPassword, setMasterPassword } = useAuthStore();
    const [search, setSearch] = useState('');
    const [credentials, setCredentials] = useState<CredentialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const trackActivity = useTrackActivity();

    // Lock Screen State
    const [unlockPassword, setUnlockPassword] = useState('');
    const [unlockError, setUnlockError] = useState('');
    const [vaultSetup, setVaultSetup] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    // Modal State
    const [activeTab, setActiveTab] = useState<'logins' | 'cards'>('logins');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<ModalStep>('pick-service');
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [serviceSearch, setServiceSearch] = useState('');
    const [newCred, setNewCred] = useState({ name: '', username: '', domain: '', password: '' });
    const [newCard, setNewCard] = useState({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Prompt State
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [promptPassword, setPromptPassword] = useState('');
    const [promptError, setPromptError] = useState('');
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

    // Decryption State
    const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
    const [decryptedCards, setDecryptedCards] = useState<Record<string, any>>({});
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
            setUnlockError('Password is too short');
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
                setUnlockError('Incorrect Master Password');
            }
        } catch (error: any) {
            if (error.message === 'vault_not_initialized') {
                setVaultSetup(false);
            } else {
                setUnlockError('Verification failed');
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    const formatExpiryDate = (value: string) => {
        let clean = value.replace(/\D/g, '').slice(0, 4);
        if (clean.length >= 2) {
            const mm = parseInt(clean.substring(0, 2));
            if (mm > 12) clean = '12' + clean.substring(2);
            if (mm === 0) clean = '01' + clean.substring(2);
            return clean.substring(0, 2) + '/' + clean.substring(2);
        }
        return clean;
    };

    const formatCVV = (value: string) => {
        return value.replace(/\D/g, '').slice(0, 4);
    };

    const getCardBrand = (number: string) => {
        const clean = number.replace(/\D/g, '');
        if (clean.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
        if (/^3[47]/.test(clean)) return 'Amex';
        if (/^6(?:011|5)/.test(clean)) return 'Discover';
        return null;
    };

    const getBrandLogo = (brand: string | null) => {
        switch (brand) {
            case 'Visa':
                return <img src="/Logo-visa-icon.png" alt="Visa" className="h-8 w-auto object-contain drop-shadow-md" />;
            case 'Mastercard':
                return <img src="/MasterCard_Logo.png" alt="Mastercard" className="h-12 w-auto object-contain drop-shadow-md" />;
            case 'Amex':
                return <img src="/American_Express_logo.png" alt="Amex" className="h-10 w-auto object-contain drop-shadow-md" />;
            case 'Discover':
                return <img src="/discover-2-logo-png-transparent.png" alt="Discover" className="h-8 w-auto object-contain drop-shadow-md" />;
            default:
                return <CreditCard size={28} className="text-white/80 drop-shadow-md" />;
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        setModalStep('pick-type');
        setSelectedServiceId(null);
        setServiceSearch('');
        setNewCred({ name: '', username: '', domain: '', password: '' });
        setNewCard({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalStep('pick-service');
        setSelectedServiceId(null);
        setServiceSearch('');
        setNewCred({ name: '', username: '', domain: '', password: '' });
        setNewCard({ name: '', cardNumber: '', cardholderName: '', expiry: '', cvv: '' });
    };

    const handleSelectService = (service: ServiceInfo) => {
        setSelectedServiceId(service.id);
        setNewCred(prev => ({
            ...prev,
            name: service.name,
            domain: service.domain,
        }));
        setModalStep('fill-details');
    };

    const handleSelectCustom = () => {
        setSelectedServiceId('custom');
        setNewCred({ name: '', username: '', domain: '', password: '' });
        setModalStep('fill-details');
    };

    const handleSaveCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !masterPassword) return;

        try {
            setIsSaving(true);

            // Encrypt the password using Rust backend
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
                serviceId: selectedServiceId || undefined,
            });

            await trackActivity('create_credential', { name: newCred.name, domain: newCred.domain });

            closeModal();
            loadCredentials(); // Refresh list

        } catch (error: any) {
            console.error('Failed to save credential:', error);
            alert(`Failed to save credential: ${error.message || error}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !masterPassword) return;

        try {
            setIsSaving(true);
            const cardDataJson = JSON.stringify({
                cardNumber: newCard.cardNumber,
                expiry: newCard.expiry,
                cvv: newCard.cvv,
                cardholderName: newCard.cardholderName
            });

            const encryptedData = await invoke<string>('encrypt_text', {
                plaintext: cardDataJson,
                password: masterPassword,
                algorithm: 'AES-256-GCM'
            });

            await addCredential(user.uid, {
                type: 'card',
                name: newCard.name,
                username: newCard.cardholderName,
                domain: 'Credit Card',
                encryptedData,
            });

            await trackActivity('create_credential', { name: newCard.name, domain: 'Credit Card' });

            closeModal();
            loadCredentials();
        } catch (error: any) {
            console.error('Failed to save card:', error);
            alert(`Failed to save card: ${error.message || error}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user || !id) return;
        if (confirm('Are you sure you want to delete this credential?')) {
            try {
                await deleteCredential(user.uid, id);
                setCredentials(credentials.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete credential:', error);
            }
        }
    };

    const handleCopyPassword = async (item: CredentialItem, type: 'username' | 'password') => {
        if (type === 'username') {
            navigator.clipboard.writeText(item.username);
            setCopiedId(`${item.id}-user`);
            setTimeout(() => setCopiedId(null), 2000);
            return;
        }

        if (!masterPassword || !item.id) return;

        const executeCopy = async () => {
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
                alert('Failed to decrypt. Incorrect Master Password?');
            }
        };

        setPendingAction(() => executeCopy);
        setIsPromptOpen(true);
    };

    const filteredCredentials = credentials.filter(c =>
        c.type !== 'card' &&
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.domain.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredCards = credentials.filter(c =>
        c.type === 'card' &&
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.username.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDecryptCard = async (item: CredentialItem) => {
        if (!masterPassword || !item.id) return;
        if (decryptedCards[item.id]) {
            // Toggle off
            setDecryptedCards(prev => {
                const next = { ...prev };
                delete next[item.id!];
                return next;
            });
            return;
        }

        const executeDecrypt = async () => {
            try {
                const plainText = await invoke<string>('decrypt_text', {
                    encoded: item.encryptedData,
                    password: masterPassword
                });
                const data = JSON.parse(plainText);
                setDecryptedCards(prev => ({ ...prev, [item.id!]: data }));
            } catch (error) {
                console.error('Decryption failed:', error);
                alert('Failed to decrypt card details. Incorrect Master Password?');
            }
        };

        setPendingAction(() => executeDecrypt);
        setIsPromptOpen(true);
    };

    const handleCopyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredServices = POPULAR_SERVICES.filter(s =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.domain.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    // Render Service Icon for credential cards
    const renderCredentialIcon = (item: CredentialItem) => {
        const serviceId = (item as any).serviceId;
        const service = serviceId ? getServiceById(serviceId) : null;

        if (service) {
            return (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center select-none overflow-hidden">
                    <div className="w-8 h-8">{service.icon}</div>
                </div>
            );
        }

        // Fallback: letter avatar
        return (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg select-none">
                {item.name.charAt(0).toUpperCase()}
            </div>
        );
    };

    // Lock Screen View
    if (!masterPassword) {
        return (
            <div className="flex items-center justify-center h-full animate-in fade-in duration-500">
                <Card className="w-full max-w-md p-8 flex flex-col items-center text-center space-y-6">
                    {!vaultSetup ? (
                        <>
                            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-2">
                                <ShieldAlert size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Setup Required</h2>
                                <p className="text-muted-foreground mt-2">
                                    You need to setup a Master Password in the Settings page to use the Vault.
                                </p>
                            </div>
                            <Button onClick={() => navigate('/dashboard/settings')} className="w-full">
                                Go to Settings
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Vault Locked</h2>
                                <p className="text-muted-foreground mt-2">
                                    Enter your Master Password to unlock your secure credentials.
                                </p>
                            </div>

                            <form onSubmit={handleUnlock} className="w-full space-y-4">
                                <div className="space-y-1">
                                    <PasswordInput
                                        label="Master Password"
                                        placeholder="..."
                                        value={unlockPassword}
                                        onChange={(e: any) => setUnlockPassword(e.target.value)}
                                        required
                                    />
                                    {unlockError && <p className="text-sm text-destructive text-left">{unlockError}</p>}
                                </div>
                                <Button type="submit" className="w-full" disabled={isVerifying}>
                                    {isVerifying ? 'Verifying...' : 'Unlock Vault'}
                                </Button>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        );
    }

    // Main Vault View
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Credential Vault</h1>
                    <p className="text-muted-foreground">
                        Securely store and manage your login information offline.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setMasterPassword(null)}>
                        <Lock size={16} className="mr-2" />
                        Lock
                    </Button>
                    <Button onClick={openModal} className="shadow-md">
                        <Plus size={18} className="mr-2" />
                        {activeTab === 'cards' ? 'New Card' : 'New Login'}
                    </Button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-2 p-1 bg-card rounded-lg border border-border w-max">
                <button
                    onClick={() => setActiveTab('logins')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'logins'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                >
                    Logins
                </button>
                <button
                    onClick={() => setActiveTab('cards')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'cards'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                >
                    Payment Cards
                </button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-border/60 shadow-sm relative">
                <div className="p-4 border-b border-border bg-card/50 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search vault..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldAlert size={16} className="text-amber-500" />
                        AES-256-GCM Encrypted
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-muted/10">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading credentials...</div>
                    ) : activeTab === 'logins' ? (
                        filteredCredentials.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <ShieldAlert size={48} className="mb-4 opacity-50" />
                                <p>No logins found. Add one to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredCredentials.map((item) => (
                                    <div key={item.id} className="group flex flex-col p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                {renderCredentialIcon(item)}
                                                <div>
                                                    <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        {item.domain}
                                                        <ExternalLink size={10} />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={() => handleDelete(item.id!)}
                                                    className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete Credential"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md group/field hover:bg-muted/50 transition-colors">
                                                <div className="truncate text-sm text-muted-foreground w-[80%]">{item.username}</div>
                                                <button
                                                    onClick={() => handleCopyPassword(item, 'username')}
                                                    className="opacity-0 group-hover/field:opacity-100 hover:text-primary transition-all p-1"
                                                >
                                                    {copiedId === `${item.id}-user` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md group/field hover:bg-muted/50 transition-colors">
                                                <div className="text-sm font-mono text-muted-foreground tracking-widest">
                                                    {decryptedPasswords[item.id!] ? '••••••••' : '••••••••••••••'}
                                                </div>
                                                <button
                                                    onClick={() => handleCopyPassword(item, 'password')}
                                                    className="opacity-0 group-hover/field:opacity-100 hover:text-primary transition-all p-1"
                                                    title="Copy Password"
                                                >
                                                    {copiedId === `${item.id}-pass` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-border flex items-center text-xs text-muted-foreground">
                                            <span>Added {item.createdAt ? new Date((item.createdAt as any).seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        filteredCards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <CreditCard size={48} className="mb-4 opacity-50" />
                                <p>No payment cards found. Add one to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredCards.map((item) => {
                                    const decrypted = decryptedCards[item.id!];
                                    const isDecrypted = !!decrypted;

                                    // Determine card brand
                                    let brandName = 'Credit Card';
                                    if (isDecrypted && decrypted.cardNumber) {
                                        if (decrypted.cardNumber.startsWith('4')) brandName = 'Visa';
                                        else if (/^5[1-5]/.test(decrypted.cardNumber)) brandName = 'Mastercard';
                                        else if (/^3[47]/.test(decrypted.cardNumber)) brandName = 'Amex';
                                        else if (/^6(?:011|5)/.test(decrypted.cardNumber)) brandName = 'Discover';
                                    }

                                    return (
                                        <div key={item.id} className="relative group w-full aspect-[1.586/1] min-h-[220px] rounded-2xl p-6 text-white shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 border border-white/10"
                                            style={{
                                                background: brandName === 'Visa' ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' :
                                                    brandName === 'Mastercard' ? 'linear-gradient(135deg, #171717 0%, #262626 100%)' :
                                                        brandName === 'Amex' ? 'linear-gradient(135deg, #475569 0%, #1e293b 100%)' :
                                                            brandName === 'Discover' ? 'linear-gradient(135deg, #7c2d12 0%, #450a0a 100%)' :
                                                                'linear-gradient(135deg, #18181b 0%, #09090b 100%)'
                                            }}>

                                            {/* Glass reflection effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none mix-blend-overlay" />
                                            {/* Glow blob */}
                                            <div className="absolute -top-32 -right-32 w-[150%] h-[150%] bg-white/5 blur-3xl rounded-full pointer-events-none" />

                                            <div className="flex justify-between items-start relative z-10 w-full">
                                                <div className="flex items-center gap-4">
                                                    {/* Realistic EMV Chip */}
                                                    <div className="relative w-12 h-9 rounded-md bg-gradient-to-br from-[#e0be70] via-[#cbad60] to-[#b39548] shadow-sm border border-black/20 overflow-hidden flex flex-col justify-between py-1.5 opacity-90">
                                                        <div className="h-[1px] w-full bg-black/20" />
                                                        <div className="h-[1px] w-full bg-black/20" />
                                                        <div className="h-[1px] w-full bg-black/20" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-5 h-full border-x border-black/20 rounded-[2px]" />
                                                        </div>
                                                        <div className="absolute right-2 top-0 bottom-0 w-[1px] bg-black/20" />
                                                    </div>

                                                    {/* Contactless Symbol */}
                                                    <svg className="w-6 h-6 text-white/60 opacity-80 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M8.5 21.3c-2.1-3.3-2.1-7.6 0-10.9m4.5 12.8c-3.5-5.1-3.5-11.7 0-16.8m5.1 18.6c-4.8-6.8-4.8-15.6 0-22.4" />
                                                    </svg>
                                                </div>

                                                <div className="font-bold text-xl italic tracking-wider flex items-center justify-end h-10 w-24 drop-shadow-md">
                                                    {brandName === 'Credit Card' ? <span className="opacity-80 drop-shadow-md text-right whitespace-nowrap">Credit Card</span> : getBrandLogo(brandName)}
                                                </div>
                                            </div>

                                            {/* delete button */}
                                            <button
                                                onClick={() => handleDelete(item.id!)}
                                                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/40 hover:bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm shadow-lg"
                                                title="Delete Card"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div className="mt-auto relative z-10 w-full mb-1">
                                                <div className="flex items-center justify-between mb-4 w-full group/number">
                                                    <div className="font-mono text-[22px] sm:text-[26px] font-medium tracking-[0.12em] sm:tracking-[0.18em] drop-shadow-md text-white/95 truncate">
                                                        {isDecrypted && decrypted.cardNumber ?
                                                            decrypted.cardNumber.replace(/(.{4})/g, '$1 ').trim() :
                                                            '•••• •••• •••• ••••'
                                                        }
                                                    </div>
                                                    <div className="flex bg-black/20 rounded-lg p-1 backdrop-blur-sm opacity-0 group-hover/number:opacity-100 transition-opacity mr-2 sm:mr-0 shrink-0">
                                                        <button onClick={() => handleDecryptCard(item)} className="p-1.5 text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/10" title="Toggle Decryption">
                                                            {isDecrypted ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                        {isDecrypted && decrypted.cardNumber && (
                                                            <button
                                                                onClick={() => handleCopyText(decrypted.cardNumber, `${item.id}-card`)}
                                                                className="p-1.5 text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/10"
                                                                title="Copy Card Number"
                                                            >
                                                                {copiedId === `${item.id}-card` ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end w-full">
                                                    <div className="flex flex-col w-[55%]">
                                                        <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 mb-1 font-semibold">Cardholder</span>
                                                        <span className="tracking-widest uppercase truncate font-medium text-white/90 drop-shadow-sm text-sm sm:text-base">
                                                            {isDecrypted && decrypted.cardholderName ? decrypted.cardholderName : item.username || '••••••'}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-4 sm:gap-6 w-[45%] justify-end pr-2">
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 mb-1 font-semibold">Valid Thru</span>
                                                            <span className="tracking-wider font-mono text-sm sm:text-[15px] font-medium text-white/90 drop-shadow-sm">
                                                                {isDecrypted && decrypted.expiry ? decrypted.expiry : '••/••'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 mb-1 font-semibold">CVV</span>
                                                            <span className="tracking-wider font-mono text-sm sm:text-[15px] font-medium text-white/90 drop-shadow-sm">
                                                                {isDecrypted && decrypted.cvv ? decrypted.cvv : '•••'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Alias Name (top right floating) */}
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 px-4 py-1.5 rounded-full text-[11px] text-white/90 font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-sm border border-white/10">
                                                {item.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>

                {/* New Credential Modal Overlay */}
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
                        <Card className="w-full max-w-lg p-6 shadow-xl border-border mx-4 overflow-hidden">

                            {/* Step 0: Pick Type */}
                            {modalStep === 'pick-type' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold">What would you like to add?</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Choose the type of credential to secure.</p>
                                        </div>
                                        <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setModalStep('pick-service')}
                                            className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Lock size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-lg">Login Account</h3>
                                                <p className="text-xs text-muted-foreground mt-1 px-4">Websites, apps, and various services</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveTab('cards');
                                                setModalStep('fill-card-details');
                                            }}
                                            className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <CreditCard size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-lg">Payment Card</h3>
                                                <p className="text-xs text-muted-foreground mt-1 px-4">Credit, debit, and prepaid cards</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Pick a Service */}
                            {modalStep === 'pick-service' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-3 mb-5">
                                        <button
                                            onClick={() => setModalStep('pick-type')}
                                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-bold">Select Service</h2>
                                            <p className="text-sm text-muted-foreground">Pick a service or create a custom one.</p>
                                        </div>
                                    </div>

                                    {/* Search Services */}
                                    <div className="relative mb-4">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                            <Search size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search services..."
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary transition-colors text-sm"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Service Grid */}
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1 pb-2">
                                        {/* Custom entry option */}
                                        <button
                                            onClick={handleSelectCustom}
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <PenLine size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground truncate w-full text-center transition-colors">
                                                Custom
                                            </span>
                                        </button>

                                        {filteredServices.map((service) => (
                                            <button
                                                key={service.id}
                                                onClick={() => handleSelectService(service)}
                                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                                                    <div className="w-8 h-8 transition-transform group-hover:scale-110">
                                                        {service.icon}
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground truncate w-full text-center transition-colors">
                                                    {service.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {filteredServices.length === 0 && serviceSearch && (
                                        <div className="text-center py-6 text-muted-foreground">
                                            <Globe size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No services match "{serviceSearch}"</p>
                                            <button onClick={handleSelectCustom} className="text-sm text-primary hover:underline mt-1">
                                                Add as custom entry →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Fill Details */}
                            {modalStep === 'fill-details' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-3 mb-5">
                                        <button
                                            onClick={() => setModalStep('pick-service')}
                                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                        {selectedServiceId && selectedServiceId !== 'custom' ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                                                    <div className="w-8 h-8">
                                                        {getServiceById(selectedServiceId)?.icon}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold">{getServiceById(selectedServiceId)?.name}</h2>
                                                    <p className="text-xs text-muted-foreground">{getServiceById(selectedServiceId)?.domain}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h2 className="text-lg font-bold">Custom Service</h2>
                                                <p className="text-xs text-muted-foreground">Enter service details manually</p>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSaveCredential} className="space-y-4">
                                        {/* Only show name/domain inputs for custom services */}
                                        {selectedServiceId === 'custom' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Input
                                                        label="Service Name"
                                                        placeholder="e.g. My Bank Account"
                                                        value={newCred.name}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Input
                                                        label="Domain / URL"
                                                        placeholder="example.com"
                                                        value={newCred.domain}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, domain: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="space-y-2">
                                            <Input
                                                label="Username / Email"
                                                placeholder="user@example.com"
                                                value={newCred.username}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <PasswordInput
                                                label="Password"
                                                placeholder="Super secret password"
                                                value={newCred.password}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCred({ ...newCred, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                                            <Button type="button" variant="outline" onClick={closeModal}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving ? 'Encrypting...' : 'Save encrypted'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Step 3: Fill Card Details */}
                            {modalStep === 'fill-card-details' && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-3 mb-5">
                                        <button
                                            onClick={() => setModalStep('pick-type')}
                                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 text-primary">
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">New Payment Card</h2>
                                                <p className="text-xs text-muted-foreground">Securely store card details</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveCard} className="space-y-4">
                                        <div className="space-y-2">
                                            <Input
                                                label="Card Alias (e.g. Primary Debit)"
                                                placeholder="My Main Card"
                                                value={newCard.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCard({ ...newCard, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="Cardholder Name"
                                                placeholder="John Doe"
                                                value={newCard.cardholderName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 relative group-card-input">
                                            <Input
                                                label="Card Number"
                                                placeholder="0000 0000 0000 0000"
                                                value={newCard.cardNumber}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
                                                required
                                                className="pr-14"
                                            />
                                            <div className="absolute right-3.5 bottom-[7px] flex items-center h-9 w-12 justify-center border-l border-border/50 pl-3">
                                                <div className="flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                                    {getBrandLogo(getCardBrand(newCard.cardNumber))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Input
                                                    label="Expiry Date"
                                                    placeholder="MM/YY"
                                                    value={newCard.expiry}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCard({ ...newCard, expiry: formatExpiryDate(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <PasswordInput
                                                    label="CVV"
                                                    placeholder="123"
                                                    value={newCard.cvv}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCard({ ...newCard, cvv: formatCVV(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                                            <Button type="button" variant="outline" onClick={closeModal}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving ? 'Encrypting...' : 'Save encrypted'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Master Password Verification Prompt */}
                {isPromptOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
                        <Card className="w-full max-w-xs p-6 shadow-xl border-border mx-4 flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Verify Identity</h3>
                                <p className="text-xs text-muted-foreground mt-1 px-4">Enter master password to access sensitive data.</p>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (promptPassword === masterPassword) {
                                    setPromptError('');
                                    setPromptPassword('');
                                    setIsPromptOpen(false);
                                    if (pendingAction) await pendingAction();
                                } else {
                                    setPromptError('Incorrect Master Password');
                                }
                            }} className="w-full space-y-4 mt-2">
                                <div className="space-y-1">
                                    <PasswordInput
                                        label=""
                                        placeholder="Master Password"
                                        value={promptPassword}
                                        onChange={(e: any) => setPromptPassword(e.target.value)}
                                        required
                                    />
                                    {promptError && <p className="text-xs text-destructive text-left mt-1">{promptError}</p>}
                                </div>
                                <div className="flex justify-end gap-2 text-sm pt-2">
                                    <Button type="button" variant="outline" className="w-1/2" onClick={() => {
                                        setIsPromptOpen(false);
                                        setPromptPassword('');
                                        setPromptError('');
                                        setPendingAction(null);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="w-1/2">
                                        Verify
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </Card>
        </div>
    );
}
