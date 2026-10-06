"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let currentProg = 0;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const targetProg = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      currentProg += (targetProg - currentProg) * 0.15;
      setProgress(currentProg);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] w-full bg-[#c9b88a] z-50 pointer-events-none origin-left"
      style={{ transform: `scaleX(${progress.toFixed(4)})` }}
    />
  );
}
