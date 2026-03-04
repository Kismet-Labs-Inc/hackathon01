import type { MenuItem } from '@/types/menu';
import type { Recommendation } from '@/types/recommendation';

export interface FallbackReco {
  menuItemName: string;
  matchPercent: number;
  reasoning: string;
  foodEmoji: string;
  crowdFavePercent: number;
  popularityTag: string;
}

export const FALLBACK_RECOMMENDATIONS: Record<string, FallbackReco[]> = {
  comfort: [
    {
      menuItemName: 'Short Rib Pappardelle',
      matchPercent: 96,
      reasoning:
        "Nothing says 'hug on a plate' like braised short rib draped over fresh pasta. Your comfort food spirit animal, served al dente.",
      foodEmoji: '\u{1F35D}',
      crowdFavePercent: 91,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Chicken Milanese',
      matchPercent: 89,
      reasoning:
        'Crispy, golden, and utterly satisfying -- this is the warm blanket of the chicken world. Arugula on top makes it fancy comfort.',
      foodEmoji: '\u{1F357}',
      crowdFavePercent: 84,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Wild Mushroom Risotto',
      matchPercent: 85,
      reasoning:
        "Creamy risotto with truffle oil is basically a warm hug from an Italian grandmother you didn't know you had.",
      foodEmoji: '\u{1F344}',
      crowdFavePercent: 78,
      popularityTag: 'Hidden Gem',
    },
    {
      menuItemName: 'Truffle Fries',
      matchPercent: 82,
      reasoning:
        "When fries get the truffle treatment, comfort food levels go from 'nice' to 'I'm never leaving this table'.",
      foodEmoji: '\u{1F35F}',
      crowdFavePercent: 88,
      popularityTag: 'Crowd Fave',
    },
  ],

  light: [
    {
      menuItemName: 'Grilled Salmon',
      matchPercent: 95,
      reasoning:
        "Light but never boring -- this salmon is your 'I'm being healthy but make it delicious' power move.",
      foodEmoji: '\u{1F41F}',
      crowdFavePercent: 87,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Burrata Caprese',
      matchPercent: 91,
      reasoning:
        'Creamy burrata meets heirloom tomatoes in the freshest thing on this menu. Your Instagram will thank you.',
      foodEmoji: '\u{1F345}',
      crowdFavePercent: 82,
      popularityTag: 'Hidden Gem',
    },
    {
      menuItemName: 'Panna Cotta',
      matchPercent: 78,
      reasoning:
        "A light, silky finish that says 'I have self-control' while still treating yourself. Berry compote seals the deal.",
      foodEmoji: '\u{1F36E}',
      crowdFavePercent: 74,
      popularityTag: 'Hidden Gem',
    },
  ],

  adventurous: [
    {
      menuItemName: 'Crispy Calamari',
      matchPercent: 92,
      reasoning:
        "Tentacles first! Nothing says 'I live on the edge' like starting with fried squid and marinara.",
      foodEmoji: '\u{1F419}',
      crowdFavePercent: 85,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Short Rib Pappardelle',
      matchPercent: 88,
      reasoning:
        "Braised for hours, bold red wine reduction -- this dish didn't play it safe and neither should you.",
      foodEmoji: '\u{1F356}',
      crowdFavePercent: 91,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Espresso Martini',
      matchPercent: 84,
      reasoning:
        "Who needs dessert when your cocktail has coffee AND vodka? Adventure tastes like caffeine and poor decisions.",
      foodEmoji: '\u{1F378}',
      crowdFavePercent: 89,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Wild Mushroom Risotto',
      matchPercent: 80,
      reasoning:
        'Porcini, shiitake, and truffle oil walk into a risotto. Bold flavor trifecta for the fearless palate.',
      foodEmoji: '\u{1F344}',
      crowdFavePercent: 78,
      popularityTag: 'Hidden Gem',
    },
  ],

  date: [
    {
      menuItemName: 'Burrata Caprese',
      matchPercent: 95,
      reasoning:
        "Burrata literally oozes sophistication. Share it, lock eyes over the balsamic glaze, and you're golden.",
      foodEmoji: '\u{1F9C0}',
      crowdFavePercent: 82,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Grilled Salmon',
      matchPercent: 90,
      reasoning:
        "Elegant, clean, and says 'I know how to order at a nice restaurant.' Lemon butter is the wingman you deserve.",
      foodEmoji: '\u{1F41F}',
      crowdFavePercent: 87,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Italian Spritz',
      matchPercent: 87,
      reasoning:
        "The official drink of 'we're having a moment.' Aperol, prosecco, and an orange slice that screams good taste.",
      foodEmoji: '\u{1F379}',
      crowdFavePercent: 92,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Tiramisu',
      matchPercent: 83,
      reasoning:
        "Share a tiramisu and suddenly you're in a rom-com. Espresso-soaked perfection for two (or just you, no judgment).",
      foodEmoji: '\u{1F370}',
      crowdFavePercent: 88,
      popularityTag: "Chef's Pick",
    },
  ],

  hungover: [
    {
      menuItemName: 'Truffle Fries',
      matchPercent: 97,
      reasoning:
        "Greasy, salty, truffle-scented salvation. These fries don't judge your life choices from last night.",
      foodEmoji: '\u{1F35F}',
      crowdFavePercent: 93,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Margherita Pizza',
      matchPercent: 92,
      reasoning:
        "Carbs, cheese, and tomato sauce -- the holy trinity of hangover recovery. Wood-fired for that extra soul-healing warmth.",
      foodEmoji: '\u{1F355}',
      crowdFavePercent: 90,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Chicken Milanese',
      matchPercent: 85,
      reasoning:
        "Crispy fried chicken with carbs? Your hangover called and said 'yes please, and make it golden.'",
      foodEmoji: '\u{1F357}',
      crowdFavePercent: 84,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Sparkling Limonata',
      matchPercent: 80,
      reasoning:
        "Hydration meets citrus meets fizz. The responsible choice that still tastes like you're at a party.",
      foodEmoji: '\u{1F34B}',
      crowdFavePercent: 76,
      popularityTag: 'Hidden Gem',
    },
  ],

  sweet: [
    {
      menuItemName: 'Chocolate Lava Cake',
      matchPercent: 98,
      reasoning:
        "Warm, molten, and unapologetically indulgent. This cake has a gooey center and zero regrets. Vanilla gelato? Chef's kiss.",
      foodEmoji: '\u{1F36B}',
      crowdFavePercent: 94,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Tiramisu',
      matchPercent: 93,
      reasoning:
        "Coffee meets cream meets cocoa in the ultimate Italian dessert flex. Sweet tooth: fully activated.",
      foodEmoji: '\u{1F370}',
      crowdFavePercent: 90,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Panna Cotta',
      matchPercent: 88,
      reasoning:
        "Silky vanilla custard with berry compote is the elegant way to demolish your sugar craving. Mint garnish for the aesthetic.",
      foodEmoji: '\u{1F36E}',
      crowdFavePercent: 82,
      popularityTag: 'Hidden Gem',
    },
  ],

  // Surprise picks a random mood, but we also provide a fallback for the "surprise" id itself
  surprise: [
    {
      menuItemName: 'Crispy Calamari',
      matchPercent: 90,
      reasoning:
        "The dice rolled and fate chose tentacles. Crispy, tangy, and a bold opener -- destiny has good taste.",
      foodEmoji: '\u{1F419}',
      crowdFavePercent: 85,
      popularityTag: 'Crowd Fave',
    },
    {
      menuItemName: 'Short Rib Pappardelle',
      matchPercent: 88,
      reasoning:
        "Random chance brought you to braised perfection. Sometimes the universe just knows what you need.",
      foodEmoji: '\u{1F35D}',
      crowdFavePercent: 91,
      popularityTag: "Chef's Pick",
    },
    {
      menuItemName: 'Espresso Martini',
      matchPercent: 84,
      reasoning:
        "Surprise! It's caffeinated AND boozy. The dice giveth and the dice giveth a really good cocktail.",
      foodEmoji: '\u{1F378}',
      crowdFavePercent: 89,
      popularityTag: 'Crowd Fave',
    },
  ],
};

