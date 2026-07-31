import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, GPT56Variant, ChatStatus } from '../types';
import { streamChat } from '../utils/apiClient';

interface UseChatOptions {
  variant: GPT56Variant;
  temperature: number;
}

interface UseChatReturn {
  messages: Message[];
  status: ChatStatus;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function useChat({ variant, temperature }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('idle');
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === 'streaming') return;
      setError(null);
      setStatus('loading');

      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        variant,
      };

      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        variant,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStatus('streaming');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const history = [...messages, userMsg].slice(-48).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let accumulated = '';
        let completionTokens = 0;
        const startTime = Date.now();

        for await (const chunk of streamChat(history, variant, temperature, controller.signal)) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            accumulated += delta;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: accumulated } : m)),
            );
          }
          if (chunk.choices[0]?.finish_reason === 'stop') {
            completionTokens = chunk.usage?.completion_tokens ?? 0;
          }
        }

        const elapsed = (Date.now() - startTime) / 1000;
        const tps = elapsed > 0 && completionTokens > 0
          ? Math.round(completionTokens / elapsed)
          : undefined;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, tokensPerSecond: tps } : m,
          ),
        );
        setStatus('idle');
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        setStatus('error');
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantMsg.id && m.content === '')),
        );
      } finally {
        abortRef.current = null;
      }
    },
    [messages, variant, temperature, status],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setStatus('idle');
  }, []);

  return { messages, status, error, sendMessage, stopGeneration, clearMessages, setMessages };
}
