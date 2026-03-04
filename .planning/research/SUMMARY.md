# Project Research Summary

**Project:** Cravr — AI-powered menu scanner and mood-based food recommender
**Domain:** Mobile AI food recommendation app (hackathon prototype)
**Researched:** 2026-03-04
**Confidence:** HIGH

## Executive Summary

Cravr is a one-night hackathon build with a clear and well-researched path to a working demo. The product occupies a unique competitive position — it is the only app combining physical menu scanning via phone camera, mood-based selection, and AI dish-level recommendations with match scores. Competitors (BiteRight, MenuGuide, Taranify, MoodBite) each do pieces of this, but none execute the full "Scan. Vibe. Devour." loop. Research confirms this differentiation is real and defensible in a demo setting.

The recommended approach is a tight five-screen Expo/React Native app (SDK 52 for stability) using direct `fetch()` to Gemini for menu OCR and Claude Sonnet for recommendations. No backend, no auth, no database — everything lives in Zustand stores for a single session. The critical path is a linear flow: photo capture -> OCR parsing -> mood selection -> AI recommendations -> save items -> order summary. Build this end-to-end first; polish and add-ons come after. Research estimates 5 hours for the core MVP flow, which is achievable tonight.

The primary risks are operational, not technical. The biggest threats to the demo are: (1) API failures on stage due to venue WiFi or rate limits — mitigation is caching a "golden path" response set before going on stage; (2) garbage OCR output from a poorly-lit or laminated menu — mitigation is testing the exact demo menu early in the build and using Gemini Flash (not Flash Lite) for better accuracy; (3) scope creep past 3am breaking working code — mitigation is tagging `demo-safe` in git once the core flow works and branching all add-ons. Visual polish and mood-differentiated prompts are high-impact, low-effort differentiators that should come before any new feature work.

## Key Findings

### Recommended Stack

The stack is fully resolved with high confidence. Expo SDK 52 (stable since November 2024) is the correct choice — SDK 55 shipped literally the day before the hackathon and has no Expo Go support in the App Store yet. NativeWind v4 with `tailwindcss@^3.4.17` (not v4) handles Cravr's dark design system cleanly. Zustand (three stores, ~100 lines total) handles all state. Direct `fetch()` to both Gemini and Claude REST APIs is the only safe integration approach — the Node.js SDKs (`@anthropic-ai/sdk`, `@google/genai`) crash at runtime in Hermes due to missing `structuredClone` and stream APIs. See `STACK.md` for exact API call patterns, Tailwind config, and installation commands (~8 new packages total).

**Core technologies:**
- Expo SDK 52 + React Native 0.77: App framework — most stable Expo version with full Expo Go support
- Expo Router 4.0: Navigation — zero-config file-based routing, five screen files in `app/`
- NativeWind v4 + tailwindcss@3.4.17: Styling — team knows Tailwind; pinned to v3 (NativeWind v4 incompatible with Tailwind v4)
- Zustand 5.0: State management — three stores (menu, session, savedItems), no boilerplate, no providers
- Gemini 2.0 Flash via fetch(): Menu OCR — direct REST call with base64 image, structured JSON output mode
- Claude Sonnet via fetch(): Recommendations — faster and cheaper than Opus, sub-3s responses, identical API shape
- expo-image-picker: Photo capture — returns base64, handles camera and gallery, set `quality: 0.7`
- React Native Reanimated 3.x: Animations — bundled with SDK 52, required by NativeWind v4 as peer dependency

### Expected Features

Research identifies a strict critical path and clear tiers of value. The complete scan-to-summary loop is table stakes for a hackathon demo — missing any step makes the demo feel incomplete. See `FEATURES.md` for the full competitive landscape and feature dependency graph.

