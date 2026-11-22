import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CaretLeft, CaretRight, Certificate, Copy, Check } from "@phosphor-icons/react";
import { SpotlightCard } from "./motion/MotionPrimitives";

export function CertificationsCarousel({ credentials, isRtl }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedId, setCopiedId] = useState("");

  const filtered =
    activeFilter === "all"
      ? credentials.items
      : credentials.items.filter((item) => item.category === activeFilter);

  const safeIndex = activeIndex >= filtered.length ? 0 : activeIndex;

  function handleFilterChange(id) {
    setActiveFilter(id);
    setActiveIndex(0);
  }

  function handlePrev() {
    setActiveIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
  }

  function handleNext() {
    setActiveIndex((prev) => (prev >= filtered.length - 1 ? 0 : prev + 1));
  }

  function handleCopyId(id) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  }

  // Show 3 cards on desktop starting from safeIndex (wraps cleanly)
  const visibleCount = Math.min(3, filtered.length);
  const visibleItems = Array.from({ length: visibleCount }, (_, offset) => {
    const idx = (safeIndex + offset) % filtered.length;
    return { ...filtered[idx], displayPosition: offset };
  });

  const PrevIcon = isRtl ? CaretRight : CaretLeft;
  const NextIcon = isRtl ? CaretLeft : CaretRight;

  return (
    <div>
      {/* Filter Pills + Carousel Controls */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {credentials.filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleFilterChange(filter.id)}
                className={`relative border px-3.5 py-2 text-xs transition ${
                  isActive
                    ? "border-[#C9A24D] text-[#090B0E] font-semibold"
                    : "border-[#C9A24D]/20 bg-[#111419] text-[#9CA3AF] hover:border-[#C9A24D]/50 hover:text-[#F3EFE6]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="certFilterBg"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="absolute inset-0 bg-[#C9A24D]"
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs tabular-nums text-[#9CA3AF]" dir="ltr">
            {String(safeIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous certificate"
              className="flex h-9 w-9 items-center justify-center border border-[#C9A24D]/30 bg-[#111419] text-[#F3EFE6] transition hover:border-[#C9A24D] hover:text-[#C9A24D]"
            >
              <PrevIcon size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next certificate"
              className="flex h-9 w-9 items-center justify-center border border-[#C9A24D]/30 bg-[#111419] text-[#F3EFE6] transition hover:border-[#C9A24D] hover:text-[#C9A24D]"
            >
              <NextIcon size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Animated Carousel Deck */}
      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${activeFilter}-${safeIndex}`}
            initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 md:grid-cols-3"
          >
            {visibleItems.map((cert, i) => (
              <SpotlightCard
                key={cert.id}
                className={`flex h-full flex-col justify-between p-6 ${
                  i === 0 ? "border-[#C9A24D]/45" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                      <Certificate size={14} weight="duotone" />
                      {cert.highlight}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">{cert.date}</span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold leading-snug text-[#F3EFE6]">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-[#C9A24D]">{cert.issuer}</p>
                </div>

                <div className="mt-6 border-t border-[#C9A24D]/15 pt-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-[#9CA3AF]">
                      {credentials.idLabel}
                    </span>
                    <span
                      dir="ltr"
                      className="block truncate text-xs font-mono text-[#F3EFE6]/85"
                    >
                      {cert.credentialId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyId(cert.credentialId)}
                    title="Copy Credential ID"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#C9A24D]/25 bg-[#090B0E] text-[#C9A24D] transition hover:border-[#C9A24D]"
                  >
                    {copiedId === cert.credentialId ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {filtered.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to certificate ${idx + 1}`}
            className={`h-1.5 transition-all duration-300 ${
              idx === safeIndex ? "w-7 bg-[#C9A24D]" : "w-2 bg-[#C9A24D]/25 hover:bg-[#C9A24D]/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}