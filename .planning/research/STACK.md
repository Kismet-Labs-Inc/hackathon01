# Technology Stack

**Project:** Cravr -- AI-powered menu scanner and mood-based food recommender
**Researched:** 2026-03-04

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Expo SDK | 52 (stable) | App framework & managed workflow | SDK 52 is the safest bet tonight. SDK 55 just dropped (March 3, 2026) and Expo Go in the App Store still runs SDK 54. SDK 52 has months of stability, full Expo Go support, and zero surprise breakage. For a one-night build where "it runs on a real phone" is the demo requirement, stability wins over bleeding edge. | HIGH |
| React Native | 0.77 (via SDK 52) | Cross-platform mobile | Bundled with Expo SDK 52. New Architecture enabled by default but can be disabled if anything breaks. | HIGH |
| Expo Router | ~4.0 (SDK 52 bundled) | File-based navigation | Built into Expo -- file-based routing means zero config for screen navigation. Drop files in `app/` and they become routes. Fastest path to multi-screen apps. | HIGH |
| TypeScript | ~5.3 | Type safety | Expo templates ship with TS by default. Catches typos in a rushed hackathon build. Zero extra setup. | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| NativeWind | 4.x | Tailwind CSS for React Native | The team already knows Tailwind (project spec says "React Native with Tailwind/shadcn"). NativeWind v4 is stable with dark mode support, CSS variables, and animation support. Install, configure tailwind.config.js with Cravr's design tokens, and go. | HIGH |
| tailwindcss | ^3.4.17 | CSS utility engine (NativeWind peer dep) | NativeWind v4 requires Tailwind v3, not v4. Specifically pin ^3.4.17. | HIGH |
| @expo-google-fonts/plus-jakarta-sans | latest | Custom font | The design spec requires Plus Jakarta Sans. This Expo package has all weights pre-configured -- install and use with `useFonts()`. No manual font file management. | HIGH |
| expo-linear-gradient | SDK 52 bundled | Gradient backgrounds | Needed for polished card backgrounds and the dark-to-darker gradients in the mockups. Part of Expo SDK, zero config. | HIGH |

### AI / API Integration

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Direct `fetch()` to Gemini REST API | N/A | Menu OCR / vision | **Do NOT use `@google/genai` or `@google/generative-ai` SDKs in React Native.** Both have Node.js dependencies that cause compatibility issues in Expo (missing `structuredClone`, stream polyfill problems). Direct `fetch()` to `generativelanguage.googleapis.com` works perfectly with base64 image payloads. Simple, debuggable, no polyfill hell. | HIGH |
| Direct `fetch()` to Anthropic REST API | N/A | Mood-based recommendations | **Do NOT use `@anthropic-ai/sdk` in React Native.** It's a Node.js SDK, not designed for mobile. The Anthropic Messages API is a clean REST endpoint: POST to `api.anthropic.com/v1/messages` with `x-api-key` and `anthropic-version` headers. Simple fetch wrapper, no SDK overhead. | HIGH |

