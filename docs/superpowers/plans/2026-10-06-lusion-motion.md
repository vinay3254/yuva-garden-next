# Lusion-style Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inertial smooth scroll, fold-stacked card piles, layered depth cards, a scroll-drawn vine intro and a two-column work grid to the Yuva Garden site.

**Architecture:** One shared motion core in `src/components/motion/` (GSAP + ScrollTrigger registration, Lenis smooth scroll driven by `gsap.ticker`, a `useGsap` context hook, shared media queries). Every animated component builds its animations inside `useGsap` + `gsap.matchMedia`, so cleanup and reduced-motion handling are uniform. Existing per-component scroll listeners and rAF loops move onto ScrollTrigger / `gsap.ticker`.

**Tech Stack:** Next.js 16.3.8 (App Router), React 19.2, Tailwind CSS v4, `gsap` 3.15 (+ `ScrollTrigger`), `lenis` 1.3.

**Spec:** `docs/superpowers/specs/2026-10-06-lusion-motion-design.md`
**Visual reference:** `.superpowers/brainstorm/350140-1791304877/content/stack-prototype.html` (variant B · Fold) and `.superpowers/brainstorm/350140-1791304877/content/ribbon-grid-prototype.html`.

## Global Constraints

- Before writing code, read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` (Next 16 has breaking changes, per `AGENTS.md`).
- New dependencies: only `gsap` and `lenis`. No other packages.
- Every file that imports `gsap`, `lenis`, or uses hooks starts with `"use client";`.
- Lenis: `lerp: 0.085`, driven by `gsap.ticker` (`lenis.raf(time * 1000)`), `gsap.ticker.lagSmoothing(0)`, `lenis.on("scroll", ScrollTrigger.update)`, `anchors: true`.
- Fold values: `rotateX(-14deg) scale(0.86) yPercent(-6)`, dim overlay `#0b140e` to opacity `0.65`, `perspective: 1400px`, `transform-origin: center top`, radius `28px`, default sticky top `12vh`, card height `72vh`.
- Media queries (single source: `src/components/motion/reducedMotion.ts`):
  - `MOTION_QUERY` = `(min-width: 768px) and (prefers-reduced-motion: no-preference)`
  - `MOBILE_MOTION_QUERY` = `(max-width: 767px) and (prefers-reduced-motion: no-preference)`
  - `MOTION_OK_QUERY` = `(prefers-reduced-motion: no-preference)`
  - `HOVER_MOTION_QUERY` = `(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover)`
- **New** motion respects reduced motion: no Lenis, no pin/fold, no scrubbed transforms, no tilt. Content shows in its final state.
- **Migrated** components (`CinematicZoom`, `ParallaxBand`, `ScrollProgressBar`, `Header`, `WhatsAppFAB`, `CursorBubble`, `Hero`, `Preloader`, `BackgroundShader`) keep their current behaviour exactly. Only the timing source changes.
- In-page links (`href="#..."`) are plain `<a>` elements, not `next/link`, so Lenis `anchors: true` can handle them.
- No `window.addEventListener("scroll"` and no `requestAnimationFrame(` may remain in `src/components` when the plan is done.
- Repo note: the git root is `/home/vinay` (a shared home repo, branch `test`). Every commit step stages **only** the exact paths listed, all under `yuva-garden-next/`. Never run `git add -A` or `git add .`.
- There is no unit-test runner in this project, and the spec adds none. Each task is proven with `npx tsc --noEmit`, `npm run lint`, a `grep` invariant, and a written browser check on `npm run dev` (http://localhost:3000).

## Review Focus

1. **Reduced motion at the OS level.** Expect: no smooth-scroll inertia, no pinned or folding cards, vine fully drawn, work images fully open, every card visible. Owner: Tasks 1, 4, 7, 9, 10. Each has a "reduced motion" browser check using Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce".
2. **Catalog search that changes which categories exist.** Typing "rose" (or anything matching one category) or clearing the search must rebuild the stack. No stale fold on a removed card, and no blank gap. Owner: Task 8, step "search rebuild check".
3. **Cards taller than the viewport** (Catalog "Plants" with 7 items, any card on a short laptop screen). Expect: the full card scrolls into view before it pins, and the next card never covers unseen content. Owner: Task 4 (`pinTops`), verified in Task 8.
4. **Wheel at the very top of the page.** The Hero growth-stage scrub must still capture the wheel. Lenis must not scroll the page until the Hero reaches its end. Owner: Task 3, Hero check.
5. **Anchor links** in the header (desktop and mobile menu), footer, Nursery CTA and Intro pill. Each must glide to its section. With reduced motion, each must jump instantly to the right section. Owner: Task 1, anchor check.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/components/motion/gsap.ts` | Create | Register `ScrollTrigger` once; re-export `gsap`, `ScrollTrigger` |
| `src/components/motion/reducedMotion.ts` | Create | Shared media-query strings |
| `src/components/motion/useGsap.ts` | Create | `gsap.context` lifecycle hook |
| `src/components/motion/SmoothScroll.tsx` | Create | Lenis instance on the shared ticker |
| `src/components/motion/FoldStack.tsx` | Create | Sticky fold-stack layout + animations |
| `src/app/layout.tsx` | Modify | Mount `SmoothScroll`, Lenis CSS, drop `scroll-smooth` |
| `src/app/globals.css` | Modify | Drop `scroll-behavior: smooth` |
| `src/components/Header.tsx`, `Footer.tsx` | Modify | Hash links to `<a>`; Header scroll logic to ScrollTrigger |
| `src/components/CinematicZoom.tsx`, `ParallaxBand.tsx`, `ScrollProgressBar.tsx`, `WhatsAppFAB.tsx` | Modify | Scroll listeners to ScrollTrigger |
| `src/components/CursorBubble.tsx`, `Hero.tsx`, `Preloader.tsx`, `BackgroundShader.tsx` | Modify | rAF loops to `gsap.ticker` |
| `src/components/ServicesSection.tsx`, `ProcessSection.tsx` | Rewrite | FoldStack cards |
| `src/components/LusionCard.tsx` | Rewrite | Depth card on CSS vars, same props |
| `src/components/CatalogSection.tsx` | Modify | Category FoldStack |
| `src/components/Intro.tsx` | Rewrite | Vine ribbon intro |
| `src/components/SelectedWork.tsx` | Rewrite | Two-column work grid |
| `src/data/content.ts` | Modify | `WorkProject.tags` |

---

### Task 1: Motion core and smooth scroll

**Files:**
- Create: `src/components/motion/gsap.ts`
- Create: `src/components/motion/reducedMotion.ts`
- Create: `src/components/motion/useGsap.ts`
- Create: `src/components/motion/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx:1-2,34,40-42`
- Modify: `src/app/globals.css:12-16`
- Modify: `src/components/Header.tsx` (links only)
- Modify: `src/components/Footer.tsx` (links only)
- Modify: `package.json`, `package-lock.json` (via npm)

**Interfaces:**
- Produces:
  - `import { gsap, ScrollTrigger } from "@/components/motion/gsap"`
  - `import { MOTION_QUERY, MOBILE_MOTION_QUERY, MOTION_OK_QUERY, HOVER_MOTION_QUERY } from "@/components/motion/reducedMotion"` (all `string`)
  - `useGsap(setup: () => void | (() => void), scope: RefObject<Element | null>, deps?: DependencyList): void`
  - `default export SmoothScroll({ children }: { children: ReactNode })`

- [ ] **Step 1: Install dependencies**

Run: `cd /home/vinay/yuva-garden-next && npm install gsap@^3.15.0 lenis@^1.3.26`
Expected: both appear under `dependencies` in `package.json`.

- [ ] **Step 2: Create `src/components/motion/gsap.ts`**

```ts
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 3: Create `src/components/motion/reducedMotion.ts`**

```ts
// Shared media queries for gsap.matchMedia. Keep every motion component on these.
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";
export const MOTION_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_MOTION_QUERY = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";
export const HOVER_MOTION_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover)";
```

- [ ] **Step 4: Create `src/components/motion/useGsap.ts`**

```ts
"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "./gsap";

// Runs GSAP setup inside a context scoped to `scope`, and reverts every tween,
// ScrollTrigger and matchMedia created in it on unmount or when deps change.
export function useGsap(
  setup: () => void | (() => void),
  scope: RefObject<Element | null>,
  deps: DependencyList = []
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(setup, scope.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
```

- [ ] **Step 5: Create `src/components/motion/SmoothScroll.tsx`**

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION_OK_QUERY } from "./reducedMotion";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK_QUERY).matches) return;

    const lenis = new Lenis({ lerp: 0.085, anchors: true });
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Note: the spec's `useLenis()` context is not needed. `anchors: true` makes Lenis handle every `<a href="#…">` click, so no component needs the instance.

