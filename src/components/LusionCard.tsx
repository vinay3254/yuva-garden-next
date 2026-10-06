"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { HOVER_MOTION_QUERY, MOTION_OK_QUERY } from "@/components/motion/reducedMotion";

interface LusionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  index?: number;
  className?: string;
  glowColor?: string;
}

export default function LusionCard({
  children,
  index = 0,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.25)",
  style,
  ...props
}: LusionCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      gsap.from(wrap, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: (index % 4) * 0.08,
        scrollTrigger: { trigger: wrap, start: "top 90%", once: true },
      });
    });

    mm.add(HOVER_MOTION_QUERY, () => {
      // Pointer input only writes CSS variables; the stylesheet turns them into
      // tilt, lift, glow and image counter-motion. No React state per frame.
      gsap.set(card, { "--rx": 0, "--ry": 0, "--mx": 0, "--my": 0, "--glow": 0, "--lift": 0 });
      const to = (prop: string) => gsap.quickTo(card, prop, { duration: 0.6, ease: "power3.out" });
      const rx = to("--rx");
      const ry = to("--ry");
      const mx = to("--mx");
      const my = to("--my");
      const glow = to("--glow");
      const lift = to("--lift");

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        rx(-y * 14);
        ry(x * 14);
        mx(x);
        my(y);
        glow(1);
        lift(1);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
        mx(0);
        my(0);
        glow(0);
        lift(0);
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });
  }, wrapRef);

  return (
    <div ref={wrapRef} className="h-full [perspective:1000px]">
      <div
        ref={cardRef}
        data-depth-card
        {...props}
        className={`relative h-full [transform-style:preserve-3d] ${className}`}
        style={style}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
          style={{
            opacity: "var(--glow, 0)",
            background: `radial-gradient(circle 300px at calc(50% + var(--mx, 0) * 100%) calc(50% + var(--my, 0) * 100%), ${glowColor}, transparent 70%)`,
          }}
        />
        <div className="relative z-10 h-full flex flex-col [transform:translateZ(60px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
