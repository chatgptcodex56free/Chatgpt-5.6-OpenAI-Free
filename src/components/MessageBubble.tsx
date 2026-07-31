import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';
import { formatTimestamp } from '../utils/helpers';
import { VARIANT_COLORS } from '../config/constants';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const accentColor = message.variant ? VARIANT_COLORS[message.variant] : undefined;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className={`msg msg--${message.role}`}>
      <div className="msg__header">
        <span className="msg__role" style={!isUser && accentColor ? { color: accentColor } : undefined}>
          {isUser ? 'You' : `ChatGPT 5.6 ${message.variant ? message.variant.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''}`}
        </span>
        <span className="msg__time">{formatTimestamp(message.timestamp)}</span>
        {!isUser && message.tokensPerSecond != null && (
          <span className="msg__tps">{message.tokensPerSecond} t/s</span>
        )}
        <button className="msg__copy" onClick={handleCopy} aria-label="Copy message" title="Copy">
          {copied ? '✓' : '⎘'}
        </button>
      </div>
      <div className="msg__content">
        {isUser ? (
          <pre className="msg__user-text">{message.content}</pre>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
