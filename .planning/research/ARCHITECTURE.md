# Architecture Research

**Domain:** Mobile AI-powered food recommendation app (hackathon prototype)
**Researched:** 2026-03-04
**Confidence:** HIGH

## System Overview

```
+-----------------------------------------------------------------------+
|                         PRESENTATION LAYER                            |
|  +------------+  +-----------+  +-----------+  +-------------------+  |
|  | Welcome    |  | Scan/     |  | Mood      |  | Results / Order   |  |
|  | Screen     |  | Camera    |  | Selector  |  | Summary Screens   |  |
|  +-----+------+  +-----+-----+  +-----+-----+  +--------+--------+  |
|        |               |              |                   |           |
+--------+---------------+--------------+-------------------+-----------+
|                        APP STATE (Zustand)                            |
|  +-------------+  +----------------+  +-------------------+           |
|  | menuStore   |  | sessionStore   |  | savedItemsStore   |           |
|  | (parsed     |  | (selected mood,|  | (user picks,      |           |
|  |  menu items)|  |  filters)      |  |  order totals)    |           |
|  +------+------+  +-------+--------+  +--------+----------+           |
+---------+------------------+---------------------+--------------------+
|                        SERVICE LAYER                                  |
|  +-------------------+  +--------------------+                        |
|  | menuService       |  | recommendService   |                        |
|  | (Gemini OCR call) |  | (Claude API call)  |                        |
|  +--------+----------+  +---------+----------+                        |
+-----------|----------------------------|---------+--------------------+
            |                            |         |
            v                            v         |
   +--------+--------+    +-------------+------+   |
   | Google Gemini    |    | Anthropic Claude   |   |
   | 3.1 Flash Lite   |    | Opus 4.6 API       |   |
   | (Menu OCR)       |    | (Recommendations)  |   |
   +-----------------+    +--------------------+   |
                                                   |
            +--------------------------------------+
            |  expo-image-picker (Camera/Gallery)
            +--------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| Welcome Screen | Branding, single CTA to scan | Static screen, one button |
| Scan Screen | Capture menu photo via camera or gallery | expo-image-picker, base64 encoding |
| Mood Selector | Display 6 mood cards + "Surprise me" | Grid of pressable cards |
| Results Screen | Show AI recommendations with match %, price, calories | ScrollView of recommendation cards |
| Order Summary | Display saved picks with totals | FlatList + computed totals |
| menuStore | Hold parsed menu items from OCR | Zustand store |
| sessionStore | Hold current mood, any active filters | Zustand store |
| savedItemsStore | Hold user's "I'll get this" picks | Zustand store |
| menuService | Send photo to Gemini, parse structured menu data | Async function, fetch API |
| recommendService | Send menu items + mood to Claude, get ranked recommendations | Async function, fetch API |

## Recommended Project Structure

```
app/                          # Expo Router file-based routes
  _layout.tsx                 # Root layout (Stack navigator)
  index.tsx                   # Welcome screen (/)
  scan.tsx                    # Scan/camera screen (/scan)
  mood.tsx                    # Mood selector (/mood)
  results.tsx                 # Results screen (/results)
  order.tsx                   # Order summary (/order)

src/
  components/                 # Reusable UI components
    MoodCard.tsx              # Single mood option card
    RecommendationCard.tsx    # Food recommendation card with match %
    SavedItemRow.tsx          # Row in order summary
    LoadingOverlay.tsx        # Loading state during API calls
    Button.tsx                # Styled button (coral CTA)
  services/                   # API integration
    menu-service.ts           # Gemini OCR: image -> structured menu
    recommend-service.ts      # Claude: menu + mood -> recommendations
  stores/                     # Zustand state
    menu-store.ts             # Parsed menu items
    session-store.ts          # Current mood, filters
    saved-items-store.ts      # User's saved picks
  types/                      # TypeScript interfaces
    menu.ts                   # MenuItem, ParsedMenu
    recommendation.ts         # Recommendation, MatchResult
    mood.ts                   # Mood enum/type
  constants/                  # App constants
    moods.ts                  # Mood definitions (label, emoji, description)
    theme.ts                  # Colors, spacing, fonts
    api.ts                    # API endpoints, keys (from env)
  utils/                      # Helpers
    image.ts                  # Base64 encoding, image resize
    format.ts                 # Price/calorie formatting

