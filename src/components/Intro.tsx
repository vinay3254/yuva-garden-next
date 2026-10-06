"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY, MOTION_QUERY } from "@/components/motion/reducedMotion";

type Point = [number, number];

// Smooth curve through points (Catmull-Rom converted to cubic Béziers).
function smoothPath(points: Point[]) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1] ?? points[i];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[i + 2] ?? points[i + 1];
    d += ` C${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`;
  }
  return d;
}

// One continuous vine, laid out from the media card's real position: it drops in
// from the top, wraps around the card, sweeps right and ends inside the section.
function vinePath(section: HTMLElement, media: HTMLElement, mediaScale: number) {
  const W = section.clientWidth;
  const x = media.offsetLeft;
  const y = media.offsetTop;
  const w = media.offsetWidth * mediaScale;
  const h = media.offsetHeight * mediaScale;
  const pad = Math.min(90, W * 0.05);
  const clampX = (v: number) => Math.min(W - pad, Math.max(pad, v));

  const points: Point[] = [
    [clampX(x + w * 0.62), -40],
    [clampX(x + w * 0.5), y - pad * 0.9],
    [clampX(x - pad * 0.6), y + h * 0.35],
    [clampX(x + w * 0.28), y + h + pad * 0.8],
    [clampX(x + w + pad * 1.4), y + h * 0.45],
    [clampX(W * 0.8), y + h * 0.12],
    [clampX(W - pad), y + h * 0.62],
  ];
  return { d: smoothPath(points), W, H: section.clientHeight };
}

export default function Intro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const section = sectionRef.current;
    const svg = section?.querySelector<SVGSVGElement>("[data-vine-svg]");
    const path = section?.querySelector<SVGPathElement>("[data-vine]");
    const media = section?.querySelector<HTMLElement>("[data-intro-media]");
    if (!section || !svg || !path || !media) return;

    const layoutVine = () => {
      // The card grows to 1.25x on desktop motion; wrap the vine around its final size.
      const scale = window.matchMedia(MOTION_QUERY).matches ? 1.25 : 1;
      const { d, W, H } = vinePath(section, media, scale);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      path.setAttribute("d", d);
    };
    layoutVine();
    ScrollTrigger.addEventListener("refreshInit", layoutVine);

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      // pathLength={1} on the path, so dash units are 0..1 at any rendered size.
      gsap.fromTo(
        path,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 85%", end: "bottom 75%", scrub: 1 },
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

    return () => ScrollTrigger.removeEventListener("refreshInit", layoutVine);
  }, sectionRef);

  return (
    <section ref={sectionRef} className="relative pt-[12vh] pb-[8vh] px-[5vw] overflow-x-clip">
      <svg
        data-vine-svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] w-full h-full overflow-visible"
      >
        <path
          data-vine
          pathLength={1}
          fill="none"
          stroke="#6f9f5a"
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
