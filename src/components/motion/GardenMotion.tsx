"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useGsap } from "./useGsap";
import { HOVER_MOTION_QUERY, MOTION_OK_QUERY } from "./reducedMotion";

export default function GardenMotion() {
  const markerRef = useRef<HTMLSpanElement | null>(null);

  useGsap(() => {
    const root = markerRef.current?.closest("main");
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });
    });

    mm.add(HOVER_MOTION_QUERY, () => {
      const cleanup: (() => void)[] = [];
      root
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((button) => {
          const inner = button.querySelector<HTMLElement>(
            "[data-magnetic-inner]",
          );
          if (!inner) return;
          const x = gsap.quickTo(inner, "x", {
            duration: 0.5,
            ease: "power3.out",
          });
          const y = gsap.quickTo(inner, "y", {
            duration: 0.5,
            ease: "power3.out",
          });
          const move = (event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            x((event.clientX - bounds.left - bounds.width / 2) * 0.12);
            y((event.clientY - bounds.top - bounds.height / 2) * 0.2);
          };
          const reset = () => {
            x(0);
            y(0);
          };
          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", reset);
          cleanup.push(() => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", reset);
          });
        });
      return () => cleanup.forEach((remove) => remove());
    });

    // Fonts change section heights after hydration. Refresh once they settle.
    let active = true;
    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
    };
  }, markerRef);

  return <span ref={markerRef} hidden aria-hidden="true" />;
}
