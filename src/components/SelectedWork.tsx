"use client";

import { useEffect, useRef, useState } from "react";
import { workProjects } from "@/data/content";

export default function SelectedWork() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelToFn, setWheelToFn] = useState<((n: number) => void) | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wheel = wheelRef.current;
    if (!stage || !wheel) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-wcard]"));
    const count = cards.length;
    const last = count - 1;

    const T = titleRef.current;
    const L = labelRef.current;
    const HI = hintRef.current;

    const cl = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const rad = (d: number) => (d * Math.PI) / 180;
    const STEP = 40;
    const CULL = 1.6;

    let turn = 0;
    let target = 0;
    let M = {
      cardW: 380,
      cardH: 260,
      ringR: 280,
      drumR: 580,
      bow: 470,
      ringScale: 0.8,
    };
    let currentActive = -1;
    let settleTimer: ReturnType<typeof setTimeout>;

    const measure = () => {
      const w = stage.clientWidth;
      const hh = stage.clientHeight;
      const narrow = w < 760;
      const cardW = Math.min(hh * 0.38 * 1.45, w * (narrow ? 0.72 : 0.34));
      const cardH = cardW / 1.45;
      const ringR = Math.min(cardH * 1.14, hh * 0.3);

      M = {
        cardW,
        cardH,
        ringR,
        drumR: cardH * 2.22,
        bow: cardH * 1.82,
        ringScale: cl(((2 * Math.PI * ringR) / count * 0.82) / cardW, 0.16, 1),
      };

      stage.style.perspective = `${cardH * 2.7}px`;
      cards.forEach((c) => {
        c.style.width = `${cardW}px`;
        c.style.height = `${cardH}px`;
        c.style.marginLeft = `${-cardW / 2}px`;
        c.style.marginTop = `${-cardH / 2}px`;
      });

      if (L) L.style.fontSize = `${Math.max(28, cardH * 0.2)}px`;
    };

    measure();
    window.addEventListener("resize", measure);

    const place = (ringDeg: number, drumDeg: number, m: number) =>
      `translateX(${m * -M.bow * (1 - Math.cos(rad(drumDeg)))}px) rotateZ(${
        (1 - m) * ringDeg
      }deg) translateY(${-(1 - m) * M.ringR}px) rotateX(${
        m * drumDeg
      }deg) translateZ(${m * M.drumR}px)`;

    const to = (n: number) => {
      target = cl(n, 0, last + 1);
    };
    setWheelToFn(() => to);

    let rafId: number;
    const frame = () => {
      const gap = target - turn;
      turn = Math.abs(gap) < 0.0005 ? target : turn + gap * 0.12;
      const m = cl(turn, 0, 1);
      const pos = Math.max(0, turn - 1);

      wheel.style.transform = `translateZ(${-m * M.drumR}px)`;

      cards.forEach((c, i) => {
        const d = i - pos;
        c.style.transform = place((d * 360) / count, d * STEP, m);
        c.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
        c.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        const child = c.firstElementChild as HTMLElement;
        if (child) {
          child.style.transform = `scale(${
            M.ringScale + (1 - M.ringScale) * m
          })`;
        }
      });

      if (L) L.style.opacity = String(1 - m);
      if (T) T.style.opacity = String(m);
      if (HI) HI.style.opacity = turn > 0.05 ? "0" : "1";

      const near = cl(Math.round(pos), 0, last);
      if (near !== currentActive) {
        currentActive = near;
        setActiveIndex(near);
      }

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const inView = () => {
      const r = stage.getBoundingClientRect();
      return Math.abs(r.top) < window.innerHeight * 0.4;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!inView()) return;
      const next = target + e.deltaY / 900;
      if (next > 0 && next < last + 1) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        return;
      }
      to(next);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => to(Math.round(target)), 140);
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });

    let drag: number | null = null;
    const onPointerDown = (e: PointerEvent) => {
      drag = e.clientY;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (drag === null) return;
      const dy = drag - e.clientY;
      drag = e.clientY;
      const next = target + dy / 420;
      if (e.pointerType !== "mouse" && (next <= 0 || next >= last + 1)) {
        window.scrollBy(0, dy);
      }
      to(next);
    };

    const onPointerUp = () => {
      drag = null;
      stage.style.cursor = "grab";
      if (target > 1) to(Math.round(target));
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("resize", measure);
      stage.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
    };
  }, []);

  const activeProject = workProjects[activeIndex] || workProjects[0];

  return (
    <section
      id="work"
      className="relative h-screen min-h-[560px] overflow-hidden select-none bg-transparent"
    >
      {/* Category Heading Top Left */}
      <div className="absolute left-[5vw] top-[clamp(84px,12vh,120px)] text-xs md:text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] z-20 pointer-events-none">
        Selected work
      </div>

      {/* 3D Wheel Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        aria-label="Selected work 3D carousel"
        className="absolute inset-0 cursor-grab touch-pan-x outline-hidden"
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {workProjects.map((w) => (
            <div
              key={w.label}
              data-wcard="1"
              className="absolute [backface-visibility:hidden]"
            >
              <span className="block w-full h-full overflow-hidden rounded-[14px] shadow-[0_18px_40px_-18px_rgba(27,42,31,0.4)] bg-[#e4dece] transition-transform duration-300">
                <img
                  src={w.image}
                  alt={w.label}
                  draggable={false}
                  className="w-full h-full object-cover block"
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Intro Heading (visible before turning) */}
      <div
        ref={labelRef}
        className="absolute inset-0 grid place-items-center pointer-events-none font-serif-bodoni tracking-[-0.015em] text-center leading-none text-[#1b2a1f] transition-opacity"
      >
        <span>
          Our <i className="italic">gardens</i>
        </span>
      </div>

      {/* Active Project Title & Tag (Left on desktop, Bottom on mobile) */}
      <div
        ref={titleRef}
        className="absolute z-20 pointer-events-none transition-opacity duration-300 max-w-[90vw] md:max-w-[26vw] bottom-[14%] md:bottom-auto md:top-1/2 left-[5vw] md:left-[6vw] md:-translate-y-1/2"
      >
        <div className="font-serif-bodoni leading-[1.02] tracking-[-0.015em] text-[clamp(32px,3.6vw,52px)] text-[#1b2a1f]">
          {activeProject.label}
        </div>
        <div className="text-sm font-semibold tracking-[0.14em] uppercase text-[#6b5a2e] mt-3">
          {activeProject.place}
        </div>
      </div>

      {/* Right List Indicator (Desktop) */}
      <ol className="hidden md:block absolute top-[clamp(84px,12vh,120px)] right-[5vw] m-0 p-0 list-none text-right leading-[1.9] text-sm z-20">
        {workProjects.map((w, idx) => (
          <li key={w.label}>
            <button
              type="button"
              onClick={() => wheelToFn && wheelToFn(idx + 1)}
              className={`font-sans-hanken bg-transparent border-0 p-0 cursor-pointer transition-colors ${
                idx === activeIndex
                  ? "text-[#1b2a1f] font-semibold"
                  : "text-[#8a9389] hover:text-[#1b2a1f]"
              }`}
            >
              {w.label}
            </button>
          </li>
        ))}
      </ol>

      {/* Bottom Hint */}
      <div
        ref={hintRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(24px,5vh,44px)] text-xs font-semibold tracking-[0.24em] uppercase text-[#6b5a2e] pointer-events-none transition-opacity duration-500 whitespace-nowrap z-20"
      >
        Scroll or drag to turn
      </div>
    </section>
  );
}
