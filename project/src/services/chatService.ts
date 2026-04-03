import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ChatSession {
    id?: string;
    title: string;
    createdAt?: Date | Timestamp | number;
    updatedAt?: Date | Timestamp | number;
}

export interface ChatMessage {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: Date | Timestamp | number;
}

/**
 * Creates a new chat session for the user.
 */
export async function createChatSession(
    userId: string,
    title: string
): Promise<string> {
    if (!userId) throw new Error('User ID is required to create a chat session');

    const sessionsRef = collection(db, `users/${userId}/chatSessions`);
    const docRef = await addDoc(sessionsRef, {
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}

/**
 * Retrieves all chat sessions for a user, ordered by most recently updated.
 */
export async function getChatSessions(
    userId: string
): Promise<ChatSession[]> {
    if (!userId) throw new Error('User ID is required to fetch chat sessions');

    const sessionsRef = collection(db, `users/${userId}/chatSessions`);
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
            updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
        };
    }) as ChatSession[];
}

/**
 * Retrieves all messages for a given chat session, ordered chronologically.
 */
export async function getChatMessages(
    userId: string,
    sessionId: string
): Promise<ChatMessage[]> {
    if (!userId || !sessionId)
        throw new Error('User ID and Session ID are required to fetch messages');

    const messagesRef = collection(
        db,
        `users/${userId}/chatSessions/${sessionId}/messages`
    );
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            role: data.role,
            content: data.content,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        };
    }) as ChatMessage[];
}

/**
 * Adds a message to a chat session and updates the session's updatedAt timestamp.
 */
export async function addChatMessage(
    userId: string,
    sessionId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<string> {
    if (!userId || !sessionId)
        throw new Error('User ID and Session ID are required to add a message');

    const messagesRef = collection(
        db,
        `users/${userId}/chatSessions/${sessionId}/messages`
    );
    const docRef = await addDoc(messagesRef, {
        role,
        content,
        createdAt: serverTimestamp(),
    });

    // Update the session's updatedAt timestamp
    const sessionDocRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
    await updateDoc(sessionDocRef, { updatedAt: serverTimestamp() });

    return docRef.id;
}

/**
 * Updates the title of a chat session.
 */
export async function updateChatSessionTitle(
    userId: string,
    sessionId: string,
    title: string
): Promise<void> {
    if (!userId || !sessionId)
        throw new Error('User ID and Session ID are required to update title');

    const sessionDocRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
    await updateDoc(sessionDocRef, { title });
}

/**
 * Deletes a chat session and all its messages.
 */
export async function deleteChatSession(
    userId: string,
    sessionId: string
): Promise<void> {
    if (!userId || !sessionId)
        throw new Error('User ID and Session ID are required to delete a session');

    // First delete all messages in the session
    const messagesRef = collection(
        db,
        `users/${userId}/chatSessions/${sessionId}/messages`
    );
    const snapshot = await getDocs(messagesRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
    });

    // Delete the session document itself
    const sessionDocRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
    batch.delete(sessionDocRef);

    await batch.commit();
}