- [ ] **Step 6: Wire into `src/app/layout.tsx`**

Replace lines 1–2:

```tsx
import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
```

Replace line 34 `<html lang="en" className="scroll-smooth">` with:

```tsx
    <html lang="en">
```

Replace lines 40–42 (body) with:

```tsx
      <body className="font-sans-hanken antialiased bg-[#f4f1ea] text-[#1b2a1f] min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
```

- [ ] **Step 7: Remove native smooth scroll from `src/app/globals.css`**

Replace:

```css
html {
  scroll-behavior: smooth;
  background-color: #f4f1ea;
  color: #1b2a1f;
}
```

with:

```css
html {
  background-color: #f4f1ea;
  color: #1b2a1f;
}
```

- [ ] **Step 8: Convert hash links to `<a>` in `Header.tsx` and `Footer.tsx`**

In `src/components/Header.tsx`: delete `import Link from "next/link";`, then replace every `<Link` with `<a` and every `</Link>` with `</a>`. All Header hrefs are `#…`, so no other change is needed.

In `src/components/Footer.tsx`: delete `import Link from "next/link";`, then replace every `<Link` with `<a` and every `</Link>` with `</a>`.

Run: `grep -rn "next/link" src`
Expected: no output.

- [ ] **Step 9: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0. Warnings that existed before (`@next/next/no-img-element`) are acceptable. No new errors.

- [ ] **Step 10: Browser check**

Run `npm run dev` and open http://localhost:3000.
- Mouse wheel scroll glides with inertia.
- Anchor check: click Header "Services", "Process", "Work" (desktop), open the mobile menu at 390px and click "Nursery", then click Footer "Contact". Each glides to its section.
- Reduced-motion check: DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, then reload. Scrolling is native and instant, and anchor clicks jump straight to the section.

- [ ] **Step 11: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/package.json yuva-garden-next/package-lock.json yuva-garden-next/src/components/motion yuva-garden-next/src/app/layout.tsx yuva-garden-next/src/app/globals.css yuva-garden-next/src/components/Header.tsx yuva-garden-next/src/components/Footer.tsx
git commit -m "feat(motion): add Lenis smooth scroll on shared GSAP ticker"
```

---

### Task 2: Move scroll listeners onto ScrollTrigger

**Files:**
- Modify: `src/components/CinematicZoom.tsx:1-54`
- Modify: `src/components/ParallaxBand.tsx:1-24`
- Modify: `src/components/ScrollProgressBar.tsx` (whole file)
- Modify: `src/components/Header.tsx:3,7-29,41`
- Modify: `src/components/WhatsAppFAB.tsx:3,6-18`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `useGsap` from Task 1.

- [ ] **Step 1: `CinematicZoom.tsx`, replace lines 1–54 (imports + effect)**

```tsx
"use client";

import { useRef } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";

export default function CinematicZoom() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const txtRef = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    const apply = (progress: number) => {
      // smooth ease: p * p * (3 - 2 * p)
      const ease = progress * progress * (3 - 2 * progress);

      const frame = frameRef.current;
      if (frame) {
        const insetX = ease * 22;
        const insetY = ease * 14;
        const round = ease * 24;
        frame.style.clipPath = `inset(${insetY}% ${insetX}% round ${round}px)`;
      }

      const img = imgRef.current;
      if (img) {
        img.style.transform = `scale(${1.25 - ease * 0.25})`;
      }

      const txt = txtRef.current;
      if (txt) {
        txt.style.opacity = String(Math.max(0, 1 - (progress - 0.45) * 3));
        txt.style.transform = `scale(${1 - ease * 0.15})`;
      }

      const cap = capRef.current;
      if (cap) {
        cap.style.opacity = String(Math.max(0, (progress - 0.6) * 2.5));
      }
    };

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(st.progress);
  }, containerRef);
```

The JSX return block (old lines 56–101) is unchanged.

- [ ] **Step 2: `ParallaxBand.tsx`, replace lines 1–24**

```tsx
"use client";

import { useRef } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";

