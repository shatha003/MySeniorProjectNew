import { create } from 'zustand';
import { DailyTasksData, ensureDailyTasks, incrementTaskProgress, getTaskProgressSummary } from '../services/dailyTasksService';

interface DailyTasksState {
    tasks: DailyTasksData | null;
    summary: { completed: number; total: number; percentage: number };
    loading: boolean;
    error: string | null;
    fetchTasks: (userId: string) => Promise<void>;
    completeTask: (userId: string, taskType: string) => Promise<void>;
}

const defaultSummary = { completed: 0, total: 5, percentage: 0 };

export const useDailyTasksStore = create<DailyTasksState>((set) => ({
    tasks: null,
    summary: defaultSummary,
    loading: false,
    error: null,
    
    fetchTasks: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const tasks = await ensureDailyTasks(userId);
            const summary = getTaskProgressSummary(tasks);
            set({ tasks, summary, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
    
    completeTask: async (userId: string, taskType: string) => {
        set({ loading: true, error: null });
        try {
            const tasks = await incrementTaskProgress(userId, taskType);
            const summary = getTaskProgressSummary(tasks);
            set({ tasks, summary, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
}));
