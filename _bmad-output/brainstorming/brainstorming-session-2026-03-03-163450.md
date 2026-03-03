---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Menu Decision Helper - AI-powered conversational food assistant that can see'
session_goals: 'Concrete plan to build and implement the app within a 2-day hackathon'
selected_approach: 'ai-recommended'
techniques_used: ['SCAMPER', 'Decision Tree Mapping']
ideas_generated: ['flavor-profile-first', 'multi-dish-support', 'menu-decision-helper', 'price-estimation-php', 'health-score-combo', 'shopping-list-generation', 'skill-level-adjustment', 'allergy-dietary-filter', 'full-menu-scan', 'compact-expandable-cards', 'food-stall-signage-support', 'menu-language-translation', 'travel-companion', 'dietary-logging', 'cooking-inspiration', 'conversational-ai-cravings', 'conversational-ai-health-conditions']
context_file: ''
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Kismet Team
**Date:** 2026-03-03

## Session Overview

**Topic:** Menu Decision Helper — an AI-powered conversational food assistant that can see. Users point a camera at a dish or menu item and get cuisine type, flavor profile, key ingredients, and health info. They can also chat with the AI about cravings and health conditions.
**Goals:** Walk out with a concrete plan to build and implement the app within a ~2 day hackathon window
**Original Idea:** Smart Recipe Deconstructor — pivoted during brainstorming to focus on **Menu Decision Helper** as the MVP.

### Session Setup

_Kismet Team is building a hackathon project using the BMAD method. The core challenge: being able to identify the ingredients of a dish and make informed food decisions. Time constraint: less than 2 days._

## Technique Selection

**Approach:** AI-Recommended Techniques
**Techniques Used:** SCAMPER (all 7 lenses) + Decision Tree Mapping

---

## SCAMPER Session

### Lens 1: Substitute — Completed
**Ideas generated:**
1. **Flavor profile first** — identify cuisine + taste characteristics before specific ingredients
2. **Multi-dish support** — user can point at a menu or table with multiple dishes
3. **Menu decision helper** — help users decide what to eat, not just recreate dishes
4. **Price estimation in PHP** — surface estimated price per dish in Philippine Pesos

**Key Decision:** Pivoted MVP from "Recipe Deconstructor" to **Menu Decision Helper**

### Lens 2: Combine — Completed
**Ideas generated:**
5. **Dish identification + shopping list generation** — identify dish, get recipe, get shopping list for palengke/grocery (future feature)
6. **Recipe generation + skill level adjustment** — beginner vs authentic version (future feature)
7. **Menu scanner + allergy/dietary filter** — filter dishes by dietary restrictions (future feature)
8. **Dish photo + cost breakdown** — ingredient-by-ingredient cost estimate (future feature)

**Key Decision:** Stayed focused on Menu Decision Helper MVP

### Lens 3: Adapt — Completed
**Ideas explored:**
- Google Translate camera-style overlay
- Food delivery app UI patterns (Grab Food, FoodPanda cards)
- Tinder-style swipe through dishes
- Nutrition label / "flavor card" formatting

**New Feature Added:** Health score/indicator per dish

**Health Indicator Decision:** Combo style chosen:
- Traffic light color (green/yellow/red) — instant visual cue
- Simple score (7/10) — quick comparison
- One-line reason — e.g. "High protein, steamed, veggie-rich"

### Lens 4: Modify — Completed
**Ideas generated:**
9. **Full menu page scan** — AI processes entire menu page at once, returns ranked recommendations
10. **Compact expandable cards** — show summary card that expands on tap for details
11. **Flexible input support** — food stall signage, hawker boards, friend's plate at the table
12. **Menu language translation** — auto-detect Filipino, Chinese, Japanese, Korean and translate dish names with explanations

**Key Decision:** All ideas accepted, deferred to future features for MVP simplicity

### Lens 5: Put to Other Uses — Completed
**Ideas generated:**
13. **Travel companion** — tourists scan unfamiliar menus abroad (or foreigners in the Philippines)
14. **Dietary logging** — snap meals to auto-log to a health tracker
15. **Cooking inspiration** — save a dish from a menu, later get a "how to make this at home" recipe (brings back original idea as a future feature!)

**Rejected:** Restaurant review helper

### Lens 6: Eliminate — Completed
**Scope cuts for hackathon MVP:**
- No real-time camera overlay / AR
- No multi-dish detection (one item per scan)
- No price estimation
- No user accounts / login

