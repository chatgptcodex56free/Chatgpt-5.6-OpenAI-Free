import type { GPT56Variant, StreamChunk } from '../types';

const API_BASE = '/api';

// Maps our variant id to the model string sent to the API endpoint
const VARIANT_MODEL_MAP: Record<GPT56Variant, string> = {
  sol: 'gpt-5.6-sol',
  'sol-ultra': 'gpt-5.6-sol-ultra',
  terra: 'gpt-5.6-terra',
  luna: 'gpt-5.6-luna',
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  variant: GPT56Variant,
  temperature: number,
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk> {
  const model = VARIANT_MODEL_MAP[variant];

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature,
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (!res.body) throw new Error('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;
      try {
        yield JSON.parse(trimmed.slice(6)) as StreamChunk;
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
}
