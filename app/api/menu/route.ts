import { NextRequest, NextResponse } from 'next/server';
import { MENU_ITEMS, MenuItem } from '../../../data/menuData';
import { ensureUniqueMenuItems } from '../../../lib/excelMenu';

// In-memory fallback for local development or before KV binding is populated
declare global {
  var __qarmasha_menu_store: MenuItem[] | undefined;
  var MENU_KV: any;
}

// Helper to get KV binding safely in Cloudflare Workers / OpenNext runtime
async function getMenuKV(): Promise<any> {
  // 1. Direct global binding
  if (typeof globalThis !== 'undefined' && globalThis.MENU_KV) {
    return globalThis.MENU_KV;
  }
  // 2. process.env binding
  if (typeof process !== 'undefined' && (process.env as any).MENU_KV) {
    return (process.env as any).MENU_KV;
  }
  // 3. Try @opennextjs/cloudflare getCloudflareContext
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext();
    if (ctx && ctx.env && (ctx.env as any).MENU_KV) {
      return (ctx.env as any).MENU_KV;
    }
  } catch {
    // Not running inside @opennextjs/cloudflare context or module not available
  }
  return null;
}

export async function GET() {
  try {
    const kv = await getMenuKV();
    if (kv && typeof kv.get === 'function') {
      const stored = await kv.get('qarmasha_menu', 'json');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'cloudflare_kv',
          count: stored.length,
          items: ensureUniqueMenuItems(stored),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Fallback to in-memory store if set
    if (globalThis.__qarmasha_menu_store && globalThis.__qarmasha_menu_store.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'server_memory',
        count: globalThis.__qarmasha_menu_store.length,
        items: ensureUniqueMenuItems(globalThis.__qarmasha_menu_store),
        updatedAt: new Date().toISOString(),
      });
    }

    // Default fallback
    return NextResponse.json({
      success: true,
      source: 'default_static',
      count: MENU_ITEMS.length,
      items: ensureUniqueMenuItems(MENU_ITEMS),
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to fetch menu',
        items: ensureUniqueMenuItems(MENU_ITEMS),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, action } = body;

    let updatedMenu: MenuItem[];

    if (action === 'reset') {
      updatedMenu = ensureUniqueMenuItems(MENU_ITEMS);
    } else if (Array.isArray(items)) {
      if (items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'قائمة الوجبات فارغة ولا يمكن حفظها' },
          { status: 400 }
        );
      }
      updatedMenu = ensureUniqueMenuItems(items);
    } else {
      return NextResponse.json(
        { success: false, error: 'تنسيق البيانات غير صحيح' },
        { status: 400 }
      );
    }

    // Save to memory store
    globalThis.__qarmasha_menu_store = updatedMenu;

    // Save to Cloudflare KV if available
    let kvSaved = false;
    const kv = await getMenuKV();
    if (kv && typeof kv.put === 'function') {
      await kv.put('qarmasha_menu', JSON.stringify(updatedMenu));
      kvSaved = true;
    }

    return NextResponse.json({
      success: true,
      kvSaved,
      source: kvSaved ? 'cloudflare_kv' : 'server_memory',
      count: updatedMenu.length,
      items: updatedMenu,
      message: kvSaved
        ? 'تم حفظ وتحديث المنيو سحابياً على Cloudflare KV بنجاح! التغيير يظهر فوراً لجميع الزوار.'
        : 'تم حفظ وتحديث المنيو في الخادم بنجاح!',
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save menu' },
      { status: 500 }
    );
  }
}
