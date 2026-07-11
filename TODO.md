# TODO - Web redesign + real 3D upgrade

## Phase 1 — Foundation (must compile)
- [ ] Add Three.js + React Three Fiber + Drei dependencies.
- [ ] Create `src/components/world/SceneCanvas.tsx` to set up Canvas, camera, tone mapping, shadows, and HDR environment support.
- [ ] Create `src/components/world/LightingController.tsx` to switch HDR/exposure based on `phase` and weather.
- [ ] Create `src/components/world/RainSystem.tsx` (real 3D rain particles).

## Phase 2 — Cat replacement
- [ ] Replace `src/components/world/Cat.tsx` with GLTF-based cat (`RealCat.tsx`), keeping:
  - [ ] Supabase `cat_state` updates on pet.
  - [ ] Double-click (or name edit trigger) to rename.
  - [ ] Cat behavior states (idle/loafing/sleeping/loved).
- [ ] Default cat name logic: allow rename after door opens; do not force final name in UI.

## Phase 3 — Bedroom scene upgrade
- [ ] Replace `src/components/scenes/BedroomScene.tsx` visuals with a GLTF bedroom.
- [ ] Add real HDR lighting + wet/rain ambience for night/rain phases.
- [ ] Keep interactive hotspots for memory/letter as before.

## Phase 4 — House / hall upgrade
- [ ] Replace `src/components/scenes/HouseScene.tsx` with GLTF hall/living room.
- [ ] Implement interactive bookshelf + window (raycast or hit proxies).
- [ ] Ensure rain is real and visible when weather is rain.

## Phase 5 — Door colors + theme minor accents
- [ ] Update `src/routes/index.tsx` door color palette to brown.
- [ ] Ensure UI still uses theme dark green / dark red for minor accents only.

## Phase 6 — Integration + validation
- [ ] Wire weather/rain so it renders inside SceneCanvas (not only CSS overlay).
- [ ] Run `bun run lint` and `bun run build`.
- [ ] Smoke test `/world` route: scene switching, cat pet/rename, rain.