**Revised MVP Feature Set:**
1. Take a photo or upload image of a dish/menu item
2. AI identifies: cuisine type, flavor profile, key ingredients
3. Health indicator (traffic light + score + one-line reason)
4. No login, no accounts — just open and use

### Lens 7: Reverse — Completed
**Ideas generated:**
16. **Conversational cravings** — user says "I'm craving something spicy and healthy" and AI recommends from the menu
17. **Health condition filtering** — user says "I'm diabetic" or shares a condition, AI advises what's safe to eat

**Rejected:** Restaurant uploads their own menu, side-by-side dish comparison

**Key Decision:** The app is **conversational** — not just a scanner but an AI food assistant that can see

---

## Decision Tree Mapping Session

### Build Decisions

| Decision | Options Considered | Choice | Rationale |
|---|---|---|---|
| **Platform** | Web App, Mobile (React Native), PWA | **Web App** | Fastest to build and demo |
| **AI Provider** | Claude, OpenAI GPT-4o, Google Gemini, Mix | **Google Gemini** | Strong multimodal, generous free tier, single API |
| **Frontend** | Tailwind, shadcn/ui, Vanilla CSS, Vite+React | **Next.js + shadcn/ui** | Polished components out of the box |
| **Image Capture** | Camera only, Upload only, Both | **Camera + Upload** | Covers all scenarios, minimal extra work |
| **Chat UX** | Chat interface, Quick action buttons, Hybrid | **Hybrid (card + chat)** | Dish card gives immediate value, chat enables follow-ups |
| **State Management** | In-memory, Local storage, Database | **In-memory (React state)** | No login = no persistence needed, fastest to build |
| **Deployment** | Vercel, Netlify, Railway, Local | **Vercel** | Made for Next.js, free, auto HTTPS for camera |

---

## Idea Organization and Prioritization

### Theme 1: Core MVP Features
_What we're shipping in 2 days_

- Dish identification via photo (camera + upload)
- Cuisine type detection
- Flavor profile analysis
- Key ingredients extraction
- Health indicator (traffic light + score + reason)
- Conversational AI (ask questions, state cravings, share health conditions)

### Theme 2: UX & Interaction Design
_How users interact with the app_

- Hybrid UI — dish result card at top + chat below
- No login / zero friction
- Camera + upload fallback
- Food delivery app-style card inspiration

### Theme 3: Technical Architecture
_How we build it_

- Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS
- Google Gemini API (vision + chat)
- In-memory React state (no database)
- Vercel deployment

### Theme 4: Future Feature Pipeline
_Post-hackathon roadmap_

- Multi-dish / full menu scanning
- Price estimation in PHP
- Menu language translation (Filipino, Chinese, Japanese, Korean)
- Food stall / hawker board support
- Shopping list generation for palengke/grocery
- Allergy/dietary filters
- Skill-level recipe adjustment (beginner vs authentic)
- Travel companion mode
- Dietary logging integration
- Cooking inspiration — "how to make this at home"

### Breakthrough Concept
**Conversational food assistant that can see** — not just a scanner, but an AI you can talk to about what you're looking at, what you're craving, and what your body needs.

---

## Action Plan — Hackathon Build Order

1. **Scaffold** — Next.js + shadcn/ui + Tailwind project setup
2. **Camera/Upload** — Image capture component
3. **Gemini Integration** — API route: send image + prompt → structured dish analysis
4. **Dish Card UI** — Display cuisine, flavor, ingredients, health indicator
5. **Chat Interface** — Follow-up conversation below the card
6. **Polish & Deploy** — Styling, mobile responsive, push to Vercel

---

## Session Summary and Insights

**Key Achievements:**
- Pivoted from broad "Recipe Deconstructor" to focused "Menu Decision Helper" MVP
- Defined a clear, buildable scope with ruthless feature cuts
- Identified the breakthrough concept: conversational AI that can see food
- Mapped every technical decision into concrete choices
- Created a 6-step build order ready for immediate execution

**Creative Breakthroughs:**
- The app isn't just a scanner — it's conversational (cravings + health conditions)
- Health indicator combo (traffic light + score + reason) balances speed and usefulness
- Future features pipeline preserves all ideas without bloating the MVP

**Session Reflections:**
_Kismet Team showed excellent hackathon instincts — consistently choosing simplicity and focus over feature creep. The pivot from Recipe Deconstructor to Menu Decision Helper was the session's defining moment, narrowing scope while increasing practical value._
