"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/components/motion/gsap";

export default function CursorBubble() {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [bubbleText, setBubbleText] = useState("View →");

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const b = bubbleRef.current;
    if (!b) return;

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
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

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
  }, []);

  return (
    <div
      ref={bubbleRef}
      className="fixed left-0 top-0 w-[88px] h-[88px] -ml-[44px] -mt-[44px] rounded-full bg-[#1b2a1f] text-[#f4f1ea] flex items-center justify-center font-sans-hanken font-semibold text-[13px] tracking-wider pointer-events-none z-[150] scale-0 will-change-transform shadow-xl"
    >
      {bubbleText}
    </div>
  );
}