/**
 * Build Recommendation objects from fallback data by matching menu item names.
 * Falls back to the first N items if no name match is found.
 */
export function buildFallbackRecommendations(
  menuItems: MenuItem[],
  moodId: string
): Recommendation[] {
  const fallbacks = FALLBACK_RECOMMENDATIONS[moodId] ?? FALLBACK_RECOMMENDATIONS['surprise'] ?? [];

  return fallbacks.map((fb, index) => {
    // Try to find matching menu item by name (case-insensitive)
    const matchedItem =
      menuItems.find(
        (item) => item.name.toLowerCase() === fb.menuItemName.toLowerCase()
      ) ?? menuItems[index % menuItems.length];

    // If we still have no item (empty menu), create a minimal one
    if (!matchedItem) {
      return {
        id: `fallback-${moodId}-${index}`,
        item: {
          id: `synth-${index}`,
          name: fb.menuItemName,
          description: '',
          price: 0,
        },
        matchPercent: fb.matchPercent,
        reasoning: fb.reasoning,
        moodId,
        saved: false,
        foodEmoji: fb.foodEmoji,
        crowdFavePercent: fb.crowdFavePercent,
        popularityTag: fb.popularityTag,
      };
    }

    return {
      id: `fallback-${moodId}-${index}`,
      item: matchedItem,
      matchPercent: fb.matchPercent,
      reasoning: fb.reasoning,
      moodId,
      saved: false,
      foodEmoji: fb.foodEmoji,
      crowdFavePercent: fb.crowdFavePercent,
      popularityTag: fb.popularityTag,
    };
  });
}
