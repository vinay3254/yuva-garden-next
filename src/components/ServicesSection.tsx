import FoldStack from "@/components/motion/FoldStack";
import { servicesData } from "@/data/content";

export default function ServicesSection() {
  return (
    <section id="services" className="py-[12vh] px-[5vw] border-t border-[#d8d1c0]">
      <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] mb-12">
        Services
      </div>

      <FoldStack>
        {servicesData.map((item) => (
          <article key={item.id} className="relative h-[72vh] min-h-[420px] text-[#f4f1ea]">
            <img
              data-parallax
              src={item.image}
              alt={item.title}
              className="absolute inset-x-0 top-0 w-full h-[120%] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-[#0a140c]/75" />
            <div className="absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-9 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <div className="text-sm font-mono opacity-70">{item.n}</div>
                <h3 className="font-serif-bodoni font-normal text-[clamp(32px,5vw,72px)] leading-none m-0 tracking-[-0.02em]">
                  {item.title}
                </h3>
              </div>
              <p className="m-0 max-w-[320px] text-base leading-[1.55] text-[#e9e4d8]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </FoldStack>
    </section>
  );
}
