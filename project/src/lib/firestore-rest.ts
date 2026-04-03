/**
 * Firestore REST API helper for Tauri.
 * 
 * The Firestore Web SDK uses gRPC-web/WebChannel internally, which is completely
 * blocked by Tauri's WebView2 engine (Edge). This causes "client is offline" errors.
 * 
 * This helper uses plain fetch() to talk to the Firestore REST API directly,
 * which works perfectly in WebView2.
 */

import { auth } from './firebase';

const PROJECT_ID = 'seniorproject-d1dbb';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Get the current user's ID token for authenticating REST API calls.
 */
async function getIdToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    return await user.getIdToken();
}

/**
 * Convert a plain JS object to Firestore REST API field format.
 */
function toFirestoreFields(data: Record<string, any>): Record<string, any> {
    const fields: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
            fields[key] = { nullValue: null };
        } else if (value === 'SERVER_TIMESTAMP') {
            fields[key] = { timestampValue: new Date().toISOString() };
        } else if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                fields[key] = { integerValue: String(value) };
            } else {
                fields[key] = { doubleValue: value };
            }
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (Array.isArray(value)) {
            fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: String(v) })) } };
        } else if (typeof value === 'object') {
            fields[key] = { mapValue: { fields: toFirestoreFields(value) } };
        }
    }
    return fields;
}

/**
 * Convert Firestore REST API fields back to a plain JS object.
 */
function fromFirestoreFields(fields: Record<string, any>): Record<string, any> {
    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
        if ('stringValue' in value) {
            data[key] = value.stringValue;
        } else if ('integerValue' in value) {
            data[key] = parseInt(value.integerValue);
        } else if ('doubleValue' in value) {
            data[key] = value.doubleValue;
        } else if ('booleanValue' in value) {
            data[key] = value.booleanValue;
        } else if ('nullValue' in value) {
            data[key] = null;
        } else if ('timestampValue' in value) {
            data[key] = value.timestampValue;
        } else if ('arrayValue' in value) {
            data[key] = (value.arrayValue.values || []).map((v: any) => {
                if ('stringValue' in v) return v.stringValue;
                return v;
            });
        } else if ('mapValue' in value) {
            data[key] = fromFirestoreFields(value.mapValue.fields || {});
        }
    }
    return data;
}

/**
 * Get a document from Firestore via REST API.
 * Returns null if the document doesn't exist.
 */
export async function firestoreGetDoc(collection: string, docId: string): Promise<Record<string, any> | null> {
    const token = await getIdToken();
    const url = `${FIRESTORE_BASE}/${collection}/${docId}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 404) {
        return null; // Document doesn't exist
    }

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Firestore GET failed (${response.status}): ${errorBody}`);
    }

    const doc = await response.json();
    return fromFirestoreFields(doc.fields || {});
}

/**
 * Create or overwrite a document in Firestore via REST API.
 */
export async function firestoreSetDoc(collection: string, docId: string, data: Record<string, any>): Promise<void> {
    const token = await getIdToken();
    const url = `${FIRESTORE_BASE}/${collection}/${docId}`;

    const body = {
        fields: toFirestoreFields(data),
    };

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Firestore SET failed (${response.status}): ${errorBody}`);
    }
}