export default function ParallaxBand() {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useGsap(() => {
    const apply = () => {
      const b = bandRef.current;
      const bi = imgRef.current;
      if (!b || !bi) return;

      const r = b.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      bi.style.transform = `translate3d(0, ${p * -12}%, 0)`;
    };

    ScrollTrigger.create({
      trigger: bandRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: apply,
      onRefresh: apply,
    });
    apply();
  }, bandRef);
```

The JSX (old lines 26–44) is unchanged.

- [ ] **Step 3: Replace `ScrollProgressBar.tsx` entirely**

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      }
    );
  }, barRef);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] w-full bg-[#c9b88a] z-50 pointer-events-none origin-left scale-x-0"
    />
  );
}
```

- [ ] **Step 4: `Header.tsx`, replace the scroll effect**

Change line 3 to:

```tsx
import { useRef, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
```

Replace the `useEffect(() => { let lastY … }, []);` block (old lines 12–29) with:

```tsx
  const headerRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    let lastY = window.scrollY;

    const update = (curY: number) => {
      setScrolled(curY > 40);

      const dy = curY - lastY;
      if (Math.abs(dy) > 8) {
        setHidden(dy > 0 && curY > window.innerHeight * 0.7);
        lastY = curY;
      }
    };

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => update(self.scroll()),
    });
    update(window.scrollY);
  }, headerRef);
```

Add `ref={headerRef}` to the `<header` element (old line 41).

- [ ] **Step 5: `WhatsAppFAB.tsx`, replace the scroll effect**

Change line 3 to:

```tsx
import { useRef, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
```

Replace the `useEffect` block (old lines 9–18) with:

```tsx
  const fabRef = useRef<HTMLAnchorElement | null>(null);

  useGsap(() => {
    const update = (y: number) => setVisible(y > window.innerHeight * 0.7);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => update(self.scroll()),
    });
    update(window.scrollY);
  }, fabRef);
```

Add `ref={fabRef}` to the `<a` element.

- [ ] **Step 6: Invariant check**

Run: `grep -rn 'addEventListener("scroll"' src/components`
Expected: no output.

- [ ] **Step 7: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0, with no new errors.

- [ ] **Step 8: Browser check**

On `npm run dev`:
- CinematicZoom: the frame clips in, the text fades out, and the caption appears, all as before.
- ParallaxBand: the image drifts.
- The gold progress bar fills smoothly from 0 to 100% by the page bottom.
- The header turns cream after 40px. It hides on scroll down past 70% of the viewport height and shows on scroll up.
- The WhatsApp button appears after 70% of the viewport height.

- [ ] **Step 9: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/CinematicZoom.tsx yuva-garden-next/src/components/ParallaxBand.tsx yuva-garden-next/src/components/ScrollProgressBar.tsx yuva-garden-next/src/components/Header.tsx yuva-garden-next/src/components/WhatsAppFAB.tsx
git commit -m "refactor(motion): drive scroll effects from ScrollTrigger"
```

---

### Task 3: Move rAF loops onto `gsap.ticker`

**Files:**
- Modify: `src/components/CursorBubble.tsx:3,21,47-62`
- Modify: `src/components/Hero.tsx:3,22,27-58`
- Modify: `src/components/Preloader.tsx:3,19,46-76`
- Modify: `src/components/BackgroundShader.tsx:136-160` (+ import)

**Interfaces:**
- Consumes: `gsap` from Task 1. `gsap.ticker.add(fn)` calls `fn(time, deltaTime, frame)` once per frame. Callbacks below ignore the arguments.

- [ ] **Step 1: `CursorBubble.tsx`**

Add after line 3: `import { gsap } from "@/components/motion/gsap";`
Delete `let rafId: number;`.
Replace the loop and cleanup (old lines 47–62) with:

```tsx
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      s += (ts - s) * 0.14;

      if (b) {
        b.style.transform = `translate(${x}px, ${y}px) scale(${s.toFixed(3)})`;
      }
    };
    gsap.ticker.add(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(loop);
    };
```

- [ ] **Step 2: `Hero.tsx`**

Add after line 4: `import { gsap } from "@/components/motion/gsap";`
Delete `let rafId: number;`.
In `onWheel`, replace

```tsx
      if (target < 0.99) {
        e.preventDefault();
      }
```

with

```tsx
      if (target < 0.99) {
        e.preventDefault();
        // Keep Lenis (listening on window) from also scrolling the page.
        e.stopPropagation();
      }
```

Replace the loop and cleanup (old lines 45–58) with:

```tsx
    const loop = () => {
      cur += (target - cur) * 0.1;
      if (Math.abs(target - cur) < 0.001) cur = target;
      setCurrentProgress(cur);
    };
    gsap.ticker.add(loop);

    return () => {
      if (container) {
        container.removeEventListener("wheel", onWheel);
      }
      gsap.ticker.remove(loop);
    };
```

- [ ] **Step 3: `Preloader.tsx`**

Add after line 3: `import { gsap } from "@/components/motion/gsap";`
Delete `let rafId: number;`.
In `frame`, replace

```tsx
      if (shown >= 100 && !done) {
        done = true;
        setTimeout(exit, 240);
        return;
      }

      if (!done) {
        rafId = requestAnimationFrame(frame);
      }
```

with

```tsx
      if (shown >= 100 && !done) {
        done = true;
        gsap.ticker.remove(frame);
        setTimeout(exit, 240);
      }
```

Replace the final lines (old 76–78)

```tsx
    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
```

with

```tsx
    gsap.ticker.add(frame);

    return () => gsap.ticker.remove(frame);
```

- [ ] **Step 4: `BackgroundShader.tsx`**

Add `import { gsap } from "@/components/motion/gsap";` under the existing React import.
Delete `let rafId: number;` (old line 137).
In `render`, delete the line `rafId = requestAnimationFrame(render);`.
Replace `render();` with `gsap.ticker.add(render);`.
In the cleanup, replace `cancelAnimationFrame(rafId);` with `gsap.ticker.remove(render);`.

- [ ] **Step 5: Invariant check**

Run: `grep -rn "requestAnimationFrame\|cancelAnimationFrame" src/components | grep -v SelectedWork.tsx`
Expected: no output. (`SelectedWork.tsx` is rewritten in Task 10.)

- [ ] **Step 6: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 7: Browser check**

- The preloader counts 0 to 100, opens the image, and slides away.
- The cursor bubble follows the pointer on catalog cards.
- The shader background still moves.
- Hero check: reload at the top of the page and wheel down. The growth stages scrub, and the page itself does not scroll until the last stage. After that, the page scrolls smoothly.

- [ ] **Step 8: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/CursorBubble.tsx yuva-garden-next/src/components/Hero.tsx yuva-garden-next/src/components/Preloader.tsx yuva-garden-next/src/components/BackgroundShader.tsx
git commit -m "refactor(motion): run animation loops on the shared GSAP ticker"
```

