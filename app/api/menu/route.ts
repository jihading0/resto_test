import { NextResponse } from 'next/server';
import { MENU_ITEMS } from '../../../data/menuData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: MENU_ITEMS.length,
    items: MENU_ITEMS,
    updatedAt: new Date().toISOString(),
  });
}
