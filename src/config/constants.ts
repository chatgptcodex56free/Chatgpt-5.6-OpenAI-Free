export const APP_NAME = 'ChatGPT 5.6 AI Free Desktop';
export const APP_VERSION = '1.0.0';
export const GITHUB_URL = 'https://github.com/chatgptcodex56/Chatgpt-5.6-AI-Free-Desktop';

// API base — proxied through Vite dev server to avoid CORS
export const API_BASE = '/api';

export const STORAGE_KEYS = {
  conversations: 'gpt56_conversations',
  folders: 'gpt56_folders',
  settings: 'gpt56_settings',
  activeConversation: 'gpt56_active',
} as const;

export const DEFAULT_SETTINGS = {
  defaultVariant: 'terra' as const,
  temperature: 0.7,
  theme: 'dark' as const,
  streamingEnabled: true,
  fontSize: 'md' as const,
};

export const VARIANT_COLORS: Record<string, string> = {
  sol: '#f59e0b',
  'sol-ultra': '#ef4444',
  terra: '#10b981',
  luna: '#60a5fa',
};

export const TEMPLATE_CATEGORIES = ['coding', 'writing', 'analysis', 'research', 'creative'] as const;