**API Key Security Note:** For a hackathon demo, hardcoding API keys in the app is acceptable (it's a prototype, not production). In production, you'd proxy through a backend. Tonight, ship fast.

### Gemini Model Choice

| Model | Purpose | Why |
|-------|---------|-----|
| `gemini-2.0-flash` | Menu photo OCR | The PROJECT.md says "Gemini 3.1 Flash Lite Preview" but this model name doesn't map to current Gemini API offerings. `gemini-2.0-flash` is the current fast/cheap vision model available via the REST API. If "gemini-3.1-flash-lite-preview" exists as a preview model with an API key the team already has, use that. Otherwise, fall back to `gemini-2.0-flash` which is proven for OCR tasks. | MEDIUM |

### State Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Zustand | 5.0.x | Global state | At ~1KB, Zustand is 20x smaller than Redux. No providers, no reducers, no boilerplate. Create a store in one file, import the hook anywhere. Perfect for tracking: scanned menu items, selected mood, saved items, order total. For a hackathon, the entire state layer is ~30 lines of code. | HIGH |

### Image Capture

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| expo-image-picker | SDK 52 bundled | Photo upload + camera capture | `launchCameraAsync({ base64: true, quality: 0.7 })` gives you a base64 string ready to send to Gemini. Also supports `launchImageLibraryAsync()` as fallback if camera permissions fail during demo. One library handles both paths. | HIGH |

### Polish / UX Libraries

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| expo-haptics | SDK 52 bundled | Tactile feedback | One-line haptic buzz on "I'll get this" button press. Tiny detail that impresses hackathon judges. | HIGH |
| react-native-reanimated | 3.x (SDK 52 bundled) | Animations | Card entrance animations, match percentage counter, mood card selection feedback. NativeWind v4 requires it as a peer dependency anyway. | HIGH |
| react-native-safe-area-context | ~4.x (SDK 52 bundled) | Safe area insets | Handles notch/dynamic island. Already included with Expo Router. | HIGH |

### Dev Tools

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Expo Go | SDK 52 | On-device testing | Scan QR code, see app on phone. No build step. The fastest development loop possible. | HIGH |
| expo-dev-client | SDK 52 | Fallback dev build | Only needed if Expo Go hits a wall with a native module. Unlikely for this stack but good insurance. | MEDIUM |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Styling | NativeWind v4 | React Native Paper / Gluestack | Pre-built component libraries fight the custom dark theme design. You'd spend more time overriding Material Design defaults than building from scratch with Tailwind utilities. |
| Styling | NativeWind v4 | NativeWind v5 | v5 is in preview. Untested in production. One-night build = no beta dependencies. |
| State | Zustand | Redux Toolkit | 20x the bundle, 10x the boilerplate. This app has ~5 pieces of global state. Redux is a cannon for a fly. |
| State | Zustand | React Context | Fine for 2-3 values, but Cravr needs menu items array + mood + saved items + filters. Context causes unnecessary re-renders without careful memo work. Zustand handles this automatically. |
| AI SDK | Direct fetch | Vercel AI SDK | Adds framework overhead and another dependency that may have Expo compatibility quirks. Direct fetch is 15 lines of code and zero dependencies. |
| AI SDK | Direct fetch | @google/genai | Node.js SDK with `structuredClone` dependency and stream polyfill issues in React Native. Not worth debugging at 2am. |
| AI SDK | Direct fetch | @anthropic-ai/sdk | Node.js SDK, not designed for React Native. Same story -- just use fetch. |
| Navigation | Expo Router | React Navigation (manual) | Expo Router IS React Navigation under the hood, but with file-based routing. Why configure manually what you get for free? |
| Expo SDK | 52 | SDK 55 | Released literally yesterday (March 3). No Expo Go in App Store yet. Requires `--template default@sdk-55` and potentially a dev build. Too risky for a one-night build. |
| Expo SDK | 52 | SDK 54 | Viable alternative. Stable and in Expo Go. But SDK 52 has more community battle-testing (4 months older). Either works; 52 is the conservative choice. |
| Image | expo-image-picker | expo-camera | expo-camera is for building custom camera UIs. We just need "take a photo, get base64." expo-image-picker does this in 3 lines with the system camera UI. |

## Installation

```bash
# Create project
npx create-expo-app@latest cravr --template blank-typescript

# Core styling
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npm install --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss

# Font
npx expo install @expo-google-fonts/plus-jakarta-sans expo-font

# State management
npm install zustand

# Image & polish
npx expo install expo-image-picker expo-haptics expo-linear-gradient

# Initialize Tailwind config
npx tailwindcss init
```

**Total new dependencies: ~8 packages.** Everything else is bundled with Expo SDK 52.

## Configuration Quick-Start

### tailwind.config.js
```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#1A1A1A',
        coral: '#E8734A',
        success: '#4CAF50',
      },
      fontFamily: {
        'jakarta': ['PlusJakartaSans_400Regular'],
        'jakarta-medium': ['PlusJakartaSans_500Medium'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
      },
    },
  },
  plugins: [],
};
```

### API Call Patterns (no SDKs needed)

**Gemini OCR:**
```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
          { text: 'Extract all menu items from this restaurant menu. Return JSON array with name, description, price, and dietary tags for each item.' }
        ]
      }]
    })
  }
);
```

**Claude Recommendations:**
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Given these menu items: ${JSON.stringify(menuItems)}
        And this mood: "${selectedMood}"
        Recommend the top 5 items with match percentages and brief reasons. Return as JSON.`
    }]
  })
});
```

**Note on Claude model:** Use `claude-sonnet-4-5-20250929` rather than Opus for recommendations. Sonnet is faster (sub-3s responses), cheaper, and plenty smart for food matching. Opus would add latency the demo doesn't need. If the team has Opus access and wants to flex it in the pitch, swap the model string -- the API call is identical.

## Sources

- [Expo SDK 52 Changelog](https://expo.dev/changelog/2024-11-12-sdk-52)
- [Expo SDK 55 Release](https://expo.dev/changelog/sdk-55)
- [NativeWind v4 Installation](https://www.nativewind.dev/docs/getting-started/installation)
- [Expo ImagePicker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [@expo-google-fonts/plus-jakarta-sans](https://www.npmjs.com/package/@expo-google-fonts/plus-jakarta-sans)
- [Gemini API Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Anthropic API Getting Started](https://docs.anthropic.com/en/api/getting-started)
- [@anthropic-ai/sdk npm](https://www.npmjs.com/package/@anthropic-ai/sdk)
- [@google/genai npm](https://www.npmjs.com/package/@google/genai)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Expo Fonts Documentation](https://docs.expo.dev/develop/user-interface/fonts/)
