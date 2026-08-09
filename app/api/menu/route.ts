import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextRequest, NextResponse } from 'next/server';
import { MENU_ITEMS, MenuItem } from '../../../data/menuData';
import { ensureUniqueMenuItems } from '../../../lib/excelMenu';

export const dynamic = 'force-dynamic';

async function getMenuKV() {
  try {
    const { env } = getCloudflareContext();
    const kv = (env as Record<string, unknown>).MENU_KV;
    if (kv && typeof kv === 'object') {
      return kv as {
        get: (key: string, type?: 'json') => Promise<unknown>;
        put: (key: string, value: string) => Promise<void>;
      };
    }
  } catch {
    // Local development or an environment without the binding.
  }

  return null;
}

export async function GET() {
  try {
    const kv = await getMenuKV();

    if (kv) {
      const stored = await kv.get('qarmasha_menu', 'json');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'cloudflare_kv',
          count: stored.length,
          items: ensureUniqueMenuItems(stored as MenuItem[]),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: 'default_static',
      count: MENU_ITEMS.length,
      items: ensureUniqueMenuItems(MENU_ITEMS),
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch menu',
        items: ensureUniqueMenuItems(MENU_ITEMS),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, action } = body as { items?: MenuItem[]; action?: string };

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

    const kv = await getMenuKV();

    if (!kv) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudflare KV binding MENU_KV is not available. Bind the KV namespace to this Worker first.',
        },
        { status: 503 }
      );
    }

    await kv.put('qarmasha_menu', JSON.stringify(updatedMenu));

    return NextResponse.json({
      success: true,
      kvSaved: true,
      source: 'cloudflare_kv',
      count: updatedMenu.length,
      items: updatedMenu,
      message: 'تم حفظ وتحديث المنيو سحابياً على Cloudflare KV بنجاح! التغيير يظهر لجميع الزوار.',
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to save menu' },
      { status: 500 }
    );
  }
}
