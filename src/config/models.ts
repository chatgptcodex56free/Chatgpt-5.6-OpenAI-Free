import type { ModelVariant, PromptTemplate } from '../types';

export const MODEL_VARIANTS: ModelVariant[] = [
  {
    id: 'sol',
    label: 'ChatGPT 5.6 Sol',
    description: 'Reasoning-optimized. Best for coding, math, logic and multi-step problem solving.',
    contextK: 200,
    speedLabel: 'Slower',
    bestFor: 'Coding · Math · Logic',
  },
  {
    id: 'sol-ultra',
    label: 'ChatGPT 5.6 Sol Ultra',
    description: 'Extended chain-of-thought on top of Sol. For the hardest multi-step tasks.',
    contextK: 200,
    speedLabel: 'Slowest',
    bestFor: 'Deep reasoning · Research',
    badge: 'Ultra',
  },
  {
    id: 'terra',
    label: 'ChatGPT 5.6 Terra',
    description: 'Balanced general-purpose model. Best for writing, research and everyday tasks.',
    contextK: 128,
    speedLabel: 'Medium',
    bestFor: 'Writing · Research · General',
  },
  {
    id: 'luna',
    label: 'ChatGPT 5.6 Luna',
    description: 'Lightweight fast variant. Ideal for quick queries and high-frequency sessions.',
    contextK: 64,
    speedLabel: 'Fastest',
    bestFor: 'Quick chat · Summaries',
  },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: 'pt-1', category: 'coding', title: 'Code Review', prompt: 'Review the following code for bugs, performance issues, and best practices:\n\n```\n[paste code here]\n```' },
  { id: 'pt-2', category: 'coding', title: 'Explain Code', prompt: 'Explain what this code does step by step:\n\n```\n[paste code here]\n```' },
  { id: 'pt-3', category: 'coding', title: 'Write Unit Tests', prompt: 'Write comprehensive unit tests for the following function:\n\n```\n[paste function here]\n```' },
  { id: 'pt-4', category: 'writing', title: 'Improve Writing', prompt: 'Improve the clarity, tone and flow of this text while preserving its meaning:\n\n[paste text here]' },
  { id: 'pt-5', category: 'writing', title: 'Summarize', prompt: 'Summarize the following text in 3-5 bullet points:\n\n[paste text here]' },
  { id: 'pt-6', category: 'analysis', title: 'Pros & Cons', prompt: 'Give a balanced pros and cons analysis of:\n\n[topic]' },
  { id: 'pt-7', category: 'analysis', title: 'Data Interpretation', prompt: 'Interpret the following data and identify key trends:\n\n[paste data here]' },
  { id: 'pt-8', category: 'research', title: 'Research Summary', prompt: 'Provide a comprehensive overview of [topic], including key concepts, current state, and open questions.' },
  { id: 'pt-9', category: 'creative', title: 'Story Starter', prompt: 'Write a compelling opening paragraph for a story about [premise].' },
  { id: 'pt-10', category: 'creative', title: 'Brainstorm Ideas', prompt: 'Brainstorm 10 creative ideas for [topic/project].' },
];
