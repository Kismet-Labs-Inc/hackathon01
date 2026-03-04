# Phase 2: Menu Scanning - Research

**Researched:** 2026-03-05
**Domain:** Camera capture, OCR via Gemini API, state management
**Confidence:** HIGH

## Summary

Phase 2 requires three technical domains: (1) capturing a menu photo via an embedded camera viewfinder or gallery picker, (2) sending that image to Google Gemini's vision API for structured menu extraction, and (3) storing parsed menu data in Zustand for downstream screens. All three are well-documented, production-ready capabilities with strong Expo Go compatibility.

The user has locked detailed UI decisions (embedded viewfinder, scan line animation, count-up success, hardcoded fallback for demos). The primary technical risks are Gemini prompt reliability (getting consistent structured output from varied menu photos) and the base64 encoding performance for large images. Both are mitigable with quality compression and a cached fallback response.

**Primary recommendation:** Use expo-camera CameraView for the embedded viewfinder, expo-image-picker for gallery selection, direct fetch() to Gemini 2.5 Flash REST API with JSON structured output mode, and zustand for menu state management.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- In-app camera viewfinder (embedded preview, not launching native camera app)
- Single coral capture button centered at bottom -- no mode tabs
- Gallery icon tucked in corner as secondary option
- Subtle rounded rectangle framing guide overlay on viewfinder + hint text
- After capture: photo preview with "Use This" and "Retake" buttons
- Animated scan line sweeping across captured photo while Gemini processes
- No floating item labels during scan -- reveal all at once
- Stay on the photo with scan overlay during processing
- Animated count-up: "Found 14 dishes!" with number tick-up animation
- Auto-advance to mood screen after ~1.5s
- No intermediate menu review screen
- Include items with missing data (missing price -> "Price N/A", missing description -> blank)
- Preserve menu categories if Gemini can extract them
- Hardcoded fallback: cache known-good Gemini JSON response
- If Gemini times out or errors, silently swap in cached response
- Hidden developer toggle (triple-tap on logo or similar) to force cached mode
- Both auto-fallback AND manual toggle
- Caching pattern reusable for Phase 3 recommendations

### Claude's Discretion
- Error handling UX (retry behavior, error messages)
- Timeout duration for Gemini API calls
- Scan line animation style and timing
- Gallery picker implementation details
- Camera permissions flow
- Gemini prompt engineering for menu extraction
- Caching architecture (in-memory, AsyncStorage, etc.)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MENU-01 | User can photograph a menu using camera or gallery | expo-camera CameraView for embedded viewfinder, expo-image-picker launchImageLibraryAsync for gallery; both work in Expo Go SDK 54 |
| MENU-02 | App parses menu photo into structured items (name, price, description) via Gemini OCR | Gemini 2.5 Flash REST API with responseMimeType "application/json" and responseJsonSchema matching MenuItem type; direct fetch() call |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-camera | ~17.0.x (SDK 54) | Embedded CameraView component for in-app viewfinder | Only way to get embedded camera preview in Expo; works in Expo Go |
| expo-image-picker | ~16.0.x (SDK 54) | Gallery image selection via launchImageLibraryAsync | Standard Expo library for system image picker; included in Expo Go |
| zustand | ^5.x | Menu store for parsed dish data | Lightweight, no Provider wrapper, works perfectly in React Native |
| Gemini REST API | v1beta | Menu photo -> structured JSON extraction | Direct fetch() -- Node.js SDKs crash in React Native (known blocker from Phase 1 research) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-reanimated | ~4.1.1 (already installed) | Scan line animation, count-up animation | All animations in this phase |
| expo-file-system | ~19.0.x (SDK 54) | Read image file as base64 for Gemini API | Converting captured photo URI to base64 string |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| expo-camera CameraView | expo-image-picker launchCameraAsync | launchCameraAsync opens system camera app (not embedded) -- violates locked decision for in-app viewfinder |
| Gemini 2.5 Flash | Gemini 2.5 Pro | Pro is 4x more expensive and slower; Flash is sufficient for menu OCR |
| zustand | React Context | Context causes unnecessary re-renders; zustand is simpler for cross-screen state |

