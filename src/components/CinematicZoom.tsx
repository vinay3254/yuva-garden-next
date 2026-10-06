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

  return (
    <section ref={containerRef} className="h-[250vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Dynamic Zooming & Clipping Frame */}
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
          style={{ clipPath: "inset(0% 0% round 0px)" }}
        >
          <img
            ref={imgRef}
            src="https://images.unsplash.com/photo-1595387426463-bef727e35bb3?auto=format&fit=crop&w=2200&q=72"
            alt="Lush estate lawn and trees around a serene water fountain"
            className="w-full h-full object-cover will-change-transform"
            style={{ transform: "scale(1.25)" }}
          />
          <div className="absolute inset-0 bg-[#0f1611]/30" />
        </div>

        {/* Center Typography */}
        <div
          ref={txtRef}
          className="relative text-center text-[#f4f1ea] px-[5vw] transition-opacity"
        >
          <div className="text-xs md:text-[13px] font-semibold tracking-[0.2em] uppercase mb-5 text-[#e9e4d8]">
            Bettahalsur · Bangalore
          </div>
          <p className="font-serif-bodoni text-[clamp(40px,6.5vw,104px)] leading-none m-0 tracking-[-0.02em]">
            Made for Bangalore&apos;s
            <br />
            <i className="italic">sun and rain.</i>
          </p>
        </div>

        {/* Caption Reveal */}
        <div
          ref={capRef}
          className="absolute left-[5vw] right-[5vw] bottom-[6vh] flex justify-between gap-4 text-xs md:text-[13px] font-semibold tracking-[0.14em] uppercase text-[#1b2a1f] opacity-0 transition-opacity"
        >
          <span>Plants that suit the climate</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
