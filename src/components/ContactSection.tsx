"use client";

import { useState, useMemo } from "react";
import {
  faqList,
  quoteNeeds,
  quoteSizes,
  getWhatsAppUrl,
  DISPLAY_PHONE,
  LOCATION_LABEL,
} from "@/data/content";
import LusionCard from "@/components/LusionCard";

export default function ContactSection() {
  // Opening Hours calculation
  const isStoreOpen = useMemo(() => {
    const now = new Date();
    const hr = now.getHours();
    return hr >= 9 && hr < 19;
  }, []);

  // Free Quote Form State
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number>(0);

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleTilt = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-8px) scale(1.02) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    el.style.boxShadow = "0 25px 50px rgba(0,0,0,0.3)";
  };

  const handleUntilt = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "none";
    el.style.boxShadow = "none";
  };

  // WhatsApp Quote Message
  const whatsappQuoteUrl = useMemo(() => {
    const lines = [
      "Hi Yuva Garden Group, I would like a quote.",
      name ? `Name: ${name}` : "",
      area ? `Area: ${area}` : "",
      selectedNeeds.length > 0 ? `Need: ${selectedNeeds.join(", ")}` : "",
      selectedSize ? `Space: ${selectedSize}` : "",
      notes ? `Notes: ${notes}` : "",
    ].filter(Boolean);

    return getWhatsAppUrl(lines.join("\n"));
  }, [name, area, selectedNeeds, selectedSize, notes]);

  return (
    <section id="contact" className="bg-[#1b2a1f] text-[#f4f1ea] py-[14vh] px-[5vw]">
      {/* Section Header */}
      <div className="flex justify-between items-end gap-6 flex-wrap mb-14">
        <h2 className="font-serif-bodoni font-normal text-[clamp(44px,6vw,96px)] leading-none m-0 tracking-[-0.02em]">
          Let&apos;s talk about
          <br />
          <i className="italic">your garden.</i>
        </h2>

        {/* Live Operating Status Badge */}
        <div className="flex items-center gap-2.5 text-sm font-semibold px-4 py-2.5 rounded-full border border-[#33463a] bg-[#24362a]">
          <span
            className={`w-2 h-2 rounded-full ${
              isStoreOpen ? "bg-[#7fd38a] animate-pulse" : "bg-[#d98a7f]"
            }`}
          />
          <span>{isStoreOpen ? "Open now · until 7 pm" : "Closed now · opens 9 am"}</span>
        </div>
      </div>

      {/* 4 Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Call Card */}
        <LusionCard index={0} className="rounded-[22px] bg-[#f4f1ea] text-[#1b2a1f] h-full">
          <a
            href="tel:+910000000000"
            className="flex flex-col justify-between gap-6 p-7 h-full group"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#6b5a2e]">
              Call
            </span>
            <div>
              <div className="font-serif-bodoni text-2xl font-medium leading-tight">
                {DISPLAY_PHONE}
              </div>
              <div className="text-sm text-[#5d6a60] mt-1 group-hover:translate-x-1 transition-transform">
                Tap to call →
              </div>
            </div>
          </a>
        </LusionCard>

        {/* WhatsApp Card */}
        <LusionCard index={1} glowColor="rgba(255, 255, 255, 0.4)" className="rounded-[22px] bg-[#c9e3b8] text-[#1b2a1f] h-full">
          <a
            href={getWhatsAppUrl("Hi Yuva Garden Group, I am sharing photos of my space for a garden quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between gap-6 p-7 h-full group"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#3c4a40]">
              WhatsApp
            </span>
            <div>
              <div className="font-serif-bodoni text-2xl font-medium leading-tight">
                Send photos of your space
              </div>
              <div className="text-sm text-[#3c4a40] mt-1 group-hover:translate-x-1 transition-transform">
                Replies within the hour →
              </div>
            </div>
          </a>
        </LusionCard>

        {/* Nursery Location Card */}
        <LusionCard index={2} glowColor="rgba(255, 255, 255, 0.4)" className="rounded-[22px] bg-[#f0d9a8] text-[#1b2a1f] h-full">
          <a
            href="https://maps.google.com/?q=Bettahalsur,+Bangalore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between gap-6 p-7 h-full group"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#6b5a2e]">
              Visit the nursery
            </span>
            <div>
              <div className="font-serif-bodoni text-2xl font-medium leading-tight">
                {LOCATION_LABEL}
              </div>
              <div className="text-sm text-[#5d6a60] mt-1 group-hover:translate-x-1 transition-transform">
                Get directions →
              </div>
            </div>
          </a>
        </LusionCard>

        {/* Operating Hours Card */}
        <LusionCard index={3} glowColor="rgba(201, 184, 138, 0.25)" className="rounded-[22px] bg-[#24362a] border border-[#33463a] text-[#f4f1ea] h-full">
          <div className="flex flex-col justify-between gap-4 p-7 h-full">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c9b88a]">
              Hours
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-semibold text-[#f4f1ea]">
                <span>Every day</span>
                <span>9 am – 7 pm</span>
              </div>
              <div className="flex justify-between text-sm text-[#c9d2c6]">
                <span>Site visits</span>
                <span>By appointment</span>
              </div>
            </div>
          </div>
        </LusionCard>
      </div>

      {/* Main Form & Map/FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Interactive Free Quote Form */}
        <div className="bg-[#f4f1ea] text-[#1b2a1f] rounded-[24px] p-6 md:p-10 flex flex-col gap-6 shadow-xl">
          <div>
            <div className="font-serif-bodoni text-[clamp(28px,3vw,40px)] leading-[1.1] font-medium">
              Get a free quote
            </div>
            <div className="text-[15px] text-[#5d6a60] mt-1.5">
              Fill this in and it opens WhatsApp with your customized message ready to send.
            </div>
          </div>

          {/* Need Selector */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold tracking-wide uppercase text-[#6b5a2e]">
              What do you need?
            </span>
            <div className="flex gap-2 flex-wrap">
              {quoteNeeds.map((nd) => {
                const isSelected = selectedNeeds.includes(nd);
                return (
                  <button
                    key={nd}
                    type="button"
                    onClick={() => toggleNeed(nd)}
                    className={`font-sans-hanken text-sm font-medium px-4 py-2 rounded-full border border-[#1b2a1f] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1b2a1f] text-[#f4f1ea]"
                        : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                    }`}
                  >
                    {nd}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Space Size Selector */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold tracking-wide uppercase text-[#6b5a2e]">
              Space size
            </span>
            <div className="flex gap-2 flex-wrap">
              {quoteSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(isSelected ? "" : sz)}
                    className={`font-sans-hanken text-sm font-medium px-4 py-2 rounded-full border border-[#1b2a1f] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1b2a1f] text-[#f4f1ea]"
                        : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs font-semibold">
              Your name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="font-sans-hanken text-[15px] p-3 rounded-xl border border-[#d8d1c0] bg-white text-[#1b2a1f] outline-hidden focus:border-[#1b2a1f]"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold">
              Area / locality
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Yelahanka"
                className="font-sans-hanken text-[15px] p-3 rounded-xl border border-[#d8d1c0] bg-white text-[#1b2a1f] outline-hidden focus:border-[#1b2a1f]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-semibold">
            Anything else?
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about your space or requirements"
              className="font-sans-hanken text-[15px] p-3 rounded-xl border border-[#d8d1c0] bg-white text-[#1b2a1f] outline-hidden focus:border-[#1b2a1f] resize-y"
            />
          </label>

          <a
            href={whatsappQuoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center gap-2.5 bg-[#1b2a1f] text-[#f4f1ea] px-7 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-[#6b5a2e] hover:-translate-y-0.5 shadow-md"
          >
            Send on WhatsApp →
          </a>
        </div>

        {/* Map Embed and FAQ Column */}
        <div className="flex flex-col gap-4">
          {/* Bettahalsur Map Embed */}
          <div className="rounded-[24px] overflow-hidden min-h-[260px] flex-1 bg-[#24362a] border border-[#33463a]">
            <iframe
              title="Yuva Garden Group Nursery Bettahalsur Map"
              src="https://maps.google.com/maps?q=Bettahalsur,Bangalore&z=13&output=embed"
              className="w-full h-full min-h-[260px] border-0 block grayscale-[40%] contrast-105"
              loading="lazy"
            />
          </div>

          {/* Expandable FAQs Accordion */}
          <div className="bg-[#24362a] border border-[#33463a] rounded-[24px] px-6 py-2">
            {faqList.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={faq.q}
                  className={i < faqList.length - 1 ? "border-b border-[#33463a]" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : i)}
                    className="w-full flex justify-between items-center gap-4 bg-transparent border-0 text-[#f4f1ea] text-left py-4.5 cursor-pointer font-medium text-base hover:text-[#c9b88a] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`text-xl transition-transform duration-300 font-light ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="m-0 pb-4 text-[15px] leading-[1.6] text-[#c9d2c6]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
