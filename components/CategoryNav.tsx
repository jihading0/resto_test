'use client';

import React from 'react';
import { CATEGORIES, Category } from '../data/menuData';
import { Utensils, Flame, Sandwich, Drumstick, Sparkles, Salad } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (catId: Category['id']) => void;
  categoryCounts: Record<string, number>;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-4 h-4" />;
    case 'Sandwich': return <Sandwich className="w-4 h-4" />;
    case 'Drumstick': return <Drumstick className="w-4 h-4" />;
    case 'Sparkles': return <Sparkles className="w-4 h-4" />;
    case 'Salad': return <Salad className="w-4 h-4" />;
    case 'Utensils': default: return <Utensils className="w-4 h-4" />;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#F4A261] py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E63946] text-white shadow-md border-2 border-[#E63946]'
                    : 'bg-white text-[#2D2424] hover:bg-[#FFF8F0] border-2 border-[#F4A261]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#E63946]'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                    isActive
                      ? 'bg-[#FEE440] text-black'
                      : 'bg-[#FFF8F0] text-[#E63946] border border-[#F4A261]/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
