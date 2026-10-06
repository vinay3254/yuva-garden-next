"use client";

import React, { useEffect, useRef, useState } from "react";

interface LusionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
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
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Scroll-triggered spring pop entrance
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "100px 0px 50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Normalized coordinates from -0.5 to 0.5
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    // 3D tilt angles
    setTilt({
      x: normX * 16, // rotateY
      y: -normY * 16, // rotateX
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Stagger delay based on index
  const staggerDelay = (index % 4) * 85;

  return (
    <div
      className="[perspective:1200px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
        className={`relative overflow-hidden transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] ${className}`}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? isHovered
              ? `translateY(-12px) scale(1.035) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
              : "translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)"
            : "translateY(85px) scale(0.85) rotateX(20deg)",
          boxShadow: isHovered
            ? "0 35px 70px -15px rgba(0, 0, 0, 0.45), 0 0 20px rgba(201, 184, 138, 0.2)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
          transitionDuration: isVisible
            ? isHovered
              ? "0.15s"
              : "0.65s"
            : "0.95s",
          transitionDelay: isVisible && !isHovered ? `${staggerDelay}ms` : "0ms",
          ...style,
        }}
      >
        {/* Dynamic Holographic Specular Sheen (Lusion light beam effect) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 360px at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Card Content with 3D Depth */}
        <div
          className="relative z-10 h-full flex flex-col"
          style={{ transform: "translateZ(15px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
