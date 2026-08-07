'use client';

import React from 'react';
import { RESTAURANT_INFO, EGYPTIAN_BRANCHES } from '../data/menuData';
import { PhoneCall, MapPin, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenBranches: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBranches }) => {
  return (
    <footer className="bg-[#0A0A0A] border-t-4 border-[#E63946] text-gray-300 text-xs mt-16">
      {/* Top Delivery Action Strip */}
      <div className="bg-[#1A1A1A] border-b border-[#333333] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E63946] text-white border-2 border-[#F4A261] flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">جاهزين نستقبل طلبك 24/7</h3>
              <p className="text-xs text-gray-400 font-bold">اتصل الآن على الخط الساخن أو اطلب أونلاين عبر الواتساب</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${RESTAURANT_INFO.hotline}`}
              className="px-5 py-3 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-sm transition-all shadow-md"
            >
              الخط الساخن: {RESTAURANT_INFO.hotline}
            </a>
            <button
              onClick={onOpenBranches}
              className="px-4 py-3 rounded-xl bg-white hover:bg-[#FFF8F0] text-[#2D2424] font-black text-xs border-2 border-[#F4A261] cursor-pointer"
            >
              فروعنا في القاهرة والإسكندرية
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E63946] text-white font-black text-lg flex items-center justify-center border border-[#F4A261]">
              ق
            </div>
            <span className="text-lg font-black text-white">قرمشة البروستد والمشويات</span>
          </div>
          <p className="text-xs text-gray-400 font-bold leading-relaxed">
            مطعم مصري رائد متألق في وجبات الدجاج المقلي، البروستد المقرمش، والمشويات على الفحم بتتبيلة بلدي سرية طازجة يومياً.
          </p>
          <div className="pt-2 text-[11px] text-[#FEE440] font-black">
            جميع اللحوم والدواجن بلدي ومذبوحة حلال 100%
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-[#FEE440] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#F4A261]" />
            <span>مواعيد العمل والتوصيل</span>
          </h4>
          <p className="text-gray-200 font-bold">{RESTAURANT_INFO.workingHours}</p>
          <p className="text-gray-400 text-[11px] font-bold">متاح خدمة التوصيل السريع لجميع المناطق</p>
          <p className="text-gray-400 text-[11px] font-bold">متوسط زمن التجهيز: {RESTAURANT_INFO.deliveryTime}</p>
        </div>

        {/* Branches */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-[#FEE440] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#F4A261]" />
            <span>فروعنا الرئيسية</span>
          </h4>
          <ul className="space-y-1.5 text-gray-300 font-bold">
            {EGYPTIAN_BRANCHES.map((b) => (
              <li key={b.name} className="flex items-center justify-between text-xs">
                <span>{b.name}</span>
                <span className="text-[10px] text-gray-400">{b.address.split('،')[0]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guarantee */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-[#FEE440] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F4A261]" />
            <span>ضمان الجودة المصرية</span>
          </h4>
          <p className="text-gray-400 leading-relaxed text-[11px] font-bold">
            نضمن لك وصول الوجبة ساخنة ومقرمشة بنفس الجودة، وفي حالة وجود أي ملاحظة يتولى فريق خدمة العملاء معالجتها فوراً.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-white font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#FEE440]" />
            <span>صُنع بحب في مصر 🇪🇬</span>
          </div>
        </div>

      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-[#222222] py-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 font-bold">
          <p>© {new Date().getFullYear()} مطعم قرمشة - جميع الحقوق محفوظة. منيو مصري أصيل.</p>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-gray-400 hover:text-[#FEE440] transition-colors underline">
              لوحة إدارة المنيو
            </a>
            <span>تصميم وتطوير برمجيات المنيو التفاعلي بواسطة Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
