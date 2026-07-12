# Redesign: Every Room Gets Its Own Soul

Right now every scene is basically "click a hotspot → post a note." That's why it feels flat. Below is a per-scene feature redesign so each place *does* something only it can do, plus a curated list of free GLTF/HDR downloads you can drop in.

---

## Per-scene feature redesign

### 🏠 Living Room (House)
- **Shared Fireplace** — click to light. Both accounts see the same flame state in realtime (Supabase channel). Warmth level decays over hours; either person can "add a log."
- **Vinyl Player** — pick a track from a shared playlist; the other person sees the needle drop live and hears the same song if the tab is open.
- **Wall Clock** — shows *both* your local times side by side (Noah's / Khadija's timezone).

### 🍳 Kitchen
- **Recipe Jar** — write a recipe together, one ingredient at a time (turn-based: you add, she adds).
- **Tea Ritual** — click the kettle → steam animation → sends a "tea is ready 🍵" push/notification to the other person.
- **Fridge Notes** — sticky notes visible only in the kitchen, magnet-drag positioning saved to DB.

### 🍽️ Dining Room
- **Set the Table for Two** — schedule a "virtual dinner" at a time; both plates glow when the other arrives. Candle-lit countdown.
- **Gratitude Plate** — one small thing you're grateful for today, one per person per day, appears on the table.

### 🛏️ Bedroom
- **Dream Journal** — write on waking; entries fold into origami on the nightstand.
- **Goodnight Lamp** — click to turn off your lamp. The other person's lamp dims in realtime. When both are off = "we're both asleep."
- **Pillow Letters** — long-form private letters, only readable at night phase.

### 🌸 Memory Garden
- **Plant a Memory** — each memory grows a unique flower (species chosen by mood tag). Flowers age with the memory's date.
- **Water each other's flowers** — keeps them blooming; unwatered ones wilt (but never die).
- **Seasonal bloom cycle** driven by real season.

### 🌙 Stargazing Balcony
- **Wish on a Star** — click a star, write a wish. Star brightens permanently in the shared sky.
- **Constellation Builder** — connect stars with lines to draw shapes together (collaborative canvas over the night sky).

### 🔭 Observatory
- **Real Sky** — pull live moon phase + today's visible planets (open API) and render them accurately.
- **Anniversary Sky** — rewind the sky to how it looked on a chosen date (birthday, first meeting).

### 🌊 Moon Lake
- **Paper Boats** — write a message, fold it into a boat, launch it. Physically drifts across the lake in realtime for the other to catch on their side.
- **Skipping Stones** — throw a stone → ripples carry a one-word feeling (miss you / thinking of you / safe).

### 🌲 Whispering Forest
- **Firefly Whispers** — record a 5-sec voice note; it becomes a firefly. Other person walks near it → it plays.
- **Carved Trees** — carve initials/dates into bark; persistent, weathering with time.

### 🌧️ Rain Meadow
- **Shared Umbrella** — when both online, one umbrella appears; standing under it together triggers a subtle heart pulse.
- **Rain-writing** — words traced in the wet grass fade after 10 min (ephemeral thoughts).

### 🐈 The Cat (Noor)
- Roams between rooms based on time + weather.
- **Feed / pet / call** actions. Purr level = shared mood indicator.
- Occasionally brings a "gift" (a random old memory resurfaced).

---

## GLTF & HDR asset downloads (all free, commercial-OK)

### 3D models — Poly Pizza (CC-BY / CC0)
- Cozy bedroom: https://poly.pizza/m/6C0mIRA5DE
- Living room set: https://poly.pizza/m/9jFDGKGyDIw
- Kitchen: https://poly.pizza/m/aBg2VUZ8Zzp
- Dining table + chairs: https://poly.pizza/m/9pDkQyZTBWx
- Fireplace: https://poly.pizza/m/eBRLPCyPVGa
- Vinyl player: https://poly.pizza/m/dHnPy1eFxN
- Lantern: https://poly.pizza/m/8N1nUq0ZgAj
- Telescope: https://poly.pizza/m/eFPQI7HkKUw
- Paper boat: https://poly.pizza/m/2mL0lyPZzYy
- Cat (rigged): https://poly.pizza/m/2Dvs1qMz5vp
- Flowers pack: https://poly.pizza/m/cQAjkfKfHhh
- Trees pack: https://poly.pizza/m/f7EnCgTf5B

### Marketplaces (search these for higher fidelity)
- **Sketchfab (Downloadable + CC filter)**: https://sketchfab.com/3d-models?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b
- **Quaternius (100% free CC0)**: https://quaternius.com/
- **Kenney assets (CC0)**: https://kenney.nl/assets/category:3D

### HDR environments (free)
- **Poly Haven HDRIs**: https://polyhaven.com/hdris  
  Recommended: `moonlit_golf`, `dikhololo_night`, `kloppenheim_06_puresky`, `venice_sunset`, `symmetrical_garden_02`

### Where to place them
Drop `.glb` files into `public/models/` and `.hdr` files into `public/hdri/`. The scene components already reference `/models/bedroom.glb` etc. — just match filenames.

---

## Build order (phased)

1. Wire up GLTF + HDR loading pipeline (drei `useGLTF` + `Environment files={hdr}`) — one shared helper.
2. Living Room: fireplace + clock + vinyl (proves the realtime pattern).
3. Bedroom: goodnight lamp + dream journal.
4. Garden: plant-a-memory flower system.
5. Lake: paper boats with realtime drift.
6. Balcony + Observatory: shared sky + wishes.
7. Kitchen + Dining: rituals + notifications.
8. Forest + Meadow: voice fireflies + ephemeral writing.
9. Cat: cross-scene roaming + gifts.

Each phase adds one migration (features table + realtime channel) and one scene rewrite. I'll do them in that order unless you want to reorder.

---

**Reply "go" and I'll start with phase 1 (GLTF pipeline + Living Room fireplace/clock/vinyl).** Or tell me which room to build first and I'll jump straight there.
