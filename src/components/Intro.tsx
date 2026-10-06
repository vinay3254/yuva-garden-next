"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY } from "@/components/motion/reducedMotion";

function layoutRibbon(section: HTMLElement, media: HTMLElement) {
  const sectionBounds = section.getBoundingClientRect();
  const mediaBounds = media.getBoundingClientRect();
  const width = section.clientWidth;
  const x = mediaBounds.left - sectionBounds.left;
  const y = mediaBounds.top - sectionBounds.top;
  const w = mediaBounds.width;
  const h = mediaBounds.height;
  const pad = Math.max(20, width * 0.025);

  // The frame stays fixed. The ribbon uses its actual bounds at every resize.
  // The image pans inside that frame, so both layers keep their alignment.
  const desktop = width >= 768;
  const tailX = width * 0.84;
  const tailY = desktop ? y + h * 0.76 : y + h + pad * 2.5;
  const d = desktop
    ? `M ${x + w * 0.5} -60
       C ${x + w * 0.32} ${y - 180}, ${x + w * 0.68} ${y - 90}, ${x + w * 0.63} ${y + h * 0.12}
       C ${x + w * 0.68} ${y + h * 0.62}, ${x + w * 0.59} ${y + h + pad}, ${x + w * 0.28} ${y + h + pad}
       C ${x - pad * 1.2} ${y + h + pad}, ${x - pad * 1.35} ${y + h * 0.3}, ${x - pad * 0.15} ${y + h * 0.1}
       C ${x + w * 0.18} ${y - pad * 1.5}, ${x + w * 0.77} ${y - pad * 1.6}, ${x + w * 1.1} ${y - pad * 0.05}
       C ${width * 0.64} ${y + h * 0.18}, ${width * 0.65} ${y + h * 0.9}, ${width * 0.74} ${y + h * 0.88}
       C ${width * 0.78} ${y + h * 0.9}, ${width * 0.81} ${tailY}, ${tailX} ${tailY}`
    : `M ${width * 0.99} -40
       C ${width * 0.97} ${y * 0.28}, ${width * 0.99} ${y * 0.74}, ${x + w * 0.85} ${y + h * 0.15}
       C ${x + w * 0.9} ${y + h * 0.9}, ${x + w * 0.3} ${y + h + pad}, ${x + w * 0.12} ${y + h + pad}
       C ${x - pad * 0.3} ${y + h + pad}, ${x - pad * 0.2} ${y + h * 0.25}, ${x + w * 0.2} ${y - pad}
       C ${x + w * 0.78} ${y - pad * 2}, ${x + w * 1.02} ${y + h * 0.65}, ${tailX} ${tailY}`;

  return { d, width, height: section.clientHeight };
}

export default function Intro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const section = sectionRef.current;
    const svg = section?.querySelector<SVGSVGElement>("[data-vine-svg]");
    const path = section?.querySelector<SVGPathElement>("[data-vine]");
    const media = section?.querySelector<HTMLElement>("[data-intro-media]");
    if (!section || !svg || !path || !media) return;
    const showcase = section.closest("[data-garden-showcase]");
    const firstWorkRow =
      showcase?.querySelector<HTMLElement>("[data-work-row]");
    const workHeading = showcase?.querySelector<HTMLElement>(
      "[data-work-heading]",
    );

    const layout = () => {
      const ribbon = layoutRibbon(section, media);
      svg.setAttribute("viewBox", `0 0 ${ribbon.width} ${ribbon.height}`);
      path.setAttribute("d", ribbon.d);
    };
    layout();
    ScrollTrigger.addEventListener("refreshInit", layout);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK_QUERY, () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "garden-intro",
          trigger: section,
          endTrigger: firstWorkRow ?? media,
          start: "top 85%",
          // The ribbon hands off at the exact point the first project pair enters.
          end: firstWorkRow ? "top 95%" : "bottom 85%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
      // pathLength=1 needs fractional dash values to draw without pixel snapping.
      timeline.fromTo(
        path,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, autoRound: false, duration: 0.85, ease: "none" },
        0,
      );
      timeline.fromTo(
        "[data-intro-heading]",
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        "[data-intro-copy]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        0.12,
      );
      timeline.fromTo(
        "[data-intro-img]",
        { yPercent: -6, scale: 1.06 },
        { yPercent: 6, scale: 1, duration: 1, ease: "none" },
        0,
      );
      if (workHeading) {
        timeline.fromTo(
          workHeading,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
          0.8,
        );
      }
    });

    // Width, font and content changes all update the same scene geometry.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(section);
    observer.observe(media);
    if (firstWorkRow) observer.observe(firstWorkRow);
    if (workHeading) observer.observe(workHeading);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("refreshInit", layout);
    };
  }, sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="garden-intro relative overflow-hidden bg-[#f4f1ea] px-[5vw]"
    >
      <svg
        data-vine-svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id="garden-ribbon-color"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="50%"
          >
            <stop offset="0%" stopColor="#3f743b" />
            <stop offset="55%" stopColor="#6d9b52" />
            <stop offset="100%" stopColor="#96b975" />
          </linearGradient>
        </defs>
        <path
          data-vine
          pathLength={1}
          fill="none"
          stroke="url(#garden-ribbon-color)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div data-intro-heading className="relative z-10 mb-[7vw]">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b5a2e]">
          Rooted in Bangalore
        </p>
        <h2 className="m-0 max-w-[1100px] font-serif-bodoni text-[clamp(52px,8.8vw,150px)] font-normal leading-[0.98] tracking-[-0.04em]">
          Good things
          <br />
          <i>take root.</i>
        </h2>
      </div>

      <div className="intro-layout relative z-10">
        <div
          data-intro-media
          className="intro-media relative aspect-video overflow-hidden rounded-[20px] bg-[#d5dfc6]"
        >
          <img
            data-intro-img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80"
            alt="Young seedlings being grown with care in the nursery"
            loading="lazy"
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#567d3d]/25 mix-blend-multiply"
          />
        </div>
        <div data-intro-copy className="intro-copy relative">
          <p className="m-0 max-w-[680px] text-[clamp(20px,1.65vw,32px)] leading-[1.5] tracking-[-0.02em]">
            From a few pots on a balcony to a full landscape, we grow the plants
            and do the work — design, planting and the care that keeps a garden
            alive year after year.
          </p>
          <a
            data-magnetic
            href="#work"
            className="intro-cta mt-10 inline-flex rounded-full bg-white px-7 py-4 text-[14px] font-semibold uppercase shadow-[0_5px_15px_rgba(27,42,31,0.08)] md:mt-[4vw]"
          >
            <span
              data-magnetic-inner
              className="inline-flex items-center gap-4"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#1b2a1f]"
              />
              Our gardens
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
