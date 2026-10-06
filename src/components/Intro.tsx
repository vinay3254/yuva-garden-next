"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY, MOTION_QUERY } from "@/components/motion/reducedMotion";

// Original vine paths (viewBox 0 0 1600 1600), approved in ribbon-grid-prototype.html.
const VINE_TOP =
  "M420 -40 C 520 120, 560 260, 560 380 C 560 470, 470 520, 300 540 C 80 565, 20 720, 120 820 C 230 930, 520 900, 760 760 C 980 630, 1080 560, 1200 700 C 1320 840, 1350 960, 1470 930 C 1560 905, 1600 860, 1620 820";
const VINE_BOTTOM =
  "M-40 1180 C 200 1060, 420 1120, 520 1240 C 620 1360, 820 1380, 980 1250 C 1120 1140, 1280 1120, 1400 1220 C 1480 1290, 1540 1380, 1640 1400";

export default function Intro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      // pathLength={1} on each path, so dash units are 0..1 at any rendered size.
      gsap.fromTo(
        "[data-vine='top']",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "center 40%", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-vine='bottom']",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 10%", end: "bottom 60%", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-intro-img]",
        { yPercent: -12 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-intro-media]", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    mm.add(MOTION_QUERY, () => {
      gsap.fromTo(
        "[data-intro-media]",
        { scale: 0.8, borderRadius: 28 },
        {
          scale: 1.25,
          borderRadius: 16,
          ease: "none",
          scrollTrigger: { trigger: "[data-intro-media]", start: "top 90%", end: "bottom 20%", scrub: 1 },
        }
      );
      const giant = { trigger: "[data-giant]", start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-giant-word='left']", { xPercent: 12 }, { xPercent: -4, ease: "none", scrollTrigger: giant });
      gsap.fromTo("[data-giant-word='right']", { xPercent: -12 }, { xPercent: 4, ease: "none", scrollTrigger: giant });
    });
  }, sectionRef);

  return (
    <section ref={sectionRef} className="relative pt-[12vh] pb-[8vh] px-[5vw] overflow-x-clip">
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 1600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[2] w-full h-full overflow-visible"
      >
        <path
          data-vine="top"
          pathLength={1}
          d={VINE_TOP}
          fill="none"
          stroke="#7fae68"
          strokeWidth={34}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-vine="bottom"
          pathLength={1}
          d={VINE_BOTTOM}
          fill="none"
          stroke="#5f8f4e"
          strokeWidth={34}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-[3] grid grid-cols-1 md:grid-cols-2 gap-[6vw]">
        <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] self-start">
          About us
        </div>
        <div>
          <p className="m-0 text-[clamp(20px,1.7vw,28px)] leading-[1.45] text-balance">
            From a few pots on a balcony to a full landscape, we grow the plants and do the
            work — design, planting and the care that keeps a garden alive year after year.
          </p>
          <a
            href="#process"
            className="mt-10 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-[15px] font-semibold tracking-[0.04em] uppercase shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#1b2a1f]" />
            Our approach
          </a>
        </div>
      </div>

      <div
        data-intro-media
        className="relative z-[4] mt-[10vh] w-full md:w-[44vw] aspect-video rounded-[20px] overflow-hidden origin-top-left will-change-transform"
      >
        <img
          data-intro-img
          src="https://images.unsplash.com/photo-1597868165956-03a6827955b1?auto=format&fit=crop&w=1600&q=75"
          alt="Planting a seedling into fertile soil"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-[#5f8f4e] mix-blend-multiply opacity-55" />
      </div>

      <div
        data-giant
        aria-hidden="true"
        className="relative z-[1] mt-[14vh] flex justify-between gap-[4vw] whitespace-nowrap font-serif-bodoni text-[clamp(56px,10.5vw,190px)] leading-[0.9] tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(27,42,31,0.18)]"
      >
        <span data-giant-word="left" className="inline-block">OUR</span>
        <span data-giant-word="right" className="inline-block">GARDENS</span>
      </div>
    </section>
  );
}
