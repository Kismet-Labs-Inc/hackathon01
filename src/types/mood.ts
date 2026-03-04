export interface Mood {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const MOODS: Mood[] = [
  { id: "comfort", label: "Comfort Food", emoji: "\u{1F372}", description: "Warm, hearty, feels like home" },
  { id: "light", label: "Something Light", emoji: "\u{1F957}", description: "Fresh, healthy, guilt-free" },
  { id: "adventurous", label: "Adventurous", emoji: "\u{1F336}\u{FE0F}", description: "Bold flavors, new experiences" },
  { id: "date", label: "Impress a Date", emoji: "\u{1F377}", description: "Sophisticated, share-worthy" },
  { id: "hungover", label: "Hungover", emoji: "\u{1F373}", description: "Greasy, salty, restorative" },
  { id: "sweet", label: "Sweet Tooth", emoji: "\u{1F370}", description: "Desserts, pastries, indulgence" },
];

export const SURPRISE_ME: Mood = {
  id: "surprise",
  label: "Surprise Me",
  emoji: "\u{1F3B2}",
  description: "Dealer's choice",
};
