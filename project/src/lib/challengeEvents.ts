type ChallengeToolEvent = {
    tool: string;
    activityType: string;
};

type EventCallback = (event: ChallengeToolEvent) => void;

const listeners = new Set<EventCallback>();

export function emitChallengeEvent(tool: string, activityType: string) {
    const event: ChallengeToolEvent = { tool, activityType };
    listeners.forEach(callback => callback(event));
}

export function onChallengeEvent(callback: EventCallback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}