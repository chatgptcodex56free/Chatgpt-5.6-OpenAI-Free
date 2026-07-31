import type { ChatMessage } from '../../types'
import { VARIANT_COLORS } from '../../config/constants'
import './MessageBubble.css'

interface Props { message: ChatMessage }

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const color  = message.variant ? VARIANT_COLORS[message.variant] : '#888'
  return (
    <div className={`msg msg--${message.role}`}>
      <div className="msg__bubble" style={!isUser ? { '--model-color': color } as React.CSSProperties : undefined}>
        <pre className="msg__text">{message.content}</pre>
        {!isUser && message.tokens && (
          <span className="msg__meta">{message.variant} · {message.tokens} tokens</span>
        )}
      </div>
    </div>
  )
}