**Must have (table stakes — without these it's not a demo):**
- Menu photo upload + Gemini OCR — the core input; nothing works without it
- Mood selection (6 cards + Surprise Me) — the differentiating UX moment; should feel tactile
- AI recommendations with match % and witty reasoning — the payoff; reasoning text is low effort, high personality
- Save items ("I'll get this") — closes the interaction loop
- Order summary with cost + calorie totals — proves it is a complete product flow
- Dark polished UI matching Stitch mockups — judges associate visual quality with product maturity
- Real phone demo via Expo Go — live device beats simulator every time

**Should have (high-impact differentiators, build after core loop works):**
- Mood reasoning text on each card — 15 minutes, pure prompt engineering, creates memorable personality
- Dietary/calorie/budget filter chips — 30 minutes, re-sorts existing data, expected by judges familiar with BiteRight
- Skeleton loaders with personality copy — "Reading your menu..." / "Finding your perfect match..." feels faster
- Surprise Me dramatic single-card reveal — 30 minutes, creates a demo moment judges remember
- Micro-animations (card entrance, match % counter) — 1-2 hours, makes the app feel polished and fast
- Taste DNA visualization (faked data) — 1-2 hours, implies long-term product value in the pitch narrative

**Defer entirely (anti-features for tonight):**
- User accounts / authentication
- Live camera OCR (real-time frame processing)
- Backend infrastructure / database persistence
- QR sharing / group mode
- Payment integration, social features, nutritional database APIs

### Architecture Approach

The architecture is a thin, linear mobile app with no backend. Five screen files in `app/` (Expo Router), three Zustand stores as the data pipeline between screens, and two service files that own all API call logic. Screens never see raw API responses — services parse and return typed data. This separation is critical for prompt iteration: when the OCR prompt needs tuning, only `menu-service.ts` changes. The entire architecture fits in ~15 files. See `ARCHITECTURE.md` for the full directory structure, Zustand store patterns, exact build order, and estimated time per step.

**Major components:**
1. Scan Screen + menuService — captures photo via expo-image-picker, sends base64 to Gemini, stores `MenuItem[]` in menuStore
2. Mood Screen + sessionStore — displays 6 mood cards; start OCR here if not already done (biggest latency win)
3. Results Screen + recommendService — sends menuItems + mood to Claude, renders RecommendationCard with match %
4. savedItemsStore + Order Screen — aggregates "I'll get this" picks, computes cost and calorie totals
5. Three Zustand stores (menuStore, sessionStore, savedItemsStore) — the data bus connecting all screens with no prop drilling

### Critical Pitfalls

Research identified 7 critical and 12 additional pitfalls with high confidence. See `PITFALLS.md` for full prevention strategies and phase-by-phase warning table.

1. **Node.js AI SDKs crash in React Native** — Use direct `fetch()` to Gemini and Claude REST APIs from the start. The error appears at device runtime (not compile time) after your service layer is already built around the SDK API. One-liner rule: no `@anthropic-ai/sdk`, no `@google/genai`.

2. **API failure on stage (WiFi/rate limits kill demos)** — Cache the exact OCR + recommendation JSON responses for your demo menu before going on stage. Set 8-10 second timeouts with silent fallback to cached data. Use a mobile hotspot, not venue WiFi.

3. **Garbage OCR output from real menus** — Test your exact demo menu photo through Gemini in the first build hour. Use `responseMimeType: 'application/json'` with a `responseSchema`. Use Gemini Flash (not Flash Lite) — Flash Lite has documented accuracy issues and character recognition regressions.

4. **Scope creep breaks working code at 3am** — Once end-to-end flow works, run `git tag demo-safe`. Branch all add-ons. Stop coding 1 hour before demo. Polish the core before adding features.

5. **Image memory crash on device** — Set `quality: 0.5-0.7` and `exif: false` in expo-image-picker. Test on a real device, not the simulator. Large phone camera images (12-48MP) double in memory as base64 and can cause EXC_RESOURCE on iOS.

## Implications for Roadmap

Based on combined research, the build is a sequential six-phase critical path with a strict add-ons gate after Phase 4. The architecture research provides an exact build order with time estimates. Follow it.

### Phase 1: Foundation (Project Scaffold + Design System)

**Rationale:** Every subsequent phase depends on having routes, typed interfaces, theme constants, and a font-loaded screen. NativeWind silent failure must be caught here — it produces no error, just unstyled components — not discovered mid-feature.
**Delivers:** Working Expo SDK 52 project with Expo Router, NativeWind configured with Cravr's dark theme tokens (coral `#E8734A`, background `#0A0A0A`, card `#1A1A1A`), Plus Jakarta Sans loaded via `useFonts()` + `expo-splash-screen`, a `Button` component, and all TypeScript interfaces (`MenuItem`, `Recommendation`, `Mood`). Welcome screen as the "smoke test" screen.
**Avoids:** Font loading flash (Pitfall 15 — set up splash screen immediately), NativeWind silent failure (Pitfall 9 — test one `className="bg-coral"` View before building more), wrong Expo SDK (Pitfall 5 — SDK 52, not 55)
**Time estimate:** 30-40 minutes

### Phase 2: OCR Pipeline (Scan Screen + Gemini Integration)

**Rationale:** This is the riskiest integration. If Gemini OCR doesn't produce clean structured data, everything downstream is broken. Build and validate it first — a failure at this point means you can pivot to manual menu entry before sinking hours into the recommendation engine.
**Delivers:** Scan screen with expo-image-picker (camera + gallery fallback), `menuService.ts` calling Gemini with structured JSON output schema, `menuStore` holding parsed `MenuItem[]`, navigation to mood screen showing item count. The exact demo menu has been photographed, tested, and produces clean output.
**Uses:** expo-image-picker (`quality: 0.7`, `exif: false`, `base64: true`), Gemini 2.0 Flash REST API with `responseMimeType: 'application/json'`, menuStore (Zustand)
**Implements:** menuService, menuStore, Scan Screen
**Avoids:** Image memory crash (Pitfall 6), garbage OCR output (Pitfall 3), Gemini JSON parsing failure (Pitfall 11 — use `responseMimeType`, strip markdown fences), Node.js SDK crash (Pitfall 1)
**Time estimate:** 60-75 minutes including prompt iteration on real demo menu

### Phase 3: Recommendation Engine (Mood Screen + Claude Integration)

**Rationale:** With clean menu data from Phase 2, the recommendation engine can be built and tested with real data immediately. Pipeline the Gemini OCR call to start immediately after photo capture — do not wait until after mood selection. This eliminates the 30-second dead zone.
**Delivers:** Mood screen with 6 mood cards + Surprise Me, `recommendService.ts` calling Claude Sonnet with menu items + mood via structured system prompt, `sessionStore` holding recommendations, navigation to results screen.
**Uses:** Claude Sonnet REST API (not Opus — speed matters for demo), structured JSON system prompt with explicit field names and example, numbered item list to prevent hallucination
**Implements:** recommendService, sessionStore, Mood Screen, RecommendationCard component
**Avoids:** 30-second dead zone (Pitfall 8 — pipeline OCR during mood display), moods feeling cosmetic (Pitfall 10 — mood must be dominant factor, force score variety: top item 90%+, exclude below 70%), unexpected Claude JSON shape (Pitfall 12 — use structured outputs beta header)
**Time estimate:** 60-75 minutes

### Phase 4: Selection Flow (Results Screen + Order Summary)

**Rationale:** With recommendations rendering, the remaining work is UI — the save interaction and computed totals. This completes the full demo loop. Tag `demo-safe` in git immediately after this phase validates end-to-end.
**Delivers:** Results screen with RecommendationCard components (match %, price, estimated calories, reasoning text, dietary tags), "I'll get this" save toggle with sticky count bar, Order Summary screen with saved items list and total cost + calorie totals. `git tag demo-safe` after end-to-end validation.
**Implements:** savedItemsStore, Results Screen, Order Summary Screen
**Avoids:** State bugs in save flow (keep it: array of IDs in savedItemsStore), price/calorie null handling (Pitfall 16 — normalize prices to numbers immediately after OCR, show "--" for missing calories)
**Time estimate:** 50-60 minutes

### Phase 5: Polish + Demo Hardening

**Rationale:** The gap between "core works" and "demo-ready" is larger than it looks. Visual polish on the critical path (loading states, projector contrast, animations) is worth more than any new feature. Demo hardening (API caching, hotspot setup, device test) is non-negotiable before going on stage.
**Delivers:** Skeleton loaders with personality copy during API calls, card entrance animations and match % counter animation (30-min time-box each, opacity/translateY only), projector-safe card contrast (bump card background to `#252525`, add 1px `#333` border), cached golden-path API responses as fallback, status bar configured for dark theme, real-device test on venue WiFi.
**Addresses:** Loading UX (Pitfall 8), projector visibility (Pitfall 13), animation scope (Pitfall 14)
**Avoids:** Building new features — this phase is polish-only
**Time estimate:** 60-90 minutes

### Phase 6: Add-ons (Time Permitting Only, Branched)

**Rationale:** Only begin if Phase 5 is complete, `demo-safe` is tagged, and the full flow has been tested on the demo device. Every add-on gets its own git branch. If it breaks, return to main.
**Delivers (in priority order):**
- P1: Dietary/calorie/budget filter chips — 30 minutes, re-sorts existing recommendation data
- P3: Post-meal emoji rating on order summary — 15 minutes, simple tap interaction
- P4: Taste DNA visualization — 1-2 hours, faked data (static or computed from selections, no real preference learning)
- P5: Crowd rating bars — trivial, fake data
- P7: Surprise Me dramatic single-card reveal — 30 minutes, special case in recommendation flow

**Hard stop rule:** If the Phase 1-4 flow feels fragile in any way, skip Phase 6 entirely and use the time for demo rehearsal.

### Phase Ordering Rationale

- OCR before recommendations: Gemini produces the structured data Claude consumes. Cannot test recommendations without real menu data.
- Riskiest integration first: Gemini OCR (Phase 2) is identified as the highest-risk step. Proving it works in the first 90 minutes preserves time to pivot to manual menu entry if needed.
- Pipeline OCR during mood display: Architecture research identifies this as "the single biggest latency win" — start the Gemini call immediately after photo capture; by the time the user picks a mood, OCR may already be done.
- `demo-safe` tag enforces discipline: Pitfall 4 (scope creep) is critical-rated. The tag after Phase 4 creates a safe checkpoint before any polish or add-on work.
- Polish before add-ons: A polished core loop beats a feature-rich broken demo every time.

### Research Flags

Phases where prompt engineering needs iteration during build (not pre-resolvable):
- **Phase 2 (OCR Pipeline):** Gemini structured output prompt will need tuning against the specific demo menu. Build in 30 minutes for iteration. Real menus have decorative fonts, multi-column layouts, and glare — expect the first prompt to be imperfect.
- **Phase 3 (Recommendation Engine):** Mood differentiation is a known pitfall. Test all 6 moods against the same menu during development. The prompt must make mood the dominant factor and force score spread.

Phases with standard well-documented patterns (no additional research needed):
- **Phase 1 (Foundation):** Expo/NativeWind setup is thoroughly documented. Follow STACK.md installation commands exactly.
- **Phase 4 (Selection Flow):** Standard React Native list UI + Zustand state. No novel patterns.
- **Phase 5 (Demo Hardening):** API caching pattern is: run flow once, `JSON.stringify` response to a local constant, return that constant when API call exceeds timeout.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technology choices verified against official docs and community reports. Node.js SDK incompatibility confirmed via GitHub issues. SDK 55 release timing verified. NativeWind/Tailwind v3 requirement confirmed in official docs. |
| Features | HIGH | Competitive landscape researched across 6 live products. Feature tiers cross-referenced with hackathon judging criteria. Critical path dependency graph is explicit and internally consistent. |
| Architecture | HIGH | Architecture matches well-documented Expo patterns. Build order is based on dependency analysis. Time estimates are based on typical Expo development speed — conservative but achievable. |
| Pitfalls | HIGH | 19 pitfalls identified. Critical pitfalls have specific GitHub issue references, official doc confirmation, or community forum verification. Prevention steps are concrete and actionable. |

**Overall confidence:** HIGH

### Gaps to Address

- **Gemini model name:** STACK.md flags that "gemini-3.1-flash-lite-preview" (from the original project spec) does not map to a known Gemini API model. Start with `gemini-2.0-flash` (confirmed working for OCR). If the team has a preview API key for a newer model, test it in the first 15 minutes of Phase 2 — a 404 means fall back to `gemini-2.0-flash`.

- **Claude model choice:** Research recommends `claude-sonnet-4-5-20250929` for sub-3s responses. ARCHITECTURE.md diagrams used Claude Opus 4.6. Decision: use Sonnet for speed; swap to Opus model string only if the team wants to name-drop it in the pitch narrative (the API call is identical — just change the model string).

- **Taste DNA:** The order summary screen in the Stitch mockups includes a "Taste DNA" visualization. Research confirms this should be faked for the demo — hardcoded or computed from selected items with no actual preference learning. Build it as a static or trivially computed display element only.

- **Demo menu selection:** Research strongly recommends choosing and testing the exact demo restaurant menu before building the recommendation engine. This is a process dependency, not a code dependency — but it must happen in Phase 2, not the night before the demo.

- **OCR and recommendation prompt final form:** Research provides templates and patterns (see STACK.md and ARCHITECTURE.md for exact prompt structures), but the final prompts will require iteration against real menus during Phase 2 and Phase 3. Budget 30 minutes of prompt tuning per service.

## Sources

### Primary (HIGH confidence)
- [Expo SDK 52 Changelog](https://expo.dev/changelog/2024-11-12-sdk-52) — SDK stability, bundled dependencies verified
- [Expo SDK 55 Release](https://expo.dev/changelog/sdk-55) — Release timing verified (March 3, 2026)
- [NativeWind v4 Installation](https://www.nativewind.dev/docs/getting-started/installation) — Tailwind v3 requirement confirmed in official docs
- [Gemini API Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding) — OCR patterns, structured output mode
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits) — Free tier confirmed: 15 RPM / 1,000 RPD for Flash Lite
- [Anthropic API Getting Started](https://docs.anthropic.com/en/api/getting-started) — REST API call patterns
- [Claude Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) — JSON schema enforcement (beta header confirmed)
- [Expo ImagePicker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — `base64: true`, `quality` option behavior
- [Expo Image Manipulator Memory Crash iOS](https://github.com/expo/expo/issues/40158) — EXC_RESOURCE on large images confirmed
- [Expo launchCameraAsync Android Bug](https://github.com/expo/expo/issues/39480) — Post-2025-09-05 patch issue confirmed
- [Expo Router Introduction](https://docs.expo.dev/router/introduction/) — File-based routing documentation
- [Zustand GitHub](https://github.com/pmndrs/zustand) — Store patterns, v5 API

### Secondary (MEDIUM confidence)
- [Gemini Flash-Lite OCR Forum Discussion](https://discuss.ai.google.dev/t/ocr-gemini-2-0-flash-lite-vs-2-5-flash-lite/106599) — Flash Lite accuracy issues vs Flash confirmed by community
- [BiteRight](https://biteright.app/features/restaurant-menu-scanner) — Menu OCR + nutrition feature landscape
- [Foodbud AI](https://www.foodbud.ai/) — Allergen analysis + personalized menus
- [DoorDash Zesty](https://techcrunch.com/2025/12/16/doordash-rolls-out-zesty-an-ai-social-app-for-discovering-new-restaurants/) — Mood-based restaurant discovery (different layer than Cravr)
- [Taranify](https://www.taranify.com/what-to-eat) — Mood-to-food matching via color quiz
- [MoodBite AI](https://moodbite.ai/technology) — NLP mood interpretation for restaurant matching
- [MenuGuide](https://menuguide.app/) — Menu OCR + translation + allergen detection
- [@google/genai React Native Issues](https://github.com/vercel/ai/issues/3705) — SDK incompatibility in React Native confirmed

### Tertiary (LOW confidence — verify independently)
- [Gemini API Free Tier Changes Dec 2025](https://blog.laozhang.ai/en/posts/gemini-api-free-tier) — Rate limit details (third-party blog; verify against official Gemini docs)
- [Devpost hackathon demo tips](https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video) — Demo best practices
- [BizThon: What Makes Projects Stand Out](https://medium.com/@BizthonOfficial/10-winning-hacks-what-makes-a-hackathon-project-stand-out-818d72425c78) — UI polish impact on judging perception

---
*Research completed: 2026-03-04*
*Ready for roadmap: yes*
