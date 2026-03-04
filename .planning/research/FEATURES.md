# Feature Landscape

**Domain:** Mobile food recommendation app (menu scanning + mood-based AI picks)
**Researched:** 2026-03-04
**Context:** Hackathon prototype, one-night build, live phone demo to judges

## Table Stakes

Features judges expect from any AI food recommendation demo. Missing these = "this doesn't really work."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Menu input (photo upload) | Core premise of the app. If you can't get the menu in, nothing works. | Medium | Gemini Flash Lite handles OCR. Must parse into structured items (name, price, description). Confidence: HIGH |
| Structured menu display | Users need to see the menu was correctly parsed before trusting recommendations. | Low | Show parsed items as a list/cards. Validates the OCR step visually. |
| AI-generated dish recommendations | The entire value prop. "AI recommends food" is the pitch. | Medium | LLM takes parsed menu + mood context and returns ranked picks. Must feel instant (< 3 seconds). |
| Match percentage / confidence score | Judges and users both expect a visible signal of *how good* the recommendation is. Netflix proved this: match % drove 200% more engagement than star ratings. | Low | LLM generates the score. Display as a prominent badge on each card. |
| Mood/vibe selection | This IS the differentiating input mechanism. Without it, it's just "random menu items." | Low | 6 mood cards + Surprise Me. Pre-designed in Stitch. Should feel tactile and fun. |
| Save / "I'll get this" interaction | Judges need to see a complete flow: scan -> pick mood -> get recs -> choose items. Without selection, the loop feels incomplete. | Low | Toggle state on cards. Sticky bar with count. |
| Order summary view | Closes the loop. Shows what you chose, total cost, total calories. Makes the demo feel like a real product. | Low | Sum selected items. Display totals. Already designed. |
| Dark polished UI | Judges associate visual quality with product maturity. An ugly UI kills perception of technical quality. Hackathon research confirms: "A project with a bad UI is often a bad project." | Low | Already designed in Stitch. Follow the design system exactly. |
| Runs on a real phone | Live demo on phone >> simulator >> screenshots. Judges want to see it work for real. | Low | Expo Go handles this. Test on device before demo. |

## Differentiators

Features that make judges say "wow, they built that in one night?" Not expected, but high-impact.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Mood-to-food reasoning explanations | Each recommendation includes a short, witty explanation of WHY this dish matches the mood. "You said Hungover -- this greasy burger will fix everything." Creates personality and demonstrates AI understanding. | Low | Prompt engineering. LLM already generates recommendations; add a "reason" field to the response format. HIGH impact for LOW effort. |
| Micro-animations and transitions | Loading states, card reveals, match % counting up, smooth screen transitions. Research says: allocate 2-3 hours for polish. A button with a loading spinner then checkmark feels 10x more professional. | Low-Med | React Native Reanimated or built-in Animated API. Focus on: card entrance animations, match % counter animation, save button feedback. |
| Dietary/allergy filter overlays | After seeing recommendations, tap to filter by dietary needs. Items that don't match get dimmed or tagged. Competitors like BiteRight, Foodient, and MenuGuide all do allergen detection -- judges will recognize this. | Low | LLM already knows ingredients from OCR. Add filter chips that re-sort/tag results. P1 priority add-on. |
| Calorie and budget awareness | Show calorie estimates and prices on every card. Let the order summary show totals for both. Competitive apps (BiteRight, Foodbud) all do nutritional breakdowns. | Low | LLM estimates from parsed menu. Already in the card design. |
| Taste DNA visualization | After selecting items, show a flavor profile radar chart or bar chart that evolves. "Your Taste DNA is forming..." This creates a narrative arc in the demo and implies long-term value. | Medium | Needs a chart component. Can fake the "evolution" for demo. Visual payoff is high. |
| "Surprise Me" with dramatic reveal | When user taps Surprise Me, skip the recommendations list entirely. Show a single card with a dramatic flip/reveal animation. Creates a moment of delight that's memorable for judges. | Low | Special case in the recommendation flow. One card, one animation. |
| Speed / perceived intelligence | The entire scan-to-recommendation flow completing in under 10 seconds. Fast = impressive. Judges think: "the AI is actually smart." | Low | Optimize: Gemini OCR is fast, LLM call should stream. Show skeleton loaders during processing. |
| Real restaurant menu in demo | Using an actual local restaurant menu (not a pre-loaded test file) during the live demo. Proves the system actually works on real-world input. | Low | Bring a physical menu or pull one up on another phone. The demo narrative: "let me scan this actual menu right now." |