---

### Task 4: `FoldStack` component

**Files:**
- Create: `src/components/motion/FoldStack.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `useGsap`, `MOTION_QUERY`, `MOBILE_MOTION_QUERY`.
- Produces: `default export FoldStack(props: { children: ReactNode; topVh?: number; refreshKey?: string; className?: string })`
  - Each direct child becomes one card. The child supplies its own height and background.
  - Any descendant with the `data-parallax` attribute drifts `yPercent -8 → 0` as its card enters. Give such images a height of at least `120%`.
  - Change `refreshKey` whenever card content changes size (for example, a search query) to rebuild the triggers.

- [ ] **Step 1: Create `src/components/motion/FoldStack.tsx`**

```tsx
"use client";

import { Children, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";
import { MOBILE_MOTION_QUERY, MOTION_QUERY } from "./reducedMotion";

interface FoldStackProps {
  children: ReactNode;
  topVh?: number;
  refreshKey?: string;
  className?: string;
}

export default function FoldStack({
  children,
  topVh = 12,
  refreshKey = "",
  className = "",
}: FoldStackProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const items = Children.toArray(children);

  useGsap(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-fold-card]", root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Cards taller than the viewport pin only once their bottom reaches the
        // viewport bottom, so no content is covered before it was seen.
        const pinTops = () => {
          const topPx = (window.innerHeight * topVh) / 100;
          cards.forEach((card) => {
            const fit = window.innerHeight - card.offsetHeight;
            card.style.top = `${Math.min(topPx, fit)}px`;
          });
        };
        pinTops();
        ScrollTrigger.addEventListener("refreshInit", pinTops);

        cards.forEach((card, i) => {
          card.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
              }
            );
          });

          const next = cards[i + 1];
          if (!next) return;

          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: () => `top ${next.style.top || `${topVh}vh`}`,
            scrub: true,
            invalidateOnRefresh: true,
          };
          const panel = card.querySelector<HTMLElement>("[data-fold-panel]");
          const dim = card.querySelector<HTMLElement>("[data-fold-dim]");
          gsap.to(panel, { rotateX: -14, scale: 0.86, yPercent: -6, ease: "none", scrollTrigger });
          gsap.to(dim, { opacity: 0.65, ease: "none", scrollTrigger });
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", pinTops);
          cards.forEach((card) => (card.style.top = ""));
        };
      });

      mm.add(MOBILE_MOTION_QUERY, () => {
        cards.forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          });
        });
      });

      ScrollTrigger.refresh();
    },
    rootRef,
    [items.length, topVh, refreshKey]
  );

  return (
    <div ref={rootRef} className={className}>
      {items.map((child, i) => (
        <div
          key={(child as { key?: string | null }).key ?? i}
          data-fold-card
          className="relative mb-[8vh] last:mb-0 md:motion-safe:sticky"
          style={{ zIndex: i + 1, perspective: "1400px" }}
        >
          <div
            data-fold-panel
            className="relative overflow-hidden rounded-[28px] origin-top will-change-transform shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            {child}
            <div
              data-fold-dim
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#0b140e] opacity-0"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0. `FoldStack` is not rendered yet. Tasks 5, 6 and 8 render it and run its browser checks, including reduced motion and tall cards.

- [ ] **Step 3: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/motion/FoldStack.tsx
git commit -m "feat(motion): add FoldStack sticky fold card stack"
```

---

### Task 5: ServicesSection as a fold stack

**Files:**
- Rewrite: `src/components/ServicesSection.tsx`

**Interfaces:**
- Consumes: `FoldStack` from Task 4; `servicesData: ServiceItem[]` (`id, n, title, description, image`).

- [ ] **Step 1: Replace `src/components/ServicesSection.tsx`**

```tsx
import FoldStack from "@/components/motion/FoldStack";
import { servicesData } from "@/data/content";

export default function ServicesSection() {
  return (
    <section id="services" className="py-[12vh] px-[5vw] border-t border-[#d8d1c0]">
      <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] mb-12">
        Services
      </div>

      <FoldStack>
        {servicesData.map((item) => (
          <article key={item.id} className="relative h-[72vh] min-h-[420px] text-[#f4f1ea]">
            <img
              data-parallax
              src={item.image}
              alt={item.title}
              className="absolute inset-x-0 top-0 w-full h-[120%] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-[#0a140c]/75" />
            <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-9 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <div className="text-sm font-mono opacity-70">{item.n}</div>
                <h3 className="font-serif-bodoni font-normal text-[clamp(32px,5vw,72px)] leading-none m-0 tracking-[-0.02em]">
                  {item.title}
                </h3>
              </div>
              <p className="m-0 max-w-[320px] text-base leading-[1.55] text-[#e9e4d8]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </FoldStack>
    </section>
  );
}
```

`"use client"` is dropped because this file has no hooks now. `FoldStack` is its own client boundary.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 3: Browser check (1440px)**

Compare with `stack-prototype.html` variant B.
- The 4 service cards pin at 12vh.
- As the next card rises, the previous card tilts back, shrinks and darkens.
- The last card does not fold.
- Images drift slightly as each card enters.

At 390px: no pinning, and the cards fade up in a normal list.
With reduced motion: no pinning and no fade. The cards are static and fully visible.

- [ ] **Step 4: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/ServicesSection.tsx
git commit -m "feat(services): show services as a fold stack"
```

---

### Task 6: ProcessSection as a fold stack

**Files:**
- Rewrite: `src/components/ProcessSection.tsx`

**Interfaces:**
- Consumes: `FoldStack`; `processSteps: StepItem[]` (`n, title, text, image`).

- [ ] **Step 1: Replace `src/components/ProcessSection.tsx`**

```tsx
import FoldStack from "@/components/motion/FoldStack";
import { processSteps } from "@/data/content";

export default function ProcessSection() {
  return (
    <section id="process" className="py-[14vh] px-[5vw]">
      <div className="flex justify-between items-end gap-6 flex-wrap mb-12">
        <h2 className="font-serif-bodoni font-normal text-[clamp(40px,5vw,76px)] leading-none m-0 tracking-[-0.015em]">
          How we <i className="italic">work</i>
        </h2>
        <p className="m-0 max-w-[300px] text-[15px] leading-[1.6] text-[#3c4a40]">
          Four steps, from the first visit to ongoing care.
        </p>
      </div>

      <FoldStack>
        {processSteps.map((step) => (
          <article key={step.n} className="relative h-[72vh] min-h-[420px] text-[#f4f1ea]">
            <img
              data-parallax
              src={step.image}
              alt={step.title}
              className="absolute inset-x-0 top-0 w-full h-[120%] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1611]/25 to-[#0f1611]/85" />
            <div className="absolute left-6 top-6 md:left-10 md:top-9 font-serif-bodoni text-3xl md:text-4xl">
              {step.n}
            </div>
            <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-9">
              <div className="font-serif-bodoni text-[clamp(32px,4.4vw,64px)] leading-none mb-3">
                {step.title}
              </div>
              <div className="text-base md:text-lg leading-[1.55] max-w-[460px] text-[#e9e4d8]">
                {step.text}
              </div>
            </div>
          </article>
        ))}
      </FoldStack>
    </section>
  );
}
```

The subtitle copy changes because "Hover or tap each step" no longer describes the UI.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 3: Browser check**

The 4 process cards fold like the Services cards. The number, title and text are always visible.

- [ ] **Step 4: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/ProcessSection.tsx
git commit -m "feat(process): show process steps as a fold stack"
```

---

### Task 7: `LusionCard` depth card rewrite

**Files:**
- Rewrite: `src/components/LusionCard.tsx`
- Modify: `src/app/globals.css` (append depth rules)

**Interfaces:**
- Consumes: `gsap`, `useGsap`, `MOTION_OK_QUERY`, `HOVER_MOTION_QUERY`.
- Produces: the same default export and props as today: `{ children: ReactNode; index?: number; className?: string; glowColor?: string } & HTMLAttributes<HTMLDivElement>`. Call sites in `CatalogSection` and `ContactSection` are unchanged.
  - Opt-in: a descendant with `data-depth="img"` moves opposite the pointer (±18px).

- [ ] **Step 1: Replace `src/components/LusionCard.tsx`**

```tsx
"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { HOVER_MOTION_QUERY, MOTION_OK_QUERY } from "@/components/motion/reducedMotion";

interface LusionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  index?: number;
  className?: string;
  glowColor?: string;
}

export default function LusionCard({
  children,
  index = 0,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.25)",
  style,
  ...props
}: LusionCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      gsap.from(wrap, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: (index % 4) * 0.08,
        scrollTrigger: { trigger: wrap, start: "top 90%", once: true },
      });
    });

    mm.add(HOVER_MOTION_QUERY, () => {
      // Pointer input only writes CSS variables; the stylesheet turns them into
      // tilt, lift, glow and image counter-motion. No React state per frame.
      gsap.set(card, { "--rx": 0, "--ry": 0, "--mx": 0, "--my": 0, "--glow": 0, "--lift": 0 });
      const to = (prop: string) => gsap.quickTo(card, prop, { duration: 0.6, ease: "power3.out" });
      const rx = to("--rx");
      const ry = to("--ry");
      const mx = to("--mx");
      const my = to("--my");
      const glow = to("--glow");
      const lift = to("--lift");

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        rx(-y * 14);
        ry(x * 14);
        mx(x);
        my(y);
        glow(1);
        lift(1);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
        mx(0);
        my(0);
        glow(0);
        lift(0);
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });
  }, wrapRef);

  return (
    <div ref={wrapRef} className="h-full [perspective:1000px]">
      <div
        ref={cardRef}
        data-depth-card
        {...props}
        className={`relative h-full [transform-style:preserve-3d] ${className}`}
        style={style}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
          style={{
            opacity: "var(--glow, 0)",
            background: `radial-gradient(circle 300px at calc(50% + var(--mx, 0) * 100%) calc(50% + var(--my, 0) * 100%), ${glowColor}, transparent 70%)`,
          }}
        />
        <div className="relative z-10 h-full flex flex-col [transform:translateZ(60px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
```

The card no longer uses `overflow-hidden`, because it would flatten the 3D depth. Children clip their own images, as Catalog already does with `rounded-t-[22px] overflow-hidden`.

- [ ] **Step 2: Append depth rules to `src/app/globals.css`**

```css
/* LusionCard depth: variables are written by GSAP quickTo (see LusionCard.tsx) */
[data-depth-card] {
  transform: translateY(calc(var(--lift, 0) * -12px)) scale(calc(1 + var(--lift, 0) * 0.03))
    rotateX(calc(var(--rx, 0) * 1deg)) rotateY(calc(var(--ry, 0) * 1deg));
  box-shadow: 0 calc(4px + var(--lift, 0) * 31px) calc(20px + var(--lift, 0) * 50px)
    calc(-2px - var(--lift, 0) * 13px) rgba(0, 0, 0, calc(0.1 + var(--lift, 0) * 0.35));
}

[data-depth-card] [data-depth="img"] {
  transform: translate3d(calc(var(--mx, 0) * -18px), calc(var(--my, 0) * -18px), 0) scale(1.08);
}
```

- [ ] **Step 3: Invariant check**

Run: `grep -n "useState\|setMousePos\|setTilt" src/components/LusionCard.tsx`
Expected: no output.

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 5: Browser check**

- Contact section cards rise in with a stagger.
- On hover they tilt up to 14°, lift and glow under the pointer. The content sits visibly in front of the card face.
- React DevTools Profiler: recording while moving the pointer over a card shows **no** commits.
- With reduced motion: the cards are static, with no entrance and no tilt.

- [ ] **Step 6: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/LusionCard.tsx yuva-garden-next/src/app/globals.css
git commit -m "perf(cards): drive LusionCard depth with GSAP CSS variables"
```

---

### Task 8: CatalogSection as category fold stack

**Files:**
- Modify: `src/components/CatalogSection.tsx:3-6,8-55,68-212`

**Interfaces:**
- Consumes: `FoldStack` (with `refreshKey`), `LusionCard` with `data-depth="img"` opt-in, and `CatalogItem["cat"]` = `"Plants" | "Services" | "Supplies"`.

- [ ] **Step 1: Imports and state (old lines 3–55)**

Replace lines 3–6 with:

```tsx
import { useState, useMemo } from "react";
import { catalogItems, CatalogItem, getWhatsAppUrl } from "@/data/content";
import { Search, X, Check, ArrowRight } from "lucide-react";
import LusionCard from "@/components/LusionCard";
import FoldStack from "@/components/motion/FoldStack";

const CATEGORY_ORDER: CatalogItem["cat"][] = ["Plants", "Services", "Supplies"];
```

Replace the body from `const [selectedCategory …` down to the end of `handleUntilt` (old lines 9–48) with:

```tsx
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [activeDetailItem, setActiveDetailItem] = useState<CatalogItem | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogItems.filter(
      (item) => !q || (item.name + " " + item.note + " " + item.desc).toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        items: filteredItems.filter((item) => item.cat === cat),
      })).filter((group) => group.items.length > 0),
    [filteredItems]
  );

  const toggleListItem = (name: string) => {
    setSelectedList((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };
```

`whatsappListUrl` (old lines 50–55) stays.

- [ ] **Step 2: Search bar without category pills (old lines 68–116)**

The stack now shows every category, so the pills are removed. Replace the whole filter/search block with:

```tsx
      {/* Search */}
      <div className="flex justify-end mb-9 pb-6 border-b border-[#33463a]">
        <label className="flex items-center gap-2.5 bg-[#24362a] border border-[#33463a] rounded-full px-4 py-1 min-w-[260px] w-full md:max-w-[320px]">
          <Search size={16} className="text-[#a9b3a8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plants, services…"
            aria-label="Search the catalog"
            className="w-full bg-transparent border-0 outline-hidden text-[#f4f1ea] placeholder-[#a9b3a8] text-sm py-2"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="text-[#a9b3a8] hover:text-[#f4f1ea]"
            >
              <X size={14} />
            </button>
          )}
        </label>
      </div>
```

- [ ] **Step 3: Category stack replaces the flat grid (old lines 125–212)**

Replace from `{/* Cards Grid */}` through the grid's closing `</div>` with the code below. The item card body is the old one, with two changes: the image gets `data-depth="img"`, and its `transition-transform … group-hover:scale-105` classes are removed because depth motion replaces them.

```tsx
      {/* Category Fold Stack */}
      <FoldStack refreshKey={searchQuery}>
        {groups.map(({ cat, items }) => (
          <div
            key={cat}
            className="bg-[#24362a] border border-[#33463a] rounded-[28px] p-5 md:p-8 min-h-[72vh]"
          >
            <div className="flex justify-between items-baseline gap-4 mb-6">
              <h3 className="font-serif-bodoni font-normal text-[clamp(32px,3.6vw,56px)] leading-none m-0">
                {cat}
              </h3>
              <span className="font-mono text-sm text-[#a9b3a8]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item, index) => {
                const isAdded = selectedList.includes(item.name);
                return (
                  <LusionCard
                    key={item.id}
                    index={index}
                    className={`bg-[#f4f1ea] text-[#1b2a1f] rounded-[22px] flex flex-col ${
                      isAdded ? "ring-2 ring-[#c9b88a] ring-offset-2 ring-offset-[#24362a]" : ""
                    }`}
                  >
                    {/* Card Image */}
                    <div
                      onClick={() => setActiveDetailItem(item)}
                      className="aspect-[5/4] overflow-hidden relative cursor-pointer group rounded-t-[22px]"
                    >
                      <img
                        data-depth="img"
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute left-3.5 top-3.5 text-xs font-semibold px-3 py-1 rounded-full shadow-xs text-[#1b2a1f]"
                        style={{ backgroundColor: item.tagBg }}
                      >
                        {item.tag}
                      </span>
                      <span className="absolute right-3.5 top-3.5 bg-[#f4f1ea]/90 backdrop-blur-xs text-[#1b2a1f] text-xs font-semibold px-3 py-1 rounded-full shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                        Details
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col gap-3.5 flex-1">
                      <div>
                        <div className="font-serif-bodoni text-2xl leading-[1.1] font-medium">
                          {item.name}
                        </div>
                        <div className="text-[13px] text-[#5d6a60] mt-1">{item.note}</div>
                      </div>

                      {/* Facts Badges */}
                      <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
                        {item.facts.map((fact) => (
                          <span
                            key={fact}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#e9e4d8] text-[#3c4a40]"
                          >
                            {fact}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => toggleListItem(item.name)}
                          className={`flex-1 text-sm font-semibold py-2.5 px-3.5 rounded-full border border-[#1b2a1f] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                            isAdded
                              ? "bg-[#1b2a1f] text-[#f4f1ea]"
                              : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            "+ Add to list"
                          )}
                        </button>
                        <a
                          href={getWhatsAppUrl(`Hi, I am interested in: ${item.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${item.name} on WhatsApp`}
                          className="w-11 h-11 shrink-0 rounded-full bg-[#1b2a1f] text-[#f4f1ea] flex items-center justify-center text-lg transition-colors hover:bg-[#6b5a2e]"
                        >
                          <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>
                  </LusionCard>
                );
              })}
            </div>
          </div>
        ))}
      </FoldStack>
