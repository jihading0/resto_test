'use client';

import React, { useState } from 'react';
import { MenuItem, RESTAURANT_INFO, EGYPTIAN_BRANCHES } from '../data/menuData';
import { X, Plus, Minus, Trash2, Send, PhoneCall, Copy, Check, MapPin, User, Phone, Sparkles, AlertCircle } from 'lucide-react';

export interface CartItem {
  id: string; // unique cart item id
  menuItem: MenuItem;
  quantity: number;
  spiceLevel: 'normal' | 'spicy';
  selectedExtras: { id: string; name: string; price: number }[];
  specialNotes: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  selectedBranch: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedBranch,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const extrasTotal = item.selectedExtras.reduce((eSum, e) => eSum + e.price, 0);
    return sum + (item.menuItem.price + extrasTotal) * item.quantity;
  }, 0);

  const deliveryFee = cartItems.length > 0 ? RESTAURANT_INFO.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  // Generate formatted WhatsApp message text
  const generateOrderMessage = () => {
    let text = `*🍔 طلب جديد من مطعم قرمشة البروستد والمشويات* 🍗\n`;
    text += `====================================\n`;
    text += `📍 *الفرع المطلوب:* ${selectedBranch}\n`;
    text += `👤 *اسم العميل:* ${customerName.trim() || 'غير محدد'}\n`;
    text += `📞 *رقم الهاتف:* ${customerPhone.trim() || 'غير محدد'}\n`;
    text += `🏠 *عنوان التوصيل:* ${deliveryAddress.trim() || 'استلام من الفرع / غير محدد'}\n`;
    text += `====================================\n`;
    text += `📋 *تفاصيل الأصناف المحددة:* (${cartItems.length} صنف)\n\n`;

    cartItems.forEach((item, index) => {
      const itemBasePrice = item.menuItem.price;
      const extrasTotal = item.selectedExtras.reduce((s, e) => s + e.price, 0);
      const unitPrice = itemBasePrice + extrasTotal;
      const lineTotal = unitPrice * item.quantity;

      text += `*${index + 1}. ${item.menuItem.name}*\n`;
      text += `   • الكمية: ${item.quantity}\n`;
      text += `   • التتبيلة المختارة: ${item.spiceLevel === 'spicy' ? '🔥 حارة سبايسي' : '🍗 كلاسيك عادية'}\n`;
      
      if (item.selectedExtras.length > 0) {
        text += `   • الإضافات والصوصات: ${item.selectedExtras.map((e) => `${e.name} (+${e.price}جـ)`).join(' ، ')}\n`;
      } else {
        text += `   • الإضافات: بدون إضافات إضافية\n`;
      }
      
      if (item.specialNotes && item.specialNotes.trim() !== '') {
        text += `   • ملاحظات خاصة: 📝 "${item.specialNotes.trim()}"\n`;
      }
      
      text += `   • إجمالي الصنف: ${lineTotal} جـ (${unitPrice} جـ × ${item.quantity})\n\n`;
    });

    text += `====================================\n`;
    text += `💰 *الحساب والتكلفة:* \n`;
    text += `   - المجموع الفرعي للأصناف: ${subtotal} جـ\n`;
    text += `   - خدمة التوصيل (${selectedBranch}): ${deliveryFee} جـ\n`;
    text += `💵 *إجمالي الحساب المطلوب:* *${grandTotal} جـ*\n`;
    text += `====================================\n`;
    text += `يرجى تأكيد استلام الطلب والبدء في التجهيز والتوصيل. شكراً لكم! ✨`;

    return text;
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(generateOrderMessage());
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(generateOrderMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white border-r-4 border-[#E63946] shadow-2xl flex flex-col justify-between text-[#2D2424]">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-5 bg-[#E63946] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEE440] text-black font-black flex items-center justify-center shadow-sm">
                {cartItems.length}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">سلة الطلبات</h2>
                <p className="text-xs text-[#FEE440] font-bold">{selectedBranch}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-white hover:underline px-2.5 py-1 rounded bg-black/20 border border-white/20 font-bold cursor-pointer"
                >
                  تفريغ
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FFF8F0] border-2 border-[#F4A261] mx-auto flex items-center justify-center text-[#E63946]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-[#2D2424]">السلة فارغة حالياً</h3>
                <p className="text-xs text-gray-600 font-bold max-w-xs mx-auto">
                  تصفح قائمة الطعام المتميزة وأضف وجبات الدجاج المقرمش والمشويات لسلتك.
                </p>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemExtrasTotal = item.selectedExtras.reduce((s, e) => s + e.price, 0);
                    const itemTotalPrice = (item.menuItem.price + itemExtrasTotal) * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="bg-[#FFF8F0] rounded-xl border-2 border-[#F4A261] p-3.5 space-y-2.5 transition-all hover:border-[#E63946]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-[#F4A261]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="text-sm font-black text-[#2D2424]">{item.menuItem.name}</h4>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span
                                  className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                                    item.spiceLevel === 'spicy'
                                      ? 'bg-[#E63946] text-white'
                                      : 'bg-[#FEE440] text-black border border-black/10'
                                  }`}
                                >
                                  {item.spiceLevel === 'spicy' ? '🌶️ سبايسي' : '🍗 عادي'}
                                </span>

                                {item.selectedExtras.map((e) => (
                                  <span key={e.id} className="text-[10px] text-[#2D2424] font-bold bg-white px-1.5 py-0.2 rounded border border-[#F4A261]">
                                    +{e.name}
                                  </span>
                                ))}
                              </div>
                              {item.specialNotes && (
                                <p className="text-[11px] text-gray-600 mt-1 italic font-bold">
                                  &quot;{item.specialNotes}&quot;
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-[#E63946] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity and Line Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F4A261]/40">
                          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-[#F4A261]">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded bg-[#E63946] text-white flex items-center justify-center font-bold text-xs hover:bg-[#d62839]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-black text-[#2D2424]">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded bg-[#E63946] text-white flex items-center justify-center font-bold text-xs hover:bg-[#d62839]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-black text-[#E63946]">{itemTotalPrice} جـ</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Details Form */}
                <div className="bg-[#FFF8F0] p-4 rounded-xl border-2 border-[#F4A261] space-y-3 mt-4">
                  <h4 className="text-xs font-black text-[#E63946] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>بيانات التوصيل والعميل:</span>
                  </h4>

                  <div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="اسمك الكريم..."
                      className="w-full bg-white text-xs font-bold text-[#2D2424] placeholder-gray-500 p-2.5 rounded-lg border-2 border-[#F4A261] focus:border-[#E63946] outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="رقم الهاتف للتواصل..."
                      className="w-full bg-white text-xs font-bold text-[#2D2424] placeholder-gray-500 p-2.5 rounded-lg border-2 border-[#F4A261] focus:border-[#E63946] outline-none dir-rtl"
                    />
                  </div>

                  <div>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة والشقة)..."
                      rows={2}
                      className="w-full bg-white text-xs font-bold text-[#2D2424] placeholder-gray-500 p-2.5 rounded-lg border-2 border-[#F4A261] focus:border-[#E63946] outline-none resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#FFF8F0] border-t-2 border-[#F4A261] space-y-3">
              <div className="space-y-1.5 text-xs font-bold text-[#2D2424]">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-black text-[#2D2424]">{subtotal} جـ</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل ({selectedBranch}):</span>
                  <span className="font-black text-[#2D2424]">{deliveryFee} جـ</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#2D2424] pt-2 border-t-2 border-[#F4A261]/30">
                  <span>إجمالي الحساب:</span>
                  <span className="text-[#E63946] text-xl font-black">{grandTotal} جـ</span>
                </div>
              </div>

              {/* Order Submission Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>أرسل الطلب مباشرة عبر الواتساب</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyOrder}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-[#FFF8F0] text-[#2D2424] text-xs font-black border-2 border-[#F4A261] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2A9D8F]" /> : <Copy className="w-3.5 h-3.5 text-[#E63946]" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ ملخص الطلب'}</span>
                  </button>

                  <a
                    href={`tel:${RESTAURANT_INFO.hotline}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-[#FFF8F0] text-[#2D2424] text-xs font-black border-2 border-[#F4A261]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>اتصل ديلفري</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
