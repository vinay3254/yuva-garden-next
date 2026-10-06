"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/components/motion/gsap";

export default function Preloader() {
  const [percent, setPercent] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [exiting, setExiting] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t0 = performance.now();
    const MIN_DURATION = 1600;
    let shown = 0;
    let done = false;

    const frame = () => {
      // Calculate progress based on time and image ready states
      const elapsed = (performance.now() - t0) / MIN_DURATION;
      const timeProgress = Math.min(1, elapsed);
      const goal = timeProgress * 100;

      shown += (goal - shown) * 0.1;
      if (goal >= 100 && shown > 99.2) shown = 100;

      const v = Math.floor(shown);
      setPercent(v);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${shown / 100})`;
      }

      if (imgRef.current) {
        const k = 50 - shown * 0.5 * 0.82;
        imgRef.current.style.clipPath = `inset(${k.toFixed(2)}% ${k.toFixed(2)}% ${k.toFixed(2)}% ${k.toFixed(2)}% round 18px)`;
      }

      if (shown >= 100 && !done) {
        done = true;
        gsap.ticker.remove(frame);
        setTimeout(exit, 240);
      }
    };

    const exit = () => {
      setExiting(true);
      if (imgRef.current) {
        imgRef.current.style.transition =
          "clip-path 1s cubic-bezier(0.76,0,0.24,1), width 1s cubic-bezier(0.76,0,0.24,1)";
        imgRef.current.style.clipPath = "inset(0% 0% 0% 0% round 18px)";
      }

      setTimeout(() => {
        const L = loaderRef.current;
        if (L) {
          L.style.transition =
            "transform 1.2s cubic-bezier(0.76,0,0.24,1), border-radius 1.2s cubic-bezier(0.76,0,0.24,1)";
          L.style.borderBottomLeftRadius = "50% 14vh";
          L.style.borderBottomRightRadius = "50% 14vh";
          L.style.transform = "translateY(-105%)";
        }
        setTimeout(() => {
          setHidden(true);
        }, 1250);
      }, 550);
    };

    gsap.ticker.add(frame);

    return () => gsap.ticker.remove(frame);
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={loaderRef}
      className={`fixed inset-0 z-[200] bg-[#f4f1ea] text-[#1b2a1f] flex flex-col justify-between p-[28px_5vw] box-border overflow-hidden select-none will-change-transform ${
        exiting ? "pointer-events-none" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center gap-4 text-xs md:text-[13px] font-semibold tracking-[0.14em] uppercase">
        <span className="font-serif-bodoni text-xl md:text-2xl tracking-[0.01em] lowercase capitalize font-normal">
          Yuva Garden Group
        </span>
        <span className="text-[#6b5a2e]">Bettahalsur · Bangalore</span>
      </div>

      {/* Center Reveal Image */}
      <div
        ref={imgRef}
        className="absolute left-1/2 top-1/2 w-[min(34vw,420px)] aspect-[4/5] -translate-x-1/2 -translate-y-1/2 rounded-[18px] overflow-hidden will-change-[clip-path] shadow-2xl"
        style={{
          clipPath: "inset(50% 50% 50% 50% round 18px)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=70"
          alt="Young garden seedlings"
          className="w-full h-full object-cover block"
        />
      </div>

      {/* Bottom Counter & Status */}
      <div className="flex justify-between items-end gap-4 relative z-10">
        <span className="text-xs md:text-[13px] font-semibold tracking-[0.14em] uppercase text-[#6b5a2e] pb-2 md:pb-[2vw]">
          Growing your garden
        </span>
        <span className="font-serif-bodoni text-[clamp(96px,17vw,260px)] leading-[0.8] tracking-[-0.04em] flex items-start">
          <span>{percent}</span>
          <span className="text-[0.3em] mt-[0.12em] ml-[0.05em]">%</span>
        </span>
      </div>

      {/* Bottom Minimal Progress Line */}
      <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#e2dccd]">
        <div
          ref={barRef}
          className="h-full bg-[#1b2a1f] origin-left transition-transform duration-75"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