```

The Empty State block (old lines 118–123) stays as is. It still keys off `filteredItems.length === 0`. The detail modal and floating tray (old lines 214–328) stay unchanged. They are siblings of `FoldStack`, not inside a transformed panel, so `position: fixed` still works.

- [ ] **Step 4: Invariant check**

Run: `grep -n "selectedCategory\|handleTilt\|handleUntilt" src/components/CatalogSection.tsx`
Expected: no output.

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 6: Browser check at 1440px and on a short window (1280×720)**

- Three cards appear in order: Plants, Services, Supplies. Each shows its count.
- Tall-card check: the Plants card (2 rows) scrolls fully into view before it pins. Its bottom row is fully visible before the Services card covers it.
- Each later card folds the previous one.
- "Add to list" toggles, the tray appears, and the detail modal opens and closes.
- Item cards tilt on hover.

- [ ] **Step 7: Search rebuild check**

- Type a query that matches only Plants items (for example, take a word from a Plants item's `name`). Only the Plants card remains, and it does not fold.
- Clear the search. All 3 cards return and fold correctly, with no blank gaps.
- Type `zzzz`. The empty-state message shows and no cards render.

- [ ] **Step 8: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/CatalogSection.tsx
git commit -m "feat(catalog): group catalog into a category fold stack"
```