## Anti-Features

Features to explicitly NOT build for this hackathon. Building these would waste precious hours.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User accounts / authentication | Zero onboarding is a design principle. Signup screens kill hackathon demos. Every second of friction = lost judge attention. | Jump straight to scan. No login wall. |
| Live camera OCR (real-time scanning) | Too risky for one night. Camera permission issues, frame processing, edge cases. Photo upload is reliable and still impressive. | Photo upload from gallery or single camera capture. Looks almost the same in demo. |
| QR code sharing / group mode | Extremely high complexity. Needs networking, real-time sync, QR generation. No time. | If time permits, show a static mockup screen. "And in the full version, you'd share via QR." |
| Backend / database persistence | No time to set up a server, database, user sessions. Everything can live in-memory for a demo. | React state or AsyncStorage. Data lives for the demo session. That's all you need. |
| Payment integration | Not relevant to the core value prop. Judges don't need to see Stripe checkout. | Order summary shows totals. The "I'll get this" interaction IS the conversion moment. |
| Multi-language menu translation | Cool feature (MenuGuide does it) but adds complexity and edge cases. English menus are fine for demo. | Only demo with English-language menus. |
| Nutritional database integration | BiteRight uses USDA FoodData Central etc. for exact nutrition. You don't have time to integrate nutrition APIs. | LLM estimates calories from dish descriptions. "Approximately 450 cal" is fine. Not medically accurate, but useful. |
| Restaurant discovery / location | DoorDash Zesty does restaurant-level recommendations with maps. You're solving a different problem: you're already AT the restaurant. | The menu is the input. No location services needed. |
| Social features / reviews | Zesty has follows, comments, photo sharing. Way too much scope. | The value is personal: MY mood, MY recommendations, MY order. |
| Onboarding flavor quiz | Some apps (Foodbud) ask for taste preferences upfront. This contradicts the "show value first" philosophy. | Taste DNA builds passively from selections. No quiz needed. |
| Elaborate post-meal rating flow | Nice-to-have, but not core. If it takes more than 30 minutes to build, skip it. | If time permits, a simple emoji-tap rating on each item in order summary. 15-minute feature max. |

## Feature Dependencies

```
Photo Upload (menu input)
  --> Menu OCR/Parsing (Gemini)
    --> Structured Menu Display
      --> Mood Selection
        --> AI Recommendation Engine (LLM)
          --> Recommendation Cards (with match %, price, calories, reasoning)
            --> Save / "I'll get this"
              --> Order Summary (totals)
                --> [Optional] Taste DNA visualization
                --> [Optional] Post-meal rating

Dietary/Allergy Filters --> depends on Recommendation Cards existing
Surprise Me --> special case of AI Recommendation flow
Micro-animations --> layered on top of all screens (independent)
```

**Critical path:** Photo Upload -> OCR -> Mood -> Recommendations -> Save -> Summary. This is the demo flow. Build this first, make it work end-to-end, then layer on differentiators.

## MVP Recommendation

Build these first (in order of dependency):

1. **Menu photo upload + OCR parsing** -- Without this working, there's no demo
2. **Mood selection screen** -- 6 cards + Surprise Me, the "vibe" moment
3. **AI recommendations with match % and reasoning** -- The payoff. Include witty explanations.
4. **Save items + order summary** -- Closes the loop. Proves it's a complete flow.
5. **Polish: dark UI matching Stitch, basic animations** -- Judges associate visual quality with product quality

Then layer differentiators (time permitting, in priority order):

