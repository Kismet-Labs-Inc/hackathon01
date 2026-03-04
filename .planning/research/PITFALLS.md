# Domain Pitfalls

**Domain:** Mobile AI food recommendation app (menu OCR + mood-based recommendations)
**Context:** One-night hackathon build, single developer, Expo/React Native, Gemini Flash Lite OCR, Claude Opus 4.6 recommendations, demo on real phone
**Researched:** 2026-03-04

---

## Critical Pitfalls

Mistakes that can sink the demo entirely or waste irreplaceable hours.

### Pitfall 1: Using Node.js AI SDKs in React Native

**What goes wrong:** Installing `@anthropic-ai/sdk`, `@google/genai`, or `@google/generative-ai` in an Expo project. These are Node.js SDKs that depend on `structuredClone`, Node streams, and other APIs missing from React Native's Hermes runtime.
**Why it happens:** The npm install succeeds. The import compiles. The error only appears at runtime on a device -- usually as "Property structuredClone doesn't exist" or a stream polyfill crash. By then you have built your service layer around the SDK's API.
**Consequences:** 1-2 hours debugging polyfills, or a full rewrite of the service layer to use fetch instead.
**Prevention:** Use direct `fetch()` calls to both Gemini and Claude REST APIs from the start. The REST APIs are simple JSON-in, JSON-out. No SDK needed. See STACK.md for exact API call patterns.
**Detection:** If you see `structuredClone`, `ReadableStream`, or `TextDecoder` errors on device, you have hit this.
**Confidence:** HIGH -- verified via GitHub issues and community reports.

### Pitfall 2: API Calls Fail Live on Stage (The Silent Demo Killer)

**What goes wrong:** You demo the app, tap "Scan Menu," and... spinner forever. The Gemini or Claude API times out, rate-limits, or returns an error. The audience sees a loading screen. The demo is dead.
**Why it happens:**
- Hackathon venue WiFi is notoriously unreliable -- hundreds of developers saturating shared bandwidth simultaneously
- Gemini free tier rate limits are aggressively low: Flash Lite is 15 RPM / 1,000 RPD on free tier. If you burned through requests during development/testing, you may hit daily quota during the demo.
- Claude API calls for complex recommendation prompts can take 10-30 seconds under load
- Cold starts on API endpoints add seconds of latency
**Consequences:** Total demo failure. No amount of talking can save a blank screen. Judges move on.
**Prevention:**
1. **Cache a golden path.** Before the demo, capture the exact API responses (OCR result + recommendation result) for your demo menu. Store them as local JSON fallbacks. If the API call fails or takes >8 seconds, serve the cached response. The audience cannot tell the difference.
2. **Preload your demo flow.** Before going on stage, run through the full flow once on the venue WiFi. This warms up caches and confirms connectivity.
3. **Use a mobile hotspot as backup.** Phone tethering from a teammate's device is more reliable than venue WiFi.
4. **Add visible loading states** with personality: "Analyzing menu..." / "Finding your perfect match..." gives the illusion of progress even if the API is slow.
5. **Set aggressive timeouts** (8-10 seconds) with graceful fallback to cached data.
**Detection:** API calls during development take >5 seconds. You see 429 errors in your console. Venue WiFi drops during setup.
**Phase:** Must be addressed in the core build. Fallback/caching logic should be baked in from the start, not bolted on at 4am.

### Pitfall 3: Menu Photo Produces Garbage OCR Output

**What goes wrong:** The Gemini vision call returns mangled text -- missing items, wrong prices, garbled names, items from the wrong section. Recommendations are based on nonsense.
**Why it happens:**
- Restaurant menus are one of the hardest OCR targets: decorative fonts, multi-column layouts, handwritten specials, background textures, watermarks
- Phone photos of menus have glare (laminated menus), uneven lighting (dim restaurants), blur (hand shake), perspective distortion (angled shots)
- Flash Lite is measurably worse at OCR than regular Flash. Community reports confirm flash-lite has accuracy issues, and the 2.5 series introduced character recognition regressions (e.g., "e" becoming diacritical variants like "e" or "e")
- The model may hallucinate menu items that do not exist, invent prices, or merge items from different columns
**Consequences:** Recommendations for dishes not on the menu. Wrong prices in order summary. Judges who know the restaurant catch the errors.
**Prevention:**
1. **Choose your demo menu NOW and test it.** Pick a real menu, photograph it under good lighting, run it through Gemini, verify the output. Iterate on the prompt until clean.
2. **Use a structured prompt:** `"Extract all menu items as JSON array. Each item: {name, description, price, category}. If you cannot read a field, set it to null."`
3. **Pre-photograph your demo menu** in good lighting. Do NOT take a fresh photo on stage under projector lighting.
4. **Consider using regular Flash instead of Flash Lite** for OCR. The cost difference is negligible for a hackathon (<100 calls total). The accuracy difference is significant.
5. **Validate OCR output** before passing to recommendations -- if fewer than 3 items parsed, show "Couldn't read menu clearly" rather than generating recommendations from garbage.
**Detection:** Test with 3-4 different menu photos. If any returns fewer than 50% of visible items, the prompt needs work.
**Phase:** Must be validated in the first hour. Everything downstream depends on clean menu data.

