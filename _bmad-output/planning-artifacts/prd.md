---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
classification:
  projectType: 'web-app-pwa'
  domain: 'general-food-tech'
  complexity: 'medium'
  projectContext: 'greenfield'
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-03-03-163450.md'
  - '_bmad-output/designs/01-welcome.png'
  - '_bmad-output/designs/02-menu-scan.png'
  - '_bmad-output/designs/03-mood-selector.png'
  - '_bmad-output/designs/04-menu-recommendations.png'
  - '_bmad-output/designs/05-filtered-results.png'
  - '_bmad-output/designs/06-order-summary.png'
  - '_bmad-output/designs/07-table-share.png'
  - '_bmad-output/designs/08-rate-meal.png'
  - '_bmad-output/designs/09-final-review.png'
  - '_bmad-output/designs/10-saved-items.png'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
  designs: 10
workflowType: 'prd'
---

# Product Requirements Document - Cravr

**Author:** Kismet Team
**Date:** 2026-03-04

## Executive Summary

Cravr is a mobile-first progressive web app that eliminates dining decision fatigue by giving diners instant, AI-powered insight into restaurant menus. Users snap a photo of a menu, select a mood or vibe, and receive personalized dish recommendations ranked by flavor profile match, dietary fit, and budget — all before ordering.

The core problem: restaurant menus are poor decision tools. They list dish names and brief descriptions but fail to communicate what food actually tastes like, whether it fits a diner's current mood, or how dishes compare to each other. Diners default to safe choices or rely on waiter recommendations. Cravr replaces guesswork with confidence.

Target users: anyone who eats at restaurants — from the indecisive office worker scanning an unfamiliar menu to groups trying to coordinate orders. The product originated as a recipe recreation tool but pivoted after recognizing that the far larger and more universal problem is choosing what to eat, not recreating it at home.

### What Makes This Special

Cravr is **flavor-profile-first menu intelligence**. Unlike food delivery apps that rank dishes by popularity or aggregate ratings, Cravr deconstructs each dish into taste dimensions (savory, spicy, rich, sweet, etc.) and matches them to the user's current mood and preferences in real-time, at the restaurant.

No one is surfacing *how food tastes* as a decision input. Cravr's AI breaks down menu items into cuisine type, flavor profile, key ingredients, health indicators, and estimated pricing — turning an opaque list of dish names into an informed, personalized decision. The vibe/mood selector ("Comfort Food," "Adventurous," "Impress a Date") adds an emotional dimension that no menu or review app provides.

## Project Classification

- **Project Type:** Progressive Web App (PWA) — mobile-first with camera access via browser APIs
- **Domain:** Food/Restaurant tech — no regulatory or compliance requirements
- **Complexity:** Medium — AI vision integration is the primary technical challenge; UI patterns are standard web
- **Project Context:** Greenfield — new product built during a 2-day hackathon, with a secondary goal of experiencing the full BMAD development workflow end-to-end

## Success Criteria

### User Success

- User makes a confident menu decision in **under 2 minutes** from scan to pick
- User discovers dishes they wouldn't have tried otherwise — measured via on-site interview/survey during hackathon demo, and via flavor profile deviation tracking in a future version
- User feels the flavor profile breakdown gave them information they couldn't get from the menu alone

### Business Success

- **Hackathon:** Working demo of the core flow (scan → vibe → recommend) with a polished, presentable UI
- **Hackathon:** Team can articulate and share their experience using the BMAD development workflow as part of the presentation
- **Post-hackathon (stretch):** If the concept resonates and gains traction, the team would continue building it — viral potential is the north star for continuation

### Technical Success

- Menu photo upload/snap successfully processed by AI to extract dish names and descriptions
- AI generates accurate flavor profiles, cuisine classification, and ingredient identification from extracted menu data
- Mood/vibe filtering returns relevant, personalized recommendations with match scores
- PWA loads fast on mobile browsers with camera/photo access working reliably

### Measurable Outcomes

- Time from menu scan to dish selection: **< 2 minutes**
- AI successfully extracts menu items from photo: **> 80% accuracy** on legible menus
- At least **3 recommendations** returned per vibe selection
- Demo-ready app for hackathon presentation with full core flow working

## User Journeys

### Journey 1: Solo Diner — Happy Path

**Meet Marco**, 28, a marketing associate at a BPO company in Makati. It's 12:15 PM and he just got out of a meeting. He has 45 minutes for lunch and he's standing on Ayala Avenue staring at a row of restaurants he's walked past a hundred times but never really explored. He always ends up at the same Jollibee or the same pares place. Not because the food is bad — but because choosing feels like a gamble when you only have one lunch break.

