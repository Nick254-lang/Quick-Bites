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
    imagePublicId: 'myrestaurant/menu/smoky-burger',
    featured: true,
  },
  {
    slug: 'peri-peri-wrap',
    name: 'Peri Peri Wrap',
    description: 'Flame-grilled chicken, slaw, and house peri sauce.',
    price: 690,
    category: 'grill',
    prepTime: '12 min',
    imagePublicId: 'myrestaurant/menu/peri-peri-wrap',
    featured: true,
  },
  {
    slug: 'steak-rice-bowl',
    name: 'Steak Rice Bowl',
    description: 'Garlic rice, grilled steak strips, pickled veg, sesame glaze.',
    price: 920,
    category: 'bowls',
    prepTime: '18 min',
    imagePublicId: 'myrestaurant/menu/steak-rice-bowl',
  },
  {
    slug: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with beef chili and cheese sauce.',
    price: 460,
    category: 'sides',
    prepTime: '10 min',
    imagePublicId: 'myrestaurant/menu/loaded-fries',
  },
  {
    slug: 'mango-cheesecake',
    name: 'Mango Cheesecake',
    description: 'Creamy baked cheesecake finished with mango coulis.',
    price: 420,
    category: 'dessert',
    prepTime: '5 min',
    imagePublicId: 'myrestaurant/menu/mango-cheesecake',
  },
  {
    slug: 'hibiscus-fizz',
    name: 'Hibiscus Fizz',
    description: 'Sparkling hibiscus cooler with lime and mint.',
    price: 280,
    category: 'drinks',
    prepTime: '3 min',
    imagePublicId: 'myrestaurant/menu/hibiscus-fizz',
  },
];

export const fallbackMenuItems = seedMenuItems.map((item, index) => ({
  id: `seed-${index + 1}`,
  ...item,
  imageUrl: buildCloudinaryImageUrl(item.imagePublicId),
}));
