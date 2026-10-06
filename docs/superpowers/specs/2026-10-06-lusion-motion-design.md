# Lusion-style motion system — design

Date: 2026-10-06
Status: awaiting review

## Goal

Give the Yuva Garden site Lusion-like motion: inertial smooth scroll, stacked "fold" card piles, layered depth cards, a scroll-drawn vine ribbon in the intro, and a two-column project grid. Visual direction was approved from two browser prototypes:

- `.superpowers/brainstorm/350140-1791304877/content/stack-prototype.html` (variant **B · Fold** chosen)
- `.superpowers/brainstorm/350140-1791304877/content/ribbon-grid-prototype.html` (approved as-is)

The prototypes are the visual reference for timings, easings and values below.

## Non-goals

- No WebGL changes. `BackgroundShader` stays as-is apart from moving its loop to the shared ticker.
- No content or copy changes beyond the new intro paragraph, pill and work tag lines.
- No changes to Hero, Nursery, Seasons, Contact or Footer layouts.

## Dependencies

- `lenis` (smooth scroll)
- `gsap` (core + `ScrollTrigger`, free for commercial use)

Approx. +45 KB gzip. Both are client-only; every consumer is a `"use client"` component.

Before writing code, read the relevant guides in `node_modules/next/dist/docs/` (Next 16.3.8, per `AGENTS.md`) for client components and layout changes.

## 1. Scroll engine

**New `src/components/motion/SmoothScroll.tsx`** — client component mounted once in `src/app/layout.tsx` around `children`.

- Registers `ScrollTrigger` once.
- Creates Lenis with `lerp: 0.085`.
- Drives Lenis from `gsap.ticker` (`lenis.raf(time * 1000)`), sets `gsap.ticker.lagSmoothing(0)`, and calls `ScrollTrigger.update` on Lenis scroll. One rAF loop for the whole app.
- Exposes the Lenis instance via React context (`useLenis()`), used by Header anchor links (`#services`, `#process`, `#work`, …) for smooth `lenis.scrollTo`.
- `prefers-reduced-motion: reduce` → Lenis is not created; native scroll; `useLenis()` returns `null` and callers fall back to default anchor behaviour.
- Destroys Lenis and removes the ticker callback on unmount.

**New `src/components/motion/useGsap.ts`** — small hook wrapping `gsap.context(fn, scopeRef)` in `useLayoutEffect`/`useEffect` with `ctx.revert()` cleanup. Every animated component uses it, so StrictMode double-mount and route changes leave no stale triggers.

**New `src/components/motion/reducedMotion.ts`** — `prefersReducedMotion()` helper plus a `gsap.matchMedia` breakpoint set shared by all components: `motion` = `(min-width: 768px) and (prefers-reduced-motion: no-preference)`.

**Migration of existing per-component loops**

| Component | Today | After |
|---|---|---|
| `CinematicZoom` | scroll listener | ScrollTrigger scrub |
| `ParallaxBand` | scroll listener | ScrollTrigger scrub |
| `ScrollProgressBar` | scroll listener + rAF | ScrollTrigger scrub on `scaleX` |
| `Header` | scroll listener | `ScrollTrigger.create({ onUpdate })` for show/hide |
| `WhatsAppFAB` | scroll listener | `ScrollTrigger.create({ onUpdate })` |
| `CursorBubble`, `Hero`, `Preloader`, `BackgroundShader` | own rAF loop | `gsap.ticker.add` / `remove` |

Behaviour of each component must stay identical apart from the smoother scroll input.

## 2. `FoldStack` (approved variant B)

**New `src/components/motion/FoldStack.tsx`**

```tsx
<FoldStack top="12vh">
  <FoldStack.Card>…</FoldStack.Card>
  …
</FoldStack>
```

- Each card is `position: sticky; top: <top>` inside a container with `perspective: 1400px`; `transform-origin: center top`; rounded 28px; overflow hidden; z-index by order.
- While the next card travels from viewport bottom to `top`, the current card scrubs to `rotateX(-14deg) scale(0.86) yPercent(-6)` and its dim overlay (`#0b140e`) to opacity `0.65`. Ease `none`, `scrub: true`.
- Any descendant `[data-parallax]` image drifts `yPercent -8 → 0` as its card enters.
- Last card does not fold.
- Outside the `motion` media query: no sticky, no fold; cards render as a normal vertical list and fade up (`y: 60 → 0`, `expo.out`, 1.1s) on enter.

**Sections using FoldStack**