**Installation:**
```bash
npx expo install expo-camera expo-image-picker expo-file-system && npm install zustand
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  stores/
    useMenuStore.ts        # Zustand store for parsed menu items
  services/
    gemini.ts              # Gemini API client (fetch-based)
    menuParser.ts          # Prompt + response parsing logic
  constants/
    fallbackMenu.ts        # Cached known-good Gemini response for demo
  types/
    menu.ts                # MenuItem interface (already exists)
app/
  scan.tsx                 # Full scan screen (replaces placeholder)
```

### Pattern 1: Zustand Store with No Persistence
**What:** Simple in-memory store for menu items, no AsyncStorage persistence needed (hackathon demo, data is ephemeral per scan)
**When to use:** This phase and all downstream screens (mood, results, order)
**Example:**
```typescript
// src/stores/useMenuStore.ts
import { create } from 'zustand';
import { MenuItem } from '@/types/menu';

interface MenuState {
  items: MenuItem[];
  isProcessing: boolean;
  error: string | null;
  setItems: (items: MenuItem[]) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  isProcessing: false,
  error: null,
  setItems: (items) => set({ items, isProcessing: false, error: null }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error, isProcessing: false }),
  clear: () => set({ items: [], isProcessing: false, error: null }),
}));
```

### Pattern 2: Gemini REST API Direct Fetch with Structured Output
**What:** Call Gemini vision API directly via fetch() with JSON schema enforcement
**When to use:** Sending menu photo for OCR extraction
**Example:**
```typescript
// src/services/gemini.ts
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function extractMenuItems(base64Image: string, apiKey: string) {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Extract all menu items from this restaurant menu photo.
For each item, extract: name, description (if visible), price (as a number, or null if not visible), and category (e.g. Appetizers, Mains, Desserts).
Include ALL items even if some fields are missing.`,
          },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number', nullable: true },
                  category: { type: 'string' },
                },
                required: ['name'],
              },
            },
          },
          required: ['items'],
        },
      },
    }),
  });

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}
```

### Pattern 3: Demo Fallback with Silent Swap
**What:** Cache a known-good response and swap it in on API failure
**When to use:** Demo reliability -- timeout, network error, or manual toggle
**Example:**
```typescript
// src/services/menuParser.ts
import { FALLBACK_MENU } from '@/constants/fallbackMenu';

let forceFallback = false;
export const toggleForceFallback = () => { forceFallback = !forceFallback; };
export const isForceFallback = () => forceFallback;

