import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'منيو قرمشة | دجاج بروستد ومشوفات على الفحم - الطعم المصري الأصيل',
  description: 'قائمة طعام مطعم قرمشة للوجبات السريعة والبروستد والمشويات - عروض وخصومات ممتازة وتوصيل سريع',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning className="bg-[#FFF8F0] text-[#2D2424] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
