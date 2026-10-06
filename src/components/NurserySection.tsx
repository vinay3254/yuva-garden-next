"use client";

import { useEffect, useMemo } from "react";
import { corridorImageIds, unsplashUrl } from "@/data/content";

export default function NurserySection() {
  // Generate the keyframes mathematically
  useEffect(() => {
    const P = {
      perspective: 30,
      cardHeight: 25,
      birthHeight: 2.6,
      exitHeight: 46,
      railBirth: -11,
      railExit: 44,
      fan: 3.3,
      turnBirth: 6,
      turnExit: 28,
      stops: 24,
    };

    const makeKeyframes = (dir: number, name: string) => {
      const steps: string[] = [];
      for (let i = 0; i <= P.stops; i++) {
        const u = i / P.stops;
        const scale =
          (P.birthHeight / P.cardHeight) *
          Math.pow(P.exitHeight / P.birthHeight, u);
        const z = P.perspective * (1 - 1 / scale);
        const rail =
          P.railExit - (P.railExit - P.railBirth) * Math.pow(1 - u, P.fan);
        const turn = P.turnBirth + (P.turnExit - P.turnBirth) * u;
        steps.push(
          `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(
            2
          )}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`
        );
      }
      return `@keyframes ${name}{${steps.join("")}}`;
    };

    const styleEl = document.createElement("style");
    styleEl.id = "yg-corridor-keyframes";
    styleEl.textContent =
      makeKeyframes(1, "yg-r") +
      makeKeyframes(-1, "yg-l") +
      "@media(prefers-reduced-motion:reduce){.yg-corr-card{animation-play-state:paused!important}}";
    document.head.appendChild(styleEl);

    return () => {
      const existing = document.getElementById("yg-corridor-keyframes");
      if (existing) existing.remove();
    };
  }, []);

  const corridorCards = useMemo(() => {
    const N = 9;
    const speed = 18;
    const cards: { img: string; anim: string; delay: string; key: string }[] = [];

    ["yg-r", "yg-l"].forEach((animName) => {
      for (let i = 0; i < N; i++) {
        cards.push({
          key: `${animName}-${i}`,
          img: unsplashUrl(corridorImageIds[i % corridorImageIds.length], 500),
          anim: `${animName} ${speed}s linear infinite`,
          delay: `${(-(i * speed) / N).toFixed(2)}s`,
        });
      }
    });

    return cards;
  }, []);

  return (
    <section
      id="nursery"
      aria-label="Nursery"
      className="relative h-screen min-h-[560px] overflow-hidden bg-[#1b2a1f] [container-type:inline-size]"
    >
      {/* 3D Perspective Flight Corridor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none [perspective:30cqw] [perspective-origin:50%_55%]"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {corridorCards.map((card) => (
            <div
              key={card.key}
              className="yg-corr-card absolute left-1/2 top-[55%] w-[18cqw] h-[25cqw] -ml-[9cqw] -mt-[12.5cqw] rounded-[0.4cqw] overflow-hidden [backface-visibility:hidden] shadow-2xl"
              style={{
                animation: card.anim,
                animationDelay: card.delay,
              }}
            >
              <img
                src={card.img}
                alt=""
                draggable={false}
                className="w-full h-full object-cover block"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Center Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_38%_46%_at_50%_52%,rgba(27,42,31,0.92)_0%,rgba(27,42,31,0.6)_55%,rgba(27,42,31,0)_100%)] pointer-events-none" />

      {/* Central Announcement */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-7 text-center text-[#f4f1ea] px-6">
        <div className="text-xs md:text-[13px] font-semibold tracking-[0.2em] uppercase text-[#c9b88a]">
          The nursery
        </div>
        <h2 className="font-serif-bodoni font-normal text-[clamp(44px,6.4vw,104px)] leading-none m-0 tracking-[-0.02em] drop-shadow-lg">
          Hundreds of plants,
          <br />
          <i className="italic">one place.</i>
        </h2>
        <a
          href="#contact"
          className="bg-[#f4f1ea] text-[#1b2a1f] px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-[#c9b88a] hover:scale-105 active:scale-95 shadow-xl mt-2"
        >
          Ask what&apos;s in stock ↓
        </a>
      </div>
    </section>
  );
}
