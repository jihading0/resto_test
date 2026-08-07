'use client';

import React from 'react';
import { ShoppingBag, PhoneCall, MapPin, Search, Send } from 'lucide-react';
import { RESTAURANT_INFO, EGYPTIAN_BRANCHES } from '../data/menuData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  selectedBranch,
  onSelectBranch,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-[#E63946] transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E63946] text-white flex items-center justify-center shadow-md border-2 border-[#F4A261] transform -rotate-2">
            <span className="text-2xl font-black select-none">ق</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#E63946] tracking-wide">
                قرمشـة <span className="text-[#F4A261] font-bold text-base sm:text-lg">بروستد &amp; مشويات</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FEE440] text-black border border-black/10 hidden sm:inline-block">
                الطعم المصري الأصيل
              </span>
            </div>
            <p className="text-xs text-[#2D2424]/70 font-bold">
              توصيل سريع • الخط الساخن: <span className="text-[#E63946] font-black dir-ltr inline-block">{RESTAURANT_INFO.hotline}</span>
            </p>
          </div>
        </div>

        {/* Search bar for desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4A261]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن وجبة، ساندوتش، صوص أو صنف..."
            className="w-full bg-[#FFF8F0] text-sm text-[#2D2424] placeholder-gray-500 pr-10 pl-4 py-2 rounded-xl border-2 border-[#F4A261] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 transition-all outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-[#E63946]"
            >
              إلغاء
            </button>
          )}
        </div>

        {/* Actions & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Branch selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8F0] border-2 border-[#F4A261]">
            <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
            <select
              value={selectedBranch}
              onChange={(e) => onSelectBranch(e.target.value)}
              className="bg-transparent text-xs text-[#2D2424] font-bold focus:outline-none cursor-pointer"
            >
              {EGYPTIAN_BRANCHES.map((b) => (
                <option key={b.name} value={b.name} className="bg-white text-[#2D2424]">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hotline Call button */}
          <a
            href={`tel:${RESTAURANT_INFO.hotline}`}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-xs font-bold text-white transition-colors shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#FEE440] animate-pulse" />
            <span>اتصل بالمطعم</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent('مرحباً مطعم قرمشة، أود الطلب والاستفسار عبر الواتساب 🍗')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A9D8F] hover:bg-[#23857a] text-xs font-black text-white transition-colors shadow-sm"
            title="تواصل معنا عبر واتساب"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden md:inline">طلب واتساب</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-bold text-sm transition-all shadow-md shadow-red-500/20 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white stroke-[2.5]" />
            <span className="hidden sm:inline">سلة الطلبات</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FEE440] text-black text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
