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
