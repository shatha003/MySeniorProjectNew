import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type ActivityType = 
    | 'scan_link'
    | 'scan_file'
    | 'scan_image'
    | 'generate_password'
    | 'check_password'
    | 'generate_encryption'
    | 'create_credential';

export interface Activity {
    id?: string;
    type: ActivityType;
    description: string;
    points: number;
    metadata?: Record<string, string>;
    createdAt?: Date;
}

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
    scan_link: 10,
    scan_file: 15,
    scan_image: 10,
    generate_password: 5,
    check_password: 3,
    generate_encryption: 5,
    create_credential: 20,
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
    scan_link: 'Scanned Link',
    scan_file: 'Scanned File',
    scan_image: 'Scanned Image',
    generate_password: 'Generated Password',
    check_password: 'Checked Password',
    generate_encryption: 'Generated Encryption',
    create_credential: 'Created Credential',
};

export async function logActivity(
    userId: string, 
    type: ActivityType, 
    metadata?: Record<string, string>
): Promise<string> {
    if (!userId) throw new Error('User ID is required to log activity');
    
    const points = ACTIVITY_POINTS[type];
    const description = ACTIVITY_LABELS[type];
    
    const activitiesRef = collection(db, `users/${userId}/activities`);
    const docRef = await addDoc(activitiesRef, {
        type,
        description,
        points,
        metadata: metadata || {},
        createdAt: serverTimestamp(),
    });
    
    return docRef.id;
}

export async function getRecentActivities(userId: string, maxCount: number = 10): Promise<Activity[]> {
    if (!userId) throw new Error('User ID is required to fetch activities');
    
    const activitiesRef = collection(db, `users/${userId}/activities`);
    const q = query(activitiesRef, orderBy('createdAt', 'desc'), limit(maxCount));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Activity[];
}

export function getActivityIcon(type: ActivityType): string {
    switch (type) {
        case 'scan_link':
            return 'link';
        case 'scan_file':
            return 'file';
        case 'scan_image':
            return 'image';
        case 'generate_password':
            return 'key';
        case 'check_password':
            return 'shield';
        case 'generate_encryption':
            return 'lock';
        case 'create_credential':
            return 'wallet';
        default:
            return 'activity';
    }
}
