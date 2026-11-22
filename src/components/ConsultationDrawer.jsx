import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, WhatsappLogo, Copy, Check, PaperPlaneTilt, LinkedinLogo } from "@phosphor-icons/react";
import { CONTACT_CONFIG } from "../data/content";

export function ConsultationDrawer({ isOpen, onClose, copy, isRtl }) {
  const [name, setName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTopic = selectedTopic || copy.topics[0];

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError(copy.validationError);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(CONTACT_CONFIG.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const whatsappHref = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `${name ? `${name} — ` : ""}[${activeTopic}] ${message}`
  )}`;

  const slideOffset = isRtl ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
        >
          <motion.aside
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed top-0 bottom-0 ${
              isRtl ? "left-0 border-r" : "right-0 border-l"
            } w-full max-w-md overflow-y-auto border-[#C9A24D]/25 bg-[#111419] p-6 sm:p-8 shadow-2xl`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#C9A24D]/15 pb-5">
              <div>
                <h3 className="text-xl font-semibold text-[#F3EFE6]">{copy.title}</h3>
                <p className="mt-1.5 text-sm text-[#9CA3AF]">{copy.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#C9A24D]/25 text-[#9CA3AF] transition hover:border-[#C9A24D] hover:text-[#F3EFE6]"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="mt-8 border border-[#C9A24D]/35 bg-[#090B0E] p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/60 text-emerald-400">
                  <Check size={24} weight="bold" />
                </div>
                <h4 className="text-lg font-semibold text-[#F3EFE6]">{copy.successTitle}</h4>
                <p className="mt-2 text-sm text-[#9CA3AF]">{copy.successDesc}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="mt-4 text-xs text-[#C9A24D] underline underline-offset-4"
                >
                  {isRtl ? "تجهيز رسالة جديدة" : "Prepare another inquiry"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#C9A24D]">
                    {copy.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={copy.namePlaceholder}
                    className="w-full border border-[#C9A24D]/25 bg-[#090B0E] px-4 py-3 text-sm text-[#F3EFE6] placeholder:text-[#9CA3AF]/50 focus:border-[#C9A24D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#C9A24D]">
                    {copy.topicLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {copy.topics.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedTopic(item)}
                        className={`border px-3 py-1.5 text-xs transition ${
                          activeTopic === item
                            ? "border-[#C9A24D] bg-[#C9A24D]/15 text-[#C9A24D]"
                            : "border-[#C9A24D]/20 bg-[#090B0E] text-[#9CA3AF] hover:border-[#C9A24D]/45"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#C9A24D]">
                    {copy.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={copy.messagePlaceholder}
                    className="w-full resize-none border border-[#C9A24D]/25 bg-[#090B0E] px-4 py-3 text-sm text-[#F3EFE6] placeholder:text-[#9CA3AF]/50 focus:border-[#C9A24D] focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 bg-[#C9A24D] px-5 py-3.5 text-sm font-semibold text-[#090B0D] transition hover:bg-[#d8b461]"
                >
                  <PaperPlaneTilt size={18} weight="bold" />
                  <span>{copy.submit}</span>
                </button>
              </form>
            )}

            {/* Direct Channels */}
            <div className="mt-8 border-t border-[#C9A24D]/15 pt-6 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2.5 border border-emerald-500/35 bg-emerald-950/35 px-4 py-3 text-sm font-medium text-[#F3EFE6] transition hover:border-emerald-400 hover:bg-emerald-950/60"
              >
                <WhatsappLogo size={20} weight="fill" className="text-emerald-400" />
                <span dir="ltr">{copy.whatsappBtn}</span>
              </a>

              <a
                href={CONTACT_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 border border-[#C9A24D]/25 bg-[#090B0E] px-4 py-3 text-sm text-[#F3EFE6] transition hover:border-[#C9A24D]"
              >
                <LinkedinLogo size={18} weight="fill" className="text-[#0A66C2]" />
                <span>{copy.linkedinBtn}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex w-full items-center justify-between border border-[#C9A24D]/20 bg-[#090B0E] px-4 py-3 text-xs text-[#F3EFE6] transition hover:border-[#C9A24D]/50"
              >
                <span dir="ltr" className="truncate">{CONTACT_CONFIG.email}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[#C9A24D]">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? copy.emailCopied : copy.copyEmail}
                </span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}