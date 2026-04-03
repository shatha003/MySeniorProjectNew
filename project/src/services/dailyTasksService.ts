import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getTodayDateString } from './userProgressService';

export interface DailyTask {
    id: string;
    type: string;
    description: string;
    target: number;
    current: number;
    points: number;
    completed: boolean;
}

export interface DailyTasksData {
    date: string;
    tasks: DailyTask[];
    totalScore: number;
    maxScore: number;
    createdAt?: Date;
}

export const DEFAULT_DAILY_TASKS: Omit<DailyTasksData, 'date' | 'totalScore' | 'createdAt'> = {
    tasks: [
        {
            id: 'scan_task',
            type: 'scan',
            description: 'Complete a scan',
            target: 1,
            current: 0,
            points: 25,
            completed: false,
        },
        {
            id: 'generate_passwords',
            type: 'generate_password',
            description: 'Generate passwords',
            target: 2,
            current: 0,
            points: 15,
            completed: false,
        },
        {
            id: 'check_password',
            type: 'check_password',
            description: 'Check password strength',
            target: 1,
            current: 0,
            points: 10,
            completed: false,
        },
        {
            id: 'create_credential',
            type: 'create_credential',
            description: 'Create a credential',
            target: 1,
            current: 0,
            points: 30,
            completed: false,
        },
        {
            id: 'use_encryption',
            type: 'generate_encryption',
            description: 'Use encryption',
            target: 1,
            current: 0,
            points: 15,
            completed: false,
        },
    ],
    maxScore: 95,
};

export async function getDailyTasks(userId: string): Promise<DailyTasksData | null> {
    if (!userId) throw new Error('User ID is required');
    
    const today = getTodayDateString();
    const tasksRef = doc(db, `users/${userId}/dailyTasks/${today}`);
    const snapshot = await getDoc(tasksRef);
    
    if (snapshot.exists()) {
        return snapshot.data() as DailyTasksData;
    }
    
    return null;
}

export async function initializeDailyTasks(userId: string): Promise<DailyTasksData> {
    if (!userId) throw new Error('User ID is required');
    
    const today = getTodayDateString();
    const tasksData: DailyTasksData = {
        ...DEFAULT_DAILY_TASKS,
        date: today,
        totalScore: 0,
    };
    
    const tasksRef = doc(db, `users/${userId}/dailyTasks/${today}`);
    await setDoc(tasksRef, {
        ...tasksData,
        createdAt: serverTimestamp(),
    });
    
    return tasksData;
}

export async function ensureDailyTasks(userId: string): Promise<DailyTasksData> {
    const today = getTodayDateString();
    const existing = await getDailyTasks(userId);
    
    if (existing && existing.date === today) {
        return existing;
    }
    
    return initializeDailyTasks(userId);
}

export async function incrementTaskProgress(userId: string, taskType: string): Promise<DailyTasksData> {
    if (!userId) throw new Error('User ID is required');
    
    const tasksData = await ensureDailyTasks(userId);
    const today = getTodayDateString();
    
    let totalScore = tasksData.totalScore;
    const updatedTasks = tasksData.tasks.map(task => {
        if (task.type === taskType && !task.completed) {
            const newCurrent = Math.min(task.current + 1, task.target);
            const wasCompleted = task.completed;
            task.completed = newCurrent >= task.target;
            task.current = newCurrent;
            
            if (!wasCompleted && task.completed) {
                totalScore += task.points;
            }
        }
        return task;
    });
    
    const newData: DailyTasksData = {
        ...tasksData,
        tasks: updatedTasks,
        totalScore,
    };
    
    const tasksRef = doc(db, `users/${userId}/dailyTasks/${today}`);
    await setDoc(tasksRef, newData, { merge: true });
    
    return newData;
}

export function getTaskProgressSummary(tasksData: DailyTasksData): { completed: number; total: number; percentage: number } {
    const completed = tasksData.tasks.filter(t => t.completed).length;
    const total = tasksData.tasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
}
