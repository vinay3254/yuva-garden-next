"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY } from "@/components/motion/reducedMotion";

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useGsap(() => {
    const loader = loaderRef.current;
    if (!loader) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK_QUERY, () => {
      const counter = { value: 0 };
      const timeline = gsap.timeline();
      timeline.to(counter, {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = String(Math.round(counter.value));
        },
      });
      timeline.fromTo(
        "[data-loader-image]",
        { clipPath: "inset(50% 50% round 18px)", scale: 0.9 },
        {
          clipPath: "inset(0% 0% round 18px)",
          scale: 1,
          duration: 1.1,
          ease: "expo.inOut",
        },
        0,
      );
      timeline.to(
        "[data-loader-bar]",
        { scaleX: 1, duration: 1.1, ease: "power2.inOut" },
        0,
      );
      timeline.to(
        loader,
        {
          yPercent: -105,
          borderBottomLeftRadius: "45% 12vh",
          borderBottomRightRadius: "45% 12vh",
          duration: 0.95,
          ease: "expo.inOut",
        },
        1.2,
      );
      timeline.set(loader, { display: "none" });
    });
  }, loaderRef);

  return (
    <div
      ref={loaderRef}
      data-intro-loader
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] box-border flex select-none flex-col justify-between overflow-hidden bg-[#f4f1ea] p-[28px_5vw] text-[#1b2a1f]"
    >
      <div className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.14em] md:text-xs">
        <span className="font-serif-bodoni text-xl font-normal normal-case tracking-normal md:text-2xl">
          Yuva Garden Group
        </span>
        <span className="text-[#6b5a2e]">Bettahalsur · Bangalore</span>
      </div>
      <div
        data-loader-image
        className="absolute left-1/2 top-1/2 aspect-[4/5] w-[min(48vw,300px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px]"
        style={{ clipPath: "inset(50% 50% round 18px)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=70"
          alt=""
          className="block h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10 flex items-end justify-between gap-4">
        <span className="pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b5a2e] md:pb-[2vw] md:text-xs">
          Growing your garden
        </span>
        <span className="flex items-start font-serif-bodoni text-[clamp(96px,17vw,260px)] leading-[0.8] tracking-[-0.04em]">
          <span ref={countRef}>0</span>
          <span className="ml-[0.05em] mt-[0.12em] text-[0.3em]">%</span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#e2dccd]">
        <div
          data-loader-bar
          className="h-full origin-left bg-[#1b2a1f]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
