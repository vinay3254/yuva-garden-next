"use client";

import { useRef } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      }
    );
  }, barRef);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] w-full bg-[#c9b88a] z-50 pointer-events-none origin-left scale-x-0"
    />
  );
}
