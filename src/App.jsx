import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDown,
  ShieldCheck,
  Brain,
  Handshake,
  CheckCircle,
  Buildings,
  GraduationCap,
  LinkedinLogo,
  Globe,
  Briefcase,
  WhatsappLogo,
  Sparkle,
  Sun,
  Moon,
  List,
  X,
} from "@phosphor-icons/react";

import { CONTENT, CONTACT_CONFIG } from "./data/content";
import { MonogramLogo } from "./components/MonogramLogo";
import { CertificationsCarousel } from "./components/CertificationsCarousel";
import { ConsultationDrawer } from "./components/ConsultationDrawer";
import {
  ScrollProgressLine,
  BlurFade,
  SpotlightCard,
  BorderBeam,
  MagneticButton,
  NumberTicker,
  SkillsMarquee,
} from "./components/motion/MotionPrimitives";

export default function App() {
  const [lang, setLang] = useState("ar"); // Defaults to Arabic RTL
  const [theme, setTheme] = useState("light"); // Defaults to Clinical Ivory & Gold
  const [activePillar, setActivePillar] = useState("insurance");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRtl = lang === "ar";
  const t = CONTENT[lang];
  const DirectionArrow = isRtl ? ArrowUpLeft : ArrowUpRight;

  // Lenis smooth scroll
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Hero portrait parallax
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(heroScroll, [0, 1], [0, shouldReduceMotion ? 0 : 48]);

  // Career timeline vertical progress rail
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  });

  const selectedPillar =
    t.pillars.tabs.find((tab) => tab.id === activePillar) || t.pillars.tabs[0];

  function scrollToId(id) {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function renderPillarIcon(id) {
    if (id === "insurance") return <ShieldCheck size={17} weight="duotone" />;
    if (id === "pr") return <Handshake size={17} weight="duotone" />;
    return <Brain size={17} weight="duotone" />;
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#090B0E] text-[#F3EFE6] overflow-x-clip"
    >
      <ScrollProgressLine />

      {/* 1. Floating Executive Navbar */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-[#C9A24D]/15 bg-[#090B0E]/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("top");
            }}
          >
            <MonogramLogo isRtl={isRtl} />
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {t.nav.links.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                className="text-sm text-[#9CA3AF] transition hover:text-[#C9A24D]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              aria-label={
                theme === "light"
                  ? isRtl
                    ? "التبديل إلى الوضع الداكن"
                    : "Switch to Dark Obsidian theme"
                  : isRtl
                  ? "التبديل إلى الوضع الذهبي الفاتح"
                  : "Switch to Ivory & Gold theme"
              }
              className="inline-flex h-[34px] w-[34px] items-center justify-center border border-[#C9A24D]/25 bg-[#111419] text-[#C9A24D] transition hover:border-[#C9A24D]"
            >
              {theme === "light" ? (
                <Moon size={16} weight="duotone" />
              ) : (
                <Sun size={16} weight="duotone" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setLang((prev) => (prev === "ar" ? "en" : "ar"))}
              aria-label={t.nav.langAria}
              className="inline-flex items-center gap-1.5 border border-[#C9A24D]/25 bg-[#111419] px-3 py-2 text-xs font-medium text-[#F3EFE6] transition hover:border-[#C9A24D]"
            >
              <Globe size={15} className="text-[#C9A24D]" />
              <span>{t.nav.langToggle}</span>
            </button>

            <MagneticButton
              onClick={() => setDrawerOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-[#C9A24D] px-4 py-2 text-xs sm:text-sm font-semibold text-[#090B0E] transition hover:bg-[#d8b461]"
            >
              <span>{t.nav.cta}</span>
              <DirectionArrow size={15} weight="bold" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={isRtl ? "قائمة التنقل" : "Toggle navigation menu"}
              className="inline-flex md:hidden h-[34px] w-[34px] items-center justify-center border border-[#C9A24D]/30 bg-[#111419] text-[#C9A24D] transition hover:border-[#C9A24D]"
            >
              {mobileMenuOpen ? <X size={17} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Mobile Executive Navigation Bar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg-main) 95%, transparent)",
              }}
              className="md:hidden overflow-hidden border-t border-[#C9A24D]/20 backdrop-blur-md"
            >
              <div className="mx-auto max-w-6xl space-y-2 px-5 py-4">
                {t.nav.links.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: isRtl ? 14 : -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    onClick={() => scrollToId(item.id)}
                    className="flex w-full items-center justify-between border border-[#C9A24D]/15 bg-[#111419] px-4 py-3 text-sm font-medium text-[#F3EFE6] transition hover:border-[#C9A24D] hover:text-[#C9A24D]"
                  >
                    <span className="flex items-center gap-3">
                      <span dir="ltr" className="text-[11px] font-mono text-[#C9A24D]">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <DirectionArrow size={15} className="text-[#C9A24D]" />
                  </motion.button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDrawerOpen(true);
                  }}
                  className="sm:hidden mt-2 flex w-full items-center justify-center gap-2 bg-[#C9A24D] px-4 py-3 text-sm font-semibold text-[#090B0E] transition hover:bg-[#d8b461]"
                >
                  <span>{t.nav.cta}</span>
                  <DirectionArrow size={16} weight="bold" />
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section
        id="top"
        ref={heroRef}
        className="bg-ledger-grid relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-[#C9A24D]/15"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg-main) 45%, transparent) 55%, var(--bg-main) 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BlurFade delay={0.04}>
              <div className="inline-flex items-center gap-2 border border-emerald-500/25 bg-emerald-950/25 px-3 py-1 text-[11px] font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.hero.availabilityTag}</span>
              </div>
            </BlurFade>

            <BlurFade delay={0.09}>
              <p className="mt-4 text-xs font-medium tracking-wide text-[#C9A24D]">
                {t.hero.eyebrow}
              </p>
              <p className="mt-1.5 text-base font-semibold text-[#F3EFE6]/90">
                {t.hero.nameBadge}
              </p>
            </BlurFade>

            <BlurFade delay={0.16}>
              <h1 className="font-editorial mt-3 text-4xl font-semibold leading-[1.12] text-[#F3EFE6] sm:text-6xl lg:text-[4.15rem]">
                {t.hero.titleLine1}
                <span className={`block text-[#C9A24D] ${!isRtl ? "italic font-medium" : "mt-1"}`}>
                  {t.hero.titleAccent}
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.22}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#9CA3AF] sm:text-lg">
                {t.hero.subtitle}
              </p>
            </BlurFade>

            <BlurFade delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <MagneticButton
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-[#C9A24D] px-6 py-3.5 text-sm font-semibold text-[#090B0E] transition hover:bg-[#d8b461]"
                >
                  <span>{t.hero.primaryCta}</span>
                  <DirectionArrow size={17} weight="bold" />
                </MagneticButton>

                <button
                  type="button"
                  onClick={() => scrollToId("credentials")}
                  className="inline-flex items-center gap-2.5 border border-[#C9A24D]/35 bg-[#111419] px-6 py-3.5 text-sm font-medium text-[#F3EFE6] transition hover:border-emerald-400/60 hover:bg-[#161a20]"
                >
                  <Sparkle size={16} weight="duotone" className="text-emerald-400" />
                  <span>{t.hero.secondaryCta}</span>
                </button>
              </div>
            </BlurFade>

            <BlurFade delay={0.34}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[#9CA3AF]">
                <span className="inline-flex items-center gap-1.5">
                  <Buildings size={15} className="text-[#C9A24D]" />
                  {t.hero.badges[0]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-emerald-400" />
                  {t.hero.badges[1]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LinkedinLogo size={15} className="text-[#0A66C2]" />
                  {t.hero.badges[2]}
                </span>
              </div>
            </BlurFade>
          </div>

          {/* Editorial Portrait Frame */}
          <div className="lg:col-span-5">
            <motion.div style={{ y: portraitY }} className="relative mx-auto max-w-sm">
              <div className="relative border border-[#C9A24D]/25 bg-[#0D1014] p-3">
                <BorderBeam duration={10} />
                <span className="pointer-events-none absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-[#C9A24D]" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

                <div className="relative z-10 aspect-[4/4.6] w-full overflow-hidden border border-[#C9A24D]/15 bg-[#111419]">
                  {CONTACT_CONFIG.portraitImage ? (
                    <img
                      src={CONTACT_CONFIG.portraitImage}
                      alt={t.hero.nameBadge}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-between p-6 text-center">
                      <span className="border border-emerald-500/30 bg-emerald-950/35 px-3 py-1 text-[11px] text-emerald-300">
                        {t.hero.portraitTag}
                      </span>
                      <span className="font-editorial text-5xl font-semibold tracking-wider text-[#C9A24D]/80">
                        {isRtl ? "م ص" : "MS"}
                      </span>
                      <span className="text-[11px] tracking-wider text-[#9CA3AF]">
                        {t.hero.portraitComingSoon}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-3 flex items-center justify-between px-1 text-[11px] text-[#9CA3AF]">
                  <span>{t.hero.portraitFigure}</span>
                  <a
                    href={CONTACT_CONFIG.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="text-[#C9A24D] hover:underline underline-offset-4"
                  >
                    misyemen.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 flex max-w-6xl justify-center px-5 sm:justify-start sm:px-8">
          <button
            type="button"
            onClick={() => scrollToId("metrics")}
            className="inline-flex items-center gap-2 text-xs text-[#9CA3AF] transition hover:text-[#C9A24D]"
          >
            <span>{t.hero.scrollHint}</span>
            <ArrowDown size={14} className="animate-bounce text-[#C9A24D]" />
          </button>
        </div>
      </section>

      {/* 3. Credibility Ticker Strip */}
      <section id="metrics" className="border-b border-[#C9A24D]/15 bg-[#0C0F13]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y sm:divide-y-0 sm:grid-cols-4 sm:divide-x divide-[#C9A24D]/15 rtl:sm:divide-x-reverse">
          {t.metrics.map((m, idx) => (
            <BlurFade key={idx} delay={idx * 0.06} className="px-6 py-8 text-center sm:text-start">
              <div className="font-editorial text-3xl font-semibold text-[#C9A24D] sm:text-4xl">
                <NumberTicker
                  value={m.value}
                  decimals={m.decimals}
                  prefix={m.prefix}
                  suffix={m.suffix}
                />
              </div>
              <p className="mt-2 text-xs text-[#9CA3AF]">{m.label}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* 4. Interactive 3-Pillar Lens Switcher + Services & Opportunities */}
      <section id="pillars" className="py-20 sm:py-28 border-b border-[#C9A24D]/15">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <BlurFade>
                <p className="text-xs font-semibold tracking-wider text-[#C9A24D]">
                  {t.pillars.sectionTag}
                </p>
                <h2 className="font-editorial mt-3 text-3xl font-semibold leading-tight text-[#F3EFE6] sm:text-5xl">
                  {t.pillars.titleStart}{" "}
                  <span className={`text-[#C9A24D] ${!isRtl ? "italic font-medium" : ""}`}>
                    {t.pillars.titleAccent}
                  </span>
                </h2>
              </BlurFade>
            </div>
            <div className="lg:col-span-5">
              <BlurFade delay={0.1}>
                <p className="text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
                  {t.pillars.description}
                </p>
              </BlurFade>
            </div>
          </div>

          {/* Animated Tab Bar */}
          <div className="mt-10 flex flex-wrap gap-3 border-b border-[#C9A24D]/15 pb-5">
            {t.pillars.tabs.map((tab) => {
              const isSelected = activePillar === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePillar(tab.id)}
                  className={`relative inline-flex items-center gap-2 border px-4 py-2.5 text-xs sm:text-sm font-medium transition ${
                    isSelected
                      ? "border-[#C9A24D] text-[#090B0E]"
                      : "border-[#C9A24D]/20 bg-[#111419] text-[#9CA3AF] hover:border-[#C9A24D]/50 hover:text-[#F3EFE6]"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="pillarActiveTab"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 bg-[#C9A24D]"
                    />
                  )}
                  <span className="relative z-10">{renderPillarIcon(tab.id)}</span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Smooth Morphing Pillar Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lang}-${selectedPillar.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <SpotlightCard className="p-7 sm:p-10">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-5">
                    <span className="inline-block border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                      {selectedPillar.tag}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-[#F3EFE6] sm:text-3xl">
                      {selectedPillar.headline}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">
                      {selectedPillar.summary}
                    </p>
                    <p className="mt-5 text-xs font-medium text-[#C9A24D]">
                      {selectedPillar.metricsTag}
                    </p>
                  </div>

                  <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-s border-[#C9A24D]/15 pt-6 lg:pt-0 lg:ps-8">
                    <ul className="space-y-4">
                      {selectedPillar.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#F3EFE6]/90">
                          <CheckCircle
                            size={19}
                            weight="duotone"
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>

          {/* Services & Open Opportunities Matrix */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <BlurFade delay={0.08}>
              <SpotlightCard className="h-full p-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#F3EFE6]">
                    {t.pillars.servicesTitle}
                  </h3>
                  <Briefcase size={20} weight="duotone" className="text-[#C9A24D]" />
                </div>
                <p className="mt-1.5 text-xs text-emerald-300">{t.pillars.servicesAvailability}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.pillars.servicesList.map((srv) => (
                    <span
                      key={srv}
                      className="border border-[#C9A24D]/20 bg-[#090B0E] px-3 py-1.5 text-xs text-[#F3EFE6]/90"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </BlurFade>

            <BlurFade delay={0.14}>
              <SpotlightCard className="h-full p-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#F3EFE6]">
                    {t.pillars.opportunitiesTitle}
                  </h3>
                  <Sparkle size={20} weight="duotone" className="text-emerald-400" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.pillars.opportunitiesList.map((opp) => (
                    <span
                      key={opp}
                      className="border border-emerald-500/25 bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-200"
                    >
                      {opp}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* 5. Scroll-Driven Career Timeline (All 5 Roles + Education) */}
      <section id="experience" className="py-20 sm:py-28 border-b border-[#C9A24D]/15 bg-[#0C0F13]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <BlurFade>
            <p className="text-xs font-semibold tracking-wider text-[#C9A24D]">
              {t.experience.sectionTag}
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-semibold text-[#F3EFE6] sm:text-5xl">
              {t.experience.titleStart}{" "}
              <span className={`text-[#C9A24D] ${!isRtl ? "italic font-medium" : ""}`}>
                {t.experience.titleAccent}
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#9CA3AF] sm:text-base">
              {t.experience.subtitle}
            </p>
          </BlurFade>

          {/* Animated Scroll Rail */}
          <div ref={timelineRef} className="relative mt-12 ps-7 sm:ps-10">
            <div className="absolute top-0 bottom-0 start-2 w-[2px] bg-[#C9A24D]/15" />
            <motion.div
              style={{ scaleY: timelineScroll, transformOrigin: "top" }}
              className="absolute top-0 bottom-0 start-2 w-[2px] bg-gradient-to-b from-[#C9A24D] to-emerald-400"
            />

            <div className="space-y-6">
              {t.experience.roles.map((role, idx) => (
                <BlurFade key={idx} delay={idx * 0.05} className="relative">
                  <span className="absolute -start-[26px] sm:-start-[38px] top-6 h-3 w-3 rounded-full border-2 border-[#C9A24D] bg-[#090B0E]" />
                  <SpotlightCard className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="border border-[#C9A24D]/30 bg-[#C9A24D]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#C9A24D]">
                        {role.badge}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        {role.period} • {role.duration}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg sm:text-xl font-semibold text-[#F3EFE6]">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-emerald-300">
                      {role.org} — <span className="text-[#9CA3AF]">{role.location}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">{role.details}</p>
                  </SpotlightCard>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Verified Credentials Carousel */}
      <section id="credentials" className="py-20 sm:py-28 border-b border-[#C9A24D]/15">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <BlurFade>
            <p className="text-xs font-semibold tracking-wider text-[#C9A24D]">
              {t.credentials.sectionTag}
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-semibold text-[#F3EFE6] sm:text-5xl">
              {t.credentials.titleStart}{" "}
              <span className={`text-[#C9A24D] ${!isRtl ? "italic font-medium" : ""}`}>
                {t.credentials.titleAccent}
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#9CA3AF] sm:text-base">
              {t.credentials.subtitle}
            </p>
          </BlurFade>

          <CertificationsCarousel credentials={t.credentials} isRtl={isRtl} />
        </div>
      </section>

      {/* 7. Dual-Track Moving Skills Marquee */}
      <section id="skills" className="py-20 sm:py-24 border-b border-[#C9A24D]/15 bg-[#0C0F13]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 mb-10">
          <BlurFade>
            <p className="text-xs font-semibold tracking-wider text-[#C9A24D]">
              {t.skills.sectionTag}
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-semibold text-[#F3EFE6] sm:text-5xl">
              {t.skills.titleStart}{" "}
              <span className={`text-[#C9A24D] ${!isRtl ? "italic font-medium" : ""}`}>
                {t.skills.titleAccent}
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#9CA3AF]">{t.skills.subtitle}</p>
          </BlurFade>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mx-auto max-w-6xl px-5 sm:px-8 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#C9A24D]">
              {t.skills.track1Label}
            </p>
            <SkillsMarquee items={t.skills.track1} accent="gold" isRtl={isRtl} />
          </div>

          <div>
            <p className="mx-auto max-w-6xl px-5 sm:px-8 mb-2 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              {t.skills.track2Label}
            </p>
            <SkillsMarquee items={t.skills.track2} reverse accent="emerald" isRtl={isRtl} />
          </div>
        </div>
      </section>

      {/* 8. Conversion CTA & Footer */}
      <footer id="contact" className="py-20 sm:py-24 bg-[#07090B]">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <BlurFade>
            <p className="text-xs font-semibold tracking-wider text-[#C9A24D]">
              {t.ctaFooter.sectionTag}
            </p>
            <h2 className="font-editorial mt-4 text-4xl font-semibold text-[#F3EFE6] sm:text-6xl">
              {t.ctaFooter.titleStart}
              <span className={`block text-[#C9A24D] ${!isRtl ? "italic font-medium" : "mt-1"}`}>
                {t.ctaFooter.titleAccent}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-[#9CA3AF] sm:text-base">
              {t.ctaFooter.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MagneticButton
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#C9A24D] px-7 py-4 text-sm font-semibold text-[#090B0E] transition hover:bg-[#d8b461]"
              >
                <span>{t.ctaFooter.button}</span>
                <DirectionArrow size={17} weight="bold" />
              </MagneticButton>

              <a
                href={CONTACT_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-[#C9A24D]/30 bg-[#111419] px-6 py-4 text-sm font-medium text-[#F3EFE6] transition hover:border-[#0A66C2]"
              >
                <LinkedinLogo size={18} weight="fill" className="text-[#0A66C2]" />
                <span>{t.ctaFooter.linkedinBtn}</span>
              </a>
            </div>
          </BlurFade>
        </div>

        {/* Owner Footer Row */}
        <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-[#C9A24D]/15 px-5 pt-8 text-xs text-[#9CA3AF] sm:flex-row sm:px-8">
          <MonogramLogo isRtl={isRtl} />
          <div className="flex flex-wrap items-center gap-6">
            <span>{t.ctaFooter.location}</span>
            <span>{t.ctaFooter.copyright}</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              dir="ltr"
              className="text-[#C9A24D] hover:underline underline-offset-4"
            >
              {CONTACT_CONFIG.email}
            </a>
            <span dir="ltr" className="text-[#F3EFE6]/80">
              {CONTACT_CONFIG.phoneDisplay}
            </span>
          </div>
        </div>

        {/* Bestryful Soft Agency Credit Bar */}
        <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-[#C9A24D]/10 px-5 pt-6 text-xs text-[#9CA3AF] sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <span>{isRtl ? "تصميم وتطوير:" : "Crafted by"}</span>
            <a
              href={CONTACT_CONFIG.agency.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-[#C9A24D]/25 bg-[#111419] px-3 py-1.5 text-[#F3EFE6] transition hover:border-[#C9A24D]/60"
            >
              <img
                src={CONTACT_CONFIG.agency.logo}
                alt={CONTACT_CONFIG.agency.name}
                className="h-5 w-5 rounded bg-white object-contain p-0.5"
              />
              <span className="font-semibold">{CONTACT_CONFIG.agency.name}</span>
              <DirectionArrow size={12} className="text-[#C9A24D]" />
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/${CONTACT_CONFIG.agency.whatsappNumber}?text=${encodeURIComponent(
                CONTACT_CONFIG.agency.premadeMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              aria-label={isRtl ? "تواصل مع Bestryful Soft عبر واتساب" : "Contact Bestryful Soft on WhatsApp"}
              title={isRtl ? "تواصل مع Bestryful Soft عبر واتساب" : "Contact Bestryful Soft on WhatsApp"}
              className="flex h-8 w-8 items-center justify-center border border-emerald-500/30 bg-emerald-950/35 text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-950/60"
            >
              <WhatsappLogo size={18} weight="fill" />
            </a>
          </div>
        </div>
      </footer>

      <ConsultationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        copy={t.drawer}
        isRtl={isRtl}
      />
    </div>
  );
}