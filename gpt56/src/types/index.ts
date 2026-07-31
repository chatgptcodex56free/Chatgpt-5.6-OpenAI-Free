export type GPTVariant = 'sol' | 'sol-ultra' | 'terra' | 'luna'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  variant?: GPTVariant
  timestamp: Date
  tokens?: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  variant: GPTVariant
  createdAt: Date
  updatedAt: Date
}

export interface VariantInfo {
  id: GPTVariant
  label: string
  description: string
  speed: 'fastest' | 'fast' | 'medium' | 'slow'
  contextK: number
  strengths: string
}

export const VARIANTS: VariantInfo[] = [
  { id: 'sol',       label: 'GPT-5.6 Sol',       description: 'Reasoning-optimized — best for coding, math, logic', speed: 'slow',    contextK: 200, strengths: 'Complex reasoning, multi-step tasks' },
  { id: 'sol-ultra', label: 'GPT-5.6 Sol Ultra',  description: 'Extended reasoning for the hardest tasks',           speed: 'slow',    contextK: 200, strengths: 'Extreme multi-step reasoning' },
  { id: 'terra',     label: 'GPT-5.6 Terra',      description: 'Balanced — writing, research, general use',          speed: 'medium',  contextK: 128, strengths: 'Creative writing, research, everyday tasks' },
  { id: 'luna',      label: 'GPT-5.6 Luna',       description: 'Fastest — quick queries and chat',                   speed: 'fastest', contextK: 64,  strengths: 'Speed, high-volume chat' },
]