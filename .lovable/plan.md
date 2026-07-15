# The Family Chapter

This is a large phase. Nothing existing is deleted — the House, its rooms, models, animations, and code all stay. We add a new primary destination ("The Family") and gate the house entrance behind a handwritten note.

I'll build it in ordered passes so each step is verifiable in the preview.

---

## Pass 1 — Proposal polish (quick wins first)

1. **Red carpet on the proposal stage.** Recolor the stage/aisle plane in `StageArea` / `ProposalScene` from ivory to a deep velvet crimson (`oklch(0.35 0.15 25)`) with a subtle gold trim. Marble floor of the walkway stays.
2. **Lanterns + particles beside the stage.** Reuse the opening-scene `WalkwayLanterns` + `ProposalDust` at the stage — mirrored clusters flanking the scroll, warm amber, gently bobbing. Sparkles already active; increase count near the stage.
3. **Smooth zoom-in instead of camera walk.** Replace the `CameraRig` walk (z: 8 → -1.5) with a cinematic dolly-zoom: camera eases from z:8 → z:2 with easing curve, fov breathing 50 → 42, no wobble/shake. Candles still ignite along the path in sync with the zoom progress. No functional phases change — `walkProgress` still drives candles/brightness.

## Pass 2 — Login gate after the letter

Currently after "Yes" the sequence flows: `yes-path` → `welcome-text` → `enter-house` → `/world`.

Change to: after `yes-path`, redirect to `/auth` (Lovable Cloud auth is already scaffolded). On successful sign-in, land on a new route `/chapter` that presents two choices in the same cinematic language as the parchment:

- **"The house is reserved."** → enters the gated house corridor (see Pass 3). Same cinematic entrance, but the door stays closed with Noah's note.
- **"Family begins here."** → enters The Family chapter (Pass 4).

Both options remain available; this is a chapter selector, not a one-shot fork.

## Pass 3 — The House becomes a symbol of the future

- Keep `/world` and all rooms/models intact — no deletions.
- New route `/home-doors` (or reuse a lead-in to `/world`): renders the existing exterior pathway, warm windows, lantern glow, the cat occasionally crossing, birds overhead. The large doors remain closed. No lock, no banner.
- Beside the doors, a small handwritten parchment note (reuse `ParchmentOverlay` styling, smaller, pinned): Noah's exact text ("Our Home / This door isn't closed / It's waiting…").
- Clicking the doors: soft ambient dimming, doors don't open, note gently glows. No error.
- The `/world` interior route is preserved for later; simply not linked from the chapter selector.

## Pass 4 — The Family chapter (`/family`)

A cinematic scroll-through with soft section transitions (framer-motion, no cards). Sections:

1. **Our Dreams** — full-bleed handwritten lines fading in over a soft dawn scene. Phrases prefixed with "If God wills…", "Maybe one day…", "I hope…". No lists — poetic paragraphs.
2. **Our Little Family** — the cat wanders freely (reuse `RealCat` with expanded idle behaviors: sleep, stretch, chase butterflies, follow cursor). Click the cat → purr + head-tilt.
3. **The Bucket List** — scrapbook pages, hand-torn paper texture, ink handwriting. Each dream is a page turn (framer-motion). Completed dreams bloom into a pressed-flower illustration instead of a checkmark. Add-dream input styled as an inkwell prompt.
4. **The Memory Booth** — cozy wooden booth SVG/CSS, curtain draw animation, 3-2-1 flash (uses webcam via `getUserMedia`), photo strip develops with a slow filter transition. Strips saved to Lovable Cloud (`family_photos` table with RLS: owner-only) and rendered as a growing album wall.
5. **The Surprise Chapter** — hidden. Discovered by hovering a specific object (a small suitcase in the corner of Our Little Family). Reveals environmental clues over multiple visits (boarding pass with blurred details, passport, circled calendar, tiny plane) — none reveal the full story.
6. **The Observatory** — reuse existing `ObservatoryScene`. Add: dwell timer (30–45s of no interaction) → desk lamp glow + folded note appears → opens to three choices: Hug Me / Sit With Me / Kiss. Each is a short cinematic vignette (framer-motion camera easing + ambient audio cue), then the room returns exactly as it was.

## Pass 5 — Backend + housekeeping

- Add `family_dreams` and `family_photos` tables to Lovable Cloud with RLS (owner-only read/write via `auth.uid()`), plus `GRANT` blocks.
- Register the new routes; no changes to `routeTree.gen.ts` by hand (Vite plugin regenerates).
- Preserve all existing SEO/head metadata; add head() for `/chapter`, `/family`, and `/home-doors`.
- Fix any outstanding security scan findings (RLS, grants).

---

## Technical notes

- **No new heavy 3D assets required** — reuse existing GLTFs (cat, houseplants, lantern, telescope, vinyl player, outdoor couch, books). Booth, bucket list, dreams are 2D/CSS/framer-motion for warmth + performance.
- **Fonts / colors** stay in `src/styles.css` design tokens; add `--color-carpet-red`, `--color-ink`, `--color-parchment-warm`.
- **Camera zoom** replaces walk math in `useProposalSequence` — `walkProgress` continues to drive candle count and brightness so no downstream code changes.
- **Auth**: the existing `/auth` route + `_authenticated` gate is reused. `/chapter`, `/family`, `/home-doors` live under `_authenticated/`.
- **Cat behavior**: extend `RealCat` state machine with `sleep | stretch | wander | chase | follow` states, weighted random transitions.
- **Memory Booth webcam**: gracefully degrades if permission denied — user can upload a photo instead.

---

## Scope check before I start

This is roughly a full day of building. I'll ship it in the 5 passes above and let you see each pass live before moving to the next. If you'd rather I collapse passes (e.g. skip the login gate and jump straight to `/family`), tell me now — otherwise I'll begin with Pass 1 (proposal polish) immediately.
