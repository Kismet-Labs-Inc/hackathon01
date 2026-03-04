# Cravr - Project Instructions

## Design System

**DESIGN.md is the source of truth for all UI work.** Every plan or task that touches UI must reference `@DESIGN.md` in its context block. Executors must read it before writing any screen or component code.

Key design rules (see DESIGN.md for full details):
- Dark theme: `#0A0A0A` background, `#1A1A1A` cards, `#E8744A` coral accent
- Font: Plus Jakarta Sans exclusively, weights per element type in DESIGN.md
- Full-bleed immersive screens — no status bars, no tab bars, no header chrome
- Pill-shaped buttons with `border-radius: 9999px`
- Generous spacing: ~20-24px screen padding, ~24-32px section gaps
- Use tokens from `src/theme/tokens.ts` — never hardcode colors/spacing

## Tech Stack

- React Native + Expo SDK 54 (Expo Go compatible)
- TypeScript strict
- Zustand for state (no persistence needed)
- Expo Router for navigation
- react-native-reanimated for animations
- Direct `fetch()` for API calls — no Node.js SDKs (they crash in React Native)
- Gemini 2.5 Flash for OCR/AI features

## Conventions

- All screens live in `app/` (Expo Router file-based routing)
- Shared components in `src/components/`
- Services in `src/services/`, stores in `src/stores/`
- Types in `src/types/`
- Theme tokens in `src/theme/tokens.ts`
- Every AI-powered feature must have a hardcoded fallback for demo safety

## Hackathon Context

This is a hackathon project (deadline: March 5, 2026). Favor speed and demo-readiness over production patterns. No auth, no persistence, no error reporting infra. Fallback data is a first-class feature, not a compromise.
