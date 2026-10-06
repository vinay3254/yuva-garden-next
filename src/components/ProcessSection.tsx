"use client";

import { useState } from "react";
import { processSteps } from "@/data/content";

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-[14vh] px-[5vw]">
      <div className="flex justify-between items-end gap-6 flex-wrap mb-12">
        <h2 className="font-serif-bodoni font-normal text-[clamp(40px,5vw,76px)] leading-none m-0 tracking-[-0.015em]">
          How we <i className="italic">work</i>
        </h2>
        <p className="m-0 max-w-[300px] text-[15px] leading-[1.6] text-[#3c4a40]">
          Hover or tap each step to explore our methodology.
        </p>
      </div>

      {/* Accordion Columns */}
      <div className="flex flex-col md:flex-row gap-3 min-h-[480px] md:h-[72vh]">
        {processSteps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={step.n}
              onMouseEnter={() => setActiveStep(idx)}
              onClick={() => setActiveStep(idx)}
              className={`relative overflow-hidden cursor-pointer rounded-2xl transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "flex-[5_1_0%]" : "flex-[1_1_0%]"
              }`}
              style={{ minWidth: "64px", minHeight: "120px" }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f1611]/25 to-[#0f1611]/85" />

              {/* Step Number Top Left */}
              <div className="absolute left-6 top-6 font-serif-bodoni text-3xl text-[#f4f1ea]">
                {step.n}
              </div>

              {/* Title & Description Bottom */}
              <div
                className={`absolute left-6 right-6 bottom-6 text-[#f4f1ea] min-w-[240px] transition-all duration-500 delay-100 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6 pointer-events-none"
                }`}
              >
                <div className="font-serif-bodoni text-[clamp(28px,2.8vw,42px)] mb-2">
                  {step.title}
                </div>
                <div className="text-base leading-[1.55] max-w-[380px] text-[#e9e4d8]">
                  {step.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
