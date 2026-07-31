import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, GPT56Variant } from './types';
import { useChat } from './hooks/useChat';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import VariantPicker from './components/VariantPicker';
import ConversationSidebar from './components/ConversationSidebar';
import { APP_NAME, DEFAULT_SETTINGS, STORAGE_KEYS } from './config/constants';
import {
  loadConversations,
  saveConversations,
  loadFolders,
  deriveTitleFromMessage,
  exportAsMarkdown,
  exportAsText,
  downloadFile,
} from './utils/helpers';

const App: React.FC = () => {
  const [variant, setVariant] = useState<GPT56Variant>(DEFAULT_SETTINGS.defaultVariant);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [folders] = useState(loadFolders);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.activeConversation),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { messages, status, error, sendMessage, stopGeneration, clearMessages, setMessages } =
    useChat({ variant, temperature: DEFAULT_SETTINGS.temperature });

  // Persist conversations on messages change
  useEffect(() => {
    if (messages.length === 0) return;
    setConversations((prev) => {
      const existing = prev.find((c) => c.id === activeConvId);
      if (existing) {
        const updated = prev.map((c) =>
          c.id === activeConvId ? { ...c, messages, variant, updatedAt: Date.now() } : c,
        );
        saveConversations(updated);
        return updated;
      } else {
        const newConv: Conversation = {
          id: activeConvId ?? uuidv4(),
          title: deriveTitleFromMessage(messages[0].content),
          folderId: null,
          messages,
          variant,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        const updated = [newConv, ...prev];
        setActiveConvId(newConv.id);
        localStorage.setItem(STORAGE_KEYS.activeConversation, newConv.id);
        saveConversations(updated);
        return updated;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleNewChat = useCallback(() => {
    clearMessages();
    const id = uuidv4();
    setActiveConvId(id);
    localStorage.setItem(STORAGE_KEYS.activeConversation, id);
  }, [clearMessages]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return;
      setActiveConvId(id);
      localStorage.setItem(STORAGE_KEYS.activeConversation, id);
      setMessages(conv.messages);
      setVariant(conv.variant);
    },
    [conversations, setMessages],
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveConversations(updated);
        return updated;
      });
      if (id === activeConvId) {
        handleNewChat();
      }
    },
    [activeConvId, handleNewChat],
  );

  const handleExportMd = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return;
      downloadFile(exportAsMarkdown(conv), `${conv.title}.md`, 'text/markdown');
    },
    [conversations],
  );

  const handleExportTxt = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return;
      downloadFile(exportAsText(conv), `${conv.title}.txt`, 'text/plain');
    },
    [conversations],
  );

  // Update document title
  useEffect(() => {
    document.title = `${APP_NAME} — ${variant}`;
  }, [variant]);

  return (
    <div className={`app ${sidebarOpen ? 'app--sidebar-open' : 'app--sidebar-closed'}`}>
      {/* Sidebar */}
      {sidebarOpen && (
        <ConversationSidebar
          conversations={conversations}
          folders={folders}
          activeId={activeConvId}
          onSelect={handleSelectConversation}
          onNew={handleNewChat}
          onDelete={handleDeleteConversation}
          onExportMd={handleExportMd}
          onExportTxt={handleExportTxt}
        />
      )}

      {/* Sidebar toggle */}
      <button
        className="app__sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <span className="topbar__title">ChatGPT 5.6 AI Free Desktop</span>
          <VariantPicker selected={variant} onChange={setVariant} />
          <button
            className="topbar__new-btn"
            onClick={handleNewChat}
            title="New conversation"
            aria-label="New conversation"
          >
            + New
          </button>
        </header>

        <ChatWindow messages={messages} status={status} error={error} />
        <InputBar onSend={sendMessage} onStop={stopGeneration} status={status} />
      </main>
    </div>
  );
};

export default App;