Today Marco tries something different. He walks into a Thai-Japanese fusion place a coworker mentioned, sits down, and opens Cravr on his phone. He snaps a photo of the two-page menu. Within seconds, Cravr identifies 24 items — pad thai, katsu curry, salmon teriyaki, tom yum ramen, and dishes he can't even picture from the names alone.

Cravr asks: **"What's the vibe?"** Marco taps **"Comfort Food"** — it's been a long morning. Three cards appear. The top match: **Katsu Curry Rice — 92% match**. Rich, savory, warm. ₱285. 680 cal. The flavor profile shows exactly what he's craving — hearty, umami-forward, not too spicy. The second card is a Salmon Teriyaki Don he never would've noticed buried on page two.

Marco taps "I'll get this" on the katsu curry. He's ordered in under a minute. When the food arrives, it's exactly what he wanted. He thinks: *"Why didn't I have this sooner?"*

**What this journey reveals:**
- Photo capture and AI menu extraction must be fast (< 10 seconds)
- Vibe selector must be immediately intuitive — no onboarding needed
- Recommendation cards need to surface flavor profile, price, calories, and match score at a glance
- The "I'll get this" action needs to feel decisive and satisfying

### Journey 2: Solo Diner — Edge Case (Blurry Photo)

**Meet Marco again.** Same lunch break, different restaurant — a dimly lit Korean BBQ spot on Jupiter Street. The menu is laminated, glare from the overhead light, and his hands are slightly shaky from too much coffee. He snaps a photo but it's not great — half the text is blurry, the lighting washes out one side.

Cravr processes the photo and flags: **"I found 12 items clearly, but some parts of the menu are hard to read. Want to retake the photo, or work with what I've got?"**

Marco taps **"Work with what you've got."** Cravr shows 12 dishes with full profiles, and flags 3 more as **"Partially identified — tap to see what I could read."** Marco sees enough to choose from the 12 clear ones. He picks Bulgogi Rice Bowl — 88% comfort match. The partial items don't bother him; he got what he needed.

Alternatively: Marco retakes the photo with better lighting. This time Cravr gets 18 items clean. He proceeds normally.

**What this journey reveals:**
- AI must gracefully handle partial menu extraction — not fail entirely on imperfect photos
- Clear feedback when photo quality is insufficient ("retake" vs "proceed with partial")
- Partial results should still be useful — don't block the user
- UI must communicate confidence level per dish (fully identified vs partially read)

### Journey Requirements Summary

| Capability | Revealed By | Priority |
|---|---|---|
| Photo capture / upload | Both journeys | MVP |
| AI menu extraction (< 10s) | Happy path | MVP |
| Vibe/mood selector | Happy path | MVP |
| Recommendation cards with match scores | Happy path | MVP |
| Flavor profile display (taste tags) | Happy path | MVP |
| Price (PHP) and calorie display | Happy path | MVP |
| Dietary tags on cards | Happy path | MVP |
| "I'll get this" selection action | Happy path | MVP |
| Partial extraction handling | Edge case | MVP |
| Photo quality feedback / retake prompt | Edge case | MVP |
| Confidence indicators per dish | Edge case | Nice-to-have |

## Innovation & Novel Patterns

### Detected Innovation Areas

**Flavor-Profile-First Menu Intelligence** — Cravr introduces a new interaction paradigm: deconstructing restaurant menu items into taste dimensions (savory, spicy, rich, sweet, umami, etc.) and matching them to user mood/vibe in real-time. No existing app surfaces *how food tastes* as a primary decision input for diners sitting in a restaurant.

**Mood-to-Food Matching** — Borrowing from music streaming UX (Spotify mood playlists, "what's the vibe?"), Cravr applies emotional context to food selection. The vibe selector (Comfort Food, Adventurous, Impress a Date, Hungover, Sweet Tooth) is a UX pattern that doesn't exist in the food-tech space today.

### Market Context & Competitive Landscape

- **Food delivery apps** (Grab Food, FoodPanda) — rank by popularity, ratings, distance, and promotions. No flavor intelligence.
- **Review apps** (Yelp, Zomato) — aggregate crowd opinions and photos. No personalized taste matching.
- **Menu scanning apps** — mostly focused on translation or allergen detection. No mood-based recommendations.
- **Gap:** Nobody is answering "what does this dish taste like, and does it match what I want right now?" — Cravr owns this space.

### Validation Approach

- **Hackathon validation:** Accept AI-generated flavor profiles from Google Gemini using menu photos as input. Already validated with test images — accuracy is sufficient for demo and concept validation.
- **On-site user testing:** Have hackathon attendees try Cravr with real menus and survey whether flavor profiles felt accurate and recommendations were useful.
- **Success signal:** Users report the flavor breakdown helped them make a decision they were happy with.