assets/                       # Static assets
  fonts/                      # Plus Jakarta Sans
```

### Structure Rationale

- **app/:** Expo Router file-based routing. Each screen is a route file. Keeps navigation declarative and simple -- five files for five screens.
- **src/components/:** Shared UI pieces. The recommendation card and mood card are the core visual elements from the mockups. Keep them isolated for easy styling iteration.
- **src/services/:** Isolate API calls from UI. This is critical -- when an API call shape changes (prompt tweaking, response parsing), you only touch one file. Services return typed data, screens consume it.
- **src/stores/:** Zustand stores grouped by data domain. No providers needed. Screens import hooks directly. Three stores keep concerns separated while staying dead simple.
- **src/types/:** Shared TypeScript interfaces. Prevents the classic hackathon bug where the OCR response shape doesn't match what the results screen expects.

## Architectural Patterns

### Pattern 1: Direct API Calls (No Backend)

**What:** Call Gemini and Claude APIs directly from the React Native app using fetch. No backend server, no serverless functions, no proxy.
**When to use:** Hackathon prototypes where security is not a concern and speed of development is paramount.
**Trade-offs:** API keys are embedded in the app (unacceptable for production, fine for a demo). Eliminates an entire deployment layer. Removes the #1 hackathon time-sink (backend infra).

**Example:**
```typescript
// src/services/menu-service.ts
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function parseMenu(imageBase64: string): Promise<MenuItem[]> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: MENU_PARSE_PROMPT },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: MENU_SCHEMA
      }
    })
  });
  const data = await response.json();
  return parseGeminiResponse(data);
}
```

### Pattern 2: Zustand Stores as Data Pipeline

**What:** Use Zustand stores as the glue between screens. Each screen reads from stores and writes to stores. Screens never talk to each other directly.
**When to use:** Multi-screen flows where data from step 1 feeds into step 3.
**Trade-offs:** Simple mental model. No prop drilling. No context providers. Store shape becomes a contract between screens.

**Example:**
```typescript
// src/stores/menu-store.ts
import { create } from 'zustand';
import { MenuItem } from '../types/menu';

interface MenuStore {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: MenuItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  setItems: (items) => set({ items, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () => set({ items: [], isLoading: false, error: null }),
}));
```

### Pattern 3: Structured Output Prompts for Reliable Parsing

**What:** Use Gemini's `responseMimeType: 'application/json'` with a `responseSchema` for OCR, and Claude's system prompt with explicit JSON schema instructions for recommendations. Both return typed, parseable JSON.
**When to use:** Any time you need to display API results in structured UI components (cards, lists, summaries).
**Trade-offs:** Slightly more upfront prompt engineering, but eliminates regex parsing, reduces hallucination-induced crashes, and means your TypeScript types match the API response shape.

**Example (Claude recommendation prompt):**
```typescript
// src/services/recommend-service.ts
const SYSTEM_PROMPT = `You are a food recommendation engine. Given a list of menu items
and a user's mood, return recommendations as a JSON array.

Each recommendation must include:
- name: string (exact menu item name)
- matchPercent: number (0-100, how well it fits the mood)
- reason: string (1 sentence explaining the match)
- price: number (from menu)
- calories: number (estimated if not on menu)
- dietaryTags: string[] (e.g., "vegetarian", "gluten-free", "contains nuts")

Return the top 5 items sorted by matchPercent descending.
Respond with ONLY valid JSON. No markdown, no explanation.`;
```

## Data Flow

### Primary Flow: Scan -> Mood -> Recommendations

```
[User taps "Scan a Menu"]
    |
    v
[expo-image-picker] --> camera or photo library
    |
    v
[Image captured as base64]
    |
    v
[menuService.parseMenu(base64)] --> Gemini 3.1 Flash Lite API
    |                                    |
    |                                    v
    |                              [Structured JSON response]
    |                              { items: [{ name, price, description, ... }] }
    |
    v
