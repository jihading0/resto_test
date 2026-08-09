'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MENU_ITEMS, MenuItem, Category, CATEGORIES, EGYPTIAN_BRANCHES, RESTAURANT_INFO } from '../data/menuData';
import { fetchGoogleSheetMenu, ensureUniqueMenuItems } from '../lib/excelMenu';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryNav } from '../components/CategoryNav';
import { MenuItemCard } from '../components/MenuItemCard';
import { ItemModal } from '../components/ItemModal';
import { CartDrawer, CartItem } from '../components/CartDrawer';
import { BranchesModal } from '../components/BranchesModal';
import { Footer } from '../components/Footer';
import { Sparkles, Utensils, SearchX, ShoppingBag, Flame, Send } from 'lucide-react';

export default function Home() {
  // Menu items state initialized to default MENU_ITEMS to guarantee SSR hydration match
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => ensureUniqueMenuItems(MENU_ITEMS));

  // Sync menu items from server API (Cloudflare KV / D1), localStorage and Google Sheets after mount (client-side only)
  useEffect(() => {
    // Load local storage cache if available for instant display
    try {
      const savedMenu = localStorage.getItem('qarmasha_excel_menu');
      if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setMenuItems(ensureUniqueMenuItems(parsed));
          }, 0);
        }
      }
    } catch {
      // Fallback
    }

    // Fetch global server-stored menu from Cloudflare KV / Server API
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const uniqueServerItems = ensureUniqueMenuItems(data.items);
          setMenuItems(uniqueServerItems);
          localStorage.setItem('qarmasha_excel_menu', JSON.stringify(uniqueServerItems));
        }
      })
      .catch(() => {
        // Silent fallback
      });

    // Auto-sync with live Google Sheet if configured
    const googleSheetUrl = localStorage.getItem('qarmasha_google_sheet_url');
    if (googleSheetUrl && googleSheetUrl.trim() !== '') {
      fetchGoogleSheetMenu(googleSheetUrl.trim())
        .then((liveItems) => {
          if (liveItems && liveItems.length > 0) {
            const uniqueLive = ensureUniqueMenuItems(liveItems);
            setMenuItems(uniqueLive);
            localStorage.setItem('qarmasha_excel_menu', JSON.stringify(uniqueLive));
          }
        })
        .catch(() => {
          // Silent fallback to cached menu
        });
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState<Category['id']>('all');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Quick View / Customization Modal item
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Branch Selection
  const [selectedBranch, setSelectedBranch] = useState<string>(EGYPTIAN_BRANCHES[0].name);
  const [isBranchesOpen, setIsBranchesOpen] = useState<boolean>(false);

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: menuItems.length,
      broasted: 0,
      sandwiches: 0,
      grilled: 0,
      special: 0,
      sides: 0,
    };
    menuItems.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, [menuItems]);

  // Filtered menu items logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Category check
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Filter Tag check
      if (activeFilterTag === 'popular' && !item.isPopular) return false;
      if (activeFilterTag === 'spicy' && !item.isSpicy) return false;
      if (activeFilterTag === 'family' && !item.isFamily) return false;

      // 3. Search query check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        return matchName || matchDesc;
      }

      return true;
    });
  }, [menuItems, activeCategory, activeFilterTag, searchQuery]);

  // Cart actions
  const handleAddToCartQuick = (item: MenuItem) => {
    setCartItems((prev) => {
      // Check if item with default options already exists
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.menuItem.id === item.id &&
          ci.spiceLevel === (item.isSpicy ? 'spicy' : 'normal') &&
          ci.selectedExtras.length === 0 &&
          !ci.specialNotes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${item.id}-${Date.now()}`,
          menuItem: item,
          quantity: 1,
          spiceLevel: item.isSpicy ? 'spicy' : 'normal',
          selectedExtras: [],
          specialNotes: '',
        };
        return [...prev, newItem];
      }
    });
  };

  const handleAddToCartWithOptions = (
    item: MenuItem,
    quantity: number,
    spiceLevel: 'normal' | 'spicy',
    selectedExtras: { id: string; name: string; price: number }[],
    specialNotes: string
  ) => {
    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      spiceLevel,
      selectedExtras,
      specialNotes,
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2D2424] font-cairo flex flex-col selection:bg-[#E63946] selection:text-white">
      {/* Sticky Top Header */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Hero Section */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilterTag={activeFilterTag}
        onSelectFilterTag={setActiveFilterTag}
        totalItemsCount={MENU_ITEMS.length}
      />

      {/* Sticky Category Tabs */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Content & Menu Items Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full space-y-8">
        
        {/* Section Title & Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#F4A261]/30">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D2424]">
                {CATEGORIES.find((c) => c.id === activeCategory)?.name || 'جميع الوجبات'}
              </h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#FEE440] text-black border border-black/10">
                {filteredItems.length} صنف متاح
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
              {CATEGORIES.find((c) => c.id === activeCategory)?.description}
            </p>
          </div>

          {/* Quick reset filters button */}
          {(activeCategory !== 'all' || activeFilterTag !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveFilterTag('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#E63946] hover:underline flex items-center gap-1 font-black self-start sm:self-auto cursor-pointer"
            >
              <span>عرض جميع أصناف المنيو</span>
            </button>
          )}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <MenuItemCard
                key={`${item.id}-${index}`}
                item={item}
                onAddToCart={handleAddToCartQuick}
                onOpenQuickView={setSelectedMenuItem}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-[#F4A261] p-8 space-y-4 max-w-xl mx-auto shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#FFF8F0] border-2 border-[#F4A261] mx-auto flex items-center justify-center text-[#E63946]">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#2D2424]">لم يتم العثور على نتائج</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-bold leading-relaxed">
              لم نجد أي صنف يطابق البحث &quot;{searchQuery}&quot;. حاول البحث عن اسم آخر مثل &quot;بروستد&quot;، &quot;زِنجر&quot;، &quot;شيش&quot;، أو &quot;كول سلو&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setActiveFilterTag('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-xs transition-all shadow-md cursor-pointer"
            >
              إعادة ضبط البحث
            </button>
          </div>
        )}

      </main>

      {/* Item Quick Customization Modal */}
      <ItemModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedBranch={selectedBranch}
      />

      {/* Branches Modal */}
      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      {/* Footer */}
      <Footer onOpenBranches={() => setIsBranchesOpen(true)} />

      {/* Floating Bottom Cart Bar for Mobile */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 right-4 left-4 z-40 sm:hidden animate-bounce-short">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#E63946] text-white p-4 rounded-2xl font-black text-sm flex items-center justify-between shadow-2xl border-2 border-[#F4A261] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span>عرض السلة ({totalCartCount} أصناف)</span>
            </div>
            <span className="bg-[#FEE440] text-black px-3 py-1 rounded-xl text-xs font-black">
              افتح الطلب ←
            </span>
          </button>
        </div>
      )}

      {/* Persistent Floating WhatsApp Quick Button */}
      <a
        href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent('مرحباً مطعم قرمشة، أود الطلب والاستفسار عبر الواتساب 🍗')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2A9D8F] hover:bg-[#23857a] text-white font-black text-xs sm:text-sm transition-all shadow-2xl hover:scale-105 border-2 border-white group"
        title="تواصل وتأكيد الطلب عبر الواتساب"
      >
        <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">اطلب عبر الواتساب</span>
      </a>
    </div>
  );
}
