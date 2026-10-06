"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION_OK_QUERY } from "./reducedMotion";

type ScrollTo = (target: number | string | HTMLElement) => void;
const ScrollContext = createContext<ScrollTo>(() => {});
export const useSmoothScroll = () => useContext(ScrollContext);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTo = useCallback<ScrollTo>((target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target);
      return;
    }
    if (typeof target === "number") window.scrollTo({ top: target });
    else {
      const element =
        typeof target === "string" ? document.querySelector(target) : target;
      element?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK_QUERY, () => {
      const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -80 } });
      lenisRef.current = lenis;
      const tick = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>
  );
}
