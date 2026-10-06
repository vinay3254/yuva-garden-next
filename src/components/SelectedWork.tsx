"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { MOTION_OK_QUERY, MOTION_QUERY } from "@/components/motion/reducedMotion";
import { workProjects, type WorkProject } from "@/data/content";

function WorkCard({ project }: { project: WorkProject }) {
  return (
    <article data-work-card className="group">
      <div
        data-work-frame
        className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#e4dece]"
      >
        <img
          data-work-img
          src={project.image}
          alt={project.label}
          className="absolute inset-x-0 -top-[10%] w-full h-[120%] object-cover will-change-transform transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
      </div>
      <div className="overflow-hidden mt-[22px]">
        <div
          data-work-line
          className="text-[13px] font-medium tracking-[0.06em] uppercase text-[#3c4a40]"
        >
          {[project.place, ...project.tags].join(" • ")}
        </div>
      </div>
      <h3 className="overflow-hidden mt-1.5 m-0 font-serif-bodoni font-normal text-[clamp(32px,3.4vw,58px)] leading-[1.05] tracking-[-0.015em]">
        <span data-work-line className="inline-block">
          {project.label}
          <span
            aria-hidden="true"
            className="inline-block ml-3.5 opacity-0 -translate-x-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0"
          >
            →
          </span>
        </span>
      </h3>
    </article>
  );
}

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const left = workProjects.filter((_, i) => i % 2 === 0);
  const right = workProjects.filter((_, i) => i % 2 === 1);

  useGsap(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      gsap.utils.toArray<HTMLElement>("[data-work-card]", root).forEach((card) => {
        const frame = card.querySelector<HTMLElement>("[data-work-frame]");
        const img = card.querySelector<HTMLElement>("[data-work-img]");
        const lines = card.querySelectorAll<HTMLElement>("[data-work-line]");

        gsap.fromTo(
          frame,
          { clipPath: "inset(12% 6% 0% 6% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          }
        );
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.from(lines, {
          yPercent: 100,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
      });
    });

    mm.add(MOTION_QUERY, () => {
      gsap.to("[data-work-col='right']", {
        y: -120,
        ease: "none",
        scrollTrigger: { trigger: "[data-work-grid]", start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }, sectionRef);

  return (
    <section id="work" ref={sectionRef} className="py-[16vh] px-[5vw]">
      <div className="flex justify-between items-end gap-6 mb-[10vh]">
        <h2 className="font-serif-bodoni font-normal text-[clamp(44px,6vw,92px)] leading-none m-0 tracking-[-0.015em]">
          Selected <i className="italic">work</i>
        </h2>
        <span className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e]">
          {workProjects.length} projects
        </span>
      </div>

      <div data-work-grid className="grid grid-cols-1 md:grid-cols-2 gap-x-[2.4vw] gap-y-[12vh]">
        <div data-work-col="left" className="flex flex-col gap-[12vh]">
          {left.map((project) => (
            <WorkCard key={project.label} project={project} />
          ))}
        </div>
        <div data-work-col="right" className="flex flex-col gap-[12vh] md:mt-[22vh]">
          {right.map((project) => (
            <WorkCard key={project.label} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
