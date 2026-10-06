"use client";

import { useEffect, useState, useRef } from "react";
import { growthStages, getWhatsAppUrl, DISPLAY_PHONE } from "@/data/content";

export default function Hero() {
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 1
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const numStages = growthStages.length;
  // Calculate active stage index
  const stageIndex = Math.min(
    numStages - 1,
    Math.max(0, Math.round(currentProgress * (numStages - 1)))
  );
  const activeStage = growthStages[stageIndex];

  useEffect(() => {
    let target = 0;
    let cur = 0;
    let rafId: number;

    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));

    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > 2) return;
      if (e.deltaY > 0 && target >= 1) return;
      if (e.deltaY < 0 && target <= 0) return;

      const dist = window.innerWidth < 760 ? 1200 : 2000;
      target = clamp(target + (e.deltaY * (e.deltaMode === 1 ? 40 : 1)) / dist, 0, 1);
      if (target > 0.01) setHasInteracted(true);
      if (target < 0.99) {
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", onWheel, { passive: false });
    }

    const loop = () => {
      cur += (target - cur) * 0.1;
      if (Math.abs(target - cur) < 0.001) cur = target;
      setCurrentProgress(cur);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      if (container) {
        container.removeEventListener("wheel", onWheel);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Title 1 fades out, Title 2 fades in
  const t1 = Math.max(0, 1 - currentProgress / 0.28);
  const t2 = Math.min(1, Math.max(0, (currentProgress - 0.72) / 0.28));

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative h-screen min-h-[560px] overflow-hidden bg-[#0f1611] select-none"
    >
      {/* 5 Growth Layers with Cross-Fade & Gentle Scale */}
      <div className="absolute inset-0 transform-gpu">
        {growthStages.map((stage, k) => {
          const factor = currentProgress * (numStages - 1);
          const opacity = k === 0 ? 1 : Math.min(1, Math.max(0, factor - k + 1));
          const scale = 1.18 - 0.18 * Math.min(1, Math.max(0, (factor - k + 1) / 2));

          return (
            <div
              key={stage.id}
              className="absolute inset-0 transition-opacity duration-300 ease-out will-change-[opacity,transform]"
              style={{ opacity }}
            >
              <img
                src={stage.img}
                alt={stage.alt}
                className="w-full h-full object-cover block will-change-transform"
                style={{ transform: `scale(${scale.toFixed(4)})` }}
              />
            </div>
          );
        })}
      </div>

      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1611]/55 via-transparent via-35% to-[#0f1611]/75 pointer-events-none" />

      {/* Title 1: "Gardens, designed and grown." */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center text-[#f4f1ea] px-6 pointer-events-none transition-all duration-300"
        style={{
          opacity: t1,
          transform: `translateY(${(1 - t1) * -30}px) scale(${0.96 + t1 * 0.04})`,
          filter: `blur(${(1 - t1) * 8}px)`,
        }}
      >
        <div className="text-xs md:text-[13px] font-semibold tracking-[0.22em] uppercase text-[#e9e4d8]">
          Yuva Garden Group · Bangalore
        </div>
        <h1 className="font-serif-bodoni font-normal text-[clamp(48px,8vw,128px)] leading-none tracking-[-0.02em] m-0 drop-shadow-md">
          Gardens, designed
          <br />
          <i className="italic">and grown.</i>
        </h1>
      </div>

      {/* Title 2: "From bare soil to your garden." with CTAs */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-7 text-center text-[#f4f1ea] px-6 transition-all duration-300"
        style={{
          opacity: t2,
          transform: `translateY(${(1 - t2) * 24}px) scale(${0.97 + t2 * 0.03})`,
          filter: `blur(${(1 - t2) * 6}px)`,
          pointerEvents: t2 > 0.8 ? "auto" : "none",
        }}
      >
        <p className="font-serif-bodoni text-[clamp(34px,5vw,80px)] leading-[1.05] m-0 tracking-[-0.015em] drop-shadow-md">
          From bare soil
          <br />
          <i className="italic">to your garden.</i>
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <a
            href="tel:+910000000000"
            className="bg-[#f4f1ea] text-[#1b2a1f] px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all hover:bg-[#d9cfb4] hover:scale-105 active:scale-95 shadow-lg"
          >
            Call us
          </a>
          <a
            href={getWhatsAppUrl("Hi Yuva Garden Group, I would like to enquire about your services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#f4f1ea] bg-[#1b2a1f]/40 backdrop-blur-xs text-[#f4f1ea] px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all hover:bg-[#f4f1ea] hover:text-[#1b2a1f] hover:scale-105 active:scale-95 shadow-lg"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom Stage Indicator */}
      <div className="absolute left-[5vw] bottom-[clamp(24px,6vh,48px)] flex items-baseline gap-3 text-[#f4f1ea] pointer-events-none z-10">
        <span className="font-serif-bodoni text-3xl font-medium">
          {activeStage.id}
        </span>
        <span className="text-xs md:text-[13px] font-semibold tracking-[0.18em] uppercase text-[#e9e4d8]">
          {activeStage.label}
        </span>
      </div>

      {/* Clickable Stage Dots for direct interaction */}
      <div className="absolute right-[5vw] bottom-[clamp(24px,6vh,48px)] flex items-center gap-2 z-10">
        {growthStages.map((stage, idx) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => setCurrentProgress(idx / (numStages - 1))}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === stageIndex
                ? "w-8 h-2 bg-[#c9b88a]"
                : "w-2 h-2 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Jump to stage ${stage.label}`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[clamp(24px,6vh,48px)] flex flex-col items-center gap-1.5 text-[#f4f1ea] text-xs font-semibold tracking-[0.3em] transition-opacity duration-500 pointer-events-none z-10 ${
          hasInteracted || currentProgress > 0.05 ? "opacity-0" : "opacity-90 animate-bounce"
        }`}
      >
        <span>SCROLL</span>
        <span className="text-sm">↓</span>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#f4f1ea]/20 z-10">
        <div
          className="h-full bg-[#c9b88a] origin-left transition-transform duration-75"
          style={{ transform: `scaleX(${currentProgress.toFixed(4)})` }}
        />
      </div>
    </section>
  );
}
