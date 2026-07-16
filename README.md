# Bhārat — Interactive Study Map

A personal-use, India-focused interactive study map.

## Redesign — switchable shell (2026-07)

The app shipped a Claude Design redesign ("Redesign for modern UX and
scalability") implementing all four explored directions as a **live,
switchable layout** rather than picking just one:

- **2a — Unified Rail** *(default)* — persistent icon rail, docked chapter
  list + facts/quiz columns.
- **1a — Rail & Launcher** — same rail, grouped module cards on Home.
- **1b — Command Deck** — top nav bar + search instead of a rail; stat
  strip + flat module rows on Home.
- **1c — Focus Atlas** — map-first: no persistent chrome at all, floating
  chapter/facts cards over a full-bleed map, chrome-free centered Home.

Switch between them from the layout icon in the rail (or the ⚏ icon in
the Command Deck's top-right). The choice persists per device. See
`src/lib/shellStyles.ts` for the exact chrome config per style, and
`src/components/shell/` for Rail / CommandBar / AppShell / ShellSwitcher.

Home is now `/` (new dashboard, real progress data via `src/lib/stats.ts`);
Study Map moved to `/map`. Desktop-only distinction — mobile always uses
the original drawer + bottom-sheet chrome regardless of shell style.
`docked-tree` (1b's collapsible chapter tree) currently renders identically
to the plain docked list — a deliberate scope cut, not a bug.

The global palette (`src/styles/globals.css` `:root`/`.dark`) was replaced
with the redesign's dark-purple / light-classic tokens under the same
variable names, so every screen — including PYQ/Flashcards/Mind Maps,
which weren't in the mockup — picked it up automatically.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## What works in this build

**v3 — Comprehensive edition**
- **21 chapters** organized in **subject tabs** (Geography 11 / History 10) with unit groups: India Physical · World · Mizoram — Ancient · Medieval · Modern
- **Connections engine** — every chapter carries concept tags (rivers, places, ranges); shared concepts surface as clickable cross-links (e.g. the Ravi connects Rivers of India ↔ Indus Valley ↔ Vedic Age; the Deccan connects Soils ↔ Medieval South ↔ Delhi Sultanate)
- **Everything saves locally** — quiz progress, theme, basemap, layer states, and your last-open chapter persist in the browser (localStorage, no backend/Supabase needed)
- New chapters: The Vedic Age, Buddhism & Jainism, Delhi Sultanate, Medieval South (Cholas→Talikota), Europeans: Ports to Power, World Resources & Industry, World Atmosphere & Heat Zones

**v2 — Atlas edition**
- 8 geography (incl. Mizoram GS-V + 2 world-geography chapters) and 4 history chapters
- Picture-map basemaps: **Watercolor**, Satellite, Shaded Relief, NatGeo — switchable globally from the top bar
- Atlas-plate finish: paper grain + vignette over the map
- **Animated flow lines** — rivers, marches, invasion corridors and ocean currents stream in their draw direction
- **Story mode** — press ▶ on the timeline and the map flies through every event
- Quiz upgrades: shake/pop feedback, animated score ring
- Fully responsive: chapter drawer + facts/quiz bottom sheet on mobile; the sheet auto-ducks for map-click questions
- Leaflet CSS now bundled from npm (no CDN dependency)
- Honors `prefers-reduced-motion`


- Three-panel layout with study, quiz, and author modes
- Light + dark themes (persists)
- Per-chapter color theming (each chapter wears its own palette)
- Multiple basemaps: terrain, topographic, voyager, paper, clean
- Pattern fills on polygons: dots, hatch, wave, cross — far more cartographic feel than flat colors
- Drop shadows + smooth hover transitions on map features
- Timeline scrubber for history chapters (Plassey demo)
- Map-click + MCQ quiz types with tolerance-based scoring
- **Author Mode** — build new chapters by clicking on the map; no GeoJSON editing
- Two demo chapters: Climate & Monsoon, Battle of Plassey

## Author Mode — how to make a chapter without coding

1. Click the **✎ Author** button in the top right.
2. Pick a tool: Marker, Polygon, or Line (keys 1–4).
3. Click on the map to drop features. Polygons need Enter to finish.
4. Or search for places by name in the "Place Library" section — common
   Indian cities, capitals, historic sites, and battles are pre-loaded.
5. Fill in the chapter title, summary, and "The Idea" sentence.
6. Click "Generate Chapter Code" → copy the output.
7. Save the code as a new file in `src/data/chapters/`.
8. Add it to the chapters array in `src/data/index.ts`.
9. The chapter appears in the left panel.

This means a new chapter takes maybe 15 minutes — click locations,
write facts, write quiz questions, paste output. No GeoJSON.

## Project layout

```
src/
  components/        UI components
    MapView.tsx        The map (vector + raster + patterns + author overlay)
    LeftPanel.tsx      Chapter list + layer toggles
    RightPanel.tsx     Facts or quiz
    FactsPanel.tsx     Chapter facts + focus banner
    QuizPanel.tsx      MCQ + map-click quizzes
    Timeline.tsx       History chapter scrubber
    AuthorTool.tsx     Click-to-build chapter editor
    TopBar.tsx         Mode badge, author toggle, theme toggle
  data/
    chapters/        One file per chapter
    index.ts         Chapter registry
  hooks/
    useChapterTheme.ts  Applies chapter palette
  lib/
    store.ts         Zustand app state (persists)
    geo.ts           Haversine distance
    basemaps.ts      Tile source registry
    patterns.ts      SVG pattern fills for polygons
    places.ts        Indian place library for author tool
  styles/globals.css
  types/index.ts     Schema (Chapter, Layer, QuizItem, TimelineEvent)
  App.tsx, main.tsx
```

## Adding a new chapter (without author mode)

If you'd rather write a chapter file by hand:

1. Create `src/data/chapters/<chapter-id>.ts` exporting a `Chapter` object.
2. Import + list it in `src/data/index.ts`.

See `battle-of-plassey.ts` for a fully-featured chapter (focus, timeline events, themed palette, multiple layer types and patterns).

## Layer styling reference

```ts
style: {
  color: '#3a7a7a',        // line color
  weight: 2,               // line thickness
  fillColor: '#3a7a7a',    // solid fill (ignored if pattern is set)
  fillOpacity: 0.4,
  dashArray: '6 4',        // dashed lines
  pattern: 'hatch',        // 'dots' | 'hatch' | 'wave' | 'cross'
  shadow: true,            // soft drop shadow
}
```

## Basemap reference

```ts
basemap: 'terrain'   // hillshading + rivers — physical geography
basemap: 'topo'      // full topographic map
basemap: 'voyager'   // soft modern
basemap: 'paper'     // sepia / parchment — historical chapters
basemap: 'clean'     // minimal, label-free
```
