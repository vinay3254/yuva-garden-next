"use client";

import { useEffect, useState } from "react";
import { getWhatsAppUrl } from "@/data/content";

export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={getWhatsAppUrl("Hi Yuva Garden Group, I would like to chat with you about my garden.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-6 bottom-6 z-40 flex items-center gap-2.5 bg-[#1b2a1f] text-[#f4f1ea] px-5 py-3.5 rounded-full text-sm font-semibold shadow-[0_10px_30px_rgba(15,22,17,0.25)] transition-all duration-400 hover:bg-[#6b5a2e] active:scale-95 border border-[#33463a] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-[#7fd38a] animate-pulse" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
