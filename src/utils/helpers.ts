import type { Conversation, ConversationFolder } from '../types';
import { STORAGE_KEYS } from '../config/constants';

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.conversations);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

export function saveConversations(convos: Conversation[]): void {
  localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(convos));
}

export function loadFolders(): ConversationFolder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.folders);
    return raw ? (JSON.parse(raw) as ConversationFolder[]) : [];
  } catch {
    return [];
  }
}

export function saveFolders(folders: ConversationFolder[]): void {
  localStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(folders));
}

export function deriveTitleFromMessage(content: string, maxLen = 60): string {
  const cleaned = content.replace(/\s+/g, ' ').trim();
  return cleaned.length <= maxLen ? cleaned : cleaned.slice(0, maxLen - 1) + '…';
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function exportAsMarkdown(convo: Conversation): string {
  const lines = [`# ${convo.title}`, ''];
  for (const m of convo.messages) {
    const label = m.role === 'user' ? '**You**' : `**ChatGPT 5.6 ${capitalize(m.variant ?? 'terra')}**`;
    lines.push(`${label}  `);
    lines.push(m.content);
    lines.push('');
  }
  return lines.join('\n');
}

export function exportAsText(convo: Conversation): string {
  const lines = [convo.title, '='.repeat(convo.title.length), ''];
  for (const m of convo.messages) {
    const label = m.role === 'user' ? 'You' : `ChatGPT 5.6 ${capitalize(m.variant ?? 'terra')}`;
    lines.push(`[${label}]`);
    lines.push(m.content);
    lines.push('');
  }
  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
