import type { VariantInfo } from '../../types'
import { VARIANTS } from '../../types'
import { VARIANT_COLORS } from '../../config/constants'
import './ModelPicker.css'

interface Props {
  selected: string
  onSelect: (id: string) => void
}

export function ModelPicker({ selected, onSelect }: Props) {
  return (
    <div className="model-picker">
      {VARIANTS.map((v: VariantInfo) => (
        <button
          key={v.id}
          title={`${v.description} | Context: ${v.contextK}K | Speed: ${v.speed}`}
          onClick={() => onSelect(v.id)}
          className={`model-btn ${selected === v.id ? 'model-btn--active' : ''}`}
          style={{ '--accent': VARIANT_COLORS[v.id] } as React.CSSProperties}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}