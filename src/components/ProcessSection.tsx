import FoldStack from "@/components/motion/FoldStack";
import { processSteps } from "@/data/content";

export default function ProcessSection() {
  return (
    <section id="process" className="py-[14vh] px-[5vw]">
      <div className="flex justify-between items-end gap-6 flex-wrap mb-12">
        <h2 className="font-serif-bodoni font-normal text-[clamp(40px,5vw,76px)] leading-none m-0 tracking-[-0.015em]">
          How we <i className="italic">work</i>
        </h2>
        <p className="m-0 max-w-[300px] text-[15px] leading-[1.6] text-[#3c4a40]">
          Four steps, from the first visit to ongoing care.
        </p>
      </div>

      <FoldStack>
        {processSteps.map((step) => (
          <article key={step.n} className="relative h-[72vh] min-h-[420px] text-[#f4f1ea]">
            <img
              data-parallax
              src={step.image}
              alt={step.title}
              className="absolute inset-x-0 top-0 w-full h-[120%] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1611]/25 to-[#0f1611]/85" />
            <div className="absolute left-6 top-6 md:left-10 md:top-9 font-serif-bodoni text-3xl md:text-4xl">
              {step.n}
            </div>
            <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-9">
              <div className="font-serif-bodoni text-[clamp(32px,4.4vw,64px)] leading-none mb-3">
                {step.title}
              </div>
              <div className="text-base md:text-lg leading-[1.55] max-w-[460px] text-[#e9e4d8]">
                {step.text}
              </div>
            </div>
          </article>
        ))}
      </FoldStack>
    </section>
  );
}