---

### Task 9: Intro vine ribbon

**Files:**
- Rewrite: `src/components/Intro.tsx`

**Interfaces:**
- Consumes: `gsap`, `useGsap`, `MOTION_OK_QUERY`, `MOTION_QUERY`.

- [ ] **Step 1: Replace `src/components/Intro.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY, MOTION_QUERY } from "@/components/motion/reducedMotion";

// Original vine paths (viewBox 0 0 1600 1600), approved in ribbon-grid-prototype.html.
const VINE_TOP =
  "M420 -40 C 520 120, 560 260, 560 380 C 560 470, 470 520, 300 540 C 80 565, 20 720, 120 820 C 230 930, 520 900, 760 760 C 980 630, 1080 560, 1200 700 C 1320 840, 1350 960, 1470 930 C 1560 905, 1600 860, 1620 820";
const VINE_BOTTOM =
  "M-40 1180 C 200 1060, 420 1120, 520 1240 C 620 1360, 820 1380, 980 1250 C 1120 1140, 1280 1120, 1400 1220 C 1480 1290, 1540 1380, 1640 1400";

export default function Intro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      // pathLength={1} on each path, so dash units are 0..1 at any rendered size.
      gsap.fromTo(
        "[data-vine='top']",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "center 40%", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-vine='bottom']",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 10%", end: "bottom 60%", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-intro-img]",
        { yPercent: -12 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-intro-media]", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    mm.add(MOTION_QUERY, () => {
      gsap.fromTo(
        "[data-intro-media]",
        { scale: 0.8, borderRadius: 28 },
        {
          scale: 1.25,
          borderRadius: 16,
          ease: "none",
          scrollTrigger: { trigger: "[data-intro-media]", start: "top 90%", end: "bottom 20%", scrub: 1 },
        }
      );
      const giant = { trigger: "[data-giant]", start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-giant-word='left']", { xPercent: 20 }, { xPercent: -10, ease: "none", scrollTrigger: giant });
      gsap.fromTo("[data-giant-word='right']", { xPercent: -20 }, { xPercent: 10, ease: "none", scrollTrigger: giant });
    });
  }, sectionRef);

  return (
    <section ref={sectionRef} className="relative min-h-[160vh] pt-[12vh] px-[5vw] overflow-x-clip">
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 1600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[2] w-full h-full overflow-visible"
      >
        <path
          data-vine="top"
          pathLength={1}
          d={VINE_TOP}
          fill="none"
          stroke="#7fae68"
          strokeWidth={34}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-vine="bottom"
          pathLength={1}
          d={VINE_BOTTOM}
          fill="none"
          stroke="#5f8f4e"
          strokeWidth={34}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-[3] grid grid-cols-1 md:grid-cols-2 gap-[6vw]">
        <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] self-start">
          About us
        </div>
        <div>
          <p className="m-0 text-[clamp(20px,1.7vw,28px)] leading-[1.45] text-balance">
            From a few pots on a balcony to a full landscape, we grow the plants and do the
            work — design, planting and the care that keeps a garden alive year after year.
          </p>
          <a
            href="#process"
            className="mt-10 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-[15px] font-semibold tracking-[0.04em] uppercase shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#1b2a1f]" />
            Our approach
          </a>
        </div>
      </div>

      <div
        data-intro-media
        className="relative z-[4] mt-[10vh] w-full md:w-[44vw] aspect-video rounded-[20px] overflow-hidden origin-top-left will-change-transform"
      >
        <img
          data-intro-img
          src="https://images.unsplash.com/photo-1597868165956-03a6827955b1?auto=format&fit=crop&w=1600&q=75"
          alt="Planting a seedling into fertile soil"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-[#5f8f4e] mix-blend-multiply opacity-55" />
      </div>

      <div
        data-giant
        aria-hidden="true"
        className="relative z-[1] mt-[8vh] flex justify-around whitespace-nowrap font-serif-bodoni text-[clamp(80px,15vw,260px)] leading-[0.9] tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(27,42,31,0.18)]"
      >
        <span data-giant-word="left" className="inline-block">OUR</span>
        <span data-giant-word="right" className="inline-block">GARDENS</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 3: Browser check against `ribbon-grid-prototype.html`**

- 1440px: both vines draw with scroll and wrap around the media card. The card grows from 0.8 to 1.25 and its image drifts. "OUR" and "GARDENS" slide apart. The "Our approach" pill glides to Process.
- 390px: single column. Vines still draw, the media is full width with no scale, and the giant words stay static. There is no horizontal page scroll.
- Reduced motion: the vines are fully drawn, the media is at scale 1, and nothing moves.

- [ ] **Step 4: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/components/Intro.tsx
git commit -m "feat(intro): add scroll-drawn vine ribbon intro"
```

