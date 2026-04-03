import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProgress {
    xp: number;
    level: number;
    totalScore: number;
    streakDays: number;
    lastActiveDate: string;
    createdAt?: Date;
}

export const LEVEL_THRESHOLDS = [
    { level: 1, xp: 0, title: 'Novice' },
    { level: 2, xp: 100, title: 'Apprentice' },
    { level: 3, xp: 300, title: 'Guardian' },
    { level: 4, xp: 600, title: 'Defender' },
    { level: 5, xp: 1000, title: 'Sentinel' },
    { level: 6, xp: 1500, title: 'Champion' },
    { level: 7, xp: 2200, title: 'Hero' },
    { level: 8, xp: 3000, title: 'Legend' },
    { level: 9, xp: 4000, title: 'Mythic' },
    { level: 10, xp: 5500, title: 'Omniscient' },
];

export function getLevelInfo(xp: number): { level: number; title: string; xpForNext: number; xpInLevel: number; progress: number } {
    let currentLevel = LEVEL_THRESHOLDS[0];
    let nextLevel = LEVEL_THRESHOLDS[1];

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i].xp) {
            currentLevel = LEVEL_THRESHOLDS[i];
            nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
            break;
        }
    }

    const xpInLevel = xp - currentLevel.xp;
    const xpNeeded = nextLevel.xp - currentLevel.xp;
    const progress = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        xpForNext: nextLevel.xp,
        xpInLevel,
        progress: Math.min(progress, 100),
    };
}

export function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
    if (!userId) throw new Error('User ID is required');

    const progressRef = doc(db, `users/${userId}/progress/data`);
    const snapshot = await getDoc(progressRef);

    if (snapshot.exists()) {
        return snapshot.data() as UserProgress;
    }

    return null;
}

export async function initializeUserProgress(userId: string): Promise<UserProgress> {
    if (!userId) throw new Error('User ID is required');

    const today = getTodayDateString();
    const initialProgress: UserProgress = {
        xp: 0,
        level: 1,
        totalScore: 0,
        streakDays: 0,
        lastActiveDate: today,
    };

    const progressRef = doc(db, `users/${userId}/progress/data`);
    await setDoc(progressRef, {
        ...initialProgress,
        createdAt: serverTimestamp(),
    });

    return initialProgress;
}

export async function addXp(userId: string, points: number): Promise<UserProgress> {
    if (!userId) throw new Error('User ID is required');

    const progress = await getUserProgress(userId);

    if (!progress) {
        await initializeUserProgress(userId);
        return addXp(userId, points);
    }

    const today = getTodayDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newXp = progress.xp + points;
    let newLevel = progress.level;
    let newStreak = progress.streakDays;

    const levelInfo = getLevelInfo(newXp);
    newLevel = levelInfo.level;

    if (progress.lastActiveDate !== today && progress.lastActiveDate !== yesterdayString) {
        newStreak = 1;
    } else if (progress.lastActiveDate !== today) {
        newStreak = progress.streakDays + 1;
    }

    const newProgress: UserProgress = {
        xp: newXp,
        level: newLevel,
        totalScore: progress.totalScore + points,
        streakDays: newStreak,
        lastActiveDate: today,
    };

    const progressRef = doc(db, `users/${userId}/progress/data`);
    await setDoc(progressRef, newProgress, { merge: true });

    return newProgress;
}

export async function ensureUserProgress(userId: string): Promise<UserProgress> {
    const existing = await getUserProgress(userId);
    if (existing) {
        return existing;
    }
    return initializeUserProgress(userId);
}
