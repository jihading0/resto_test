'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload,
  ShieldCheck,
  Database,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Key,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Sparkles,
  Flame,
  Save,
  ImageIcon,
} from 'lucide-react';
import { MenuItem, MENU_ITEMS, CATEGORIES } from '../../data/menuData';
import { exportMenuToExcel, parseExcelToMenuItems, fetchGoogleSheetMenu, ensureUniqueMenuItems } from '../../lib/excelMenu';
import Link from 'next/link';

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Change password modal state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassStatus, setChangePassStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Menu states
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => ensureUniqueMenuItems(MENU_ITEMS));

  // Table Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Item Modal (Add / Edit) State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    price: number;
    category: 'broasted' | 'sandwiches' | 'grilled' | 'special' | 'sides';
    description: string;
    image: string;
    isSpicy: boolean;
    isPopular: boolean;
    isFamily: boolean;
    prepTime: string;
  }>({
    id: '',
    name: '',
    price: 100,
    category: 'broasted',
    description: '',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800',
    isSpicy: false,
    isPopular: false,
    isFamily: false,
    prepTime: '15-20 دقيقة',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync client-side stored session and data after initial mount
  useEffect(() => {
    if (sessionStorage.getItem('qarmasha_admin_authenticated') === 'true') {
      setTimeout(() => setIsAuthenticated(true), 0);
    }

    const savedUrl = localStorage.getItem('qarmasha_google_sheet_url');
    if (savedUrl) {
      setTimeout(() => setGoogleSheetUrl(savedUrl), 0);
    }

    try {
      const savedMenu = localStorage.getItem('qarmasha_excel_menu');
      if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => setMenuItems(ensureUniqueMenuItems(parsed)), 0);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  // Get current stored password or default
  const getStoredPassword = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qarmasha_admin_password') || 'qarmasha2026';
    }
    return 'qarmasha2026';
  };

  // Helper to persist updated menu
  const saveMenuItems = (updatedMenu: MenuItem[], successText: string) => {
    const uniqueMenu = ensureUniqueMenuItems(updatedMenu);
    setMenuItems(uniqueMenu);
    localStorage.setItem('qarmasha_excel_menu', JSON.stringify(uniqueMenu));
    setStatusMessage({ type: 'success', text: successText });
  };

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (failedAttempts >= 5) {
      setLoginError('تم حظر المحاولات المؤقت بسبب ادخال كلمة مرور خاطئة عدة مرات. يرجى المحاولة لاحقاً.');
      return;
    }

    const currentPass = getStoredPassword();

    if (passwordInput.trim() === currentPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('qarmasha_admin_authenticated', 'true');
      setPasswordInput('');
      setFailedAttempts(0);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      setLoginError(`كلمة المرور غير صحيحة! المتبقي: ${5 - attempts} محاولات.`);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('qarmasha_admin_authenticated');
  };

  // Handle Password Change
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassStatus(null);

    if (newPassword.length < 6) {
      setChangePassStatus({ type: 'error', text: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePassStatus({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' });
      return;
    }

    localStorage.setItem('qarmasha_admin_password', newPassword);
    setChangePassStatus({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح! احفظ كلمة المرور الجديدة.' });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsChangingPass(false);
      setChangePassStatus(null);
    }, 2000);
  };

  // Save Google Sheet CSV URL and sync live data
  const handleSaveAndSyncSheet = async () => {
    if (!googleSheetUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال رابط CSV المنشور من Google Sheets.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const liveItems = await fetchGoogleSheetMenu(googleSheetUrl.trim());
      if (!liveItems || liveItems.length === 0) {
        throw new Error('لم يتم العثور على أية وجبات داخل ملف Google Sheets');
      }

      setMenuItems(liveItems);
      localStorage.setItem('qarmasha_google_sheet_url', googleSheetUrl.trim());
      localStorage.setItem('qarmasha_excel_menu', JSON.stringify(liveItems));

      setStatusMessage({
        type: 'success',
        text: `تم التزامن وتحديث المنيو بنجاح! تم استيراد ${liveItems.length} وجبة مباشرة من Google Sheets. الآن يرى زوار الموقع الأسعار والوجبات الجديدة فوراً.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'فشل الاتصال بـ Google Sheets. يرجى التأكد من اختيار File -> Share -> Publish to Web واختيار التنسيق Comma-separated values (.csv).',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload local Excel file
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
          throw new Error('الملف المرفوع فارغ أو تنسيقه غير صحيح');
        }

        saveMenuItems(parsedItems, `تم تحديث المنيو من ملف الأكسل المحلي! عدد الوجبات: ${parsedItems.length}`);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err.message || 'خطأ في قراءة ملف الأكسل' });
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('هل أنت تأكد من إرجاع المنيو للوضع الافتراضي؟')) {
      setMenuItems(MENU_ITEMS);
      localStorage.removeItem('qarmasha_excel_menu');
      localStorage.removeItem('qarmasha_google_sheet_url');
      setGoogleSheetUrl('');
      setStatusMessage({ type: 'success', text: 'تمت إعادة ضبط المنيو إلى القائمة الأصلية والمحلية للمطعم.' });
    }
  };

  // Open modal for Adding New Item
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      id: `item_${Date.now()}`,
      name: '',
      price: 120,
      category: 'broasted',
      description: '',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800',
      isSpicy: false,
      isPopular: false,
      isFamily: false,
      prepTime: '15-20 دقيقة',
    });
    setIsItemModalOpen(true);
  };

  // Open modal for Editing Item
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      image: item.image,
      isSpicy: !!item.isSpicy,
      isPopular: !!item.isPopular,
      isFamily: !!item.isFamily,
      prepTime: item.prepTime || '15-20 دقيقة',
    });
    setIsItemModalOpen(true);
  };

  // Save Add/Edit Item
  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('يرجى كتابة اسم الوجبة');
      return;
    }

    let updatedList: MenuItem[];

    if (editingItem) {
      // Update existing item
      updatedList = menuItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name.trim(),
              price: Number(formData.price),
              category: formData.category,
              description: formData.description.trim(),
              image: formData.image.trim() || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800',
              isSpicy: formData.isSpicy,
              isPopular: formData.isPopular,
              isFamily: formData.isFamily,
              prepTime: formData.prepTime,
            }
          : item
      );
      saveMenuItems(updatedList, `تم تحديث الوجبة "${formData.name}" بنجاح!`);
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: formData.id || `item_${Date.now()}`,
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800',
        isSpicy: formData.isSpicy,
        isPopular: formData.isPopular,
        isFamily: formData.isFamily,
        prepTime: formData.prepTime,
      };
      updatedList = [newItem, ...menuItems];
      saveMenuItems(updatedList, `تمت إضافة الوجبة الجديدة "${formData.name}" للمنيو بنجاح!`);
    }

    setIsItemModalOpen(false);
  };

  // Delete Item
  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`هل أنت تأكد من حذف الوجبة "${name}" من المنيو؟`)) {
      const updatedList = menuItems.filter((item) => item.id !== id);
      saveMenuItems(updatedList, `تم حذف الوجبة "${name}" بنجاح.`);
    }
  };

  // Quick Toggle Flag (Spicy, Popular, Family)
  const handleToggleFlag = (id: string, flagKey: 'isSpicy' | 'isPopular' | 'isFamily') => {
    const updatedList = menuItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [flagKey]: !item[flagKey],
        };
      }
      return item;
    });
    saveMenuItems(updatedList, 'تم تحديث خيارات الوجبة بنجاح.');
  };

  // Filtered Menu Items for Admin Table
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // UNAUTHENTICATED LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4 font-cairo dir-rtl">
        <div className="w-full max-w-md bg-white border-4 border-[#E63946] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E63946] text-white flex items-center justify-center font-black shadow-lg border-2 border-[#F4A261]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[#E63946]">دخول مدير المطعم</h1>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              منطقة محمية لاستحواذ وإدارة قاعدة بيانات منيو مطعم قرمشة
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-900 text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-[#2D2424] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#E63946]" />
                <span>كلمة مرور الإدارة</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة المرور..."
                  required
                  className="w-full bg-[#FFF8F0] text-sm font-bold text-[#2D2424] placeholder-gray-400 p-3.5 pl-11 rounded-xl border-2 border-[#F4A261] outline-none focus:border-[#E63946] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={failedAttempts >= 5}
              className="w-full py-3.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>تسجيل الدخول للوحة التحكم</span>
            </button>
          </form>

          {/* Hint Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
            <span>كلمة المرور الافتراضية: <code className="bg-amber-100 text-black px-1.5 py-0.5 rounded font-mono">qarmasha2026</code></span>
            <Link href="/" className="text-[#2A9D8F] hover:underline font-black">
              العودة للموقع
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2D2424] font-cairo dir-rtl p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border-4 border-[#E63946] shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E63946] text-white flex items-center justify-center font-black shadow-md border-2 border-[#F4A261]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#E63946]">لوحة إدارة المنيو والربط المباشر</h1>
              <p className="text-xs text-gray-600 font-bold">إدارة وحذف وإضافة أصناف المنيو لمطعم قرمشة</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsChangingPass(!isChangingPass)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>تغيير كلمة المرور</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs transition-colors"
            >
              <span>الموقع المباشر</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Change Password Modal / Card */}
        {isChangingPass && (
          <div className="bg-white p-5 rounded-2xl border-4 border-[#F4A261] shadow-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-black text-[#E63946] flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>تغيير كلمة مرور لوحة التحكم</span>
              </h3>
              <button
                onClick={() => setIsChangingPass(false)}
                className="text-xs text-gray-400 hover:text-black font-bold"
              >
                إلغاء
              </button>
            </div>

            {changePassStatus && (
              <div
                className={`p-3 rounded-xl border text-xs font-black ${
                  changePassStatus.type === 'success'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-rose-50 border-rose-500 text-rose-900'
                }`}
              >
                {changePassStatus.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="كلمة المرور الجديدة (6 أحرف فأكثر)..."
                required
                className="bg-[#FFF8F0] p-3 text-xs font-bold rounded-xl border-2 border-gray-300 outline-none focus:border-[#E63946]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور الجديدة..."
                required
                className="bg-[#FFF8F0] p-3 text-xs font-bold rounded-xl border-2 border-gray-300 outline-none focus:border-[#E63946]"
              />
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs cursor-pointer"
                >
                  حفظ كلمة المرور الجديدة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border-2 flex items-center gap-3 text-sm font-black transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : 'bg-rose-50 border-rose-500 text-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* MAIN CRUD MENU MANAGEMENT CARD */}
        <div className="bg-white p-6 rounded-3xl border-4 border-[#F4A261] shadow-lg space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-gray-100">
            <div>
              <h2 className="text-xl font-black text-[#2D2424] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E63946]" />
                <span>إدارة الأصناف والوجبات المباشرة ({menuItems.length} صنف)</span>
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-1">
                يمكنك إضافة وجبات جديدة، تغيير الأسعار والأسماء والصور أو حذف وجبات مباشرة.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-sm shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة وجبة جديدة للمنيو</span>
            </button>
          </div>

          {/* Search and Category Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن وجبة بالاسم أو الوصف أو المعرف..."
                className="w-full bg-[#FFF8F0] text-xs font-bold text-[#2D2424] placeholder-gray-400 p-3 pr-10 rounded-xl border-2 border-gray-200 outline-none focus:border-[#E63946]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-[#FFF8F0] text-xs font-black text-[#2D2424] p-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#E63946]"
            >
              <option value="all">جميع الأقسام ({menuItems.length})</option>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = menuItems.filter((i) => i.category === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto border-2 border-amber-100 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FFF8F0] text-[#2D2424] font-black sticky top-0 z-10 border-b-2 border-amber-200">
                <tr>
                  <th className="p-3">الصورة</th>
                  <th className="p-3">اسم الوجبة</th>
                  <th className="p-3">السعر</th>
                  <th className="p-3">القسم</th>
                  <th className="p-3">المميزات</th>
                  <th className="p-3 text-center">الإجراءات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                {filteredMenuItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400 font-bold">
                      لا توجد وجبات مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredMenuItems.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className="hover:bg-amber-50/60 transition-colors">
                      <td className="p-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative shrink-0">
                          {/* eslint-disable-next-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-black text-[#2D2424] text-sm">{item.name}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-xs">{item.description}</div>
                      </td>

                      <td className="p-3 font-black text-[#E63946] text-sm whitespace-nowrap">
                        {item.price} جـ
                      </td>

                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-black">
                          {CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleToggleFlag(item.id, 'isSpicy')}
                            title="تبديل خيار سبايسي"
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                              item.isSpicy
                                ? 'bg-rose-100 border-rose-300 text-rose-800'
                                : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                            }`}
                          >
                            🌶️ سبايسي
                          </button>

                          <button
                            onClick={() => handleToggleFlag(item.id, 'isPopular')}
                            title="تبديل خيار الأشهى / الأكثر طلباً"
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                              item.isPopular
                                ? 'bg-amber-100 border-amber-300 text-amber-900'
                                : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                            }`}
                          >
                            🔥 مميزة
                          </button>

                          <button
                            onClick={() => handleToggleFlag(item.id, 'isFamily')}
                            title="تبديل خيار عائلية"
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                              item.isFamily
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                            }`}
                          >
                            👨‍👩‍👧‍👦 عائلية
                          </button>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            title="تعديل الوجبة"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="حذف الوجبة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Sheet Live Connection Section */}
        <div className="bg-white p-6 rounded-2xl border-4 border-[#2A9D8F] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-[#2A9D8F]" />
            <div>
              <h3 className="text-base font-black text-[#2D2424]">رابط Google Sheets CSV المباشر (التزامن التلقائي)</h3>
              <p className="text-xs text-gray-500 font-bold">يمكنك ربط الموقع بجوجل شيت للتزامن التلقائي أيضاً</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              className="flex-1 bg-[#FFF8F0] text-xs sm:text-sm font-bold text-[#2D2424] placeholder-gray-400 p-3 rounded-xl border-2 border-[#F4A261] outline-none focus:border-[#E63946]"
            />
            <button
              onClick={handleSaveAndSyncSheet}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>تأكيد وتزامن جوجل شيت</span>
            </button>
          </div>
        </div>

        {/* Download / Upload Local Excel Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-[#F4A261] space-y-3">
            <h4 className="text-sm font-black text-[#2D2424] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#E63946]" />
              <span>1. تصدير المنيو الحالي إلى ملف أكسل</span>
            </h4>
            <p className="text-xs text-gray-600 font-bold">قم بتنزيل الأصناف الحالية كنموذج لتعديله على جهازك:</p>
            <button
              onClick={() => exportMenuToExcel(menuItems)}
              className="w-full py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل أكسل (.XLSX)</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-[#F4A261] space-y-3">
            <h4 className="text-sm font-black text-[#2D2424] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#2A9D8F]" />
              <span>2. رفع ملف أكسل يدوي من الحاسوب</span>
            </h4>
            <p className="text-xs text-gray-600 font-bold">رفع ملف .xlsx أو .csv محلي استبدالاً للمنيو:</p>
            <label className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#FFF8F0] border-2 border-dashed border-[#2A9D8F] text-[#2A9D8F] font-black text-xs cursor-pointer hover:bg-emerald-50">
              <Upload className="w-4 h-4 ml-2" />
              <span>اختر ملف الأكسل (.xlsx)</span>
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleReset}
            className="text-xs text-[#E63946] hover:underline font-black cursor-pointer bg-rose-50 px-4 py-2 rounded-xl"
          >
            إعادة ضبط المنيو إلى الأصلي كلياً
          </button>
        </div>

      </div>

      {/* ADD / EDIT ITEM MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border-4 border-[#E63946] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto font-cairo dir-rtl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-[#E63946] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F4A261]" />
                <span>{editingItem ? 'تعديل بيانا الوجبة' : 'إضافة وجبة جديدة للمنيو'}</span>
              </h3>

              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItemSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">اسم الوجبة *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: وجبة قرمشة سوبر 4 قطع"
                    className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-bold text-xs outline-none focus:border-[#E63946]"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">السعر (بالجنيه المصري) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="150"
                    className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-bold text-xs outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">القسم *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-black text-xs outline-none focus:border-[#E63946]"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prep Time */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">وقت التحضير المتوقع</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="15-20 دقيقة"
                    className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-bold text-xs outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-700">وصف الوجبة والمكونات</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="قطع دجاج مقرمشة حارة أو عادية مع البطاطس الذهبية والمشروب..."
                  className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-bold text-xs outline-none focus:border-[#E63946]"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#2A9D8F]" />
                  <span>رابط صورة الوجبة (Image URL)</span>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF8F0] p-3 rounded-xl border-2 border-gray-200 font-bold text-xs outline-none focus:border-[#E63946] dir-ltr text-left"
                />
              </div>

              {/* Flags Toggles */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <span className="text-xs font-black text-amber-900 block">علامات تمييز الوجبة:</span>
                <div className="flex flex-wrap gap-4 text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                      className="w-4 h-4 accent-[#E63946] rounded"
                    />
                    <span>🌶️ سبايسي (حار)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 accent-[#F4A261] rounded"
                    />
                    <span>🔥 وجبة مميزة (الأكثر طلباً)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFamily}
                      onChange={(e) => setFormData({ ...formData, isFamily: e.target.checked })}
                      className="w-4 h-4 accent-[#2A9D8F] rounded"
                    />
                    <span>👨‍👩‍👧‍👦 وجبة عائلية</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'حفظ التعديلات' : 'إضافة الوجبة الآن'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
