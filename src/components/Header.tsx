"use client";

import { useRef, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { useGsap } from "@/components/motion/useGsap";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);

  useGsap(() => {
    let lastY = window.scrollY;

    const update = (curY: number) => {
      setScrolled(curY > 40);

      const dy = curY - lastY;
      if (Math.abs(dy) > 8) {
        setHidden(dy > 0 && curY > window.innerHeight * 0.7);
        lastY = curY;
      }
    };

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => update(self.scroll()),
    });
    update(window.scrollY);
  }, headerRef);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Nursery", href: "#nursery" },
    { label: "Seasons", href: "#seasons" },
    { label: "Work", href: "#work" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-[5vw] transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "py-3 bg-[#f4f1ea]/90 backdrop-blur-md text-[#1b2a1f] border-b border-[#d8d1c0] shadow-xs"
          : "py-6 bg-transparent text-[#f4f1ea] border-b border-transparent"
      }`}
    >
      <a
        href="#top"
        className="font-serif-bodoni text-xl md:text-2xl tracking-[0.02em] font-medium transition-opacity hover:opacity-80"
      >
        Yuva Garden Group
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        {navLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-[#6b5a2e]"
          >
            {item.label}
          </a>
        ))}
        <a
          href="#contact"
          className="border border-current px-5 py-2 rounded-full transition-all hover:bg-current hover:text-[#f4f1ea] hover:border-transparent text-sm font-semibold tracking-wide"
        >
          Contact
        </a>
      </nav>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center gap-3">
        <a
          href="#contact"
          className="border border-current px-3 py-1.5 rounded-full text-xs font-semibold"
        >
          Contact
        </a>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#f4f1ea]/95 backdrop-blur-lg border-b border-[#d8d1c0] text-[#1b2a1f] p-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium py-1.5 border-b border-[#e4dece] hover:text-[#6b5a2e]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 text-center bg-[#1b2a1f] text-[#f4f1ea] py-3 rounded-full font-semibold"
          >
            Get a Quote
          </a>
        </div>
      )}
    </header>
  );
}
