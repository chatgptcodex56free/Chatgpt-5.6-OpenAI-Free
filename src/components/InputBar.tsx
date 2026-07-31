import React, { useState, useRef, useEffect } from 'react';
import type { ChatStatus } from '../types';
import { PROMPT_TEMPLATES } from '../config/models';

interface InputBarProps {
  onSend: (content: string) => void;
  onStop: () => void;
  status: ChatStatus;
  disabled?: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSend, onStop, status, disabled }) => {
  const [value, setValue] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = status === 'streaming' || status === 'loading';

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const applyTemplate = (prompt: string) => {
    setValue(prompt);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="input-bar">
      {showTemplates && (
        <div className="input-bar__templates">
          <div className="input-bar__templates-header">
            <span>Prompt Templates</span>
            <button onClick={() => setShowTemplates(false)} aria-label="Close templates">✕</button>
          </div>
          <div className="input-bar__templates-list">
            {PROMPT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`input-bar__template-item input-bar__template-item--${t.category}`}
                onClick={() => applyTemplate(t.prompt)}
              >
                <span className="input-bar__template-category">{t.category}</span>
                <span className="input-bar__template-title">{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-bar__row">
        <button
          className="input-bar__template-btn"
          onClick={() => setShowTemplates((v) => !v)}
          title="Prompt templates"
          aria-label="Open prompt templates"
          disabled={isStreaming}
        >
          ⚡
        </button>
        <textarea
          ref={textareaRef}
          className="input-bar__textarea"
          placeholder={disabled ? 'Configure access to start…' : 'Message ChatGPT 5.6… (Enter to send, Shift+Enter for newline)'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          rows={1}
          aria-label="Chat input"
          autoFocus
        />
        <div className="input-bar__actions">
          {isStreaming ? (
            <button className="input-bar__btn input-bar__btn--stop" onClick={onStop} aria-label="Stop">■</button>
          ) : (
            <button
              className="input-bar__btn input-bar__btn--send"
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              aria-label="Send"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputBar;
