'use client';

import React, { useState } from 'react';
import { MenuItem } from '../data/menuData';
import { Plus, Flame, Star, Users, Clock, Flame as SpicyIcon } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onOpenQuickView: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onOpenQuickView,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenQuickView(item)}
      className="group relative flex flex-col bg-white hover:bg-[#FFF8F0] rounded-2xl border-2 border-[#F4A261] hover:border-[#E63946] transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Food Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#FFF8F0]">
        <img
          src={imageError ? 'https://picsum.photos/seed/chicken/800/600' : item.image}
          alt={item.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Badges on Top */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          {item.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEE440] text-black text-[11px] font-black shadow-sm border border-black/20">
              <Star className="w-3 h-3 fill-black text-black" />
              <span>الأكثر مبيعاً</span>
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E63946] text-white text-[11px] font-bold shadow-sm">
              <SpicyIcon className="w-3 h-3 text-[#FEE440]" />
              <span>خلطة حارة</span>
            </span>
          )}
          {item.isFamily && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2A9D8F] text-white text-[11px] font-bold shadow-sm">
              <Users className="w-3 h-3 text-white" />
              <span>حجم عائلي</span>
            </span>
          )}
        </div>

        {/* Prep time or Calories indicator */}
        {item.prepTime && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-[#2D2424] font-bold bg-white/90 backdrop-blur px-2 py-0.5 rounded-md border border-[#F4A261]">
            <Clock className="w-3 h-3 text-[#E63946]" />
            <span>{item.prepTime}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#2D2424] group-hover:text-[#E63946] transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-[#2D2424]/75 font-bold leading-relaxed mt-1.5 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Action */}
        <div className="pt-3 border-t-2 border-[#F4A261]/30 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#2D2424]/60 block font-extrabold">السعر:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#E63946]">{item.price}</span>
              <span className="text-xs font-black text-[#2D2424]">جـ</span>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isAdded
                ? 'bg-[#2A9D8F] text-white'
                : 'bg-[#E63946] hover:bg-[#d62839] text-white shadow-sm'
            }`}
          >
            <Plus className={`w-4 h-4 ${isAdded ? 'rotate-45 transition-transform' : ''}`} />
            <span>{isAdded ? 'تمت الإضافة ✓' : 'أضف للسلة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
