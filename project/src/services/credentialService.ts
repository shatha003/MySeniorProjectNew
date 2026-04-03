import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CredentialItem {
    id?: string;
    type?: 'login' | 'card'; // Distinguish between login and payment card
    name: string;
    username: string; // Can be cardholder name for UI purposes
    domain: string;
    encryptedData: string; // For cards, this will hold a JSON string: { cardNumber, cardholderName, expiry, cvv }
    serviceId?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
}

/**
 * Adds a new credential to the user's vault in Firestore.
 */
export async function addCredential(userId: string, credential: Omit<CredentialItem, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!userId) throw new Error('User ID is required to add an encrypted credential');

    const vaultRef = collection(db, `users/${userId}/vault`);
    const docRef = await addDoc(vaultRef, {
        ...credential,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}

/**
 * Retrieves all saved credentials for a user from Firestore.
 */
export async function getUserCredentials(userId: string): Promise<CredentialItem[]> {
    if (!userId) throw new Error('User ID is required to fetch credentials');

    const vaultRef = collection(db, `users/${userId}/vault`);
    const q = query(vaultRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as CredentialItem[];
}

/**
 * Deletes a specific credential from the user's vault.
 */
export async function deleteCredential(userId: string, credentialId: string) {
    if (!userId || !credentialId) throw new Error('User ID and Credential ID are required for deletion');

    const docRef = doc(db, `users/${userId}/vault/${credentialId}`);
    await deleteDoc(docRef);
}
