'use client';

import { ProductVariant } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants?: ProductVariant[];
  selectedVariant: { [key: string]: string };
  onVariantChange: (type: string, value: string) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.type}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {variant.type}
            {selectedVariant[variant.type] && (
              <span className="text-gray-900 ml-1">: {selectedVariant[variant.type]}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => onVariantChange(variant.type, option)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                  selectedVariant[variant.type] === option
                    ? 'border-gold-600 bg-gold-50 text-gold-900'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
