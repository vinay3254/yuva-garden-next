import { LOCATION_LABEL } from "@/data/content";

export default function Footer() {
  return (
    <footer className="py-12 px-[5vw] pb-8 bg-[#1b2a1f] text-[#a9b3a8] text-sm border-t border-[#33463a] flex flex-col gap-10">
      <div className="flex justify-between items-end gap-8 flex-wrap">
        <div className="font-serif-bodoni text-[clamp(32px,4vw,56px)] text-[#f4f1ea] leading-none">
          Yuva Garden Group
        </div>
        <nav className="flex gap-6 flex-wrap">
          <a href="#services" className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors">
            Services
          </a>
          <a href="#process" className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors">
            Process
          </a>
          <a href="#seasons" className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors">
            Seasons
          </a>
          <a href="#work" className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors">
            Work
          </a>
          <a href="#contact" className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors">
            Contact
          </a>
        </nav>
      </div>

      <div className="flex justify-between items-center gap-3 flex-wrap text-xs text-[#a9b3a8]/80 border-t border-[#33463a]/50 pt-6">
        <span>© {new Date().getFullYear()} Yuva Garden Group · {LOCATION_LABEL}</span>
        <a
          href="#top"
          className="text-[#c9d2c6] hover:text-[#f4f1ea] transition-colors"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