1. **Mood reasoning text** on each card (15 min -- just prompt engineering)
2. **Dietary/calorie/budget filter chips** (30 min -- re-sort existing data)
3. **Surprise Me dramatic reveal** (30 min -- animation on single card)
4. **Micro-animations** on card entrance and match % counter (1-2 hrs)
5. **Taste DNA radar/bar chart** (1-2 hrs)
6. **Post-meal emoji rating** (15 min if simple)

**Defer entirely:** User accounts, live OCR, QR sharing, backend, payments, social features, nutritional DB integration.

## Competitive Landscape Context

| Competitor/Reference | What They Do | What Cravr Does Differently |
|---------------------|-------------|---------------------------|
| BiteRight | Scans menus for nutritional/allergen analysis. Health-focused. Clinical tone. | Cravr is mood-first, fun-first. "What's the vibe?" not "What are the macros?" |
| Foodbud | AI allergen analysis + personalized menus for restaurants. B2B + B2C. | Cravr works on ANY menu with zero restaurant integration. Photo -> picks. |
| DoorDash Zesty | AI restaurant discovery via mood/context. Social features. | Cravr works INSIDE the restaurant on the actual menu. Zesty picks restaurants; Cravr picks dishes. |
| Taranify | Mood-based food recommendations via color quiz. | Cravr uses direct mood cards (faster) and works on a specific menu you're holding, not generic cuisine suggestions. |
| MoodBite | NLP-based mood-to-restaurant matching. | Same lane but Cravr is dish-level, not restaurant-level. More specific, more useful when you're already seated. |
| MenuGuide | Menu OCR + translation + allergen detection. | Cravr adds the recommendation layer. MenuGuide shows you what's on the menu; Cravr tells you what to ORDER. |

**Cravr's unique position:** The only app that combines physical menu scanning + mood context + AI dish-level recommendations with match scores. Competitors do pieces of this; nobody does the full "Scan. Vibe. Devour." loop.

## What Judges Will Remember

Based on hackathon research, judges remember:

1. **The "aha" moment** -- Scanning a real menu and seeing AI picks appear with match percentages and witty reasoning. That's the demo moment.
2. **Visual polish** -- Dark theme, smooth animations, professional cards. "They built THIS in one night?"
3. **Speed** -- If the whole flow takes < 15 seconds from scan to recommendations, it feels like magic.
4. **Personality** -- The mood cards, the recommendation reasoning, the app's voice. "Hungover? This greasy burger will cure what ails you. 94% match."
5. **Complete flow** -- Start to finish, no dead ends, no "imagine this part works." A full loop from scan to order summary.

## Sources

- [BiteRight Restaurant Menu Scanner](https://biteright.app/features/restaurant-menu-scanner) -- Menu OCR + nutrition analysis features
- [Foodbud AI](https://www.foodbud.ai/) -- Allergen analysis + personalized restaurant menus
- [DoorDash Zesty launch (TechCrunch)](https://techcrunch.com/2025/12/16/doordash-rolls-out-zesty-an-ai-social-app-for-discovering-new-restaurants/) -- Mood-based restaurant discovery
- [Taranify mood-based recommendations](https://www.taranify.com/what-to-eat) -- Color quiz to food picks, no history needed
- [MoodBite AI](https://moodbite.ai/technology) -- NLP mood interpretation for restaurant matching
- [MenuGuide](https://menuguide.app/) -- Menu OCR + translation + allergen detection
- [Foodient allergen scanner](https://www.foodient.app/) -- Photo-based allergen identification
- [Tribe AI: Top AI Nutrition Apps 2025](https://www.tribe.ai/applied-ai/ai-nutrition-apps) -- AI food app feature expectations
- [Devpost: hackathon demo tips](https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video) -- Demo best practices
- [Hackathon judging criteria](https://eventornado.com/blog/how-to-judge-a-hackathon-5-criteria-to-pick-winners) -- What judges evaluate
- [BizThon: What Makes Projects Stand Out](https://medium.com/@BizthonOfficial/10-winning-hacks-what-makes-a-hackathon-project-stand-out-818d72425c78) -- UI polish and animation impact
