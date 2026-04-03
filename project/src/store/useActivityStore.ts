import { create } from 'zustand';
import { Activity, getRecentActivities, logActivity as logActivityService, ActivityType } from '../services/activityService';

interface ActivityState {
    activities: Activity[];
    loading: boolean;
    error: string | null;
    fetchActivities: (userId: string) => Promise<void>;
    logActivity: (userId: string, type: ActivityType, metadata?: Record<string, string>) => Promise<string>;
}

export const useActivityStore = create<ActivityState>((set) => ({
    activities: [],
    loading: false,
    error: null,
    
    fetchActivities: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const activities = await getRecentActivities(userId, 15);
            set({ activities, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
    
    logActivity: async (userId: string, type: ActivityType, metadata?: Record<string, string>) => {
        try {
            const activityId = await logActivityService(userId, type, metadata);
            const activities = await getRecentActivities(userId, 15);
            set({ activities });
            return activityId;
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },
}));
