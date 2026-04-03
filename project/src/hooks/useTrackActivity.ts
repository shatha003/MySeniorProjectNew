import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useActivityStore } from '../store/useActivityStore';
import { useUserProgressStore } from '../store/useUserProgressStore';
import { useDailyTasksStore } from '../store/useDailyTasksStore';
import { ActivityType, ACTIVITY_POINTS } from '../services/activityService';

export function useTrackActivity() {
    const user = useAuthStore((state) => state.user);
    const { logActivity } = useActivityStore();
    const { earnXp } = useUserProgressStore();
    const { completeTask } = useDailyTasksStore();
    
    const track = useCallback(async (type: ActivityType, metadata?: Record<string, string>) => {
        if (!user?.uid) {
            console.warn('Cannot track activity: user not authenticated');
            return;
        }
        
        const userId = user.uid;
        const points = ACTIVITY_POINTS[type];
        
        await logActivity(userId, type, metadata);
        
        await earnXp(userId, points);
        
        let taskType: string = type;
        if (type === 'scan_link' || type === 'scan_file' || type === 'scan_image') {
            taskType = 'scan';
        }
        
        await completeTask(userId, taskType);
    }, [user, logActivity, earnXp, completeTask]);
    
    return track;
}
