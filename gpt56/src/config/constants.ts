export const APP_CONFIG = {
  name: 'ChatGPT 5.6 AI Free Desktop',
  version: '1.0.0',
  defaultVariant: 'terra' as const,
  apiEndpoint: '/api/gpt56',
  streamEnabled: true,
  maxRetries: 3,
}

export const STORAGE_KEYS = {
  sessions: 'gpt56_sessions',
  settings: 'gpt56_settings',
  activeVariant: 'gpt56_variant',
}

export const VARIANT_COLORS = {
  'sol':       '#f59e0b',
  'sol-ultra': '#ef4444',
  'terra':     '#22c55e',
  'luna':      '#8ab4f8',
}