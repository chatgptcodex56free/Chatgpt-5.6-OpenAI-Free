export type Role = 'user' | 'assistant' | 'system';

export type GPT56Variant = 'sol' | 'sol-ultra' | 'terra' | 'luna';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  variant?: GPT56Variant;
  tokensPerSecond?: number;
}

export interface Conversation {
  id: string;
  title: string;
  folderId: string | null;
  messages: Message[];
  variant: GPT56Variant;
  createdAt: number;
  updatedAt: number;
}

export interface ConversationFolder {
  id: string;
  name: string;
  createdAt: number;
}

export interface ModelVariant {
  id: GPT56Variant;
  label: string;
  description: string;
  contextK: number;
  speedLabel: string;
  bestFor: string;
  badge?: string;
}

export interface PromptTemplate {
  id: string;
  category: 'coding' | 'writing' | 'analysis' | 'creative' | 'research';
  title: string;
  prompt: string;
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: { role?: Role; content?: string };
    finish_reason: string | null;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';

export interface AppSettings {
  defaultVariant: GPT56Variant;
  temperature: number;
  theme: 'dark' | 'light' | 'system';
  streamingEnabled: boolean;
  fontSize: 'sm' | 'md' | 'lg';
}