---

### Task 10: SelectedWork two-column grid

**Files:**
- Modify: `src/data/content.ts:421-473` (`WorkProject` + `workProjects`)
- Rewrite: `src/components/SelectedWork.tsx`
- Modify: `src/components/CursorBubble.tsx:30-39` (remove the dead "Drag" branch)

**Interfaces:**
- Consumes: `gsap`, `useGsap`, `MOTION_OK_QUERY`, `MOTION_QUERY`.
- Produces: `WorkProject = { label: string; place: string; image: string; tags: string[] }`.

- [ ] **Step 1: Add `tags` to `WorkProject` in `src/data/content.ts`**

```ts
export interface WorkProject {
  label: string;
  place: string;
  image: string;
  tags: string[];
}
```

Add a `tags` line to each existing entry, matched by `label`. Keep every other field as it is.

```ts
// "Courtyard garden"   →
    tags: ["Design", "Planting", "Irrigation"],
// "Rooftop deck"       →
    tags: ["Terrace", "Containers", "Drip watering"],
// "Patio planting"     →
    tags: ["Planting", "Pots", "Lighting"],
// "Kitchen garden"     →
    tags: ["Edibles", "Raised beds", "Compost"],
// "Lawn and borders"   →
    tags: ["Lawn & turf", "Borders", "Maintenance"],
// "Flower walk"        →
    tags: ["Borders", "Seasonal colour"],
// "Fountain lawn"      →
    tags: ["Lawn & turf", "Water feature"],
// "Stone path"         →
    tags: ["Hardscape", "Ground cover"],
// "Palm entrance"      →
    tags: ["Palms", "Entrance design", "Lighting"],
```

Run: `npx tsc --noEmit`
Expected: exit 0. A missing `tags` on any entry fails here.

