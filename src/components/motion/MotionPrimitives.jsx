import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
} from "motion/react";

/**
 * 1. Top Gold-to-Emerald Scroll Progress Bar
 */
export function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C9A24D] via-[#E4C67D] to-[#10B981] origin-left z-50 pointer-events-none"
    />
  );
}

/**
 * 2. Blur-to-sharp entrance (replays cleanly on scroll)
 */
export function BlurFade({ children, delay = 0, yOffset = 18, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 3. Interactive cursor-tracking obsidian card (120fps, zero re-renders)
 */
export function SpotlightCard({ children, className = "", onClick }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(-999);
  const mouseY = useMotionValue(-999);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(e) {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(-999);
    mouseY.set(-999);
  }

  const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(201, 162, 77, 0.13), transparent 75%)`;
  const borderGlow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.4), transparent 75%)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative overflow-hidden border border-[#C9A24D]/18 bg-[#111419] transition-colors duration-300 hover:border-[#C9A24D]/40 ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: borderGlow,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/**
 * 4. Animated perimeter beam around Hero portrait
 */
export function BorderBeam({ duration = 10 }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-[100%] opacity-45"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg 280deg, rgba(201, 162, 77, 0.85) 320deg, rgba(16, 185, 129, 0.8) 345deg, transparent 360deg)",
        }}
      />
      <div className="absolute inset-[1px] bg-[#0D1014]" />
    </div>
  );
}

/**
 * 5. Magnetic cursor attraction for primary CTA buttons
 */
export function MagneticButton({ children, className = "", onClick, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(e) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.16);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.16);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/**
 * 6. Animated metric counter on scroll reveal (ESLint-clean)
 */
export function NumberTicker({ value, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || shouldReduceMotion) return;

    let startTime = null;
    const duration = 1150;
    let frameId;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * value);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, shouldReduceMotion]);

  const activeValue = shouldReduceMotion ? value : displayValue;
  const formatted =
    decimals > 0
      ? activeValue.toFixed(decimals)
      : Math.round(activeValue).toLocaleString("en-US");

  return (
    <span ref={ref} dir="ltr" className="inline-block tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * 7. Moving Dual-Track Infinite Skills Marquee (Pauses on hover, RTL-safe)
 */
export function SkillsMarquee({ items, reverse = false, accent = "gold", isRtl = false }) {
  const doubled = [...items, ...items];
  const badgeClasses =
    accent === "emerald"
      ? "border-emerald-500/25 bg-emerald-950/20 text-[#F3EFE6] hover:border-emerald-400/60"
      : "border-[#C9A24D]/25 bg-[#111419] text-[#F3EFE6] hover:border-[#C9A24D]/70";
  const dotColor = accent === "emerald" ? "bg-emerald-400" : "bg-[#C9A24D]";

  return (
    <div dir="ltr" className="marquee-wrapper relative overflow-hidden py-2">
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{ background: "linear-gradient(to right, var(--bg-alt), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{ background: "linear-gradient(to left, var(--bg-alt), transparent)" }}
      />

      <div className={reverse ? "animate-marquee-reverse" : "animate-marquee-forward"}>
        {doubled.map((skill, idx) => (
          <div
            key={`${skill}-${idx}`}
            dir={isRtl ? "rtl" : "ltr"}
            className={`mx-2 inline-flex shrink-0 items-center gap-2.5 border px-4 py-2.5 text-xs sm:text-sm transition-colors ${badgeClasses}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            <span className="whitespace-nowrap">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}