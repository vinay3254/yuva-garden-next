"use client";

import { useEffect, useRef } from "react";

export default function ParallaxBand() {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const b = bandRef.current;
      const bi = imgRef.current;
      if (!b || !bi) return;

      const r = b.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      bi.style.transform = `translate3d(0, ${p * -12}%, 0)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={bandRef}
      className="relative h-[90vh] min-h-[520px] overflow-hidden flex items-center justify-center text-center"
    >
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1597201278257-3687be27d954?auto=format&fit=crop&w=2200&q=70"
        alt="Vibrant landscaped flower beds and lush green shrubs"
        className="absolute left-0 right-0 top-[-15%] w-full h-[130%] object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-[#0f1611]/45" />

      <p className="relative font-serif-bodoni text-[clamp(36px,5.6vw,88px)] leading-[1.05] text-[#f4f1ea] m-0 px-[5vw] max-w-[14ch] tracking-[-0.015em]">
        Every garden starts with <i className="italic">good soil.</i>
      </p>
    </section>
  );
}