export async function parseMenuPhoto(base64: string, apiKey: string): Promise<MenuItem[]> {
  if (forceFallback) return FALLBACK_MENU;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
    const result = await extractMenuItems(base64, apiKey, controller.signal);
    clearTimeout(timeout);
    return normalizeItems(result.items);
  } catch (error) {
    console.warn('Gemini failed, using fallback:', error);
    return FALLBACK_MENU;
  }
}
```

### Anti-Patterns to Avoid
- **Using @google/generative-ai SDK:** Node.js SDK crashes in React Native. Use direct fetch() only.
- **Storing API key in source code:** Use environment variables via expo-constants or a .env approach. For hackathon, a constants file is acceptable but add to .gitignore.
- **Full-resolution base64:** A 12MP photo base64 is ~16MB string. Always compress with quality: 0.5-0.7 to keep it reasonable.
- **Awaiting camera ready without ref:** Always use useRef for CameraView and wait for onCameraReady before enabling capture button.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Camera viewfinder | Custom native camera module | expo-camera CameraView | Handles permissions, preview, capture across platforms |
| Image gallery picker | Custom file browser | expo-image-picker launchImageLibraryAsync | System-native picker, permissions handled |
| Base64 encoding | Manual file reading | expo-file-system readAsStringAsync with base64 encoding | Handles binary file reading correctly on both platforms |
| State management | React Context + useReducer | zustand create() | No Provider nesting, simpler API, selector-based re-renders |
| JSON parsing from LLM | Manual regex extraction | Gemini responseJsonSchema | Schema enforcement guarantees parseable JSON output |

**Key insight:** Every component in this pipeline has a well-tested library solution. The only custom code should be the Gemini prompt, the scan screen UI, and the fallback/caching logic.

## Common Pitfalls

### Pitfall 1: Camera Permission Denied with No Recovery
**What goes wrong:** User denies camera permission and gets stuck on a blank screen
**Why it happens:** No fallback UI when permission.granted is false
**How to avoid:** Show a permission request screen with explanation text and a button to re-request. If permanently denied, show instructions to enable in Settings and provide the gallery picker as alternative.
**Warning signs:** Testing only the happy path where permissions are already granted

### Pitfall 2: Base64 String Too Large for Gemini
**What goes wrong:** Request fails or times out because the base64 payload is enormous
**Why it happens:** takePictureAsync at full resolution produces 8-16MB base64 strings
**How to avoid:** Use `quality: 0.5` in takePictureAsync options. For gallery picks, use `quality: 0.6` in launchImageLibraryAsync. This reduces payload to ~1-3MB while keeping text readable.
**Warning signs:** Gemini requests taking >20 seconds or returning 413 errors

### Pitfall 3: Gemini Returns Unexpected JSON Structure
**What goes wrong:** JSON.parse succeeds but the data shape doesn't match MenuItem
**Why it happens:** Despite responseJsonSchema, edge cases in menu photos can produce odd output
**How to avoid:** Always normalize the response -- map each item, provide defaults for missing fields, generate unique IDs, handle null prices gracefully
**Warning signs:** App crashes on results screen with "undefined is not an object"

### Pitfall 4: Only One CameraView at a Time
**What goes wrong:** Black screen or crash when navigating back to scan screen
**Why it happens:** expo-camera enforces single active preview
**How to avoid:** The expo-router Stack navigation unmounts previous screens by default, so this should be fine. But if using keep-alive or custom navigation, ensure camera cleanup.
**Warning signs:** Black camera preview after navigating away and back

### Pitfall 5: Forgetting AbortController for Timeout
**What goes wrong:** fetch() hangs indefinitely on bad network
**Why it happens:** fetch() has no built-in timeout
**How to avoid:** Use AbortController with setTimeout (15 seconds recommended). On abort, fall back to cached response.
**Warning signs:** "Processing" state never resolves during demo on conference WiFi

## Code Examples

### Camera Permission Flow
```typescript
// Source: expo-camera docs
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return null; // Loading

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need camera access to scan menus
        </Text>
        <Pressable onPress={requestPermission} style={styles.permissionBtn}>
          <Text>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  return <CameraView style={styles.camera} facing="back" ref={cameraRef} />;
}
```

### Taking a Photo with Base64
```typescript
// Source: expo-camera docs
const cameraRef = useRef<CameraView>(null);

async function capturePhoto() {
  if (!cameraRef.current) return;
  const photo = await cameraRef.current.takePictureAsync({
    quality: 0.5,
    base64: true, // Returns base64 string directly
  });
  // photo.base64 contains the base64 string
  // photo.uri contains the local file URI for preview
  return photo;
}
```

### Gallery Picker
```typescript
// Source: expo-image-picker docs
import * as ImagePicker from 'expo-image-picker';

