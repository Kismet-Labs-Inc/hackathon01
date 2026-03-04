# Phase 1: Foundation - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Expo project scaffold with Cravr's design system, typed interfaces, navigation routes for all screens (most placeholder), and a polished Welcome screen running on a real phone via Expo Go.

</domain>

<decisions>
## Implementation Decisions

### Welcome screen feel
- Subtle fade-in animation: logo + tagline fade in over ~0.5s, button slides up from bottom
- Match the warm radial glow behind the fire emoji from Stitch mockup (radial gradient, warm orange fading into #0A0A0A)
- "No signup needed — just point & shoot" text below CTA, matching mockup exactly
- Tapping "Scan a Menu" navigates to the Scan screen

### Placeholder screens
- Each stub screen has back navigation and a "Next" button to advance to the next screen
- Full flow walkthrough wired: Welcome → Scan → Mood → Results → Order
- Validates the entire navigation stack end-to-end even with placeholder content

### Navigation
- Pure stack navigation with jump-to-start capability for demo restarts
- No header bar — immersive full-screen layouts matching Stitch designs
- Floating back button overlay on inner screens
- Demo restart skips Welcome, goes straight to Scan screen (faster for re-runs)

### Claude's Discretion
- Placeholder screen appearance (whatever's fastest while being clear which screen it is)
- Button press effect on "Scan a Menu" CTA
- Screen transition style (slide, fade, etc.)
- TypeScript interface field definitions for MenuItem, Recommendation, Mood
- Folder structure and project organization
- State management setup decisions

</decisions>

<specifics>
## Specific Ideas

- Welcome screen should match the Stitch mockup closely — fire emoji, "Cravr" in bold white, "Scan. Vibe. Devour." tagline in muted coral, large coral CTA button
- No bottom tab bar anywhere — Stitch added one on some screens but it was flagged for removal
- Design identity is locked: #0A0A0A background, #E8734A coral accent, Plus Jakarta Sans font, #1A1A1A cards, fully rounded corners

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no code exists yet

### Established Patterns
- None — patterns will be established in this phase

### Integration Points
- UX mockups in /ux/ folder (10 Stitch PNG screens) serve as the visual reference
- Stitch project ID: 13628720197590285921 for design system extraction

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-05*
