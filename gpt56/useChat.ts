import { useState, useRef } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = async (content: string) => {
    const userMsg: Message = { id: Date.now(), role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
        signal: abortRef.current.signal,
      })
      const data = await res.json()
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.content, timestamp: new Date() }])
    } catch (e) {
      if ((e as Error).name !== 'AbortError') console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const stop = () => abortRef.current?.abort()
  const clear = () => setMessages([])

  return { messages, isLoading, sendMessage, stop, clear }
}
