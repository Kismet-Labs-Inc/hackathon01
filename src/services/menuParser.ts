import type { MenuItem } from '@/types/menu';
import { extractMenuItems, RawMenuItem } from '@/services/gemini';
import { FALLBACK_MENU } from '@/constants/fallbackMenu';

const TIMEOUT_MS = 15_000;

let forceFallback = false;

/** Toggle force-fallback mode for hidden dev toggle. */
export function toggleForceFallback(): void {
  forceFallback = !forceFallback;
}

/** Check if force-fallback is currently active. */
export function isForceFallback(): boolean {
  return forceFallback;
}

/**
 * Normalize a raw Gemini item into our MenuItem shape.
 */
function normalizeItem(raw: RawMenuItem): MenuItem {
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);

  let description = raw.description ?? '';
  let price = typeof raw.price === 'number' ? raw.price : 0;

  if (price === 0 && !description.includes('Price N/A')) {
    description = description ? `${description} (Price N/A)` : 'Price N/A';
  }

  return {
    id,
    name: raw.name,
    description,
    price,
    category: raw.category ?? 'Uncategorized',
  };
}

/**
 * Parse a menu photo via Gemini API with timeout and silent fallback.
 *
 * - If forceFallback is on, returns cached data immediately.
 * - Otherwise calls Gemini with a 15s timeout.
 * - On any failure (network, timeout, parse), silently returns fallback data.
 */
export async function parseMenuPhoto(
  base64: string,
  apiKey: string
): Promise<MenuItem[]> {
  if (forceFallback) {
    return FALLBACK_MENU;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await extractMenuItems(base64, apiKey, controller.signal);
    clearTimeout(timeout);

    if (!result.items || result.items.length === 0) {
      console.warn('[menuParser] Gemini returned empty items, using fallback');
      return FALLBACK_MENU;
    }

    return result.items.map(normalizeItem);
  } catch (error) {
    clearTimeout(timeout);
    console.warn('[menuParser] Gemini failed, using fallback:', error);
    return FALLBACK_MENU;
  }
}
