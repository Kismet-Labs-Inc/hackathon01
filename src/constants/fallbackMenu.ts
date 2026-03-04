import type { MenuItem } from '@/types/menu';

/**
 * Hardcoded demo fallback menu -- returned when Gemini fails or times out.
 * Modeled after a realistic Italian-American restaurant for demo day.
 */
export const FALLBACK_MENU: MenuItem[] = [
  // Appetizers
  {
    id: 'fb-01',
    name: 'Crispy Calamari',
    description: 'Lightly fried with marinara and lemon aioli',
    price: 14.0,
    calories: 480,
    dietaryTags: [],
    category: 'Appetizers',
  },
  {
    id: 'fb-02',
    name: 'Burrata Caprese',
    description: 'Creamy burrata, heirloom tomatoes, basil, balsamic glaze',
    price: 16.0,
    calories: 320,
    dietaryTags: ['vegetarian', 'gluten-free'],
    category: 'Appetizers',
  },
  {
    id: 'fb-03',
    name: 'Truffle Fries',
    description: 'Hand-cut fries, parmesan, truffle oil, fresh herbs',
    price: 12.0,
    calories: 560,
    dietaryTags: ['vegetarian'],
    category: 'Appetizers',
  },

  // Mains
  {
    id: 'fb-04',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon, lemon butter, roasted vegetables, wild rice',
    price: 28.0,
    calories: 620,
    dietaryTags: ['gluten-free'],
    category: 'Mains',
  },
  {
    id: 'fb-05',
    name: 'Short Rib Pappardelle',
    description: 'Braised short rib, fresh pappardelle, red wine reduction',
    price: 26.0,
    calories: 780,
    dietaryTags: [],
    category: 'Mains',
  },
  {
    id: 'fb-06',
    name: 'Margherita Pizza',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, wood-fired',
    price: 18.0,
    calories: 680,
    dietaryTags: ['vegetarian'],
    category: 'Mains',
  },
  {
    id: 'fb-07',
    name: 'Chicken Milanese',
    description: 'Crispy breaded chicken, arugula, cherry tomatoes, shaved parmesan',
    price: 24.0,
    calories: 720,
    dietaryTags: [],
    category: 'Mains',
  },
  {
    id: 'fb-08',
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice, porcini, shiitake, truffle oil, aged parmesan',
    price: 22.0,
    calories: 540,
    dietaryTags: ['vegetarian', 'gluten-free'],
    category: 'Mains',
  },

  // Desserts
  {
    id: 'fb-09',
    name: 'Tiramisu',
    description: 'Classic Italian, espresso-soaked ladyfingers, mascarpone cream',
    price: 12.0,
    calories: 420,
    dietaryTags: ['vegetarian'],
    category: 'Desserts',
  },
  {
    id: 'fb-10',
    name: 'Chocolate Lava Cake',
    description: 'Warm molten center, vanilla gelato, raspberry coulis',
    price: 14.0,
    calories: 580,
    dietaryTags: ['vegetarian'],
    category: 'Desserts',
  },
  {
    id: 'fb-11',
    name: 'Panna Cotta',
    description: 'Vanilla bean, mixed berry compote, mint',
    price: 10.0,
    calories: 340,
    dietaryTags: ['vegetarian', 'gluten-free'],
    category: 'Desserts',
  },

  // Drinks
  {
    id: 'fb-12',
    name: 'Italian Spritz',
    description: 'Aperol, prosecco, soda, fresh orange',
    price: 14.0,
    calories: 180,
    dietaryTags: ['vegan', 'gluten-free'],
    category: 'Drinks',
  },
  {
    id: 'fb-13',
    name: 'Espresso Martini',
    description: 'Vodka, fresh espresso, coffee liqueur, vanilla',
    price: 16.0,
    calories: 220,
    dietaryTags: ['vegan', 'gluten-free'],
    category: 'Drinks',
  },
  {
    id: 'fb-14',
    name: 'Sparkling Limonata',
    description: 'House-made lemonade, sparkling water, fresh mint',
    price: 6.0,
    calories: 120,
    dietaryTags: ['vegan', 'gluten-free'],
    category: 'Drinks',
  },
];