### Pitfall 4: Scope Creep at 3am (The Decorated Dead End)

**What goes wrong:** Core flow works. You think "I have time for filters... and ratings... and Taste DNA..." You start a new feature, introduce a bug in working code, and spend the remaining hours debugging instead of polishing.
**Why it happens:** Adrenaline and false confidence. The gap between "core works" and "demo-ready" is bigger than it looks.
**Consequences:** 5am with a half-working pipeline, beautiful filter chips, and no demo. Or the add-on introduced a state management bug that breaks the core flow.
**Prevention:**
1. **Once core flow works end-to-end, commit and tag it.** `git tag demo-safe`. This is your fallback.
2. **Polish before adding.** Loading states, error handling, and animations on the core flow are worth more than half-built add-on features.
3. **Each add-on gets a branch.** If it breaks, `git checkout demo-safe`.
4. **Hard rule: no add-ons until scan -> mood -> recs -> save -> summary works with real data.**
5. **Stop coding 1 hour before demo.** Use that hour to: charge phone, test on venue WiFi, practice the talk track, pre-load the demo flow.
**Detection:** If you are working on anything other than the critical path and have not done a full end-to-end test yet, stop immediately.
**Phase:** Discipline throughout. Set a checkpoint: "If core isn't working by [time], all add-ons are cut."

### Pitfall 5: Choosing Bleeding-Edge Expo SDK

**What goes wrong:** Using Expo SDK 55 (released March 3, 2026 -- literally yesterday) for a project due tomorrow morning. SDK 55 requires the New Architecture with no opt-out, Expo Go in the App Store still runs SDK 54, and there are zero months of community bug reports.
**Why it happens:** Developers default to "latest is best."
**Consequences:** Compatibility issues with NativeWind v4, undiscovered bugs, need for a development build instead of Expo Go (adds 15-30 min of EAS setup).
**Prevention:** Use Expo SDK 52 (stable since November 2024). SDK 54 is also acceptable. Avoid SDK 55 tonight.
**Detection:** If `npx expo start` fails or Expo Go shows a version mismatch, you chose wrong.
**Confidence:** HIGH -- SDK 55 release timing verified.

### Pitfall 6: The "Image Too Large" Memory Crash

