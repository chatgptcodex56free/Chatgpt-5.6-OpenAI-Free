import { useState } from 'react'
import type { ChatSession } from './types'

const STORAGE_KEY = 'gpt56_sessions'

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const save = (updated: ChatSession[]) => {
    setSessions(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const addSession = (s: ChatSession) => save([s, ...sessions])
  const removeSession = (id: string) => save(sessions.filter(s => s.id !== id))
  const updateSession = (id: string, patch: Partial<ChatSession>) =>
    save(sessions.map(s => (s.id === id ? { ...s, ...patch } : s)))

  return { sessions, addSession, removeSession, updateSession }
}
