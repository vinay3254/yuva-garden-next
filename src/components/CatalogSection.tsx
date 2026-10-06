"use client";

import { useState, useMemo } from "react";
import { catalogItems, CatalogItem, getWhatsAppUrl } from "@/data/content";
import { Search, X, Check, ArrowRight } from "lucide-react";
import LusionCard from "@/components/LusionCard";
import FoldStack from "@/components/motion/FoldStack";

const CATEGORY_ORDER: CatalogItem["cat"][] = ["Plants", "Services", "Supplies"];

export default function CatalogSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [activeDetailItem, setActiveDetailItem] = useState<CatalogItem | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogItems.filter(
      (item) => !q || (item.name + " " + item.note + " " + item.desc).toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        items: filteredItems.filter((item) => item.cat === cat),
      })).filter((group) => group.items.length > 0),
    [filteredItems]
  );

  const toggleListItem = (name: string) => {
    setSelectedList((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const whatsappListUrl = useMemo(() => {
    const text =
      "Hi Yuva Garden Group, I would like a quote for:\n" +
      selectedList.map((n) => `• ${n}`).join("\n");
    return getWhatsAppUrl(text);
  }, [selectedList]);

  return (
    <section id="popular" className="py-[14vh] px-[5vw] bg-[#1b2a1f] text-[#f4f1ea] relative">
      <div className="flex justify-between items-end gap-6 flex-wrap mb-8">
        <h2 className="font-serif-bodoni font-normal text-[clamp(40px,5vw,76px)] leading-none m-0 tracking-[-0.015em]">
          Popular <i className="italic">right now</i>
        </h2>
        <p className="m-0 max-w-[340px] text-[15px] leading-[1.6] text-[#c9d2c6]">
          Add what you need to your list, then send it to us in one WhatsApp message.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-9 pb-6 border-b border-[#33463a]">
        <label className="flex items-center gap-2.5 bg-[#24362a] border border-[#33463a] rounded-full px-4 py-1 min-w-[260px] w-full md:max-w-[320px]">
          <Search size={16} className="text-[#a9b3a8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plants, services…"
            aria-label="Search the catalog"
            className="w-full bg-transparent border-0 outline-hidden text-[#f4f1ea] placeholder-[#a9b3a8] text-sm py-2"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="text-[#a9b3a8] hover:text-[#f4f1ea]"
            >
              <X size={14} />
            </button>
          )}
        </label>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-[#c9d2c6] text-lg">
          Nothing matches &ldquo;{searchQuery}&rdquo;. Ask us on WhatsApp — we probably have it.
        </div>
      )}

      {/* Category Fold Stack */}
      <FoldStack refreshKey={searchQuery}>
        {groups.map(({ cat, items }) => (
          <div
            key={cat}
            className="bg-[#24362a] border border-[#33463a] rounded-[28px] p-5 md:p-8 min-h-[72vh]"
          >
            <div className="flex justify-between items-baseline gap-4 mb-6">
              <h3 className="font-serif-bodoni font-normal text-[clamp(32px,3.6vw,56px)] leading-none m-0">
                {cat}
              </h3>
              <span className="font-mono text-sm text-[#a9b3a8]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item, index) => {
                const isAdded = selectedList.includes(item.name);
                return (
                  <LusionCard
                    key={item.id}
                    index={index}
                    className={`bg-[#f4f1ea] text-[#1b2a1f] rounded-[22px] flex flex-col ${
                      isAdded ? "ring-2 ring-[#c9b88a] ring-offset-2 ring-offset-[#24362a]" : ""
                    }`}
                  >
                    {/* Card Image */}
                    <div
                      onClick={() => setActiveDetailItem(item)}
                      className="aspect-[5/4] overflow-hidden relative cursor-pointer group rounded-t-[22px]"
                    >
                      <img
                        data-depth="img"
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute left-3.5 top-3.5 text-xs font-semibold px-3 py-1 rounded-full shadow-xs text-[#1b2a1f]"
                        style={{ backgroundColor: item.tagBg }}
                      >
                        {item.tag}
                      </span>
                      <span className="absolute right-3.5 top-3.5 bg-[#f4f1ea]/90 backdrop-blur-xs text-[#1b2a1f] text-xs font-semibold px-3 py-1 rounded-full shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                        Details
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col gap-3.5 flex-1">
                      <div>
                        <div className="font-serif-bodoni text-2xl leading-[1.1] font-medium">
                          {item.name}
                        </div>
                        <div className="text-[13px] text-[#5d6a60] mt-1">{item.note}</div>
                      </div>

                      {/* Facts Badges */}
                      <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
                        {item.facts.map((fact) => (
                          <span
                            key={fact}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#e9e4d8] text-[#3c4a40]"
                          >
                            {fact}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => toggleListItem(item.name)}
                          className={`flex-1 text-sm font-semibold py-2.5 px-3.5 rounded-full border border-[#1b2a1f] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                            isAdded
                              ? "bg-[#1b2a1f] text-[#f4f1ea]"
                              : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            "+ Add to list"
                          )}
                        </button>
                        <a
                          href={getWhatsAppUrl(`Hi, I am interested in: ${item.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${item.name} on WhatsApp`}
                          className="w-11 h-11 shrink-0 rounded-full bg-[#1b2a1f] text-[#f4f1ea] flex items-center justify-center text-lg transition-colors hover:bg-[#6b5a2e]"
                        >
                          <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>
                  </LusionCard>
                );
              })}
            </div>
          </div>
        ))}
      </FoldStack>

      {/* Detail Modal Dialog */}
      {activeDetailItem && (
        <div
          onClick={() => setActiveDetailItem(null)}
          className="fixed inset-0 z-50 bg-[#0f1611]/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f4f1ea] text-[#1b2a1f] rounded-[24px] overflow-hidden max-w-[880px] w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="min-h-[280px] md:min-h-full">
              <img
                src={activeDetailItem.big}
                alt={activeDetailItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-9 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: activeDetailItem.tagBg }}
                >
                  {activeDetailItem.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDetailItem(null)}
                  aria-label="Close dialog"
                  className="w-9 h-9 rounded-full border border-[#1b2a1f] flex items-center justify-center text-[#1b2a1f] hover:bg-[#1b2a1f] hover:text-[#f4f1ea] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="font-serif-bodoni text-[clamp(32px,3.5vw,46px)] leading-[1.05] m-0 font-normal">
                {activeDetailItem.name}
              </h3>
              <p className="m-0 text-base leading-[1.6] text-[#3c4a40]">
                {activeDetailItem.desc}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 my-2">
                {activeDetailItem.specs.map((sp) => (
                  <div
                    key={sp.k}
                    className="p-3 bg-[#e9e4d8] rounded-xl text-left"
                  >
                    <div className="text-[11px] font-semibold tracking-wider uppercase text-[#6b5a2e]">
                      {sp.k}
                    </div>
                    <div className="text-sm font-medium mt-0.5 text-[#1b2a1f]">
                      {sp.v}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => toggleListItem(activeDetailItem.name)}
                  className={`font-semibold text-sm px-6 py-3 rounded-full border border-[#1b2a1f] transition-all ${
                    selectedList.includes(activeDetailItem.name)
                      ? "bg-[#1b2a1f] text-[#f4f1ea]"
                      : "bg-transparent text-[#1b2a1f] hover:bg-[#1b2a1f]/10"
                  }`}
                >
                  {selectedList.includes(activeDetailItem.name)
                    ? "✓ In your list"
                    : "+ Add to list"}
                </button>
                <a
                  href={getWhatsAppUrl(`Hi, I am inquiring about: ${activeDetailItem.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm px-6 py-3 rounded-full border border-[#1b2a1f] bg-[#1b2a1f] text-[#f4f1ea] hover:bg-[#6b5a2e] transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Order Tray ("Cart") */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-40 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center gap-3.5 bg-[#f4f1ea] text-[#1b2a1f] py-2 pl-5 pr-2 rounded-full shadow-[0_20px_50px_rgba(15,22,17,0.35)] max-w-[calc(100vw-32px)] ${
          selectedList.length > 0
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-28 opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-sm font-semibold whitespace-nowrap">
          {selectedList.length} {selectedList.length === 1 ? "item" : "items"} in your list
        </span>
        <button
          type="button"
          onClick={() => setSelectedList([])}
          className="text-xs text-[#6b5a2e] hover:underline cursor-pointer px-1"
        >
          Clear
        </button>
        <a
          href={whatsappListUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1b2a1f] text-[#f4f1ea] px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-[#6b5a2e] transition-colors"
        >
          Send list on WhatsApp
        </a>
      </div>
    </section>
  );
}
