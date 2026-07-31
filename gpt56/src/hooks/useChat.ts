import { useState, useCallback } from 'react'
import type { ChatMessage, GPTVariant } from '../types'

export function useChat(variant: GPTVariant) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      variant,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, msg])
    setLoading(true)

    try {
      const res = await fetch('/api/gpt56', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant, messages: [...messages, msg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: data.content,
        variant,
        timestamp: new Date(),
        tokens: data.tokens,
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, variant])

  return { messages, loading, send, clear: () => setMessages([]) }
}