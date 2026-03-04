# Phase 2: Menu Scanning - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

User can photograph a restaurant menu using the device camera (or gallery), have it processed by Gemini OCR, and see the parsed menu data stored for downstream recommendation. The scan screen replaces the Phase 1 placeholder. Creating recommendations, mood selection, and ordering are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Scan screen UI
- In-app camera viewfinder (embedded preview, not launching native camera app)
- Single coral capture button centered at bottom — no mode tabs (remove AUTO/BARCODE from Stitch mockup)
- Gallery icon tucked in corner as secondary option
- Subtle rounded rectangle framing guide overlay on viewfinder + "Position the menu within the frame" hint text
- After capture: show photo preview with "Use This" and "Retake" buttons before processing

### Processing experience
- Animated scan line sweeping across the captured photo while Gemini processes
- No floating item labels during scan — keep it simple, reveal all at once
- Stay on the photo (with scan overlay) during processing — don't navigate to a separate loading screen

### Success transition
- Animated count-up on the scan screen: "Found 14 dishes!" with satisfying number tick-up animation
- Auto-advance to mood screen after ~1.5s
- No intermediate menu review screen — success acknowledgment then straight to mood

### Parsed menu data
- Include items even with missing data (missing price → "Price N/A", missing description → blank)
- Preserve menu categories (Appetizers, Mains, Desserts, etc.) if Gemini can extract them
- MenuItem type already defined in `src/types/menu.ts` — `category` field exists as optional

### Demo reliability
- Hardcoded fallback: cache a known-good Gemini JSON response from a test run
- If Gemini times out or errors, silently swap in cached response — audience never knows
- Hidden developer toggle (triple-tap on logo or similar) to force cached mode before going on stage
- Both auto-fallback AND manual toggle — maximum safety net
- Design the caching pattern to be reusable for Phase 3 recommendations too (same pattern, different data)
- Demo menu choice (real vs staged) decided during testing, not an implementation decision

### Claude's Discretion
- Error handling UX (retry behavior, error messages)
- Timeout duration for Gemini API calls
- Scan line animation style and timing
- Gallery picker implementation details
- Camera permissions flow
- Gemini prompt engineering for menu extraction
- Caching architecture (in-memory, AsyncStorage, etc.)

</decisions>

<specifics>
## Specific Ideas

- Stitch mockup (2-scan-stitch.png) shows the camera viewfinder aesthetic to match — dark with rounded frame, coral accents
- "Found X dishes!" count-up is a key demo moment — should feel satisfying and build confidence the tech works
- The scan line animation makes the processing feel intentional, not like a loading spinner
- Fallback cache means we can demo confidently even on bad WiFi

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/BackButton.tsx`: Floating back button already styled for dark theme
- `src/theme/tokens.ts`: Colors (coral, bg, card), spacing, borderRadius tokens all defined
- `src/theme/fonts.ts`: Plus Jakarta Sans font variants loaded
- `src/types/menu.ts`: MenuItem interface with id, name, description, price, calories?, dietaryTags?, category?

### Established Patterns
- expo-router file-based routing: screens in `app/` directory
- `@/*` path alias maps to `src/*` via tsconfig
- react-native-reanimated `withTiming` for native-driven animations (used in Welcome screen)
- StyleSheet.create pattern with tokens imported from theme
- No state management library set up yet — Zustand planned per roadmap success criteria

### Integration Points
- `app/scan.tsx` exists as placeholder — will be replaced with real implementation
- Navigation: scan → mood already wired (router.push("/mood"))
- Gemini API: direct fetch() only — Node.js AI SDKs crash in React Native (Phase 1 research warning)
- Menu data needs Zustand store to persist between scan → mood → results screens

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-menu-scanning*
*Context gathered: 2026-03-05*
