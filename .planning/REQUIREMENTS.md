# Requirements: Cravr

**Defined:** 2026-03-04
**Core Value:** Users can scan any restaurant menu and instantly get mood-matched food recommendations they're excited to order.

## v1 Requirements

Requirements for hackathon prototype. Each maps to roadmap phases.

### Menu Input

- [ ] **MENU-01**: User can photograph a menu using camera or gallery
- [ ] **MENU-02**: App parses menu photo into structured items (name, price, description) via Gemini OCR

### Mood & Recommendations

- [ ] **MOOD-01**: User can select a mood from 6 options (Comfort Food, Something Light, Adventurous, Impress a Date, Hungover, Sweet Tooth)
- [ ] **MOOD-02**: User can tap "Surprise Me" for a random mood pick
- [ ] **RECO-01**: User sees AI-generated dish recommendations ranked by match %
- [ ] **RECO-02**: Each recommendation includes a witty reasoning text explaining why it matches the mood
- [ ] **RECO-03**: Surprise Me shows a single card with a dramatic reveal animation

### Selection & Order

- [ ] **ORDR-01**: User can save items ("I'll get this") and see saved state on cards
- [ ] **ORDR-02**: User can view order summary with total cost and total calories

### Filters

- [ ] **FILT-01**: User can filter recommendations by dietary/allergy restrictions
- [ ] **FILT-02**: User can filter recommendations by max calorie count
- [ ] **FILT-03**: User can filter recommendations by max budget/price

### Post-Meal

- [ ] **POST-01**: User can rate each ordered item with emoji reactions (Amazing/Tasty/Meh/Nope)
- [ ] **POST-02**: User sees Taste DNA flavor bars updated after rating (faked data)

### Foundation

- [ ] **FOUN-01**: App uses dark theme matching Stitch mockups (#0A0A0A bg, #E8734A accent, Plus Jakarta Sans)
- [ ] **FOUN-02**: App runs on a real phone via Expo

## v2 Requirements

### Visual Polish

- **POLH-01**: Card entrance animations on recommendation results
- **POLH-02**: Match % count-up animation on card load

### Advanced Input

- **ADVN-01**: Live camera OCR with real-time menu parsing

### Social

- **SOCL-01**: QR code sharing of picks with table
- **SOCL-02**: Group mode with live session (who picked what)

### Accounts

- **ACCT-01**: User accounts with persistent Taste DNA across sessions

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Zero onboarding by design -- show value first |
| Backend / database persistence | In-memory for hackathon demo, no server needed |
| Payment integration | Not core value prop -- order summary shows totals |
| Multi-language menu translation | English menus only for demo |
| Nutritional database integration | LLM estimates calories from descriptions |
| Restaurant discovery / location | User is already at the restaurant |
| Social features / reviews | Personal experience, not social network |
| Onboarding flavor quiz | Taste DNA builds passively from selections |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Pending |
| FOUN-02 | Phase 1 | Pending |
| MENU-01 | Phase 2 | Pending |
| MENU-02 | Phase 2 | Pending |
| MOOD-01 | Phase 3 | Pending |
| MOOD-02 | Phase 3 | Pending |
| RECO-01 | Phase 3 | Pending |
| RECO-02 | Phase 3 | Pending |
| RECO-03 | Phase 3 | Pending |
| ORDR-01 | Phase 3 | Pending |
| ORDR-02 | Phase 3 | Pending |
| FILT-01 | Phase 4 | Pending |
| FILT-02 | Phase 4 | Pending |
| FILT-03 | Phase 4 | Pending |
| POST-01 | Phase 4 | Pending |
| POST-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-05 after roadmap creation*
