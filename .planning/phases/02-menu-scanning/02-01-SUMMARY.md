---
phase: 02-menu-scanning
plan: 01
subsystem: api
tags: [zustand, gemini, ocr, menu-parsing, fallback]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: TypeScript config, theme tokens, MenuItem type, Expo Router setup
provides:
  - Zustand menu store (useMenuStore) with items/processing/error state
  - Gemini 2.5 Flash REST API client for menu extraction
  - Menu parser with 15s timeout and silent fallback
  - Force-fallback toggle for dev/demo mode
  - 14-item realistic fallback menu across 4 categories
affects: [02-02, 03-recommendations]

# Tech tracking
tech-stack:
  added: [zustand, expo-camera, expo-image-picker, expo-file-system]
  patterns: [direct-fetch-api, silent-fallback, zustand-store]

key-files:
  created:
    - src/stores/useMenuStore.ts
    - src/services/gemini.ts
    - src/services/menuParser.ts
    - src/constants/fallbackMenu.ts
    - src/constants/apiKeys.ts
  modified:
    - .gitignore
    - package.json

key-decisions:
  - "Used --legacy-peer-deps for zustand install due to React 19 peer dep conflict"
  - "14-item Italian-American fallback menu with calories and dietary tags for demo realism"

patterns-established:
  - "Direct fetch() to Gemini REST API with structured JSON response schema"
  - "Silent fallback pattern: try API -> catch -> return cached data"
  - "Force-fallback module toggle for dev/demo switching"
  - "Zustand store pattern: state + setters + clear action"

requirements-completed: [MENU-02]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 02 Plan 01: Menu Scanning Service Layer Summary

**Zustand menu store, Gemini 2.5 Flash REST client with structured JSON schema, and silent-fallback menu parser with 15s timeout**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-04T18:32:20Z
- **Completed:** 2026-03-04T18:34:36Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Zustand store with items/isProcessing/error state and clear action
- Gemini 2.5 Flash direct fetch() client with responseJsonSchema for structured menu extraction
- Menu parser orchestrator with 15s AbortController timeout and silent fallback
- 14-item Italian-American fallback menu with calories, dietary tags across 4 categories
- API key file created and gitignored for security

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create API key config** - `4b94296` (chore)
2. **Task 2: Create Zustand menu store, Gemini service, fallback cache, and menu parser** - `d6f5e5c` (feat)

## Files Created/Modified
- `src/stores/useMenuStore.ts` - Zustand store for menu items, processing state, error state
- `src/services/gemini.ts` - Gemini 2.5 Flash REST API client with structured JSON output
- `src/services/menuParser.ts` - Orchestrator with timeout, fallback, normalization
- `src/constants/fallbackMenu.ts` - 14-item realistic demo fallback menu
- `src/constants/apiKeys.ts` - Gemini API key placeholder (gitignored)
- `.gitignore` - Added apiKeys.ts exclusion
- `package.json` - Added zustand, expo-camera, expo-image-picker, expo-file-system

## Decisions Made
- Used `--legacy-peer-deps` for zustand install due to React 19 peer dependency conflict with NativeWind
- Chose 14-item Italian-American menu for fallback realism across Appetizers, Mains, Desserts, Drinks

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] zustand peer dependency conflict**
- **Found during:** Task 1 (Install dependencies)
- **Issue:** `npm install zustand` failed due to React 19 peer dep conflict with NativeWind dependencies
- **Fix:** Used `--legacy-peer-deps` flag
- **Files modified:** package.json, package-lock.json
- **Verification:** zustand installed successfully, tsc compiles cleanly
- **Committed in:** 4b94296 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor install flag needed. No scope creep.

## Issues Encountered
None beyond the zustand peer dep conflict documented above.

## User Setup Required

Users must add their Gemini API key to `src/constants/apiKeys.ts`:
1. Visit [aistudio.google.com](https://aistudio.google.com) -> Get API Key -> Create API key
2. Replace `YOUR_API_KEY_HERE` in `src/constants/apiKeys.ts` with the key

## Next Phase Readiness
- Service layer complete, ready for scan screen UI (Plan 02-02)
- useMenuStore, parseMenuPhoto, and FALLBACK_MENU available for import
- Force-fallback toggle ready for demo day safety switch

---
*Phase: 02-menu-scanning*
*Completed: 2026-03-05*
