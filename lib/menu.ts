import type { MenuCategory } from '@/lib/types';
import { buildCloudinaryImageUrl } from '@/lib/cloudinary';

interface SeedMenuItem {
  slug: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  prepTime: string;
  imagePublicId: string;
  featured?: boolean;
}

export const seedMenuItems: SeedMenuItem[] = [
  {
    slug: 'smoky-burger',
    name: 'Smoky Burger',
    description: 'Beef patty, caramelized onions, cheddar, and pepper mayo.',
    price: 780,
    category: 'signature',
    prepTime: '15 min',
    imagePublicId: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    slug: 'peri-peri-wrap',
    name: 'Peri Peri Wrap',
    description: 'Flame-grilled chicken, slaw, and house peri sauce.',
    price: 690,
    category: 'grill',
    prepTime: '12 min',
    imagePublicId: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    slug: 'steak-rice-bowl',
    name: 'Steak Rice Bowl',
    description: 'Garlic rice, grilled steak strips, pickled veg, sesame glaze.',
    price: 920,
    category: 'bowls',
    prepTime: '18 min',
    imagePublicId: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    slug: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with beef chili and cheese sauce.',
    price: 460,
    category: 'sides',
    prepTime: '10 min',
    imagePublicId: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'mango-cheesecake',
    name: 'Mango Cheesecake',
    description: 'Creamy baked cheesecake finished with mango coulis.',
    price: 420,
    category: 'dessert',
    prepTime: '5 min',
    imagePublicId: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'hibiscus-fizz',
    name: 'Hibiscus Fizz',
    description: 'Sparkling hibiscus cooler with lime and mint.',
    price: 280,
    category: 'drinks',
    prepTime: '3 min',
    imagePublicId: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'safari-bbq-ribs',
    name: 'Safari BBQ Ribs',
    description: 'Sticky pork ribs brushed with tamarind BBQ glaze and kachumbari.',
    price: 1180,
    category: 'signature',
    prepTime: '22 min',
    imagePublicId: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    slug: 'charred-chicken-skewers',
    name: 'Charred Chicken Skewers',
    description: 'Spiced chicken skewers, lemon yoghurt, and flame-roasted peppers.',
    price: 740,
    category: 'grill',
    prepTime: '14 min',
    imagePublicId: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'coconut-curry-bowl',
    name: 'Coconut Curry Bowl',
    description: 'Coconut curry, basmati rice, chickpeas, greens, and toasted cashews.',
    price: 840,
    category: 'bowls',
    prepTime: '16 min',
    imagePublicId: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'plantain-bites',
    name: 'Plantain Bites',
    description: 'Golden plantain, chilli salt, and smoky tomato dip.',
    price: 380,
    category: 'sides',
    prepTime: '8 min',
    imagePublicId: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'chocolate-fondant',
    name: 'Chocolate Fondant',
    description: 'Warm chocolate cake with a molten centre and vanilla cream.',
    price: 480,
    category: 'dessert',
    prepTime: '9 min',
    imagePublicId: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'passion-ginger-cooler',
    name: 'Passion Ginger Cooler',
    description: 'Passion fruit, ginger syrup, soda, and fresh citrus.',
    price: 320,
    category: 'drinks',
    prepTime: '3 min',
    imagePublicId: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
  },
];

export const fallbackMenuItems = seedMenuItems.map((item, index) => ({
  id: `seed-${index + 1}`,
  ...item,
  imageUrl: buildCloudinaryImageUrl(item.imagePublicId),
}));
