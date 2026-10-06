"use client";

import { useEffect, useRef, useState } from "react";

export default function Intro() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-[16vh] px-[5vw] grid grid-cols-1 md:grid-cols-2 gap-[8vw] items-end"
    >
      <p
        className={`font-serif-bodoni text-[clamp(28px,3.5vw,52px)] leading-[1.22] m-0 tracking-[-0.01em] text-balance transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        From a few pots on a balcony to a full landscape, we supply the plants and
        do the work.
      </p>

      <div className="flex gap-4 items-end">
        <div
          className={`flex-1 aspect-[3/4] overflow-hidden rounded-xl transition-all duration-[1400ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            inView
              ? "clip-path-none opacity-100"
              : "[clip-path:inset(100%_0_0_0)] opacity-40"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1597868165956-03a6827955b1?auto=format&fit=crop&w=900&q=70"
            alt="Planting a seedling into fertile soil"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div
          className={`flex-1 aspect-[3/4] overflow-hidden rounded-xl mb-[8vh] transition-all duration-[1400ms] ease-[cubic-bezier(0.76,0,0.24,1)] delay-150 ${
            inView
              ? "clip-path-none opacity-100"
              : "[clip-path:inset(100%_0_0_0)] opacity-40"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=900&q=70"
            alt="Watering healthy green garden plants"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
