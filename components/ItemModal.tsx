'use client';

import React, { useState } from 'react';
import { MenuItem } from '../data/menuData';
import { X, Plus, Minus, Flame, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface CartExtraOption {
  id: string;
  name: string;
  price: number;
}

const EXTRA_OPTIONS: CartExtraOption[] = [
  { id: 'garlic', name: 'علبة ثومية إضافية', price: 12 },
  { id: 'tahini', name: 'علبة طحينة إضافية', price: 12 },
  { id: 'cheddar', name: 'صوص شيدر ذائب', price: 15 },
  { id: 'coleslaw', name: 'سلطة كول سلو صغيرة', price: 30 },
];

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCartWithOptions: (
    item: MenuItem,
    quantity: number,
    spiceLevel: 'normal' | 'spicy',
    selectedExtras: CartExtraOption[],
    specialNotes: string
  ) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  onClose,
  onAddToCartWithOptions,
}) => {
  if (!item) return null;

  return (
    <ItemModalContent
      key={item.id}
      item={item}
      onClose={onClose}
      onAddToCartWithOptions={onAddToCartWithOptions}
    />
  );
};

const ItemModalContent: React.FC<ItemModalProps & { item: MenuItem }> = ({
  item,
  onClose,
  onAddToCartWithOptions,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [spiceLevel, setSpiceLevel] = useState<'normal' | 'spicy'>(item.isSpicy ? 'spicy' : 'normal');
  const [selectedExtras, setSelectedExtras] = useState<CartExtraOption[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const toggleExtra = (extra: CartExtraOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = (item.price + extrasTotal) * quantity;

  const handleConfirm = () => {
    onAddToCartWithOptions(item, quantity, spiceLevel, selectedExtras, specialNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white border-4 border-[#E63946] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#2D2424]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-48 w-full bg-[#FFF8F0]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[#E63946] text-white border-2 border-[#F4A261] hover:bg-[#d62839] flex items-center justify-center transition-colors cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 right-4 left-4 text-white">
            <span className="text-xs text-black font-black bg-[#FEE440] border border-black/20 px-2.5 py-0.5 rounded-md inline-block mb-1">
              خصّص وجبتك على ذوقك
            </span>
            <h3 className="text-xl font-black text-white">{item.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Description & Base Price */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#F4A261]/30">
            <p className="text-sm font-bold text-[#2D2424]/80 leading-relaxed">{item.description}</p>
            <div className="text-left shrink-0">
              <span className="text-xs font-bold text-[#2D2424]/60 block">السعر الأساسي</span>
              <span className="text-xl font-black text-[#E63946]">{item.price} جـ</span>
            </div>
          </div>

          {/* Option 1: Spice Level (التتبيلة) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#2D2424] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#E63946]" />
              <span>اختر التتبيلة:</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSpiceLevel('normal')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                  spiceLevel === 'normal'
                    ? 'bg-[#E63946] border-[#E63946] text-white shadow-sm'
                    : 'bg-[#FFF8F0] border-[#F4A261] text-[#2D2424] hover:border-[#E63946]'
                }`}
              >
                <span>خلطة كلاسيك عادية 🍗</span>
                {spiceLevel === 'normal' && <Check className="w-4 h-4 text-[#FEE440]" />}
              </button>

              <button
                type="button"
                onClick={() => setSpiceLevel('spicy')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                  spiceLevel === 'spicy'
                    ? 'bg-[#E63946] border-[#E63946] text-white shadow-sm'
                    : 'bg-[#FFF8F0] border-[#F4A261] text-[#2D2424] hover:border-[#E63946]'
                }`}
              >
                <span>خلطة حارة سبايسي 🌶️</span>
                {spiceLevel === 'spicy' && <Check className="w-4 h-4 text-[#FEE440]" />}
              </button>
            </div>
          </div>

          {/* Option 2: Extra Sauces & Sides */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#2D2424] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E63946]" />
              <span>إضافات وصوصات إضافية (اختياري):</span>
            </label>
            <div className="space-y-2">
              {EXTRA_OPTIONS.map((extra) => {
                const isChecked = selectedExtras.some((e) => e.id === extra.id);
                return (
                  <div
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#FFF8F0] border-[#E63946] text-[#2D2424]'
                        : 'bg-white border-[#F4A261] text-[#2D2424] hover:border-[#E63946]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border-2 ${
                          isChecked ? 'bg-[#E63946] border-[#E63946] text-white' : 'border-[#F4A261]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-bold">{extra.name}</span>
                    </div>
                    <span className="font-black text-[#E63946]">+{extra.price} جـ</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#2D2424] block">ملاحظات خاصة للوجبة:</label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="مثال: بدون مايونيز، إكسترا كاتشب، زيادة ثومية..."
              className="w-full bg-[#FFF8F0] text-xs font-bold text-[#2D2424] placeholder-gray-500 p-3 rounded-xl border-2 border-[#F4A261] focus:border-[#E63946] outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF8F0] border-t-2 border-[#F4A261] flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border-2 border-[#F4A261]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-[#E63946] text-white flex items-center justify-center font-bold hover:bg-[#d62839] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-black text-[#2D2424]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#E63946] text-white flex items-center justify-center font-bold hover:bg-[#d62839] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>أضف للطلب</span>
            </div>
            <span className="text-base font-black text-[#FEE440]">{totalPrice} جـ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
