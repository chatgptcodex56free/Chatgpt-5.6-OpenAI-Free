import React, { useRef, useEffect } from 'react';
import type { Message, ChatStatus } from '../types';
import MessageBubble from './MessageBubble';
import { MODEL_VARIANTS } from '../config/models';
import { VARIANT_COLORS } from '../config/constants';

interface ChatWindowProps {
  messages: Message[];
  status: ChatStatus;
  error: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, status, error }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && status === 'idle') {
    return (
      <div className="chat-window chat-window--empty">
        <div className="chat-window__welcome">
          <div className="chat-window__logo">💬</div>
          <h2 className="chat-window__welcome-title">ChatGPT 5.6 AI Free Desktop</h2>
          <p className="chat-window__welcome-sub">
            chatgpt 5 free unlimited — Sol · Terra · Luna · Sol Ultra
          </p>
          <div className="chat-window__variants-grid">
            {MODEL_VARIANTS.map((v) => (
              <div
                key={v.id}
                className="chat-window__variant-card"
                style={{ borderColor: VARIANT_COLORS[v.id] }}
              >
                <span className="chat-window__variant-label" style={{ color: VARIANT_COLORS[v.id] }}>
                  {v.label.replace('ChatGPT 5.6 ', '')}
                  {v.badge ? ` ${v.badge}` : ''}
                </span>
                <span className="chat-window__variant-best">{v.bestFor}</span>
                <span className="chat-window__variant-ctx">{v.contextK}K ctx · {v.speedLabel}</span>
              </div>
            ))}
          </div>
          <p className="chat-window__welcome-hint">
            chatgpt 5 free online — no browser needed, no rate limits, no subscription
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {status === 'loading' && (
          <div className="chat-window__typing">
            <span className="chat-window__dot" />
            <span className="chat-window__dot" />
            <span className="chat-window__dot" />
          </div>
        )}
        {error && (
          <div className="chat-window__error">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