### Risk Mitigation

- **Risk:** General-purpose LLMs may produce inaccurate or generic flavor profiles for regional/specialty dishes.
- **Mitigation (hackathon):** Accept the risk — concept validation matters more than perfect accuracy at this stage.
- **Mitigation (future):** Train or fine-tune an LLM specifically on food images, flavor profiles, and cuisine data to improve accuracy. Partner with food databases or restaurant data providers for ground-truth training data.

## PWA Specific Requirements

### Project-Type Overview

Cravr is a single-page progressive web app optimized for mobile-first use. No native app installation required — users access it via URL, snap a menu photo, and get recommendations. The PWA shell provides an app-like experience with smooth screen transitions, offline asset caching, and camera/photo access via standard browser APIs.

### Technical Architecture Considerations

**Application Type:** SPA (Single Page Application) with client-side routing
**Rendering:** Client-side rendered — no SSR needed (no SEO requirement)
**PWA Features:** Service worker for asset caching, web app manifest for home screen install, camera access via file input with capture attribute

**Browser Support Matrix:**

| Browser | Priority | Notes |
|---|---|---|
| Chrome (Android) | Primary | Majority of target users in Metro Manila |
| Safari (iOS) | Primary | iPhone users — test camera API compatibility |
| Chrome (Desktop) | Low | Nice-to-have for demo/presentation only |
| Other mobile browsers | Not supported | Out of scope for MVP |

**Responsive Design:**
- Mobile-first and mobile-only for MVP (375px–430px viewport)
- No tablet or desktop layouts required

### Implementation Considerations

**Camera/Photo Access:**
- Primary: File input with `accept="image/*"` and `capture="environment"` — works on all mobile browsers
- Fallback: Standard file upload from gallery
- No live camera feed or real-time OCR required

**AI Integration:**
- Client sends menu photo to backend API
- Backend processes via Google Gemini (OCR + flavor profile generation)
- Response returns structured dish data (JSON): name, cuisine, flavor tags, price, calories, dietary info, match scores
- Single request-response pattern — no streaming or WebSocket needed for MVP

**Offline Behavior:**
- Service worker caches app shell and static assets
- Core functionality requires network (AI processing is server-side)
- Graceful offline message if no connection available

**SEO:** Not required — app is accessed via direct URL or QR code, not search discovery

**Accessibility:** Standard best practices — semantic HTML, sufficient color contrast, touch target sizing (min 44px), screen reader labels on interactive elements

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — prove the concept feels magical. The hackathon goal is "wow, this actually works" not "this scales to production." Every feature decision filters through: *does this make the demo more impressive?*

**Resource Requirements:**
- 2 developers (React/Next.js experienced)
- 1 QE for testing
- AI backend: Google Gemini (already validated with menu image testing)
- Timeline: ~2 days (hackathon window)

### MVP Feature Set (Phase 1)