[menuStore.setItems(parsedItems)]
    |
    v
[Navigate to /mood] --> User sees "We found 24 items"
    |
    v
[User taps a mood card, e.g., "Impress a Date"]
    |
    v
[sessionStore.setMood("impress-a-date")]
    |
    v
[recommendService.getRecommendations(menuItems, mood)] --> Claude Opus 4.6 API
    |                                                           |
    |                                                           v
    |                                                     [JSON array of ranked items]
    |                                                     [{ name, matchPercent, reason, ... }]
    |
    v
[sessionStore.setRecommendations(results)]
    |
    v
[Navigate to /results] --> User sees recommendation cards
    |
    v
[User taps "I'll get this" on cards]
    |
    v
[savedItemsStore.addItem(item)]
    |
    v
[Navigate to /order] --> User sees order summary with totals
```

### State Management

```
menuStore          sessionStore          savedItemsStore
  |                     |                       |
  | items[]             | mood                  | savedItems[]
  | isLoading           | recommendations[]     | totalCost (computed)
  | error               | filters               | totalCalories (computed)
  |                     |                       |
  +--- Scan Screen      +--- Mood Screen        +--- Results Screen
       writes                writes                   writes
  +--- Mood Screen      +--- Results Screen     +--- Order Screen
       reads (count)         reads                    reads
  +--- Results Screen
       reads (full)
