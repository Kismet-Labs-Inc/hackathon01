# Roadmap: Cravr

## Overview

Four-phase hackathon build delivering the "Scan. Vibe. Devour." loop on a real phone by morning. Phase 1 scaffolds the project and design system. Phase 2 de-risks the hardest integration (Gemini OCR). Phase 3 delivers the entire demo-able flow end-to-end (mood selection through order summary). Phase 4 layers on filters, post-meal rating, and demo hardening -- only touched after Phase 3 earns a `demo-safe` git tag.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Expo project scaffold, design system, typed interfaces, Welcome screen (completed 2026-03-04)
- [ ] **Phase 2: Menu Scanning** - Camera/gallery photo capture, Gemini OCR pipeline, structured menu data
- [ ] **Phase 3: Recommendations & Ordering** - Mood selection, AI recommendations, save items, order summary -- the complete demo loop
- [ ] **Phase 4: Extras & Demo Hardening** - Filters, post-meal rating, cached fallbacks, visual polish for stage

## Phase Details

### Phase 1: Foundation
**Goal**: A running Expo app with Cravr's design system that displays the Welcome screen on a real phone
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02
**Success Criteria** (what must be TRUE):
  1. App launches on a real phone via Expo Go and displays the Welcome screen with Cravr branding
  2. Dark theme renders correctly -- #0A0A0A background, #E8734A coral accent, Plus Jakarta Sans font loaded
  3. Navigation routes exist for all screens (welcome, scan, mood, results, order) even if most are placeholder
  4. TypeScript interfaces for MenuItem, Recommendation, and Mood are defined and importable
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md -- Expo scaffold, design system tokens, TypeScript interfaces, navigation skeleton
- [x] 01-02-PLAN.md -- Polished Welcome screen matching Stitch mockup, styled placeholder screens

### Phase 2: Menu Scanning
**Goal**: User can photograph a restaurant menu and see it parsed into structured dish data
**Depends on**: Phase 1
**Requirements**: MENU-01, MENU-02
**Success Criteria** (what must be TRUE):
  1. User can take a photo of a menu using the device camera or pick one from the gallery
  2. App sends the photo to Gemini and receives structured JSON with dish names, prices, and descriptions
  3. Parsed menu items are stored in the menu Zustand store and the app navigates to the Mood screen showing item count
  4. The exact demo menu has been tested through the pipeline and produces clean, usable output
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md -- Install deps, Zustand menu store, Gemini API service, fallback cache, menu parser
- [ ] 02-02-PLAN.md -- Complete scan screen UI with camera, gallery, processing animation, count-up, and auto-advance

### Phase 3: Recommendations & Ordering
**Goal**: User completes the full demo loop -- pick a mood, see AI recommendations, save items, view order summary
**Depends on**: Phase 2
**Requirements**: MOOD-01, MOOD-02, RECO-01, RECO-02, RECO-03, ORDR-01, ORDR-02
**Success Criteria** (what must be TRUE):
  1. User can select one of 6 mood cards (Comfort Food, Something Light, Adventurous, Impress a Date, Hungover, Sweet Tooth) or tap Surprise Me
  2. User sees AI-generated recommendation cards ranked by match % with witty reasoning, price, calories, and dietary tags
  3. Surprise Me presents a single recommendation card with a reveal moment
  4. User can tap "I'll get this" on any recommendation card and see the saved state toggle on the card
  5. User can view an order summary screen showing all saved items with total cost and total calories
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Extras & Demo Hardening
**Goal**: Filters and post-meal features work, and the app is hardened for a live stage demo
**Depends on**: Phase 3
**Requirements**: FILT-01, FILT-02, FILT-03, POST-01, POST-02
**Success Criteria** (what must be TRUE):
  1. User can filter recommendations by dietary restrictions, max calories, and max budget
  2. User can rate each ordered item with emoji reactions (Amazing/Tasty/Meh/Nope) and see Taste DNA bars update
  3. App gracefully handles API failures during demo by falling back to cached responses
  4. App looks polished on a projector -- loading states, adequate contrast, no visual jank
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-04 |
| 2. Menu Scanning | 0/2 | Not started | - |
| 3. Recommendations & Ordering | 0/? | Not started | - |
| 4. Extras & Demo Hardening | 0/? | Not started | - |
