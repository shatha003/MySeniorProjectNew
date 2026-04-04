import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { invoke } from '@tauri-apps/api/core';

export interface VaultConfig {
    encryptedVerifyHash: string;
}

const VERIFY_STRING = "chea-vault-verification-string";

export async function setupMasterPassword(userId: string, masterPassword: string): Promise<boolean> {
    if (!userId || !masterPassword) throw new Error('User ID and Master Password are required');

    try {
        const encryptedVerifyHash = await invoke<string>('encrypt_text', {
            plaintext: VERIFY_STRING,
            password: masterPassword,
            algorithm: 'AES-256-GCM'
        });

        const configRef = doc(db, 'users', userId, 'vaultConfig', 'main');
        await setDoc(configRef, { encryptedVerifyHash });

        return true;
    } catch (error) {
        console.error("Failed to setup master password:", error);
        return false;
    }
}

export async function verifyMasterPassword(userId: string, masterPassword: string): Promise<boolean> {
    if (!userId || !masterPassword) throw new Error('User ID and Master Password are required');

    try {
        const configRef = doc(db, 'users', userId, 'vaultConfig', 'main');
        const snapshot = await getDoc(configRef);

        if (!snapshot.exists()) {
            throw new Error('vault_not_initialized');
        }

        const data = snapshot.data() as VaultConfig;

        const decryptedString = await invoke<string>('decrypt_text', {
            encoded: data.encryptedVerifyHash,
            password: masterPassword
        });

        return decryptedString === VERIFY_STRING;
    } catch (error: any) {
        if (error.message === 'vault_not_initialized') {
            throw error;
        }
        return false;
    }
}

export async function hasVaultSetup(userId: string): Promise<boolean> {
    if (!userId) return false;
    const configRef = doc(db, 'users', userId, 'vaultConfig', 'main');
    const snapshot = await getDoc(configRef);
    return snapshot.exists();
}
