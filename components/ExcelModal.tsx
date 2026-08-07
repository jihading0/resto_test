'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, Upload, RefreshCw, X, CheckCircle, AlertCircle, Link as LinkIcon, FileCheck } from 'lucide-react';
import { MenuItem, MENU_ITEMS } from '../data/menuData';
import { exportMenuToExcel, parseExcelToMenuItems, fetchGoogleSheetMenu } from '../lib/excelMenu';

interface ExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: MenuItem[];
  onUpdateMenuItems: (newItems: MenuItem[]) => void;
  onResetMenu: () => void;
}

export const ExcelModal: React.FC<ExcelModalProps> = ({
  isOpen,
  onClose,
  currentItems,
  onUpdateMenuItems,
  onResetMenu,
}) => {
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Handle Excel/CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const parsedItems = parseExcelToMenuItems(buffer);
        
        if (parsedItems.length === 0) {
          throw new Error('الملف فارغ أو لا يحتوي على صفوف بيانات صالحة');
        }

        onUpdateMenuItems(parsedItems);
        setStatusMessage({
          type: 'success',
          text: `تمت تحديث المنيو بنجاح! تم استيراد ${parsedItems.length} صنف من ملف أكسل.`,
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err.message || 'حدث خطأ أثناء قراءة ملف الأكسل. يرجى التأكد من التنسيق الصحيح.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setStatusMessage({ type: 'error', text: 'فشل في قراءة الملف المحدد' });
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Sync with published Google Sheets CSV
  const handleSyncGoogleSheet = async () => {
    if (!googleSheetUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال رابط Google Sheets المنشور كـ CSV' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const parsedItems = await fetchGoogleSheetMenu(googleSheetUrl.trim());
      if (parsedItems.length === 0) {
        throw new Error('الجدول المنشور لا يحتوي على أي بيانات صالحة.');
      }
      onUpdateMenuItems(parsedItems);
      setStatusMessage({
        type: 'success',
        text: `تم التزامن الحقيقي مع Google Sheets بنجاح! تم تحديث ${parsedItems.length} صنف.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'تعذر الربط بـ Google Sheets. تأكد من نشر المستند (Publish to Web) كملف CSV.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in dir-rtl">
      <div className="relative w-full max-w-2xl bg-white border-4 border-[#E63946] rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-[#2D2424]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#F4A261]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2A9D8F] text-white flex items-center justify-center font-bold shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#2D2424]">ربط وتحديث المنيو بملف أكسل / Google Sheets</h3>
              <p className="text-xs text-gray-600 font-bold">حكّم كامل في جميع وجبات وأسعار المنيو من ملف أكسل بدون كود</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#E63946] text-white flex items-center justify-center font-black hover:bg-[#d62839] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border-2 flex items-center gap-3 text-xs font-black ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : 'bg-rose-50 border-rose-500 text-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Section 1: Download Current Menu as Excel */}
        <div className="bg-[#FFF8F0] p-4 rounded-xl border-2 border-[#F4A261] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#E63946]" />
              <h4 className="text-sm font-black text-[#2D2424]">1. تحميل نموذج أكسل جاهز (تصدير المنيو الحالي)</h4>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEE440] text-black">
              {currentItems.length} صنف متاح
            </span>
          </div>
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            قم بتحميل ملف الأكسل الحالي لتعديل الأسعار والوجبات والصور أو إضافة أصناف جديدة بنفس الأعمدة:
          </p>
          <button
            onClick={() => exportMenuToExcel(currentItems)}
            className="w-full py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل ملف الأكسل الحالي (.XLSX)</span>
          </button>
        </div>

        {/* Section 2: Upload Excel File */}
        <div className="bg-[#FFF8F0] p-4 rounded-xl border-2 border-[#F4A261] space-y-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#2A9D8F]" />
            <h4 className="text-sm font-black text-[#2D2424]">2. رفع ملف أكسل جديد لتحديث المنيو فوراً</h4>
          </div>
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            اختر ملف الأكسل (.xlsx / .csv) المعدل من جهازك وسيتم تحديث الأصناف مباشرة على الموقع:
          </p>
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#2A9D8F] bg-white rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
            <FileCheck className="w-7 h-7 text-[#2A9D8F] mb-1" />
            <span className="text-xs font-black text-[#2A9D8F]">اضغط هنا لاختيار ملف الأكسل (.xlsx أو .csv)</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>

        {/* Section 3: Live Sync with Google Sheets */}
        <div className="bg-[#FFF8F0] p-4 rounded-xl border-2 border-[#F4A261] space-y-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#E63946]" />
            <h4 className="text-sm font-black text-[#2D2424]">3. التزامن الحي المباشر عبر رابط Google Sheets</h4>
          </div>
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            إذا قمت برفع ملف الأكسل على Google Sheets ونشره أونلاين (File -&gt; Share -&gt; Publish to Web كـ CSV)، ضع الرابط هنا:
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              className="flex-1 bg-white text-xs font-bold text-[#2D2424] placeholder-gray-400 p-2.5 rounded-lg border-2 border-[#F4A261] outline-none focus:border-[#E63946]"
            />
            <button
              onClick={handleSyncGoogleSheet}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>تزامن الآن</span>
            </button>
          </div>
        </div>

        {/* Reset Action */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-[#F4A261]/30">
          <button
            onClick={() => {
              onResetMenu();
              setStatusMessage({ type: 'success', text: 'تم إعادة ضبط المنيو إلى القائمة الأصلية للمطعم' });
            }}
            className="text-xs text-[#E63946] hover:underline font-black cursor-pointer"
          >
            إعادة المنيو الافتراضي الأصلي
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
