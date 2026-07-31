import { useState, useRef, useEffect } from 'react'
import { useChat }      from './hooks/useChat'
import { ModelPicker }  from './components/ModelPicker/ModelPicker'
import { MessageBubble } from './components/MessageBubble/MessageBubble'
import { ChatInput }    from './components/ChatInput/ChatInput'
import type { GPTVariant } from './types'
import './styles/global.css'

export default function App() {
  const [variant, setVariant]  = useState<GPTVariant>('terra')
  const [input,   setInput]    = useState('')
  const { messages, loading, send, clear } = useChat(variant)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const submit = () => {
    if (!input.trim() || loading) return
    send(input.trim())
    setInput('')
  }

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__title">ChatGPT 5.6 — Free Desktop</span>
        <ModelPicker selected={variant} onSelect={id => setVariant(id as GPTVariant)} />
        {messages.length > 0 && <button onClick={clear} className="btn btn--ghost" style={{ marginLeft: 'auto', fontSize: 12, padding: '4px 12px' }}>Clear</button>}
      </header>

      <main className="app__messages">
        {messages.length === 0 && (
          <p className="app__empty">Select Sol for coding, Terra for writing, Luna for quick answers.</p>
        )}
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        {loading && <p className="app__typing">ChatGPT 5.6 {variant} is thinking…</p>}
        <div ref={endRef} />
      </main>

      <footer className="app__input">
        <ChatInput value={input} onChange={setInput} onSubmit={submit} disabled={loading} />
      </footer>
    </div>
  )
}