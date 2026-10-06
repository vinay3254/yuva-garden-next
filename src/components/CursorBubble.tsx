"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { HOVER_MOTION_QUERY } from "@/components/motion/reducedMotion";

export default function CursorBubble() {
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const b = bubbleRef.current;
    if (!b) return;
    const mm = gsap.matchMedia();
    mm.add(HOVER_MOTION_QUERY, () => {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let tx = x;
      let ty = y;
      let s = 0;
      let ts = 0;

      const onPointerMove = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;

        const target = e.target as HTMLElement | null;
        if (!target) return;

        const interactiveCard = target.closest<HTMLElement>("[data-cursor]");
        ts = interactiveCard ? 1 : 0;
        const label = interactiveCard?.dataset.cursor ?? "View →";
        if (b.textContent !== label) b.textContent = label;
      };
      const onLeave = () => {
        ts = 0;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);

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
        document.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("blur", onLeave);
        gsap.ticker.remove(loop);
        b.style.transform = "scale(0)";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={bubbleRef}
      aria-hidden="true"
      className="fixed left-0 top-0 w-[88px] h-[88px] -ml-[44px] -mt-[44px] rounded-full bg-[#1b2a1f] text-[#f4f1ea] flex items-center justify-center font-sans-hanken font-semibold text-[13px] tracking-wider pointer-events-none z-[150] will-change-transform shadow-xl"
      style={{ transform: "scale(0)" }}
    >
      View →
    </div>
  );
}
