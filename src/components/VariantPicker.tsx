import React from 'react';
import type { GPT56Variant } from '../types';
import { MODEL_VARIANTS } from '../config/models';
import { VARIANT_COLORS } from '../config/constants';

interface VariantPickerProps {
  selected: GPT56Variant;
  onChange: (v: GPT56Variant) => void;
}

const VariantPicker: React.FC<VariantPickerProps> = ({ selected, onChange }) => {
  return (
    <div className="variant-picker" role="tablist" aria-label="ChatGPT 5.6 variant selector">
      {MODEL_VARIANTS.map((v) => {
        const active = v.id === selected;
        const color = VARIANT_COLORS[v.id];
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={active}
            className={`variant-picker__btn ${active ? 'variant-picker__btn--active' : ''}`}
            style={active ? { borderColor: color, color } : undefined}
            onClick={() => onChange(v.id)}
            title={v.description}
          >
            {v.label.replace('ChatGPT 5.6 ', '')}
            {v.badge && <span className="variant-picker__badge">{v.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default VariantPicker;