- [ ] **Step 2: Replace `src/components/SelectedWork.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY, MOTION_QUERY } from "@/components/motion/reducedMotion";
import { workProjects, type WorkProject } from "@/data/content";

function WorkCard({ project }: { project: WorkProject }) {
  return (
    <article data-work-card className="group">
      <div
        data-work-frame
        className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#e4dece]"
      >
        <img
          data-work-img
          src={project.image}
          alt={project.label}
          className="absolute inset-x-0 -top-[10%] w-full h-[120%] object-cover will-change-transform transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
      </div>
      <div className="overflow-hidden mt-[22px]">
        <div
          data-work-line
          className="text-[13px] font-medium tracking-[0.06em] uppercase text-[#3c4a40]"
        >
          {[project.place, ...project.tags].join(" • ")}
        </div>
      </div>
      <h3 className="overflow-hidden mt-1.5 m-0 font-serif-bodoni font-normal text-[clamp(32px,3.4vw,58px)] leading-[1.05] tracking-[-0.015em]">
        <span data-work-line className="inline-block">
          {project.label}
          <span
            aria-hidden="true"
            className="inline-block ml-3.5 opacity-0 -translate-x-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0"
          >
            →
          </span>
        </span>
      </h3>
    </article>
  );
}

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const left = workProjects.filter((_, i) => i % 2 === 0);
  const right = workProjects.filter((_, i) => i % 2 === 1);

  useGsap(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      gsap.utils.toArray<HTMLElement>("[data-work-card]", root).forEach((card) => {
        const frame = card.querySelector<HTMLElement>("[data-work-frame]");
        const img = card.querySelector<HTMLElement>("[data-work-img]");
        const lines = card.querySelectorAll<HTMLElement>("[data-work-line]");

        gsap.fromTo(
          frame,
          { clipPath: "inset(12% 6% 0% 6% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          }
        );
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.from(lines, {
          yPercent: 100,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
      });
    });

    mm.add(MOTION_QUERY, () => {
      gsap.to("[data-work-col='right']", {
        y: -120,
        ease: "none",
        scrollTrigger: { trigger: "[data-work-grid]", start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }, sectionRef);

  return (
    <section id="work" ref={sectionRef} className="py-[16vh] px-[5vw]">
      <div className="flex justify-between items-end gap-6 mb-[10vh]">
        <h2 className="font-serif-bodoni font-normal text-[clamp(44px,6vw,92px)] leading-none m-0 tracking-[-0.015em]">
          Selected <i className="italic">work</i>
        </h2>
        <span className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e]">
          {workProjects.length} projects
        </span>
      </div>

      <div data-work-grid className="grid grid-cols-1 md:grid-cols-2 gap-x-[2.4vw] gap-y-[12vh]">
        <div data-work-col="left" className="flex flex-col gap-[12vh]">
          {left.map((project) => (
            <WorkCard key={project.label} project={project} />
          ))}
        </div>
        <div data-work-col="right" className="flex flex-col gap-[12vh] md:mt-[22vh]">
          {right.map((project) => (
            <WorkCard key={project.label} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

The header shows the project count instead of the prototype's "2024 — 2026" label, because the data has no dates. Cards have no click target, so there is no `cursor-pointer`.

- [ ] **Step 3: Remove the dead "Drag" branch in `CursorBubble.tsx`**

The wheel's `[data-wcard]` cards no longer exist. Replace old lines 30–42:

```tsx
      const interactiveCard = target.closest("[data-wcard], [data-pop], #popular .group, #popular [style*='perspective']");
      const isButtonOrLink = target.closest("button, a, input, textarea");

      if (interactiveCard && !isButtonOrLink) {
        ts = 1;
        if (target.closest("[data-wcard]")) {
          setBubbleText("Drag");
        } else {
          setBubbleText("View →");
        }
      } else {
        ts = 0;
      }
```

with:

```tsx
      const interactiveCard = target.closest("[data-pop], #popular .group");
      const isButtonOrLink = target.closest("button, a, input, textarea");

      ts = interactiveCard && !isButtonOrLink ? 1 : 0;
```

Then remove the `bubbleText` state. Delete `const [bubbleText, setBubbleText] = useState("View →");`, change the import to `import { useEffect, useRef } from "react";`, and replace `{bubbleText}` in the JSX with `View →`.

- [ ] **Step 4: Invariant check**

Run: `grep -rn "requestAnimationFrame\|cancelAnimationFrame\|data-wcard\|addEventListener(\"scroll\"" src/components`
Expected: no output.

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: exit 0.

- [ ] **Step 6: Browser check against `ribbon-grid-prototype.html`**

- 1440px: two columns. The right column starts lower and drifts up.
- Images open with a clip reveal and drift inside their frame.
- The tag line and title rise in.
- On hover the image zooms and the arrow slides in.
- Header "Work" glides here.
- 390px: one column with no offset.
- Reduced motion: all images are fully open, and the text is visible and static.
- The catalog cursor bubble still shows "View →" over catalog images.

- [ ] **Step 7: Commit**

```bash
cd /home/vinay && git add yuva-garden-next/src/data/content.ts yuva-garden-next/src/components/SelectedWork.tsx yuva-garden-next/src/components/CursorBubble.tsx
git commit -m "feat(work): replace wheel carousel with two-column work grid"
```

---

### Task 11: Full verification

**Files:** none changed unless a check fails. Fix the failing check in the file of the task that owns it, then re-run this task.

- [ ] **Step 1: Static checks**

Run: `cd /home/vinay/yuva-garden-next && npx tsc --noEmit && npm run lint && npm run build`
Expected: all exit 0, and the build reports `/` as generated.

- [ ] **Step 2: Invariants**

Run:

```bash
grep -rn 'addEventListener("scroll"\|requestAnimationFrame\|next/link' src
grep -rn "scroll-smooth\|scroll-behavior" src
```

Expected: no output from either.

- [ ] **Step 3: End-to-end browser pass**

Run `npm run start` (production build), then work through the list at 1440×900, 1280×720 and 390×844:
- Preloader, then the Hero wheel scrub, then smooth scroll takes over.
- Intro vine, Services fold, Process fold, Catalog category fold (including the search rebuild), and the Work grid all match the prototypes.
- Every anchor link: header (desktop and mobile), footer, Nursery CTA and Intro pill.
- The console has no errors or warnings from GSAP or React.
- Repeat the whole pass with DevTools → Rendering → `prefers-reduced-motion: reduce`. Everything is static, readable and reachable.

- [ ] **Step 4: Report**

Report the result of each check (pass, or fail with the output) to the user. Then clean up the companion server: `bash /home/vinay/.claude/plugins/cache/claude-plugins-official/superpowers/6.4.1/skills/brainstorming/scripts/stop-server.sh /home/vinay/yuva-garden-next/.superpowers/brainstorm/350140-1791304877`
