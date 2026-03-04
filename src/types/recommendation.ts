import { MenuItem } from "./menu";

export interface Recommendation {
  id: string;
  item: MenuItem;
  matchPercent: number;
  reasoning: string;
  moodId: string;
  saved: boolean;
}
