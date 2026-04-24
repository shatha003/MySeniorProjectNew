import { useAuthStore } from '../store/useAuthStore';
import { useUserProgressStore } from '../store/useUserProgressStore';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'x-ai/grok-4-fast';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export async function* callNovaStreaming(
  messages: AIMessage[],
  options: AIStreamOptions = {}
): AsyncGenerator<string, void, unknown> {
  const { model = MODEL, temperature = 0.7, maxTokens = 2000, systemPrompt } = options;

  const finalMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model,
      messages: finalMessages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      if (trimmed === 'data: [DONE]') return;

      const jsonStr = trimmed.slice(6);
      try {
        const data = JSON.parse(jsonStr);
        const content = data.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip invalid JSON
      }
    }
  }
}

export async function callNova(
  messages: AIMessage[],
  options: AIStreamOptions = {}
): Promise<string> {
  let fullResponse = '';
  for await (const chunk of callNovaStreaming(messages, options)) {
    fullResponse += chunk;
  }
  return fullResponse;
}

export function buildSecurityContext(): string {
  const user = useAuthStore.getState().user;
  const { progress } = useUserProgressStore.getState();

  if (!user) return 'User is not logged in.';

  return `User: ${user.email}
Level: ${progress?.level || 1}
XP: ${progress?.xp || 0}
Streak: ${progress?.streakDays || 0}`;
}