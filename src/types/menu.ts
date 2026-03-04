export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories?: number;
  dietaryTags?: string[];
  category?: string;
}
