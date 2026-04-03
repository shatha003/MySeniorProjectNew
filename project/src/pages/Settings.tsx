
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Bell, Shield as ShieldIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { hasVaultSetup, setupMasterPassword, verifyMasterPassword } from '../services/vaultService';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
export default function Settings() {
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
    const [autoLockEnabled, setAutoLockEnabled] = useState(true);
    const [autoLockTime, setAutoLockTime] = useState('15');

    const [vaultSetup, setVaultSetup] = useState(false);
    const [currentMaster, setCurrentMaster] = useState('');
    const [newMaster, setNewMaster] = useState('');
    const [confirmMaster, setConfirmMaster] = useState('');
    const [isSavingMaster, setIsSavingMaster] = useState(false);
    const [masterMsg, setMasterMsg] = useState('');

    const user = useAuthStore((s) => s.user);

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const photoURL = user?.photoURL || null;
    const initials = displayName.charAt(0).toUpperCase();

    useEffect(() => {
        if (user) {
            hasVaultSetup(user.uid).then(setVaultSetup);
        }
    }, [user]);

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

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account preferences, security options, and application behavior.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Navigation Sidebar for Settings */}
                <div className="md:col-span-1 space-y-1">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'account' ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent'}`}
                    >
                        <User size={16} /> Account
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent'}`}
                    >
                        <ShieldIcon size={16} /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent'}`}
                    >
                        <Bell size={16} /> Notifications
                    </button>
                </div>

                {/* Settings Content */}
                <div className="md:col-span-3 space-y-6">

                    {activeTab === 'account' && (
                        <>
                            {/* Account Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Information</CardTitle>
                                    <CardDescription>Manage your public profile and email.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        {photoURL ? (
                                            <img
                                                src={photoURL}
                                                alt={displayName}
                                                referrerPolicy="no-referrer"
                                                className="h-16 w-16 rounded-full object-cover border-2 border-primary/30 shadow-sm"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary text-xl font-medium shadow-sm">
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <button
                                                className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
                                            >
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Display Name</label>
                                            <input
                                                type="text"
                                                defaultValue={displayName}
                                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <input
                                                type="email"
                                                defaultValue={user?.email || ''}
                                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors text-sm"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Your email address.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'security' && (
                        <>
                            {/* Master Password Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Master Password (Wallet)</CardTitle>
                                    <CardDescription>
                                        {vaultSetup
                                            ? "Your vault is secure. You can update your master password below."
                                            : "You haven't set up a master password yet. Set one up to use the vault."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {vaultSetup && (
                                        <div className="space-y-2">
                                            <PasswordInput
                                                label="Current Master Password"
                                                placeholder="Enter current master password"
                                                value={currentMaster}
                                                onChange={(e: any) => setCurrentMaster(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label="New Master Password"
                                            placeholder="Enter new master password"
                                            value={newMaster}
                                            onChange={(e: any) => setNewMaster(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <PasswordInput
                                            label="Confirm Master Password"
                                            placeholder="Confirm new master password"
                                            value={confirmMaster}
                                            onChange={(e: any) => setConfirmMaster(e.target.value)}
                                        />
                                    </div>
                                    {masterMsg && (
                                        <p className={`text-sm ${masterMsg.includes('success') ? 'text-green-500' : 'text-destructive'}`}>
                                            {masterMsg}
                                        </p>
                                    )}
                                    <Button onClick={handleSetupMaster} disabled={isSavingMaster || !newMaster || !confirmMaster || (vaultSetup && !currentMaster)}>
                                        {isSavingMaster ? 'Saving...' : (vaultSetup ? 'Update Master Password' : 'Setup Master Password')}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* App Security */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Security</CardTitle>
                                    <CardDescription>Configure local lock settings for the vault.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 w-[75%]">
                                            <h4 className="text-sm font-medium">Auto-Lock Vault</h4>
                                            <p className="text-sm text-muted-foreground">Automatically lock your credential vault when the application is idle.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={autoLockEnabled} onChange={(e) => setAutoLockEnabled(e.target.checked)} />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    {autoLockEnabled && (
                                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                            <label className="text-sm font-medium text-muted-foreground">Inactivity Timeout (minutes)</label>
                                            <select
                                                value={autoLockTime}
                                                onChange={(e) => setAutoLockTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-primary focus:border-primary transition-colors text-sm"
                                            >
                                                <option value="5">5 minutes</option>
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                            </select>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Manage your notification preferences.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium">Email Alerts</h4>
                                                <p className="text-sm text-muted-foreground">Receive updates about your account activity.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium">Push Notifications</h4>
                                                <p className="text-sm text-muted-foreground">Receive local alerts for important events.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
