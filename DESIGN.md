# Design System: Cravr
**Project ID:** 13628720197590285921

## 1. Visual Theme & Atmosphere

Dark, immersive, and appetite-forward. The UI feels like a dimly-lit restaurant menu brought to life on a phone -- warm coral accents glow against a near-black canvas, creating an intimate, food-focused atmosphere. The aesthetic is modern and premium without being cold: rounded shapes, generous whitespace, and playful emoji give warmth to the dark palette.

The overall density is relaxed -- screens breathe with large headings, spacious card layouts, and minimal chrome. No status bars, no tab bars, no headers -- every screen is a full-bleed immersive experience. The design philosophy is "show value first" with zero friction.

**Mood keywords:** Warm, immersive, appetizing, playful-premium, dark-luxe

## 2. Color Palette & Roles

### Primary Colors

| Token | Value | Role |
|-------|-------|------|
| **Midnight Canvas** | `#0A0A0A` | App background -- the dominant surface across all screens |
| **Ember Coral** | `#E8744A` | Primary accent -- CTA buttons, active states, highlights, slider tracks, selected filter borders |
| **Charcoal Card** | `#1A1A1A` | Card and container backgrounds -- mood cards, recommendation cards, review cards |
| **Warm Umber** | `#211511` | Warm-tinted dark background variant -- used on recommendation feed and mood screens for subtle warmth |
| **Toasted Card** | `#2A1C18` | Warm card variant -- appears on screens with the warm background tint |

### Semantic Colors

| Token | Value | Role |
|-------|-------|------|
| **Mint Success** | `#0DF2A6` | Success states, match % badges, "REVIEWED" badges, Taste DNA header, "Active" indicators |
| **Teal Accent** | `#2DD4BF` | Secondary accent -- calorie slider track, secondary highlights |
| **Pure White** | `#FFFFFF` | Primary text on dark backgrounds -- headings, prices, names |
| **Muted Coral** | `#E8744A` at ~60% opacity | Tagline text ("Scan. Vibe. Devour."), secondary warm text |
| **Ash Gray** | `~#9CA3AF` | Secondary body text -- descriptions, calorie counts, supporting copy |
| **Whisper Gray** | `~#6B7280` | Tertiary text -- timestamps, subtle labels |

### Taste DNA Palette (Data Visualization)

| Flavor | Color | Description |
|--------|-------|-------------|
| Savory | Warm salmon-pink | `~#F87171` |
| Bold | Amber orange | `~#FB923C` |
| Rich | Vivid magenta-pink | `~#E879F9` |
| Spicy | Electric cyan | `~#22D3EE` |

### State Colors

| State | Color | Usage |
|-------|-------|-------|
| Active/Selected | `#E8744A` (Ember Coral) | Selected filters, active mood card border, CTA hover |
| Saved/Confirmed | `#0DF2A6` (Mint Success) | "Saved" checkmark, "REVIEWED" badge |
| Inactive/Default | `#1A1A1A` (Charcoal Card) | Unselected cards, default button state |
| Disabled/Muted | `~#374151` | Inactive button backgrounds, disabled sliders |

## 3. Typography Rules

**Font Family:** Plus Jakarta Sans -- used exclusively across all screens. No secondary font.

| Element | Weight | Size (approx) | Style |
|---------|--------|---------------|-------|
| App title ("Cravr") | Extra Bold (800) | 40-48px | White, centered |
| Screen headings ("What's the vibe?", "Your picks") | Bold (700) | 28-32px | White, left-aligned |
| Card titles (dish names) | Bold (700) | 18-20px | White |
| Mood card titles | Semi-Bold (600) | 16-18px | White |
| Body text / descriptions | Regular (400) | 14-16px | Ash Gray |
| Mood card descriptors | Regular (400) | 12-14px | Ash Gray |
| Tagline ("Scan. Vibe. Devour.") | Medium (500) | 16-18px | Muted Coral |
| Supporting text ("No signup needed") | Regular (400) | 14px | Ash Gray |
| Price text | Bold (700) | 20-24px | White |
| Calorie text | Regular (400) | 14px | Ash Gray |
| Badge text ("96% MATCH") | Semi-Bold (600) | 12px | White on Mint Success |
| Tag text ("vegetarian", "gluten-free") | Medium (500) | 12px | White on dark pill |
| Section labels ("ESTIMATED TOTAL") | Medium (500) | 11-12px | Ash Gray, uppercase, letter-spaced |

**Letter spacing:** Default for most text. Uppercase labels use moderate letter-spacing (~0.05-0.1em) for readability.

## 4. Component Stylings

### Buttons

