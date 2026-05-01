import { PrismaClient, MenuCategory } from '@prisma/client';

const prisma = new PrismaClient();

const menuItems = [
  {
    slug: 'smoky-burger',
    name: 'Smoky Burger',
    description: 'Beef patty, caramelized onions, cheddar, and pepper mayo.',
    price: 780,
    category: MenuCategory.SIGNATURE,
    prepTime: '15 min',
    imagePublicId: 'myrestaurant/menu/smoky-burger',
    featured: true,
  },
  {
    slug: 'peri-peri-wrap',
    name: 'Peri Peri Wrap',
    description: 'Flame-grilled chicken, slaw, and house peri sauce.',
    price: 690,
    category: MenuCategory.GRILL,
    prepTime: '12 min',
    imagePublicId: 'myrestaurant/menu/peri-peri-wrap',
    featured: true,
  },
  {
    slug: 'steak-rice-bowl',
    name: 'Steak Rice Bowl',
    description: 'Garlic rice, grilled steak strips, pickled veg, sesame glaze.',
    price: 920,
    category: MenuCategory.BOWLS,
    prepTime: '18 min',
    imagePublicId: 'myrestaurant/menu/steak-rice-bowl',
  },
  {
    slug: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with beef chili and cheese sauce.',
    price: 460,
    category: MenuCategory.SIDES,
    prepTime: '10 min',
    imagePublicId: 'myrestaurant/menu/loaded-fries',
  },
  {
    slug: 'mango-cheesecake',
    name: 'Mango Cheesecake',
    description: 'Creamy baked cheesecake finished with mango coulis.',
    price: 420,
    category: MenuCategory.DESSERT,
    prepTime: '5 min',
    imagePublicId: 'myrestaurant/menu/mango-cheesecake',
  },
  {
    slug: 'hibiscus-fizz',
    name: 'Hibiscus Fizz',
    description: 'Sparkling hibiscus cooler with lime and mint.',
    price: 280,
    category: MenuCategory.DRINKS,
    prepTime: '3 min',
    imagePublicId: 'myrestaurant/menu/hibiscus-fizz',
  },
];

async function main() {
  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
}

void main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