**What goes wrong:** User takes a photo of a menu, the app crashes or freezes. On iOS, you get an EXC_RESOURCE memory crash. On Android, the app restarts silently.
**Why it happens:**
- Modern phone cameras produce 12-48MP images (8-20MB raw)
- Converting a large image to base64 for the Gemini API doubles the memory footprint (a 10MB image becomes ~14MB as base64)
- React Native's JavaScript thread has limited memory; base64 string manipulation is expensive
- expo-image-manipulator has documented memory crashes on iOS (GitHub issue #40158)
- expo-image-picker on Android produces base64 strings that can exceed API limits (GitHub issue #2125)
**Consequences:** App crash during the most critical demo moment -- the first interaction. Requires restart.
**Prevention:**
1. **Set `quality: 0.5-0.7`** in expo-image-picker options. This cuts payload by 50-60% without losing text readability.
2. **Never use base64 for large images.** Use the file URI from the picker and send the file directly if your API call pattern supports it. If you must use base64, resize first to max 1024px on the longest side.
3. **Set `exif: false`** to strip unnecessary metadata.
4. **Test on a real device.** Memory constraints are much tighter on physical hardware than simulators.
**Detection:** App crashes when picking an image. Console shows memory warnings. Android: app restarts after photo selection.
**Phase:** Must be addressed when implementing photo capture. Non-negotiable.

### Pitfall 7: Building a Backend "Because You Should"

**What goes wrong:** Spending 1-3 hours setting up an Express/Fastify server, deploying to Vercel/Railway, configuring CORS, managing environment variables on a server -- all to proxy API calls that could be made directly.
**Why it happens:** Security instinct. "API keys shouldn't be in client code" is correct for production. A hackathon demo is not production.
**Consequences:** 2+ hours lost on infrastructure that adds zero demo value. Backend bugs (CORS, cold starts) are invisible to judges.
**Prevention:** Call Gemini and Claude APIs directly from the React Native app using `fetch()`. Store API keys in `EXPO_PUBLIC_*` environment variables. Rotate keys after the hackathon.
**Detection:** If you are writing CORS headers or debugging deployment logs at 1am, stop.

## Moderate Pitfalls

Issues that degrade the demo quality but do not kill it outright.

### Pitfall 8: The 30-Second Dead Zone (Loading Without Feedback)

**What goes wrong:** User scans menu, picks a mood, then stares at a blank screen for 15-30 seconds while: (1) image uploads, (2) Gemini processes OCR, (3) OCR result sent to Claude, (4) Claude generates recommendations.
**Why it happens:**
- Two sequential API calls create compounding latency
- Gemini vision calls with images: 3-8 seconds
- Claude with complex prompt + full menu context: 10-20 seconds
- Total: 15-30 seconds of apparent nothing
**Prevention:**
1. **Pipeline the OCR call during mood selection.** Start the Gemini call immediately after photo capture, not after mood selection. By the time the user picks a mood, OCR may already be done. **This is the single biggest latency win.**
2. **Split loading into visible stages:** "Reading your menu..." during OCR, then "Finding your perfect match..." during recommendations.
3. **Use streaming for the Claude call** if possible. Partial results appearing one by one are more engaging than a delayed dump.
4. **Skeleton screens** with shimmer animations feel 50% faster than a spinner.
**Detection:** Time your full flow with a stopwatch. If total exceeds 10 seconds, optimize the pipeline.
**Phase:** Architecture decision -- pipeline OCR early. Loading states are part of the core build.

### Pitfall 9: NativeWind v4 Silent Failure

**What goes wrong:** NativeWind v4 silently fails if the babel plugin is misconfigured or if `tailwindcss` is the wrong major version (v4 instead of v3). Styles just do not apply -- no error, no crash, just unstyled components.
**Prevention:** Pin `tailwindcss@^3.4.17` (not v4). Follow exact NativeWind v4 installation steps. Test with a single colored View before building more. If `className="bg-coral"` renders as unstyled, debug config immediately.
**Confidence:** HIGH -- NativeWind docs explicitly warn about Tailwind v4 incompatibility.

### Pitfall 10: Mood Selection Does Not Actually Affect Results

**What goes wrong:** You demo "Comfort Food" and get mac and cheese. Then you demo "Something Light" and get... the same mac and cheese with a slightly lower match percentage. Moods feel cosmetic, not functional.
**Why it happens:**
- The prompt does not give enough weight to mood
- All moods pull from the same pool; the model gravitates toward "objectively best" items regardless
- Match percentages are close together (85% vs 82%) so rankings barely change
**Prevention:**
1. **Make mood the dominant factor:** Instead of "recommend items for a [mood] mood," say "You MUST only recommend items that strongly match this mood. For 'Something Light,' EXCLUDE all heavy/fried/rich items entirely. For 'Comfort Food,' prioritize warm, hearty, familiar dishes. For 'Adventurous,' prioritize unusual ingredients and bold flavors."
2. **Force score variety:** "The top recommendation must be 90%+. Exclude any item below 70% match."
3. **Prepare a two-mood demo** (Comfort Food vs. Something Light) with the same menu to show differentiation.
**Detection:** Run all 6 moods against the same menu during development. If the same item appears in top 3 for more than 2 moods, the prompt needs tuning.
**Phase:** Prompt engineering during recommendation engine build.

### Pitfall 11: Gemini Structured Output Parsing Failures

**What goes wrong:** Gemini returns JSON wrapped in markdown code fences (` ```json ... ``` `) or includes explanatory text before/after the JSON. `JSON.parse()` throws.
**Prevention:**
1. Use `responseMimeType: 'application/json'` in Gemini request config to force JSON output mode.
2. Strip markdown fences before parsing: `response.replace(/```json\n?|\n?```/g, '').trim()`
3. Wrap JSON.parse in try/catch with a single retry.

### Pitfall 12: Claude Returns Unexpected JSON Shape

**What goes wrong:** Claude uses `match_percent` instead of `matchPercent`, or wraps the array in `{ "recommendations": [...] }`.
**Prevention:**
1. **Use Claude's structured outputs feature** (beta header `structured-outputs-2025-11-13`) to guarantee valid JSON matching your exact schema. This eliminates parsing errors.
2. Be extremely explicit in the system prompt about exact field names. Include a concrete JSON example.
3. Add a normalization function that handles common variants.
4. **Pass menu items as a numbered list**, then tell Claude to reference items by number. This prevents hallucinated items not on the menu.
**Confidence:** MEDIUM -- structured outputs eliminates format issues but is a beta feature.

### Pitfall 13: Dark Theme Invisible on Projector

**What goes wrong:** Dark theme (#0A0A0A background) looks perfect on your phone but is invisible when projected. The difference between #0A0A0A (background) and #1A1A1A (cards) is only 16 luminance steps -- imperceptible on most projectors.
**Prevention:**
1. **Bump card background** from #1A1A1A to #252525 or #2A2A2A for projector visibility.
2. **Add 1px border** in #333 or a drop shadow to cards.
3. **Test by screen-mirroring** your phone to a large screen. Stand 10 feet away. Can you read everything?
4. **Set status bar explicitly:** `<StatusBar style="light" />` in root layout.
5. **Use SafeAreaProvider** at app root AND in any modal routes.
**Phase:** Polish pass, but worth a quick mirror test early.

### Pitfall 14: Animation Time Sink

**What goes wrong:** 2 hours trying to get a smooth card flip animation, fighting layout bugs and platform differences between iOS and Android.
**Prevention:** Time-box ALL animations to 30 minutes each. If not working in 30 min, use a simple fade-in. Opacity and translateY transitions are the safest cross-platform animations. Avoid `react-native-reanimated` layout animations for a hackathon.

## Minor Pitfalls

### Pitfall 15: Font Loading Flash

**What goes wrong:** Plus Jakarta Sans has not loaded when the app renders. Flash of system font makes the UI look cheap.
**Prevention:** Use `useFonts()` hook + `expo-splash-screen`. Hold splash until fonts load. Call `SplashScreen.hideAsync()` after fonts load.
**Phase:** First commit. Do not add fonts at 4am.

### Pitfall 16: Price/Calorie Data Inconsistent

**What goes wrong:** Order summary shows $0.00, "null," or mixed formats ($12 vs $12.00 vs "12").
**Prevention:**
1. Normalize prices immediately after OCR: parse to numbers, format with `toFixed(2)`.
2. For calories (rarely on menus), have Claude estimate in the recommendation call: "Estimate calories as a single number."
3. Handle nulls in UI: show "--" or "~450 cal" instead of "null."

### Pitfall 17: Camera Permission Denied on Stage

**What goes wrong:** First `launchCameraAsync()` triggers a permission dialog. If denied, all subsequent calls fail silently.
**Prevention:** Check `requestCameraPermissionsAsync()` first. Offer `launchImageLibraryAsync()` as fallback (fewer device-specific bugs per GitHub issue #39480). Pre-grant permissions before demo.

### Pitfall 18: "Surprise Me" Is Just Random

**What goes wrong:** User taps "Surprise Me" and gets a random item. No delight, no personality.
**Prevention:** "Surprise Me" should be its own mood prompt: "Pick the single most interesting, unexpected item. Something the user would not normally order but would love. Explain WHY." Limit to 1-2 items. A "surprise" with 5 options is not a surprise.
**Phase:** Prompt engineering, late polish. Low effort, high demo impact.

### Pitfall 19: Testing Only on Simulator

**What goes wrong:** Works on simulator, fails on device. Camera does not work (simulator has no camera), base64 encoding is slower on device, memory constraints are tighter.
**Prevention:** Test on real device via Expo Go at least 2 hours before demo.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Project setup | NativeWind silent failure (Pitfall 9) | Test one colored View immediately |
| Project setup | Wrong Expo SDK (Pitfall 5) | Use SDK 52 or 54. Not 55. |
| Photo capture | Memory crash from large images (Pitfall 6) | quality: 0.5-0.7, exif: false, file URI over base64 |
| OCR Pipeline | Garbage output (Pitfall 3) | Test demo menu in first hour, structured JSON prompt |
| OCR Pipeline | JSON wrapped in markdown fences (Pitfall 11) | responseMimeType: 'application/json', strip fences |
| OCR Pipeline | Flash Lite accuracy (Pitfall 3) | Consider regular Flash for OCR step |
| AI Integration | Node.js SDK crash (Pitfall 1) | Use direct fetch(). No SDKs. |
| AI Integration | 30-second dead zone (Pitfall 8) | Pipeline OCR during mood selection |
| AI Integration | Unexpected JSON shape (Pitfall 12) | Structured outputs beta header, example JSON in prompt |
| AI Integration | Hallucinated menu items (Pitfall 12) | Numbered item list, "only items from this list" |
| Mood Selection | Moods feel cosmetic (Pitfall 10) | Mood-dominant prompt, test all 6 against same menu |
| Save/Order Flow | State bugs | Simple array of selected item IDs. Zustand or useState. |
| Visual Polish | Animation time sink (Pitfall 14) | 30-min time-box. Opacity/translateY only. |
| Visual Polish | Font flash (Pitfall 15) | useFonts + splash screen in first commit |
| Demo Prep | API failure on stage (Pitfall 2) | Cache golden path, mobile hotspot, timeout fallback |
| Demo Prep | Projector contrast (Pitfall 13) | Bump card bg to #252525, add borders, mirror test |
| Demo Prep | Device-only bugs (Pitfall 19) | Test on real device 2+ hours before demo |
| Time Management | Scope creep (Pitfall 4) | Tag demo-safe, branch add-ons, stop coding 1hr early |

---

## Sources

- [Gemini API Rate Limits (official)](https://ai.google.dev/gemini-api/docs/rate-limits) -- Free tier limits
- [Gemini API Free Tier Changes (Dec 2025)](https://blog.laozhang.ai/en/posts/gemini-api-free-tier) -- Flash Lite 15 RPM, 1000 RPD
- [Gemini Flash-Lite OCR Forum Discussion](https://discuss.ai.google.dev/t/ocr-gemini-2-0-flash-lite-vs-2-5-flash-lite/106599) -- Flash-lite vs Flash accuracy
- [Expo ImagePicker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/) -- Options and configuration
- [Expo Image Manipulator Memory Crash (iOS)](https://github.com/expo/expo/issues/40158) -- EXC_RESOURCE on large images
- [Expo ImagePicker Base64 Size (Android)](https://github.com/expo/expo/issues/2125) -- Base64 doubles size
- [Expo launchCameraAsync Android Bug](https://github.com/expo/expo/issues/39480) -- Camera broken after 2025-09-05 patch
- [Expo Safe Areas Guide](https://docs.expo.dev/develop/user-interface/safe-areas/) -- SafeAreaProvider requirements
- [Expo Status Bar Configuration](https://docs.expo.dev/guides/configuring-statusbar/) -- Dark theme setup
- [Expo SDK 55 Changelog](https://expo.dev/changelog/sdk-55) -- Release timing
- [NativeWind v4 Installation](https://www.nativewind.dev/docs/getting-started/installation) -- Config requirements
- [Claude Structured Outputs (official)](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) -- Beta header for JSON schema
- [Claude API Rate Limits (official)](https://platform.claude.com/docs/en/api/rate-limits) -- Timeout guidance
- [@google/genai React Native Issues](https://github.com/vercel/ai/issues/3705) -- SDK compatibility
- [Restaurant Menu OCR Challenges (Klippa)](https://www.klippa.com/en/blog/information/automatically-scan-menu-cards-with-ocr-ml-for-market-research-and-competitor-analyses/) -- Layout challenges
- [6 Biggest OCR Problems](https://conexiom.com/blog/the-6-biggest-ocr-problems-and-how-to-overcome-them/) -- Glare, blur, lighting
- [Hackathon Demo Tips (Medium)](https://medium.com/upstate-interactive/8-tips-to-a-successful-hackathon-demo-and-presentation-4d1ae83415ad) -- Demo preparation
