/**
 * Claude API client for mood-based food recommendations.
 * Uses direct fetch() -- no Node.js SDK (crashes in React Native).
 */

import type { MenuItem } from '@/types/menu';
import type { Recommendation } from '@/types/recommendation';
import { buildFallbackRecommendations } from '@/constants/fallbackRecommendations';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const TIMEOUT_MS = 20_000;

let forceFallback = false;

/** Toggle force-fallback mode for hidden dev toggle. */
export function toggleForceFallback(): void {
  forceFallback = !forceFallback;
}

/** Check if force-fallback is currently active. */
export function isForceFallback(): boolean {
  return forceFallback;
}

interface ClaudeRawReco {
  menuItemId: string;
  matchPercent: number;
  reasoning: string;
  foodEmoji: string;
  crowdFavePercent: number;
  popularityTag: string;
  estimatedCalories: number;
}

function buildSystemPrompt(menuItems: MenuItem[], moodId: string): string {
  const menuJSON = JSON.stringify(
    menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      calories: item.calories,
      category: item.category,
    }))
  );

  return `You are a witty food recommendation expert. Given a restaurant menu and a dining mood, recommend 3-5 dishes that best match the mood.

Mood: "${moodId}"

Menu items:
${menuJSON}

Return ONLY a valid JSON array (no markdown, no explanation) with objects containing:
- menuItemId: string (must match an item's id from the menu)
- matchPercent: number (70-99, how well this dish matches the mood)
- reasoning: string (1-2 witty, fun sentences explaining why this dish matches the mood)
- foodEmoji: string (single food emoji matching the dish type, e.g. "🍗")
- crowdFavePercent: number (60-95, a plausible fake popularity percentage)
- popularityTag: string (one of: "Chef's Pick", "Hidden Gem", "Crowd Fave")
- estimatedCalories: number (your best estimate of total calories for the dish, e.g. 450)

Sort by matchPercent descending. Be creative and fun with your reasoning -- this is for a food app that wants to make people smile.`;
}

/**
 * Generate mood-based food recommendations using Claude API.
 * Falls back to hardcoded recommendations on any failure.
 */
export async function generateRecommendations(
  menuItems: MenuItem[],
  moodId: string,
  apiKey: string
): Promise<Recommendation[]> {
  if (forceFallback || !apiKey) {
    return buildFallbackRecommendations(menuItems, moodId);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(menuItems, moodId),
        messages: [
          {
            role: 'user',
            content: `Recommend dishes from this menu for someone in a "${moodId}" mood. Return only the JSON array.`,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`[claude] API error ${response.status}: ${errorText}`);
      return buildFallbackRecommendations(menuItems, moodId);
    }

    const data = await response.json();
    const text: string | undefined = data?.content?.[0]?.text;

    if (!text) {
      console.warn('[claude] Empty response from Claude');
      return buildFallbackRecommendations(menuItems, moodId);
    }

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    console.log('[claude] Raw response (first 200 chars):', cleaned.slice(0, 200));

    const rawRecos: ClaudeRawReco[] = JSON.parse(cleaned);

    if (!Array.isArray(rawRecos) || rawRecos.length === 0) {
      console.warn('[claude] Invalid or empty recommendation array');
      return buildFallbackRecommendations(menuItems, moodId);
    }

    // Map raw recommendations to our Recommendation type
    const menuMap = new Map(menuItems.map((item) => [item.id, item]));

    const recommendations: Recommendation[] = rawRecos
      .filter((raw) => menuMap.has(raw.menuItemId))
      .map((raw, index) => {
        const menuItem = menuMap.get(raw.menuItemId)!;
        return {
          id: `claude-${moodId}-${index}`,
          item: {
            ...menuItem,
            calories: menuItem.calories ?? raw.estimatedCalories ?? null,
          },
          matchPercent: Math.min(99, Math.max(70, raw.matchPercent)),
          reasoning: raw.reasoning,
          moodId,
          saved: false,
          foodEmoji: raw.foodEmoji,
          crowdFavePercent: Math.min(95, Math.max(60, raw.crowdFavePercent)),
          popularityTag: raw.popularityTag,
        };
      });

    // If no valid matches were found, fall back
    if (recommendations.length === 0) {
      console.warn('[claude] No matching menu items in response, using fallback');
      return buildFallbackRecommendations(menuItems, moodId);
    }

    return recommendations;
  } catch (error) {
    clearTimeout(timeout);
    console.warn('[claude] Failed, using fallback:', error);
    return buildFallbackRecommendations(menuItems, moodId);
  }
}
