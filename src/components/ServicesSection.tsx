"use client";

import { useState } from "react";
import { servicesData } from "@/data/content";

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeService = servicesData[activeIdx];

  return (
    <section id="services" className="py-[12vh] px-[5vw] border-t border-[#d8d1c0]">
      <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] mb-12">
        Services
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vw] items-start">
        {/* Services List Column */}
        <div className="flex flex-col">
          {servicesData.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                className={`group flex justify-between items-baseline gap-4 py-5 border-b border-[#d8d1c0] cursor-pointer transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-75"
                }`}
              >
                <span className="font-serif-bodoni text-[clamp(26px,2.8vw,40px)] leading-[1.1] transition-transform duration-300 group-hover:translate-x-1">
                  {item.title}
                </span>
                <span className="text-sm font-mono text-[#6b5a2e]">{item.n}</span>
              </div>
            );
          })}
        </div>

        {/* Sticky Preview Image & Text Column */}
        <div className="sticky top-[110px] flex flex-col gap-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e4dece] shadow-md">
            {servicesData.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                />
              );
            })}
          </div>
          <p className="m-0 text-[17px] leading-[1.6] max-w-[460px] text-[#3c4a40] transition-opacity duration-300">
            {activeService.description}
          </p>
        </div>
      </div>
    </section>
  );
}
