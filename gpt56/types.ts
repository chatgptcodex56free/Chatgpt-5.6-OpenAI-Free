export interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface AppConfig {
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  streamResponse: boolean
  saveHistory: boolean
}
