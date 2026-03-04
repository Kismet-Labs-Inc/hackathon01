# Phase 3: Recommendations & Ordering - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

User completes the full demo loop — pick a mood from 6 cards (or Surprise Me), see AI-generated recommendation cards ranked by match %, save items with "I'll get this", and view an order summary with totals. Filters, post-meal rating, Taste DNA, and sharing are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Mood card interactions
- Tap-and-go: tap a mood card → brief selection animation → auto-navigate to results after ~0.5s
- No confirm button — immediate, demo-friendly flow
- Show real item count from scan at top: "We found 14 items on this menu. Set the mood." (pulls from useMenuStore)
- Scale bounce (1.05x) + coral border glow on tap as selection feedback
- Match Stitch dark card style exactly: #1A1A1A cards, emoji + label + short description, 2-column grid
- Surprise Me is full-width at bottom of grid, matching Stitch layout

### Recommendation cards
- Emoji-based food visuals instead of real photos (Gemini returns text only) — large food emoji per card based on dish type
- 3-5 recommendation cards per mood selection
- Each card shows: food emoji, dish name, match %, witty reasoning, price, calories, dietary tags
- Include fake crowd fave % and popularity tags — AI generates plausible values, impressive for demo
- "I'll get this" coral button on each card
- Claude Opus 4.6 for recommendation AI (stronger reasoning for witty mood-to-food matching), direct fetch() like Gemini
- Demo fallback: hardcoded cached recommendation response, same pattern as Phase 2 menu scanning (silent swap on API failure + hidden dev toggle)

### Surprise Me reveal
- Card flip animation — face-down card flips to reveal the pick using reanimated 3D flip effect
- Two-stage reveal: brief roulette through mood emojis first (lands on a random mood), then reveals top pick for that mood
- One card only with re-roll option — "I'll get this" or "Nah, pick again" (re-rolls once)
- Bold and opinionated: true surprise, not a filtered view

### Save flow & order summary
- Toggle button on card: coral "I'll get this" toggles to green checkmark "Saved" state, tap again to unsave
- Sticky bottom bar slides up when first item saved: "{N} items saved | View order >"
- Order summary shows: saved items list with emoji + name + price + calories, total cost, total calories
- Skip Phase 4 features entirely (no Taste DNA card, no share buttons, no rate button) — clean Phase 3 scope
- "Scan another menu" restart button navigates back to scan screen for demo loop

### Claude's Discretion
- Recommendation card layout/spacing details
- Loading state while AI generates recommendations
- Error handling and retry behavior
- Exact flip animation timing and easing
- Mood emoji roulette speed and duration
- Sticky bar animation style
- Order summary visual layout
- Prompt engineering for Claude API recommendation quality

</decisions>

<specifics>
## Specific Ideas

- Stitch mood mockup (3-mood-stitch.png): 2x3 grid with dark cards, emoji + label + description, "Surprise me" at bottom
- Stitch results mockup (4-results-stitch.png): Scrollable cards with food images (adapt to emojis), match %, "I'll get this" button
- Stitch save-items mockup (5-save-items-stitch.png): Same cards with "Saved" toggle state, sticky bottom bar "2 items saved | View order >"
- Stitch order mockup (6-order-stitch.png): Item list with prices/calories, totals at bottom (skip Taste DNA and share buttons for Phase 3)
- The count-up pattern from Phase 2 scan success can be reused for match % animation on recommendation cards
- Demo fallback cache pattern from Phase 2 should be replicated for recommendation API

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/mood.ts`: MOODS array (6 moods) and SURPRISE_ME already defined with id, label, emoji, description
- `src/types/recommendation.ts`: Recommendation interface with id, item, matchPercent, reasoning, moodId, saved
- `src/stores/useMenuStore.ts`: Zustand store with menu items — source for item count on mood screen and menu data for AI
- `src/components/ui/BackButton.tsx`: Floating back button styled for dark theme
- `src/theme/tokens.ts`: Full design system tokens (colors, spacing, borderRadius)
- `src/services/gemini.ts`: fetch()-based API pattern — recommendation service should follow same structure

### Established Patterns
- expo-router file-based routing: screens in `app/` directory
- `@/*` path alias for src imports
- `react-native-reanimated` withTiming for native-driven animations
- `StyleSheet.create` with imported theme tokens
- Zustand for state management (useMenuStore pattern)
- State machine pattern for multi-state screens (from Phase 2 scan screen)
- AnimatedTextInput pattern for count-up number displays
- Demo fallback pattern: hardcoded cache + silent swap on API failure + hidden dev toggle

### Integration Points
- `app/mood.tsx`: Placeholder exists — will be replaced with mood grid
- `app/results.tsx`: Placeholder exists — will be replaced with recommendation cards
- `app/order.tsx`: Placeholder exists — will be replaced with order summary
- Navigation: mood → results → order already wired via router.push
- Menu items from useMenuStore feed into AI recommendation prompt
- New Zustand store needed for recommendations/saved items (or extend existing)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-recommendations-ordering*
*Context gathered: 2026-03-05*
