export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'broasted' | 'sandwiches' | 'grilled' | 'special' | 'sides';
  image: string;
  isSpicy?: boolean;
  isPopular?: boolean;
  isFamily?: boolean;
  prepTime?: string;
  calories?: number;
}

export interface Category {
  id: 'all' | 'broasted' | 'sandwiches' | 'grilled' | 'special' | 'sides';
  name: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'جميع الأطباق',
    iconName: 'Utensils',
    description: 'استكشف قائمة طعام قرمشة بالكامل'
  },
  {
    id: 'broasted',
    name: 'الدجاج المقلي والبروستد',
    iconName: 'Flame',
    description: 'قطع دجاج مقرمشة بخلطتنا السحرية السرية'
  },
  {
    id: 'sandwiches',
    name: 'ساندوتشات الدجاج',
    iconName: 'Sandwich',
    description: 'ساندوتشات غنية بالدجاج والصوصات المميزة'
  },
  {
    id: 'grilled',
    name: 'الدجاج المشوي والجرل',
    iconName: 'Drumstick',
    description: 'مشويات على الفحم بتتبيلة شرقية أصيلة'
  },
  {
    id: 'special',
    name: 'الوجبات العائلية والخاصة',
    iconName: 'Sparkles',
    description: 'وجبات محشية وأطباق فاخرة للتجمعات'
  },
  {
    id: 'sides',
    name: 'الأطباق الجانبية والمقبلات',
    iconName: 'Salad',
    description: 'سلطات، أرز بسمتي، ومقبلات شهية'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // وجبات البروستد
  {
    id: 'b1',
    name: 'دجاج بروستد 2 قطعة',
    price: 130,
    description: 'صدر ووراك مقرمش مع البطاطس والثومية والخبز.',
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    prepTime: '15-20 دقيقة',
    calories: 680
  },
  {
    id: 'b2',
    name: 'دجاج بروستد 3 قطع',
    price: 165,
    description: 'قطع دجاج مقلية بخلطة حارة أو عادية مع الإضافات.',
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=800&auto=format&fit=crop',
    isSpicy: true,
    prepTime: '15-20 دقيقة',
    calories: 890
  },
  {
    id: 'b3',
    name: 'دجاج بروستد 4 قطع',
    price: 210,
    description: 'وجبة عائلية صغيرة مع صوصات متعددة.',
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?q=80&w=800&auto=format&fit=crop',
    prepTime: '20 دقيقة',
    calories: 1150
  },
  {
    id: 'b4',
    name: 'دلاء بروستد 10 قطع',
    price: 480,
    description: 'مناسب للتجمعات العائلية مع كول سلو وبطاطس ولتر مياه غازية.',
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
    isFamily: true,
    isPopular: true,
    prepTime: '25 دقيقة',
    calories: 2800
  },
  {
    id: 'b5',
    name: 'دلاء بروستد 15 قطعة',
    price: 690,
    description: 'كمية كبيرة مع تشكيلة صوصات وخبز وبطاطس مقلية.',
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
    isFamily: true,
    prepTime: '30 دقيقة',
    calories: 4200
  },

  // ساندوتشات الدجاج
  {
    id: 's1',
    name: 'ساندوتش زِنجر حار',
    price: 85,
    description: 'شرائح دجاج مقرمشة حارة، خس، ومايونيز في خبز كيزر.',
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?q=80&w=800&auto=format&fit=crop',
    isSpicy: true,
    isPopular: true,
    prepTime: '10-15 دقيقة',
    calories: 620
  },
  {
    id: 's2',
    name: 'ساندوتش ستربس كلاسيك',
    price: 80,
    description: 'أصابع دجاج مقلية ذهبية مع الصوص الخاص والخس.',
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800&auto=format&fit=crop',
    prepTime: '10-15 دقيقة',
    calories: 550
  },
  {
    id: 's3',
    name: 'ساندوتش تشيكن باني',
    price: 75,
    description: 'قطعة باني تقليدية متبلة ومقلية مع طماطم وخس.',
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop',
    prepTime: '10 دقيقة',
    calories: 480
  },
  {
    id: 's4',
    name: 'ساندوتش مِكس جريل دجاج',
    price: 95,
    description: 'شيش طاووق مع قطع دجاج مشوية على الفحم.',
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    prepTime: '15 دقيقة',
    calories: 590
  },
  {
    id: 's5',
    name: 'ساندوتش تورنيدو دجاج',
    price: 100,
    description: 'دجاج مقرمش مع جبنة شيدر سائحة وجنون الصوصات.',
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    isSpicy: true,
    prepTime: '15 دقيقة',
    calories: 780
  },

  // الدجاج المشوي والجرل
  {
    id: 'g1',
    name: 'فرخة مشوية على الفحم كاملة',
    price: 240,
    description: 'متبلة بالخلطة الشرقية مع أرز بسمتي وسلطة وطحينة.',
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
    isFamily: true,
    isPopular: true,
    prepTime: '25-30 دقيقة',
    calories: 1400
  },
  {
    id: 'g2',
    name: 'نصف فرخة مشوية على الفحم',
    price: 125,
    description: 'صدر أو وراك مشوي ببهارات مميزة مع الخبز والسلطة.',
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop',
    prepTime: '20 دقيقة',
    calories: 700
  },
  {
    id: 'g3',
    name: 'ربع فرخة مشوية (صدر)',
    price: 70,
    description: 'وجبة خفيفة مع سلطة وطحينة.',
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
    prepTime: '15 دقيقة',
    calories: 380
  },
  {
    id: 'g4',
    name: 'ربع فرخة مشوية (وراك)',
    price: 65,
    description: 'طرية ومتبلة بعناية مع العيش والصلصة.',
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop',
    prepTime: '15 دقيقة',
    calories: 420
  },
  {
    id: 'g5',
    name: 'شيش طاووق (وجبة)',
    price: 155,
    description: 'سيخين دجاج مشوي مع الفلفل الألوان والبصل والأرز البسمتي.',
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    prepTime: '20 دقيقة',
    calories: 820
  },

  // الوجبات العائلية والخاصة
  {
    id: 'm1',
    name: 'وجبة رولو دجاج محشي',
    price: 140,
    description: 'صدور دجاج مخلية محشية جبنة وسبانخ مقلية.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    prepTime: '20-25 دقيقة',
    calories: 750
  },
  {
    id: 'm2',
    name: 'وجبة كوردون بلو',
    price: 145,
    description: 'صدور دجاج محشية تركي وجبن مدخن ومقلية بقسماط.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    prepTime: '20-25 دقيقة',
    calories: 890
  },
  {
    id: 'm3',
    name: 'وجبة فاهيتا دجاج',
    price: 135,
    description: 'قطع دجاج مع فلفل ألوان وبصل وتوابل مكسيكية مع الأرز.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop',
    prepTime: '20 دقيقة',
    calories: 710
  },
  {
    id: 'm4',
    name: 'وجبة دجاج بالصوص الأبيض',
    price: 150,
    description: 'صدور مشوية بصوص المشروم والكريمة الغنية.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?q=80&w=800&auto=format&fit=crop',
    prepTime: '20 دقيقة',
    calories: 840
  },
  {
    id: 'm5',
    name: 'وجبة مسحب دجاج (10 قطع)',
    price: 120,
    description: 'أصابع دجاج طرية بدون عظم للصغار والكبار.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
    isFamily: true,
    prepTime: '15 دقيقة',
    calories: 680
  },

  // الأطباق الجانبية والمقبلات
  {
    id: 'a1',
    name: 'طبق أرز بسمتي بالخلطة',
    price: 35,
    description: 'أرز مبهر أصفر طويل الحبة بالمكسرات.',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop',
    prepTime: '5 دقيقة',
    calories: 320
  },
  {
    id: 'a2',
    name: 'طبق بطاطس مقلية كبير',
    price: 40,
    description: 'بطاطس ذهبية مقرمشة.',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop',
    prepTime: '5 دقيقة',
    calories: 450
  },
  {
    id: 'a3',
    name: 'سلطة كول سلو',
    price: 30,
    description: 'ملفوف وجزر مع صوص المايونيز الحلو.',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?q=80&w=800&auto=format&fit=crop',
    prepTime: '2 دقيقة',
    calories: 210
  },
  {
    id: 'a4',
    name: 'سلطة خضراء طازجة',
    price: 25,
    description: 'طماطم، خيار، خس، وجرجير بليمون وتوابل.',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    prepTime: '3 دقيقة',
    calories: 90
  },
  {
    id: 'a5',
    name: 'ثومية أو طحينة إضافية',
    price: 12,
    description: 'علبة صوص إضافية.',
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?q=80&w=800&auto=format&fit=crop',
    prepTime: '1 دقيقة',
    calories: 140
  }
];

export const EGYPTIAN_BRANCHES = [
  { name: 'فرع مدينة نصر', address: 'شارع طيران، بجوار الحديقة الدولية', phone: '01012345678' },
  { name: 'فرع المعادي', address: 'شارع 9، أمام محطة المترو', phone: '01123456789' },
  { name: 'فرع الدقي', address: 'شارع مصدق، الجيزة', phone: '01234567890' },
  { name: 'فرع الإسكندرية', address: 'طريق الكورنيش، جليم', phone: '01555554433' },
];

export const RESTAURANT_INFO = {
  name: 'مطعم قرمشة البروستد والمشويات',
  subtitle: 'أصل البروستد المصري والمشويات على الفحم',
  hotline: '19876',
  whatsappNumber: '201012345678',
  workingHours: 'من 11:00 صباحاً وحتى 3:00 فجراً',
  deliveryTime: '30 - 45 دقيقة',
  minOrder: 50,
  deliveryFee: 20
};
