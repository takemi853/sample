"use client";

import { availableTags } from "@/data/pois";

interface InterestChipsProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

/**
 * 興味タグ選択チップコンポーネント
 * Material Design準拠: 角丸チップ、十分なタップ領域（48px推奨）、明確な選択状態
 */
export default function InterestChips({
  selected,
  onChange,
}: InterestChipsProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="興味カテゴリ選択">
      {availableTags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            aria-pressed={isSelected}
            aria-label={`${tag}を${isSelected ? "選択解除" : "選択"}`}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              min-h-[40px] hover:scale-105 active:scale-95
              ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }
            `}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