* **Primary CTA ("Scan a Menu", "Share picks"):** Pill-shaped (fully rounded, `border-radius: 9999px`), Ember Coral (`#E8744A`) background, white text, bold weight. Full-width with generous vertical padding (~16px). Often includes a leading icon (camera, share).
* **Secondary CTA ("Share via QR Code"):** Pill-shaped, transparent background with Ember Coral border (1px stroke), coral text. Same dimensions as primary.
* **Action Button ("I'll get this"):** Pill-shaped, Ember Coral background, white text, medium size. Appears inline on recommendation cards.
* **Saved State ("Saved"):** Same pill shape, muted dark background with checkmark icon, white text. Replaces "I'll get this" when toggled.
* **Tertiary ("Submit review" inactive):** Pill-shaped, dark muted background (`~#374151`), gray text. Becomes Ember Coral when active.
* **Surprise Me:** Full-width, transparent/dark background, centered text with dice emoji, positioned below mood grid.

### Cards & Containers

* **Mood Cards:** Charcoal Card (`#1A1A1A`) background, generously rounded corners (`~1rem`), 2-column grid layout. Each contains: emoji (large, top), bold title, descriptive subtitle in gray. No border by default; selected state adds Ember Coral border.
* **Recommendation Cards:** Full-width, Charcoal Card background, rounded corners (`~1rem`). Contains: match % badge (Mint Success pill), dish name (bold), description, popularity bar, price + calories row, dietary tag pills, action button row.
* **Filter Panel:** Charcoal Card background with slightly more rounded corners (`~1.5rem`), overlays the recommendation feed. Contains labeled sliders and pill toggles.
* **Order Item Row:** Charcoal Card background, rounded, horizontal layout with emoji + dish name + calories on left, price on right.
* **Review Card:** Charcoal Card background, rounded, contains: dish info, photo upload area (dashed border), emoji rating row, text input, submit button.
* **Taste DNA Card:** Slightly elevated appearance, Charcoal Card background, contains DNA emoji, Mint Success heading, description text, colored bars.

### Tags & Badges

* **Match % Badge:** Small pill, Mint Success background, white bold text (e.g., "96% MATCH").
* **Dietary Tags:** Small pills, dark background (`~#374151`), white text (e.g., "vegetarian", "gluten-free").
* **Mood Pill (in header):** Ember Coral background, white text with sparkle emoji (e.g., "Impress a Date").
* **"REVIEWED" Badge:** Small pill, Mint Success background, white text with checkmark.
* **"ACTIVE" Badge:** Small pill, transparent with Mint Success text and green dot.

### Sliders

* **Budget Slider:** Ember Coral track (filled portion), gray track (unfilled), circular Ember Coral thumb.
* **Calories Slider:** Teal Accent track (filled portion), gray track (unfilled), circular Teal thumb.

### Inputs

* **Text Input:** Dark background, subtle border (1px, `~#374151`), rounded corners, placeholder text in Whisper Gray.
* **Photo Upload Area:** Dashed border (`~#374151`), dark background, camera icon centered, rounded corners.

### Navigation

* **Back Button:** "← Back" text, white, positioned top-left as floating overlay. Arrow is a simple left-pointing character.
* **Filters Button:** "Filters" text with leading filter icon, positioned top-right, Teal Accent color.

### Emoji Rating Row

* Four emoji buttons in a horizontal row: Amazing (star-eyes), Tasty (yum), Meh (neutral), Nope (angry). Selected state has a visible highlight ring. Emoji are large (~32px).

## 5. Layout Principles

### Spacing Strategy

* **Screen padding:** Generous horizontal padding (~20-24px on each side)
* **Section spacing:** Large gaps between major content blocks (~24-32px)
* **Card internal padding:** Comfortable (~16-20px)
* **Card gap (in grid):** ~12-16px between mood cards
* **Card gap (in list):** ~16px between recommendation/review cards
* **Element spacing within cards:** ~8-12px between lines of text

### Grid System

* **Mood cards:** 2-column equal-width grid with ~12px gap
* **Recommendation cards:** Single column, full-width stack
* **Order items:** Single column, full-width stack
* **Taste DNA bars:** 4-column equal-width, centered

### Screen Structure

All screens follow a consistent vertical stack pattern:

1. **Navigation row** (back button left, context/title center, action right) -- floats over content
2. **Screen heading** (large, bold, left-aligned, often with emoji)
3. **Supporting text** (gray description below heading)
4. **Primary content area** (cards, lists, grids -- scrollable)
5. **Bottom action area** (sticky CTA buttons or status bar)

### Key Layout Rules

* **No bottom tab bar** -- explicitly removed from the design
* **No header/nav bar** -- full-screen immersive layouts
* **Full-bleed backgrounds** -- Midnight Canvas extends edge to edge
* **Content is top-heavy** -- headings and key info appear first, actions at bottom
* **Welcome screen** is vertically centered with a warm radial gradient glow behind the fire emoji, fading from warm orange into Midnight Canvas

### Responsive Considerations

* Designed for mobile-first (390px width as reference)
* All layouts are single-column or 2-column grid
* Cards stretch to fill available width
* Min body height: `max(884px, 100dvh)` -- ensures content fills the viewport

---

*Extracted from Stitch Project 13628720197590285921 on 2026-03-05*
*10 screens analyzed: Welcome, Scan, Mood, Results, Results (Filtered), Save Items, Order, Order (Share), Rate, Review Summary*
