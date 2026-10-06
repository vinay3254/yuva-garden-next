import FoldStack from "@/components/motion/FoldStack";
import { servicesData } from "@/data/content";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-[12vh] px-[5vw] border-t border-[#d8d1c0]"
    >
      <div className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#6b5a2e] mb-12">
        Services
      </div>
      <div
        data-reveal
        className="mb-[8vh] flex flex-wrap items-end justify-between gap-6"
      >
        <h2 className="m-0 font-serif-bodoni text-[clamp(44px,6vw,92px)] font-normal leading-none tracking-[-0.025em]">
          A greener way
          <br />
          <i>to live.</i>
        </h2>
        <p className="m-0 max-w-[290px] text-[15px] leading-relaxed text-[#3c4a40]">
          Thoughtful design. Healthy plants. Lasting care.
          <br />
          Everything your green space needs.
        </p>
      </div>

      <FoldStack>
        {servicesData.map((item) => (
          <article
            key={item.id}
            className="relative h-[72vh] min-h-[420px] text-[#f4f1ea]"
          >
            <img
              data-parallax
              src={item.image}
              alt={item.title}
              loading="lazy"
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
