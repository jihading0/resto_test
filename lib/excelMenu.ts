import * as XLSX from 'xlsx';
import { MenuItem } from '../data/menuData';

export function ensureUniqueMenuItems(items: MenuItem[]): MenuItem[] {
  const seenIds = new Set<string>();
  return items.map((item, index) => {
    let uniqueId = item.id ? String(item.id).trim() : `item-${index + 1}`;
    if (!uniqueId || seenIds.has(uniqueId)) {
      uniqueId = `${uniqueId || 'item'}_${index + 1}`;
    }
    seenIds.add(uniqueId);
    return {
      ...item,
      id: uniqueId,
    };
  });
}

// Convert MenuItems array to Excel workbook and trigger download
export function exportMenuToExcel(items: MenuItem[], filename: string = 'قرمشة_قائمة_الطعام.xlsx') {
  const excelData = items.map((item) => ({
    'المعرف (ID)': item.id,
    'اسم الوجبة': item.name,
    'السعر (جنيه)': item.price,
    'القسم (category)': item.category, // broasted | sandwiches | grilled | special | sides
    'الوصف': item.description,
    'رابط الصورة': item.image,
    'هل سبايسي؟ (نعم/لا)': item.isSpicy ? 'نعم' : 'لا',
    'وجبة شهيرة؟ (نعم/لا)': item.isPopular ? 'نعم' : 'لا',
    'وجبة عائلية؟ (نعم/لا)': item.isFamily ? 'نعم' : 'لا',
    'وقت التجهيز': item.prepTime || '20 دقيقة',
    'السعرات': item.calories || 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'المنيو');

  // Adjust column widths for better readability
  worksheet['!cols'] = [
    { wch: 12 }, // ID
    { wch: 30 }, // Name
    { wch: 12 }, // Price
    { wch: 15 }, // Category
    { wch: 50 }, // Description
    { wch: 60 }, // Image URL
    { wch: 15 }, // IsSpicy
    { wch: 15 }, // IsPopular
    { wch: 15 }, // IsFamily
    { wch: 15 }, // PrepTime
    { wch: 10 }, // Calories
  ];

  XLSX.writeFile(workbook, filename);
}

// Parse uploaded Excel (.xlsx, .xls, .csv) File or ArrayBuffer into MenuItem[]
export function parseExcelToMenuItems(fileBuffer: ArrayBuffer | Uint8Array): MenuItem[] {
  const workbook = XLSX.read(fileBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

  const validCategories = ['broasted', 'sandwiches', 'grilled', 'special', 'sides'];

  const items: MenuItem[] = rawRows.map((row, idx) => {
    // Read Arabic headers or English fallback headers
    const id = String(row['المعرف (ID)'] || row['id'] || row['ID'] || `item-${idx + 1}`);
    const name = String(row['اسم الوجبة'] || row['name'] || row['Name'] || 'وجبة جديدة');
    const price = Number(row['السعر (جنيه)'] || row['price'] || row['Price'] || 0);
    let category = String(row['القسم (category)'] || row['category'] || row['Category'] || 'broasted').toLowerCase().trim();
    if (!validCategories.includes(category)) {
      category = 'broasted';
    }

    const description = String(row['الوصف'] || row['description'] || row['Description'] || '');
    const image = String(
      row['رابط الصورة'] ||
        row['image'] ||
        row['Image'] ||
        'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800'
    );

    const isSpicyStr = String(row['هل سبايسي؟ (نعم/لا)'] || row['isSpicy'] || '').toLowerCase();
    const isSpicy = isSpicyStr.includes('نعم') || isSpicyStr === 'true' || isSpicyStr === '1';

    const isPopularStr = String(row['وجبة شهيرة؟ (نعم/لا)'] || row['isPopular'] || '').toLowerCase();
    const isPopular = isPopularStr.includes('نعم') || isPopularStr === 'true' || isPopularStr === '1';

    const isFamilyStr = String(row['وجبة عائلية؟ (نعم/لا)'] || row['isFamily'] || '').toLowerCase();
    const isFamily = isFamilyStr.includes('نعم') || isFamilyStr === 'true' || isFamilyStr === '1';

    const prepTime = String(row['وقت التجهيز'] || row['prepTime'] || '20 دقيقة');
    const calories = Number(row['السعرات'] || row['calories'] || 0);

    return {
      id,
      name,
      price,
      description,
      category: category as any,
      image,
      isSpicy,
      isPopular,
      isFamily,
      prepTime,
      calories,
    };
  });

  return ensureUniqueMenuItems(items);
}

// Fetch and parse menu data from a published Google Sheets CSV URL
export async function fetchGoogleSheetMenu(csvUrl: string): Promise<MenuItem[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) {
    throw new Error('فشل في جلب البيانات من رابط Google Sheets. التأكد من نشر الجدول للويب كملف CSV.');
  }
  const text = await res.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

  // Buffer parsing logic
  const validCategories = ['broasted', 'sandwiches', 'grilled', 'special', 'sides'];

  const items: MenuItem[] = rawRows.map((row, idx) => {
    const id = String(row['المعرف (ID)'] || row['id'] || row['ID'] || `item-${idx + 1}`);
    const name = String(row['اسم الوجبة'] || row['name'] || row['Name'] || 'وجبة جديدة');
    const price = Number(row['السعر (جنيه)'] || row['price'] || row['Price'] || 0);
    let category = String(row['القسم (category)'] || row['category'] || row['Category'] || 'broasted').toLowerCase().trim();
    if (!validCategories.includes(category)) {
      category = 'broasted';
    }

    const description = String(row['الوصف'] || row['description'] || row['Description'] || '');
    const image = String(
      row['رابط الصورة'] ||
        row['image'] ||
        row['Image'] ||
        'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800'
    );

    const isSpicyStr = String(row['هل سبايسي؟ (نعم/لا)'] || row['isSpicy'] || '').toLowerCase();
    const isSpicy = isSpicyStr.includes('نعم') || isSpicyStr === 'true' || isSpicyStr === '1';

    const isPopularStr = String(row['وجبة شهيرة؟ (نعم/لا)'] || row['isPopular'] || '').toLowerCase();
    const isPopular = isPopularStr.includes('نعم') || isPopularStr === 'true' || isPopularStr === '1';

    const isFamilyStr = String(row['وجبة عائلية؟ (نعم/لا)'] || row['isFamily'] || '').toLowerCase();
    const isFamily = isFamilyStr.includes('نعم') || isFamilyStr === 'true' || isFamilyStr === '1';

    const prepTime = String(row['وقت التجهيز'] || row['prepTime'] || '20 دقيقة');
    const calories = Number(row['السعرات'] || row['calories'] || 0);

    return {
      id,
      name,
      price,
      description,
      category: category as any,
      image,
      isSpicy,
      isPopular,
      isFamily,
      prepTime,
      calories,
    };
  });

  return ensureUniqueMenuItems(items);
}
