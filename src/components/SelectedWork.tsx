"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import {
  MOBILE_MOTION_QUERY,
  MOTION_QUERY,
} from "@/components/motion/reducedMotion";
import { workProjects, type WorkProject } from "@/data/content";

function WorkCard({ project }: { project: WorkProject }) {
  return (
    <article data-work-card className="group min-w-0">
      <a
        href="#contact"
        aria-label={`Enquire about ${project.label}`}
        className="work-link block rounded-[18px]"
      >
        <div
          data-work-frame
          className="work-frame relative overflow-hidden rounded-[18px] bg-[#e4dece]"
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] group-focus-within:scale-[1.035] motion-reduce:transform-none">
            <img
              data-work-img
              src={project.image}
              alt={project.label}
              loading="lazy"
              className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-5 overflow-hidden">
          <p
            data-work-line
            className="m-0 text-[11px] font-medium uppercase leading-[1.55] tracking-[0.025em] text-[#3c4a40] md:text-[13px]"
          >
            {[project.place, ...project.tags].join(" • ")}
          </p>
        </div>
        <div className="mt-2 overflow-hidden">
          <h3
            data-work-line
            className="work-title m-0 flex items-center font-sans-hanken text-[clamp(28px,3.1vw,60px)] font-normal leading-[1.12] tracking-[-0.035em]"
          >
            <span aria-hidden="true" className="work-title-arrow">
              <ArrowRight className="h-[0.85em] w-[0.85em]" strokeWidth={1.5} />
            </span>
            <span>{project.label}</span>
          </h3>
        </div>
      </a>
    </article>
  );
}

const projectRows = Array.from(
  { length: Math.ceil(workProjects.length / 2) },
  (_, index) => workProjects.slice(index * 2, index * 2 + 2),
);

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: MOTION_QUERY, mobile: MOBILE_MOTION_QUERY },
      (context) => {
        root
          .querySelectorAll<HTMLElement>(
            context.conditions?.desktop
              ? "[data-work-row]"
              : "[data-work-card]",
          )
          .forEach((row, index) => {
            const frames =
              row.querySelectorAll<HTMLElement>("[data-work-frame]");
            const images =
              row.querySelectorAll<HTMLImageElement>("[data-work-img]");
            const lines = row.querySelectorAll<HTMLElement>("[data-work-line]");
            const timeline = gsap.timeline({
              scrollTrigger: {
                id: `garden-work-row-${index}`,
                trigger: row,
                start: "top 95%",
                end: "top 48%",
                scrub: 0.45,
                invalidateOnRefresh: true,
              },
            });
            // Desktop pairs share one progress value; mobile cards reveal individually.
            timeline.fromTo(
              frames,
              { y: 30, clipPath: "inset(8% 3% 0% 3% round 18px)" },
              {
                y: 0,
                clipPath: "inset(0% 0% 0% 0% round 18px)",
                duration: 0.65,
                ease: "power2.out",
              },
              0,
            );
            timeline.fromTo(
              lines,
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
              0.25,
            );
            gsap.fromTo(
              images,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
      },
    );
  }, sectionRef);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section bg-[#f4f1ea] px-[5vw] py-[12vh]"
    >
      <div
        data-work-heading
        className="mb-[7vh] flex flex-wrap items-end justify-between gap-5"
      >
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b5a2e]">
            Spaces we bring to life
          </p>
          <h2 className="m-0 font-serif-bodoni text-[clamp(44px,6vw,92px)] font-normal leading-none tracking-[-0.025em]">
            Selected <i>work</i>
          </h2>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b5a2e]">
          {workProjects.length} gardens
        </span>
      </div>
      <div data-work-grid className="work-grid">
        {projectRows.map((projects) => (
          <div data-work-row key={projects[0].label} className="work-row">
            {projects.map((project) => (
              <WorkCard key={project.label} project={project} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
