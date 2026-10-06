"use client";

import { useState } from "react";
import { seasonsData } from "@/data/content";

export default function SeasonsSection() {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);

  const currentSeason = seasonsData[activeSeasonIdx];

  return (
    <section
      id="seasons"
      className="py-[14vh] px-[5vw] grid grid-cols-1 md:grid-cols-2 gap-[6vw] items-center"
    >
      <div className="flex flex-col gap-8">
        <div data-reveal>
          <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] mb-3">
            Planting in Bangalore
          </div>
          <h2 className="font-serif-bodoni font-normal text-[clamp(40px,5vw,76px)] leading-none m-0 tracking-[-0.015em]">
            What to plant, <i className="italic">when.</i>
          </h2>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex gap-2 flex-wrap">
          {seasonsData.map((s, idx) => {
            const isSelected = idx === activeSeasonIdx;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveSeasonIdx(idx)}
                aria-pressed={isSelected}
                className={`font-sans-hanken text-[15px] font-semibold px-5 py-2.5 rounded-full border border-[#1b2a1f] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1b2a1f] text-[#f4f1ea]"
                    : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Tip & Months */}
        <div className="flex flex-col gap-1.5">
          <div className="text-sm font-semibold text-[#6b5a2e]">
            {currentSeason.months}
          </div>
          <p className="m-0 text-[18px] leading-[1.6] max-w-[460px] text-[#3c4a40]">
            {currentSeason.tip}
          </p>
        </div>

        {/* Recommended Plants Badges */}
        <div className="flex gap-2 flex-wrap">
          {currentSeason.plants.map((pl) => (
            <span
              key={pl}
              className="font-serif-bodoni text-lg px-4 py-2 bg-[#e9e4d8] rounded-full transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#d9cfb4] cursor-default text-[#1b2a1f]"
            >
              {pl}
            </span>
          ))}
        </div>
      </div>

      {/* Season Photography Cross-fade */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e4dece] shadow-md">
        {seasonsData.map((s, idx) => {
          const isSelected = idx === activeSeasonIdx;
          return (
            <img
              key={s.name}
              src={s.image}
              alt={s.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSelected
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
