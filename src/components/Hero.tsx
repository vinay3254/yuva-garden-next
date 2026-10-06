"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import {
  HOVER_MOTION_QUERY,
  MOTION_OK_QUERY,
} from "@/components/motion/reducedMotion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK_QUERY, () => {
      const entrance = gsap.timeline({ delay: 1.35 });
      entrance.from("[data-hero-line]", {
        yPercent: 110,
        rotate: 3,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
      });
      entrance.from(
        "[data-hero-detail]",
        { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 },
        0.3,
      );
      entrance.from(
        "[data-hero-entrance]",
        { y: 50, scale: 0.9, opacity: 0, duration: 1.3, ease: "power3.out" },
        0,
      );

      // Separate wrappers let scroll, pointer and breeze move independently.
      gsap.to("[data-hero-landscape]", {
        yPercent: 18,
        rotate: -3,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          id: "garden-hero",
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
      gsap.to("[data-hero-copy]", {
        y: -65,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const scene = root.querySelector<HTMLElement>("[data-hero-breeze]");
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (scene)
            scene.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
        },
        { threshold: 0 },
      );
      observer.observe(root);
      return () => {
        observer.disconnect();
        if (scene) scene.style.removeProperty("animation-play-state");
      };
    });

    mm.add(HOVER_MOTION_QUERY, () => {
      const scene = root.querySelector<HTMLElement>("[data-hero-pointer]");
      if (!scene) return;
      const xTo = gsap.quickTo(scene, "x", {
        duration: 1.1,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(scene, "y", {
        duration: 1.1,
        ease: "power3.out",
      });
      const rotateTo = gsap.quickTo(scene, "rotate", {
        duration: 1.1,
        ease: "power3.out",
      });
      const move = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        xTo(x * 30);
        yTo(y * 20);
        rotateTo(x * 2);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
        rotateTo(0);
      };
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", reset);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", reset);
      };
    });
  }, sectionRef);

  return (
    <section id="top" ref={sectionRef} className="garden-hero botanical-hero">
      <div className="hero-aura" aria-hidden="true" />

      <div data-hero-copy className="botanical-copy">
        <p data-hero-detail className="hero-eyebrow">
          <span className="hero-status-dot" />
          Rooted in Bangalore. Grown with care.
        </p>
        <h1 className="botanical-title">
          <span className="hero-line-mask">
            <span data-hero-line>Make room</span>
          </span>
          <span className="hero-line-mask">
            <span data-hero-line>
              for <i>life.</i>
            </span>
          </span>
        </h1>
        <p data-hero-detail className="botanical-description">
          A quiet corner. A greener everyday.
          <br />
          Gardens made for the way you live.
        </p>
        <div data-hero-detail className="hero-actions">
          <a data-magnetic href="#contact" className="hero-grow-link">
            <span data-magnetic-inner>
              Let&apos;s grow your garden <ArrowUpRight size={18} />
            </span>
          </a>
          <a href="#work" className="hero-work-link">
            Explore our gardens <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="botanical-scene" aria-hidden="true">
        <svg className="hero-orbit" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="337" />
          <circle cx="400" cy="400" r="350" strokeDasharray="1 16" />
        </svg>
        <div data-hero-landscape className="hero-landscape">
          <div data-hero-entrance className="hero-scene-layer">
            <div data-hero-pointer className="hero-scene-layer">
              <div data-hero-breeze className="hero-scene-layer hero-breeze">
                <Image
                  src="/images/garden-island.webp"
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 60vw"
                  loading="eager"
                  fetchPriority="high"
                  className="hero-island-image"
                />
              </div>
            </div>
          </div>
        </div>
        <span data-hero-detail className="hero-specimen-label">
          A little earth. A whole new world.
          <span>01 / Living landscapes</span>
        </span>
      </div>

      <div className="botanical-footer" data-hero-detail>
        <a href="#about" className="hero-scroll-link">
          <span>
            <ArrowDown size={18} />
          </span>
          Scroll to grow
        </a>
        <p>From the first seed to the last detail.</p>
        <span className="hero-footer-note">
          Landscape design · Nursery · Care
        </span>
      </div>
    </section>
  );
}
