
## Dish Photos
- **Priority:** P2 (nice-to-have before demo)
- **Idea:** Dynamically fetch/generate food images for recommendation cards
- **Approach:** Use Unsplash free API — search by dish name, grab first result, show with shimmer placeholder while loading. Fallback to food emoji (already works).
- **Effort:** ~30 min
- **Files:** `src/services/images.ts` (new), `app/results.tsx` (add `<Image>` to card)
