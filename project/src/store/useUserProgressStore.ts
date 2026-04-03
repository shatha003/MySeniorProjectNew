import { create } from 'zustand';
import { UserProgress, ensureUserProgress, addXp, getLevelInfo } from '../services/userProgressService';

interface UserProgressState {
    progress: UserProgress | null;
    levelInfo: ReturnType<typeof getLevelInfo>;
    loading: boolean;
    error: string | null;
    fetchProgress: (userId: string) => Promise<void>;
    earnXp: (userId: string, points: number) => Promise<void>;
    initializeProgress: (userId: string) => Promise<void>;
}

export const useUserProgressStore = create<UserProgressState>((set) => ({
    progress: null,
    levelInfo: getLevelInfo(0),
    loading: false,
    error: null,
    
    fetchProgress: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const progress = await ensureUserProgress(userId);
            const levelInfo = getLevelInfo(progress.xp);
            set({ progress, levelInfo, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
    
    earnXp: async (userId: string, points: number) => {
        set({ loading: true, error: null });
        try {
            const progress = await addXp(userId, points);
            const levelInfo = getLevelInfo(progress.xp);
            set({ progress, levelInfo, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
    
    initializeProgress: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const progress = await ensureUserProgress(userId);
            const levelInfo = getLevelInfo(progress.xp);
            set({ progress, levelInfo, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
}));
