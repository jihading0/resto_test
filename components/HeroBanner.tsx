'use client';

import React from 'react';
import { Search, Flame, Sparkles, ShieldCheck, Clock, Award, Star } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilterTag: string;
  onSelectFilterTag: (tag: string) => void;
  totalItemsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  activeFilterTag,
  onSelectFilterTag,
  totalItemsCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F0] border-b-4 border-[#F4A261] py-8 md:py-14">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F4A261]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Search */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E63946] text-white text-xs font-bold shadow-sm border border-[#F4A261]">
              <Sparkles className="w-3.5 h-3.5 text-[#FEE440]" />
              <span>أقوى خلطة بروستد ومقرمشات في مصر</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#2D2424] leading-tight tracking-tight">
              طعم القرمشة <span className="text-[#E63946] underline decoration-[#F4A261] underline-offset-8">المصرية الأصيلة</span> على أصولها 🍗
            </h1>

            <p className="text-[#2D2424]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-bold">
              دجاج مقلي ذهبي طازج يومياً ومكفول، ومشيّات طرية متبلة بخلطتنا الشرقية الخاصة على الفحم مباشرة. 
              وجبات عائلية، ساندوتشات زِنجر، وأطباق كوردون بلو بأسعار مظبوطة.
            </p>

            {/* Mobile Search box */}
            <div className="block md:hidden relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4A261]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن وجبة، ساندوتش، أو صوص..."
                className="w-full bg-white text-sm text-[#2D2424] placeholder-gray-500 pr-10 pl-4 py-3 rounded-xl border-2 border-[#F4A261] focus:border-[#E63946] outline-none font-bold"
              />
            </div>

            {/* Quick Filter Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#2D2424] font-black ml-2">تصفية سريعة:</span>
              {[
                { id: 'all', label: `الكل (${totalItemsCount})` },
                { id: 'popular', label: '⭐ الأكثر طلباً' },
                { id: 'spicy', label: '🌶️ خلطة حارة' },
                { id: 'family', label: '👨‍👩‍👧‍👦 وجبات عائلية' },
              ].map((chip) => {
                const isActive = activeFilterTag === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => onSelectFilterTag(chip.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E63946] text-white shadow-md border-2 border-[#E63946]'
                        : 'bg-white text-[#2D2424] hover:bg-[#FFF8F0] border-2 border-[#F4A261]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Key Quality Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-[#F4A261]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E63946] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#F4A261]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2D2424]">توصيل 30 دقيقة</h4>
                  <p className="text-[11px] font-bold text-gray-600">ساخن ومقرمش</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2A9D8F] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#2A9D8F]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2D2424]">دجاج طازج 100%</h4>
                  <p className="text-[11px] font-bold text-gray-600">مذبوح حلال</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E76F51] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#E76F51]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2D2424]">خلطة قرمشة</h4>
                  <p className="text-[11px] font-bold text-gray-600">بهارات سرية</p>
                </div>
              </div>
            </div>

          </div>

          {/* Banner Hero Visual Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white border-4 border-[#E63946] p-4 shadow-xl overflow-hidden group">
              <div className="absolute top-6 left-6 z-20 px-3 py-1 rounded-full bg-[#FEE440] text-black font-black text-xs shadow-md border border-black/20 transform -rotate-3">
                خصم 15% على العائلية
              </div>

              {/* Featured Banner Item */}
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden mb-3 border-2 border-[#F4A261]">
                <img
                  src="https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop"
                  alt="دلاء بروستد 10 قطع"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <span className="text-xs font-extrabold text-[#FEE440] uppercase tracking-wider">الأكثر مبيعاً في القائمة</span>
                  <h3 className="text-lg font-black text-white">دلاء بروستد عائلي (10 قطع)</h3>
                  <p className="text-xs text-gray-200 line-clamp-1 mt-0.5">مع كول سلو وبطاطس ولتر مياه غازية مجاناً</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[#FEE440] font-black text-xl">480 جـ</span>
                    <span className="text-[11px] font-extrabold text-black bg-[#FEE440] px-2.5 py-1 rounded-lg border border-black/10">
                      يكفي 4 - 5 أفراد
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Phone Quick Strip */}
              <div className="flex items-center justify-between bg-[#FEE440] rounded-xl p-3 border-2 border-black text-black">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-black fill-black" />
                  <span className="text-xs font-extrabold">تقييم العملاء: 4.9/5 (أكثر من 10,000 طلب)</span>
                </div>
                <span className="text-sm font-black dir-ltr text-[#E63946] bg-white px-2 py-0.5 rounded border border-black">{RESTAURANT_INFO.hotline}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