async function pickFromGallery() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.6,
    base64: true,
  });

  if (!result.canceled) {
    return {
      uri: result.assets[0].uri,
      base64: result.assets[0].base64,
    };
  }
  return null;
}
```

### Scan Line Animation with Reanimated
```typescript
// Source: react-native-reanimated docs pattern
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function ScanLineOverlay() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(300, { duration: 2000, easing: Easing.linear }),
      -1, // infinite
      true  // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scanLine, animatedStyle]}>
      <LinearGradient
        colors={['transparent', '#E8744A', 'transparent']}
        style={styles.scanLineGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </Animated.View>
  );
}
```

### Count-Up Animation
```typescript
// Source: reanimated withTiming pattern
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { TextInput } from 'react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function CountUp({ target }: { target: number }) {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(target, { duration: 1000 });
  }, [target]);

  const animatedProps = useAnimatedProps(() => ({
    text: `Found ${Math.round(count.value)} dishes!`,
    defaultValue: '',
  }));

  return (
    <AnimatedTextInput
      editable={false}
      animatedProps={animatedProps}
      style={styles.countText}
    />
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| expo-camera Camera component | expo-camera CameraView component | SDK 51+ (2024) | Camera -> CameraView rename; old Camera is deprecated |
| @google/generative-ai SDK | Direct fetch() to REST API | N/A for React Native | SDK uses Node.js APIs not available in React Native runtime |
| Gemini 1.5 Flash | Gemini 2.5 Flash | 2025 | Better OCR accuracy, structured output support, lower cost |
| Manual JSON parsing from LLM | responseMimeType + responseJsonSchema | 2025 | Guaranteed valid JSON output, no regex needed |

**Deprecated/outdated:**
- `Camera` component from expo-camera: Renamed to `CameraView` in SDK 51+
- Gemini 2.0 models: Being retired June 2026, use 2.5 Flash
- `responseSchema` key name: Now `responseJsonSchema` in v1beta API

## Open Questions

1. **Gemini API key management for hackathon**
   - What we know: Need an API key, can't hardcode in source for public repos
   - What's unclear: Whether to use expo-constants extra field, .env file, or inline constant
   - Recommendation: Use a constants file (src/constants/apiKeys.ts) added to .gitignore. Fast, simple, hackathon-appropriate.

2. **Optimal image quality/compression for menu OCR**
   - What we know: quality 0.5 reduces file size ~4x while keeping text readable
   - What's unclear: Whether very small text on large menus needs higher quality
   - Recommendation: Start with 0.5, test with real demo menu, increase to 0.7 only if OCR accuracy suffers

3. **Exact Gemini model string for SDK**
   - What we know: "gemini-2.5-flash" is current stable, "gemini-2.5-flash-lite" is cheaper
   - What's unclear: Whether latest endpoint slug has changed recently
   - Recommendation: Use "gemini-2.5-flash" -- best balance of speed, cost, and OCR quality for this use case

## Sources

### Primary (HIGH confidence)
- [Expo Camera docs](https://docs.expo.dev/versions/latest/sdk/camera/) - CameraView API, permissions, takePictureAsync
- [Expo ImagePicker docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/) - launchImageLibraryAsync, base64 option
- [Gemini Image Understanding docs](https://ai.google.dev/gemini-api/docs/image-understanding) - REST API format, inline_data, base64 encoding
- [Gemini Structured Output docs](https://ai.google.dev/gemini-api/docs/structured-output) - responseMimeType, responseJsonSchema

### Secondary (MEDIUM confidence)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models) - Current model names and pricing (gemini-2.5-flash confirmed available)
- [Zustand GitHub](https://github.com/pmndrs/zustand) - React Native compatibility confirmed in multiple community guides

### Tertiary (LOW confidence)
- responseJsonSchema vs responseSchema key name -- multiple sources use different names; verify against latest v1beta docs during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are well-documented Expo SDK packages or widely-used community libraries
- Architecture: HIGH - Patterns are standard React Native + REST API integration
- Pitfalls: HIGH - Based on documented issues in expo repos and known React Native/fetch limitations
- Gemini prompt engineering: MEDIUM - Menu OCR is well-supported but prompt tuning needed for specific menu formats

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable libraries, 30-day validity)
