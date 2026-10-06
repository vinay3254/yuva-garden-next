"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { corridorImageIds, unsplashUrl } from "@/data/content";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import {
  HOVER_MOTION_QUERY,
  MOTION_OK_QUERY,
} from "@/components/motion/reducedMotion";

const plantCards = [-1, 1].flatMap((side) =>
  Array.from({ length: 6 }, (_, index) => ({
    side,
    index,
    image: unsplashUrl(
      corridorImageIds[
        (index + (side === 1 ? 3 : 0)) % corridorImageIds.length
      ],
      600,
    ),
  })),
);

export default function NurserySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK_QUERY, () => {
      const cards = root.querySelectorAll<HTMLElement>("[data-nursery-card]");
      const render = (progress: number) => {
        cards.forEach((card, index) => {
          const side = plantCards[index].side;
          const distance = (plantCards[index].index / 6 + progress * 0.8) % 1;
          const scale = 0.15 * Math.pow(12, distance);
          const rail = 7 + 65 * Math.pow(distance, 1.7);
          const depth = 40 * (1 - 1 / scale);
          card.style.transform = `translate3d(${side * rail}cqw, ${Math.sin(distance * Math.PI) * -3}cqw, ${depth}cqw) rotateY(${-side * (8 + distance * 24)}deg) rotateZ(${side * distance * 6}deg)`;
          card.style.opacity = String(
            Math.min(1, distance * 8, (1 - distance) * 8),
          );
        });
      };
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
      render(trigger.progress);
      return () =>
        cards.forEach((card) => {
          card.style.removeProperty("transform");
          card.style.removeProperty("opacity");
        });
    });

    mm.add(HOVER_MOTION_QUERY, () => {
      const rig = root.querySelector<HTMLElement>("[data-nursery-rig]");
      if (!rig) return;
      const x = gsap.quickTo(rig, "rotationY", {
        duration: 1,
        ease: "power3.out",
      });
      const y = gsap.quickTo(rig, "rotationX", {
        duration: 1,
        ease: "power3.out",
      });
      const move = (event: PointerEvent) => {
        x((event.clientX / window.innerWidth - 0.5) * 5);
        y(-(event.clientY / window.innerHeight - 0.5) * 4);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    });
  }, sectionRef);

  return (
    <section
      id="nursery"
      ref={sectionRef}
      aria-label="Nursery"
      className="nursery-world relative bg-[#16251b] text-[#f4f1ea]"
    >
      <div className="nursery-stage sticky top-0 min-h-[600px] overflow-hidden [container-type:inline-size]">
        <div
          aria-hidden="true"
          className="absolute inset-0 [perspective:40cqw] [perspective-origin:50%_50%]"
        >
          <div
            data-nursery-rig
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            {plantCards.map((card) => (
              <div
                key={`${card.side}-${card.index}`}
                data-nursery-card
                data-side={card.side}
                className="nursery-flight-card absolute left-1/2 top-1/2 -ml-[9cqw] -mt-[12cqw] h-[24cqw] w-[18cqw] overflow-hidden rounded-[12px] border border-white/15 bg-[#2c4431] shadow-2xl [backface-visibility:hidden]"
              >
                <img
                  src={card.image}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_38%_55%_at_50%_50%,#16251b_0%,rgba(22,37,27,0.85)_45%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#16251b] via-transparent to-[#16251b]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-6 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9b88a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b7cc96]" /> Rooted in
            possibility
          </span>
          <h2 className="m-0 font-serif-bodoni text-[clamp(48px,6.4vw,104px)] font-normal leading-[1.02] tracking-[-0.025em]">
            Hundreds of plants,
            <br />
            <i>one place.</i>
          </h2>
          <p className="m-0 max-w-[290px] text-sm leading-relaxed text-[#e9e4d8]/80">
            Meet your next little green companion.
            <br />
            Grown with care in our Bangalore nursery.
          </p>
          <a
            data-magnetic
            href="#contact"
            className="mt-2 rounded-full bg-[#f4f1ea] px-7 py-4 text-sm font-semibold text-[#1b2a1f]"
          >
            <span
              data-magnetic-inner
              className="inline-flex items-center gap-5"
            >
              Explore the nursery <ArrowUpRight size={18} />
            </span>
          </a>
        </div>
        <div className="absolute inset-x-[5vw] bottom-24 z-10 flex justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9b88a] md:bottom-8">
          <span>Bettahalsur · Bangalore</span>
          <span>Keep growing ↓</span>
        </div>
      </div>
    </section>
  );
}
