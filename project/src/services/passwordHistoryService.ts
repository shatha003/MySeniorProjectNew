import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, writeBatch, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PasswordHistoryItem {
    id?: string;
    encryptedPassword: string; // The base64 EncryptedPayload JSON string from Rust backend
    pinned: boolean;
    entropy: number;
    createdAt?: Date | Timestamp | number;
}

/**
 * Adds a new password history item to the user's collection in Firestore.
 */
export async function addPasswordHistory(userId: string, historyItem: Omit<PasswordHistoryItem, 'id' | 'createdAt'>) {
    if (!userId) throw new Error('User ID is required to add password history');

    const historyRef = collection(db, `users/${userId}/passwordHistory`);
    const docRef = await addDoc(historyRef, {
        ...historyItem,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

/**
 * Retrieves all saved password history for a user from Firestore.
 */
export async function getUserPasswordHistory(userId: string): Promise<PasswordHistoryItem[]> {
    if (!userId) throw new Error('User ID is required to fetch password history');

    const historyRef = collection(db, `users/${userId}/passwordHistory`);
    const q = query(historyRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to milliseconds for easier client-side sorting/display if needed
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
        };
    }) as PasswordHistoryItem[];
}

/**
 * Updates the pinned status of a password history item.
 */
export async function updatePasswordHistoryPin(userId: string, historyId: string, pinned: boolean) {
    if (!userId || !historyId) throw new Error('User ID and History ID are required for updating pin status');

    const docRef = doc(db, `users/${userId}/passwordHistory/${historyId}`);
    await updateDoc(docRef, { pinned });
}

/**
 * Deletes a specific password history item.
 */
export async function deletePasswordHistory(userId: string, historyId: string) {
    if (!userId || !historyId) throw new Error('User ID and History ID are required for deletion');

    const docRef = doc(db, `users/${userId}/passwordHistory/${historyId}`);
    await deleteDoc(docRef);
}

/**
 * Clears all unpinned password history for a user.
 */
export async function clearUnpinnedHistory(userId: string) {
    if (!userId) throw new Error('User ID is required to clear history');

    const historyRef = collection(db, `users/${userId}/passwordHistory`);
    // We need all documents to check their 'pinned' status. Or we could query where pinned == false.
    const unpinnedQuery = query(historyRef, /* where('pinned', '==', false) - Requires index, safer to filter client side if small, or use writeBatch */);

    const snapshot = await getDocs(unpinnedQuery);

    const batch = writeBatch(db);
    let count = 0;

    snapshot.docs.forEach((document) => {
        if (document.data().pinned !== true) {
            batch.delete(document.ref);
            count++;
        }
    });

    if (count > 0) {
        await batch.commit();
    }
}
