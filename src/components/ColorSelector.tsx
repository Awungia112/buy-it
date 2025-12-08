'use client';

import { useState } from 'react';

interface ColorSelectorProps {
  value: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
}

const PREDEFINED_COLORS = [
  { name: 'Black', value: '#000000', hex: '#000000' },
  { name: 'White', value: '#FFFFFF', hex: '#FFFFFF' },
  { name: 'Gray', value: '#808080', hex: '#808080' },
  { name: 'Red', value: '#FF0000', hex: '#FF0000' },
  { name: 'Blue', value: '#0000FF', hex: '#0000FF' },
  { name: 'Green', value: '#008000', hex: '#008000' },
  { name: 'Yellow', value: '#FFFF00', hex: '#FFFF00' },
  { name: 'Purple', value: '#800080', hex: '#800080' },
  { name: 'Pink', value: '#FFC0CB', hex: '#FFC0CB' },
  { name: 'Orange', value: '#FFA500', hex: '#FFA500' },
  { name: 'Brown', value: '#A52A2A', hex: '#A52A2A' },
  { name: 'Navy', value: '#000080', hex: '#000080' },
  { name: 'Teal', value: '#008080', hex: '#008080' },
  { name: 'Maroon', value: '#800000', hex: '#800000' },
  { name: 'Olive', value: '#808000', hex: '#808000' },
  { name: 'Lime', value: '#00FF00', hex: '#00FF00' },
  { name: 'Aqua', value: '#00FFFF', hex: '#00FFFF' },
  { name: 'Fuchsia', value: '#FF00FF', hex: '#FF00FF' },
  { name: 'Silver', value: '#C0C0C0', hex: '#C0C0C0' },
  { name: 'Gold', value: '#FFD700', hex: '#FFD700' },
];

export function ColorSelector({
  value = [],
  onChange,
  maxColors = 10
}: ColorSelectorProps) {
  const [customColor, setCustomColor] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleColorToggle = (colorName: string) => {
    if (value.includes(colorName)) {
      // Remove color
      onChange(value.filter(c => c !== colorName));
    } else {
      // Add color (check limit)
      if (value.length >= maxColors) {
        alert(`Maximum ${maxColors} colors allowed`);
        return;
      }
      onChange([...value, colorName]);
    }
  };

  const handleCustomColorAdd = () => {
    if (!customColor.trim()) return;

    if (value.includes(customColor.trim())) {
      alert('This color is already selected');
      return;
    }

    if (value.length >= maxColors) {
      alert(`Maximum ${maxColors} colors allowed`);
      return;
    }

    onChange([...value, customColor.trim()]);
    setCustomColor('');
    setShowCustomInput(false);
  };

  const removeColor = (colorToRemove: string) => {
    onChange(value.filter(c => c !== colorToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Selected Colors Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Selected Colors:
          </span>
          {value.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-full border"
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color.startsWith('#') ? color : undefined,
                  background: !color.startsWith('#') ? color : undefined
                }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${color} color`}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Predefined Colors Grid */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choose from predefined colors:
        </h4>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {PREDEFINED_COLORS.map((color) => {
            const isSelected = value.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorToggle(color.name)}
                className={`relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isSelected
                    ? 'border-primary shadow-lg scale-110'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`${color.name} color ${isSelected ? 'selected' : 'not selected'}`}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg drop-shadow-lg">
                      check
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="flex items-center gap-2 text-sm text-primary hover:text-red-700 transition-colors"
        >
          <span className="material-symbols-outlined">
            {showCustomInput ? 'expand_less' : 'expand_more'}
          </span>
          Add custom color
        </button>

        {showCustomInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="Enter color name (e.g., 'Sky Blue', '#FF5733')"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomColorAdd()}
            />
            <button
              type="button"
              onClick={handleCustomColorAdd}
              disabled={!customColor.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select up to {maxColors} colors for this product. Colors help customers choose the right variant.
      </p>
    </div>
  );
}