import { useRef } from 'react'
import './ChatInput.css'

interface Props {
  value: string; onChange: (v: string) => void; onSubmit: () => void; disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!disabled && value.trim()) onSubmit() }
  }
  return (
    <div className="chat-input">
      <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey}
        disabled={disabled} rows={1} placeholder="Message ChatGPT 5.6…" className="chat-input__area" />
      <button onClick={onSubmit} disabled={disabled || !value.trim()} className="btn btn--primary">Send</button>
    </div>
  )
}