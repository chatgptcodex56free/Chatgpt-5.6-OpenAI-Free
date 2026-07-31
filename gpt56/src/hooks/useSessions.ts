import { useState } from 'react'
import type { ChatSession, GPTVariant } from '../types'

const KEY = 'gpt56_sessions'

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
  })

  const persist = (s: ChatSession[]) => { setSessions(s); localStorage.setItem(KEY, JSON.stringify(s)) }
  const add    = (s: ChatSession)    => persist([s, ...sessions])
  const remove = (id: string)        => persist(sessions.filter(s => s.id !== id))
  const update = (id: string, p: Partial<ChatSession>) =>
    persist(sessions.map(s => s.id === id ? { ...s, ...p } : s))

  return { sessions, add, remove, update }
}