const AVATAR_STORAGE_KEY = 'chea-avatar';

export interface SavedAvatar {
    type: 'emoji' | 'photo';
    data: string;
}

export function saveAvatar(type: 'emoji' | 'photo', data: string): void {
    try {
        const avatar: SavedAvatar = { type, data };
        localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
        window.dispatchEvent(new Event('chea-avatar-changed'));
    } catch (err) {
        console.error('Failed to save avatar:', err);
    }
}

export function loadAvatar(): SavedAvatar | null {
    try {
        const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as SavedAvatar;
    } catch (err) {
        console.error('Failed to load avatar:', err);
        return null;
    }
}

export function clearAvatar(): void {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
}
