/**
 * Gemini 2.5 Flash REST API client for menu extraction.
 * Uses direct fetch() -- no Node.js SDK (crashes in React Native).
 */

export interface RawMenuItem {
  name: string;
  description?: string;
  price?: number | null;
  category?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const EXTRACTION_PROMPT = `You are a menu extraction assistant. Extract ALL menu items from this restaurant menu image.

For each item, provide:
- name (required): The dish name exactly as written
- description: A brief description if visible
- price: The numeric price as a whole number in the menu's local currency (e.g. 3450 for ₱3,450 or 299 for ₱299). Do NOT divide or convert — use the exact number shown. Use null if not visible.
- category: The menu section/category (e.g. "Appetizers", "Mains", "Desserts")

Include every item you can see, even if some fields are missing. Preserve the original category groupings from the menu.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    items: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          description: { type: 'STRING' },
          price: { type: 'NUMBER', nullable: true },
          category: { type: 'STRING' },
        },
        required: ['name'],
      },
    },
  },
  required: ['items'],
};

export async function extractMenuItems(
  base64Image: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<{ items: RawMenuItem[] }> {
  const url = `${GEMINI_URL}?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned no candidates or empty response');
  }

  const parsed = JSON.parse(text) as { items: RawMenuItem[] };
  return parsed;
}