```

### Key Data Flows

1. **Image to Menu Items:** Scan screen captures image -> base64 encode -> send to Gemini with structured output schema -> parse response -> store in menuStore. This is the most latency-sensitive step (2-5 seconds expected).

2. **Menu + Mood to Recommendations:** Mood screen reads item count from menuStore for display ("We found 24 items"). On mood selection, full items array + mood are sent to Claude -> Claude returns ranked recommendations with match percentages -> store in sessionStore.

3. **Recommendations to Order:** Results screen reads from sessionStore. "I'll get this" button writes to savedItemsStore. Order screen computes totals from savedItemsStore (reduce over prices and calories).

## Build Order (Critical Path)

This is a one-night hackathon. Build order is dictated by what unblocks the demo flow.

| Order | What to Build | Why This Order | Time Estimate |
|-------|---------------|----------------|---------------|
| 1 | Project scaffold + navigation | Everything depends on having routes | 15 min |
| 2 | Theme constants + Button component | Every screen needs styled components | 15 min |
| 3 | Types (MenuItem, Recommendation, Mood) | Services and screens both need these | 10 min |
| 4 | menuService (Gemini OCR integration) | This is the riskiest integration -- prove it works early | 30 min |
| 5 | Scan screen (image picker + call menuService) | First screen with real functionality -- test end-to-end OCR | 30 min |
| 6 | Zustand stores (all three) | Screens need stores to pass data | 15 min |
| 7 | Mood screen (6 cards + navigation) | Mostly UI, reads from menuStore | 20 min |
| 8 | recommendService (Claude integration) | Second API integration -- need menu data from step 4-5 to test | 30 min |
| 9 | RecommendationCard component | Core visual element for results | 20 min |
| 10 | Results screen (display recommendations, "I'll get this") | Ties together stores + recommendService | 30 min |
| 11 | Order summary screen | Reads from savedItemsStore, computes totals | 20 min |
| 12 | Welcome screen | Simplest screen -- branding + CTA, do last since it's trivial | 10 min |
| 13 | Loading states + error handling | Polish pass -- skeleton loaders, retry buttons | 20 min |
| 14 | Visual polish to match Stitch mockups | Dark theme, coral accents, rounded cards, fonts | 30 min |

**Total estimated: ~5 hours for MVP flow**

**Critical path:** Steps 1-5 prove the hardest integration (OCR). If Gemini doesn't work, you know in the first 90 minutes and can pivot to manual menu entry as fallback. Steps 6-10 complete the recommendation flow. Steps 11-14 are polish.

## Anti-Patterns

### Anti-Pattern 1: Building Backend Infrastructure

**What people do:** Spin up an Express/Fastify server or deploy serverless functions to proxy API calls, thinking "I need a backend."
**Why it's wrong for this context:** For a one-night hackathon demo, backend infrastructure is pure overhead. You'll spend 1-2 hours on deployment, CORS, env vars, and debugging connectivity that contributes zero to the demo experience.
**Do this instead:** Call APIs directly from the app. Hardcode API keys in environment variables (EXPO_PUBLIC_*). Accept the security trade-off for demo speed.

### Anti-Pattern 2: Over-Engineering State Management

**What people do:** Set up Redux with slices, middleware, thunks, or use React Query for API caching, or build elaborate context providers.
**Why it's wrong for this context:** This is a linear flow app with three stores. There is no complex state synchronization. Redux setup time alone would eat 45+ minutes.
**Do this instead:** Three Zustand stores with flat state. No middleware, no persist, no devtools. The entire state layer should be under 100 lines total.

### Anti-Pattern 3: Handling Every Edge Case Upfront

**What people do:** Build comprehensive error handling, retry logic, offline support, and input validation before the happy path works.
**Why it's wrong for this context:** The demo is the happy path. Judges will not test edge cases. Every minute on error handling is a minute not spent on the demo flow.
**Do this instead:** Build the happy path first. Add a single loading spinner and a generic "Something went wrong, try again" fallback. That is sufficient for demo day.

### Anti-Pattern 4: Live Camera OCR

**What people do:** Try to implement real-time camera scanning with frame-by-frame OCR processing.
**Why it's wrong for this context:** Real-time OCR requires frame throttling, debouncing, partial result merging, and camera permission flows that are notoriously flaky on different devices. This is the #1 way to burn 3 hours and have nothing to show.
**Do this instead:** Use expo-image-picker to capture a single photo. One image, one API call, one result. The scan screen mockup shows live OCR UI, but the MVP implementation should be photo capture with a "Menu Scan" button that sends a single frame.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Gemini 3.1 Flash Lite | REST API via fetch, base64 image in request body | Use `responseMimeType: 'application/json'` + `responseSchema` for structured output. Free tier: 30 RPM. Expect 2-5s latency for menu images. |
| Claude Opus 4.6 | REST API via fetch, JSON messages format | System prompt defines output schema. Send menu items as JSON in user message. Expect 3-8s for recommendation generation. Use `max_tokens: 2048` to keep response focused. |
| expo-image-picker | Native module, returns image URI and base64 | Set `base64: true` in options to avoid a separate file-read step. Set `quality: 0.7` to reduce payload size without losing text readability. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Screens <-> Stores | Zustand hooks (useMenuStore, etc.) | Screens read via selectors, write via actions. No direct screen-to-screen data passing. |
| Screens <-> Services | Direct async function calls | Scan screen calls menuService, results screen triggers recommendService. Services return typed data. |
| Services <-> External APIs | fetch with JSON body/response | Services own prompt construction and response parsing. Screens never see raw API responses. |

## Hackathon-Specific Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| No navigation library beyond Expo Router | File-based routing is zero-config. Stack navigation is the default. No drawer, no tabs needed for this linear flow. |
| API keys in EXPO_PUBLIC_ env vars | Insecure but fast. Create a `.env` file, never commit it. For production, you'd proxy through a backend. |
| No persistent storage | App state resets on close. No AsyncStorage, no SQLite. The demo is a single session. |
| No authentication | Zero onboarding by design. No user accounts means no auth infra. |
| Fake Taste DNA | The "Your Taste DNA is evolving" card on the order screen is static/hardcoded text. No actual preference learning. |
| Single-language (English) | Menu OCR prompt assumes English menus. Demo with an English menu. |

## Sources

- [Expo ImagePicker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Router Introduction](https://docs.expo.dev/router/introduction/)
- [Expo App Folder Structure Best Practices](https://expo.dev/blog/expo-app-folder-structure-best-practices)
- [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Gemini 3.1 Flash Lite Announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-lite/)
- [Gemini API Models Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [anthropic-react-native (backmesh)](https://github.com/backmesh/anthropic-react-native) -- reference for API calling patterns, though we recommend raw fetch for simplicity

---
*Architecture research for: Cravr - mobile AI food recommendation app (hackathon)*
*Researched: 2026-03-04*