**Core User Journey Supported:** Solo diner happy path (Marco's story)

**Must-Have Capabilities:**

| # | Feature | Why It's Must-Have |
|---|---|---|
| 1 | Welcome screen with "Scan a Menu" CTA | Entry point — first impression, zero friction |
| 2 | Photo upload / camera snap | Core input — without this, nothing works |
| 3 | AI menu extraction via Gemini | Core engine — extracts dishes from menu photo |
| 4 | AI flavor profile generation | Key differentiator — the "aha" moment |
| 5 | Vibe/mood selector (6 moods) | Novel UX — what makes Cravr feel different |
| 6 | Recommendation cards with match scores | Core output — the payoff of the whole flow |
| 7 | Flavor tags, price (PHP), calorie display | Information density that builds confidence |
| 8 | Dietary tags (vegetarian, gluten-free, etc.) | Practical value that widens appeal |
| 9 | "I'll get this" selection action | Completion moment — decision made |
| 10 | Photo quality feedback / retake prompt | Edge case handling — graceful degradation |

**Explicitly Out of MVP:**
- Order summary screen
- Table sharing / QR code
- Meal rating and reviews
- Taste DNA / persistent profiles
- User accounts or signup
- Budget/calorie/dietary filter sliders (mood selector handles filtering for MVP)

### Phase 2: Growth (Post-MVP)

- Budget, calorie, and dietary filter controls
- Order summary with pick tracking
- Table sharing via QR code for group dining
- Meal rating system with photo upload
- Saved items / favorites (requires lightweight account)

### Phase 3: Expansion (Future Vision)

- **Taste DNA** — persistent flavor profile that learns from ratings and selections, improving recommendations over time
- User accounts and profile persistence
- Shopping list generation from dishes
- Recipe recreation with skill-level adjustment
- Multi-language menu support
- Restaurant partnerships and menu integrations
- Food-specialized LLM fine-tuning for improved accuracy

### Risk Mitigation Strategy

**Technical Risks:**
- *Gemini accuracy on menu photos* — Already validated with test images. Mitigation: use clear, well-lit menu photos for demo; handle partial extraction gracefully.
- *Gemini API latency* — If response takes > 10s, UX feels broken. Mitigation: loading animation with fun food facts/tips; optimize prompt for faster response.
- *Camera API browser quirks* — Safari and Chrome handle camera differently. Mitigation: use file input with capture attribute as primary approach; test on both platforms early.

**Market Risks:**
- *"Is this actually useful?"* — Validated at hackathon via live user testing and survey. If users consistently pick dishes they love, concept is proven.

**Resource Risks:**
- *2 devs, 2 days* — Tight but achievable with clear scope. One dev on frontend (React/Next.js), one on backend (Gemini API integration). QE tests end-to-end flow continuously.
- *Contingency:* If time runs short, cut dietary tags and filter controls — core flow (scan → vibe → recommend) is the minimum demo.

## Functional Requirements

### Menu Capture

- **FR1:** User can take a photo of a restaurant menu using their device camera
- **FR2:** User can upload an existing photo of a menu from their device gallery
- **FR3:** System can extract individual dish names and descriptions from a menu photo
- **FR4:** System can detect when a menu photo is low quality or partially illegible and notify the user
- **FR5:** User can retake or re-upload a menu photo after receiving a quality warning
- **FR6:** System can proceed with partially extracted menu data when full extraction is not possible

### AI Menu Intelligence

- **FR7:** System can identify the cuisine type for each extracted dish (Filipino, Japanese, Thai, Korean, etc.)
- **FR8:** System can generate a flavor profile for each dish (savory, spicy, sweet, umami, rich, etc.)
- **FR9:** System can identify key ingredients for each extracted dish
- **FR10:** System can estimate the price in Philippine Pesos (PHP) for each dish
- **FR11:** System can estimate calorie count for each dish
- **FR12:** System can generate a health indicator for each dish
- **FR13:** System can classify dietary attributes for each dish (vegetarian, vegan, gluten-free, etc.)

### Mood & Vibe Selection

- **FR14:** User can select a mood/vibe category to filter recommendations (Comfort Food, Something Light, Adventurous, Impress a Date, Hungover, Sweet Tooth)
- **FR15:** User can select a "Surprise Me" option for random mood assignment
- **FR16:** System can match dishes to the selected mood based on flavor profiles and dish characteristics

### Recommendations

- **FR17:** System can generate a ranked list of dish recommendations based on the selected mood
- **FR18:** System can calculate and display a match score (percentage) for each recommended dish
- **FR19:** User can view recommendation cards showing dish name, description, match score, flavor tags, price, calories, and dietary tags
- **FR20:** User can browse through multiple recommendations for their selected mood
- **FR21:** User can select a dish ("I'll get this") to indicate their choice

### Error Handling & Feedback

- **FR22:** System can display a meaningful message when no dishes match the selected mood
- **FR23:** System can display a loading state while the AI processes the menu photo
- **FR24:** System can display a graceful error message when the AI processing fails
- **FR25:** System can inform the user when no network connection is available

## Non-Functional Requirements

### Performance

- **NFR1:** Menu photo upload and AI processing must complete within **10 seconds** on a 4G mobile connection
- **NFR2:** Screen transitions between app states (welcome → camera → vibe → recommendations) must complete in < 300ms
- **NFR3:** Initial app load must complete within **3 seconds** on a 4G connection
- **NFR4:** Recommendation cards must render immediately after AI processing completes — no additional loading delay
- **NFR5:** Loading state during AI processing must include visual feedback (progress indicator or engaging animation) to prevent user abandonment

### Security

- **NFR6:** Menu photos sent to the Gemini API must be transmitted over HTTPS
- **NFR7:** Menu photos must not be stored permanently on the server after processing — process and discard
- **NFR8:** No personally identifiable information (PII) is collected or stored in MVP

### Integration

- **NFR9:** System must integrate with Google Gemini API for menu image processing and flavor profile generation
- **NFR10:** System must handle Gemini API failures gracefully — display user-friendly error message, not raw API errors
- **NFR11:** System must handle Gemini API rate limiting gracefully — queue or retry without user confusion
- **NFR12:** Gemini API responses must be parsed into structured dish data (JSON) before rendering to the frontend