1. **`ServicesSection`** (`#services`) — replaces the hover list + sticky preview. One full-width card per `servicesData` item: background image (`data-parallax`), bottom gradient, number, Bodoni title, description. Card height `72vh`.
2. **`ProcessSection`** (`#process`) — replaces the horizontal hover accordion. One card per `processSteps` item with number, title and text always visible.
3. **`CatalogSection`** — 3 category cards from `catalogItems[].cat` in order `Plants`, `Services`, `Supplies`. Each card holds a header (category name + count) and a responsive grid of the existing item cards. Search input stays above the stack and filters inside each card; a category with no matches is not rendered; the existing empty state shows when all are empty. Detail modal and "add to list" behaviour are unchanged. Card height is content-driven (`min-height: 72vh`); FoldStack must handle cards taller than the viewport by pinning at `top` until their bottom reaches the viewport bottom (`end: "bottom bottom"` on the trigger for tall cards).

`SelectedWork` does **not** use FoldStack (see §4).

## 3. Depth cards (`LusionCard` rewrite)

`src/components/LusionCard.tsx` keeps its public props (`index`, `className`, `glowColor`, `children`, HTML div props) so `CatalogSection` and `ContactSection` need no call-site changes.

Internal changes:

- Remove all per-frame React state (`mousePos`, `tilt`, `isHovered`). Pointer movement writes CSS variables `--rx`, `--ry`, `--mx`, `--my`, `--glow` through `gsap.quickTo` (`duration 0.6`, `power3.out`).
- Inner layers via `transform-style: preserve-3d`: image layer moves opposite the pointer (`±18px`), glow layer is a radial gradient following `--mx/--my`, foreground content at `translateZ(60–90px)`. Hover scale `1.03`, tilt max `14deg`.
- Entrance: ScrollTrigger `start: "top 90%"`, `y: 80 → 0`, opacity `0 → 1`, `expo.out` 1.1s, stagger `(index % 4) * 0.08s`.
- Tilt and glow only on `(hover: hover)` pointers and inside the `motion` media query.

## 4. Intro vine ribbon and SelectedWork grid (approved prototype 2)

**`Intro`** — rebuilt to the prototype layout:

- Section `min-height: 160vh`, label "About us" left, paragraph right, white pill "Our approach" (links to `#process`).
- Absolutely positioned inline SVG (`viewBox 0 0 1600 1600`, `preserveAspectRatio="none"`) with two vine paths, stroke `#5f8f4e` / `#7fae68`, width 34, round caps. Each path draws via `strokeDashoffset: length → 0` with `scrub: 1`. Paths are the original ones from the prototype.
- Media card (`44vw`, 16:9, existing intro image, green multiply tint) scrubs `scale 0.8 → 1.25` and inner image `yPercent -12 → 0`.
- Giant outline words "OUR" / "GARDENS" (Bodoni, transparent fill, 1px stroke at 18% ink) slide apart horizontally (`xPercent ±20 → ∓10`).
- Below `md`: single column, media full width, vine still draws (it is cheap), giant words static.

**`SelectedWork`** (`#work`) — the 3D drag wheel is removed and replaced by the two-column grid:

- Heading "Selected *work*" left, year range label right.
- `workProjects` split alternately into left and right columns; right column offset `margin-top: 22vh` and scrubs `y: 0 → -120px` across the section.
- Card: 4:3 image, radius 18px, clip-path reveal `inset(12% 6% 0 6%) → inset(0)` (`expo.out`, 1.4s), inner image parallax `yPercent -8 → 8`, hover image scale `1.07` and arrow slide-in.
- Text: tag line (uppercase, bullet-separated) and Bodoni title, both rising from `yPercent 100` with 0.08s stagger.
- `WorkProject` gains a `tags: string[]` field in `src/data/content.ts`; every existing project gets tags (place + 2–3 service words), rendered joined with ` • `.
- Below `md`: single column, no offset, no column drift.

## Accessibility and fallbacks

- `prefers-reduced-motion: reduce`: no Lenis, no pinning/folding, no scrubbed transforms, no tilt. Content renders in final state (vine fully drawn, clip-paths open, media at scale 1).
- All decorative SVG and overlays are `aria-hidden`. Card stacks keep DOM order equal to visual order; sticky positioning does not change focus order.
- Hover-only effects never hide content.

## Verification

- `npm run lint` and `npm run build` pass.
- Run `npm run dev` and check in a browser at 1440px and 390px width:
  - smooth scroll active; header anchor links glide to `#services`, `#process`, `#work`;
  - Services, Process and Catalog fold as in prototype B; Catalog search filters within cards and hides empty categories; detail modal and add-to-list still work;
  - Intro vine draws and media grows as in prototype 2; SelectedWork grid matches prototype 2;
  - LusionCard tilt and glow are smooth; React Profiler shows no re-renders during pointer move;
  - with OS reduced motion on, page is static and fully readable.
- No console errors; no leftover `window.addEventListener("scroll"` in `src/components`.

## Risks

- Sticky inside an ancestor with `overflow: hidden` breaks pinning; check section wrappers when migrating.
- Tall Catalog cards (Plants, 7 items) need the tall-card trigger rule in §2 or they will fold before their content is visible.
- Removing the SelectedWork wheel deletes its drag interaction; this is intentional and approved.
