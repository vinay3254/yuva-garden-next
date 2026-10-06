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
