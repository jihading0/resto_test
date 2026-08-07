'use client';

import React from 'react';
import { EGYPTIAN_BRANCHES, RESTAURANT_INFO } from '../data/menuData';
import { X, MapPin, PhoneCall, Clock, CheckCircle2 } from 'lucide-react';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  selectedBranch,
  onSelectBranch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white border-4 border-[#E63946] rounded-2xl p-6 space-y-5 shadow-2xl text-[#2D2424]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#F4A261]/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E63946]" />
            <h3 className="text-lg font-black text-[#E63946]">فروع مطعم قرمشة في مصر</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#E63946] text-white hover:bg-[#d62839] flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {EGYPTIAN_BRANCHES.map((b) => {
            const isSelected = selectedBranch === b.name;
            return (
              <div
                key={b.name}
                onClick={() => {
                  onSelectBranch(b.name);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FFF8F0] border-[#E63946] text-[#2D2424]'
                    : 'bg-white border-[#F4A261] text-[#2D2424] hover:border-[#E63946]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-[#E63946]">{b.name}</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-black text-black bg-[#FEE440] px-2 py-0.5 rounded border border-black/10">
                      <CheckCircle2 className="w-3 h-3 text-[#2A9D8F]" /> الفرع المختار
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs font-bold">{b.address}</p>
                <div className="mt-2 text-[11px] text-gray-500 font-extrabold flex items-center gap-2">
                  <PhoneCall className="w-3 h-3 text-[#E63946]" />
                  <span>مباشر: {b.phone}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center border-t-2 border-[#F4A261]/30">
          <p className="text-xs font-bold text-gray-600">
            خدمة التوصيل تغطي جميع المناطق المحيطة بكل فرع بمدة متوسطة 30-45 دقيقة.
          </p>
        </div>
      </div>
    </div>
  );
};
