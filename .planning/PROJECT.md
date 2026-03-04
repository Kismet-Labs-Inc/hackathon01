# Cravr

## What This Is

A mobile food recommendation app that scans restaurant menus, lets you pick a mood, and uses AI to recommend dishes with match percentages. Built as a hackathon prototype — "Scan. Vibe. Devour." Zero onboarding, value-first: point your phone at a menu and get personalized picks in seconds.

## Core Value

Users can scan any restaurant menu and instantly get mood-matched food recommendations they're excited to order.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can photograph a menu and have it parsed into structured menu items
- [ ] User can select a mood from 6 options (Comfort Food, Something Light, Adventurous, Impress a Date, Hungover, Sweet Tooth) or "Surprise me"
- [ ] User sees AI-generated recommendations with match %, description, price, calories, and dietary tags
- [ ] User can save items ("I'll get this") and see saved state on cards
- [ ] User can view order summary with total cost and total calories
- [ ] App runs on a real phone (Expo/React Native) for live demo

### Out of Scope

- Live camera OCR (real-time scanning) — too risky for one-night build, using photo upload instead
- User accounts / signup / authentication — zero onboarding by design
- QR sharing / group mode — demo as static mockup only if time permits
- Post-meal rating flow — add-on if time permits
- Taste DNA profile — add-on if time permits
- Dietary/calorie/budget filters — add-on if time permits (P1 priority)

## Context

- **Hackathon deadline:** March 5, 2026 (tomorrow)
- **Team:** Rob (building tonight), Ham, Pao, Omar
- **Demo format:** Live on phone, projected to audience
- **Design system:** 10 screens already designed in Stitch (project ID: 13628720197590285921)
- **UX screens:** All mockups in `/ux/` folder — Stitch versions are the reference designs
- **Design identity:** Dark theme (#0A0A0A bg), coral/orange accent (#E8734A), Plus Jakarta Sans font, rounded corners, #1A1A1A cards, green sparingly for success states
- **UX philosophy:** "Show value first, refine later" — results before filters, no upfront setup, passive preference building via ordering + ratings

### Screen Flow

1. Welcome — branding + "Scan a Menu" CTA
2. Scan — camera/photo upload to capture menu
3. Mood — "What's the vibe?" with 6 mood cards + Surprise me
4. Results — AI recommendation cards with match %, pricing, calories, dietary tags, "I'll get this" CTA
4a. Results + Filters — budget/calorie/dietary filter panel (add-on)
5. Save Items — mixed saved/unsaved state, sticky "View order" bar
6. Order Summary — picked items, totals, Taste DNA evolving card
6a. Share/QR — group sharing (add-on)
7. Rate — per-item emoji ratings + photo upload (add-on)
7a. Rated — Taste DNA flavor bars updated (add-on)

## Constraints

- **Timeline:** One night — must be demo-ready by morning
- **Platform:** React Native (Expo) — demo on real phone
- **OCR:** Gemini 3.1 Flash Lite Preview — fast/cheap vision model for menu parsing
- **AI Recommendations:** Claude Opus 4.6 — powerful reasoning for food matching
- **Design:** Must match Stitch mockups — dark theme, coral accent, Plus Jakarta Sans
- **Data:** Real menu scan for demo — no pre-loaded fallback

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Photo upload over live camera OCR | Live OCR too risky for one-night build | — Pending |
| Gemini Flash Lite for OCR | Cheap, fast vision model — good enough for menu text | — Pending |
| Opus 4.6 for recommendations | Need strong reasoning for mood-to-food matching | — Pending |
| React Native (Expo) | Demo on real phone for maximum impact | — Pending |
| Zero onboarding | Show value immediately — hackathon judges have short attention spans | — Pending |
| MVP only, add-ons if time | 5 core features first, everything else is bonus | — Pending |

---
*Last updated: 2026-03-04 after initialization*
