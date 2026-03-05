"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Users,
  Car,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

function useCountUpOnView({
  to,
  duration = 1600,
  start = 0,
  once = true,
}: {
  to: number;
  duration?: number;
  start?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(start);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const run = () => {
      if (reduceMotion) {
        setValue(to);
        return;
      }
      const t0 = performance.now();
      const from = start;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (once && startedRef.current) return;
        startedRef.current = true;
        run();
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, start, once]);

  return { ref, value };
}

type Point = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function FeatureCard({ point, active }: { point: Point; active?: boolean }) {
  const Icon = point.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex gap-4 rounded-md border border-white/10 bg-white/8 backdrop-blur px-4 py-4 transition-all hover:bg-white/12 hover:border-[#C9A14A]/30"
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border transition-all",
          active
            ? "bg-[#C9A14A] text-white border-[#C9A14A]/50 shadow-[0_8px_20px_rgba(201,161,74,0.3)]"
            : "bg-white/10 text-[#C9A14A] border-white/10 group-hover:bg-[#C9A14A] group-hover:text-white group-hover:border-[#C9A14A]/40",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold tracking-tight text-white">
          {point.title}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-white/60">
          {point.description}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyChoose() {
  const points: Point[] = useMemo(
    () => [
      {
        icon: Shield,
        title: "Licensed & Verified",
        description:
          "Certified by Egyptian tourism authorities — fully compliant and trusted.",
      },
      {
        icon: Users,
        title: "Local Experts, Real Support",
        description:
          "Professionals who know Egypt deeply with fast, human assistance.",
      },
      {
        icon: Car,
        title: "Comfort as a Standard",
        description:
          "Modern, air-conditioned vehicles and reliable pickup coordination.",
      },
    ],
    []
  );

  const { ref: badgeRef, value } = useCountUpOnView({
    to: 10000,
    duration: 1700,
    start: 0,
    once: true,
  });

  return (
    <motion.section
      className="relative overflow-hidden bg-[#0D1B2A] py-16 lg:py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Background image with strong overlay */}
      <div className="absolute inset-0">
        <Image
          src="/assets/about.webp"
          alt="Why Choose Us"
          width={1600}
          height={900}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0D1B2A]/90 via-main/70 to-[#0D1B2A]/85" />
      </div>

      {/* Gold accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-transparent via-[#C9A14A] to-transparent" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp}>
          <SectionHeader
            subtitle="Why Choose Us"
            title=""
          />
        </motion.div>

        <div className="mx-auto mt-2 max-w-7xl">
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-md border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            {/* Decorative corner glow */}
            <div
              className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#C9A14A]/12 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-main/30 blur-3xl"
              aria-hidden
            />

            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Top bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <motion.div variants={fadeLeft}>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    A Premium Travel Experience,{" "}
                    <span className="text-[#C9A14A]">Designed Around You</span>
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl">
                    Premium travel is built on trust, comfort, and coordination
                    — every step should feel effortless.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeRight}
                  ref={badgeRef}
                  className="hidden lg:block shrink-0 rounded-md border border-[#C9A14A]/20 bg-[#C9A14A]/8 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#C9A14A]/15 border border-[#C9A14A]/20">
                      <Shield className="h-5 w-5 text-[#C9A14A]" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
                        Trusted
                      </div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {formatNumber(value)}+
                      </div>
                      <div className="text-xs text-white/50">happy travelers</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Feature cards */}
              <motion.div
                variants={sectionVariants}
                className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4"
              >
                <FeatureCard point={points[0]} active />
                <FeatureCard point={points[1]} />
                <FeatureCard point={points[2]} />

                <motion.div
                  variants={fadeUp}
                  className="rounded-md border border-white/10 bg-white/6 backdrop-blur px-4 py-4"
                >
                  <div className="text-sm font-bold tracking-tight text-white">
                    Coverage &amp; Coordination
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                      <MapPin className="h-4 w-4 text-[#C9A14A]" />
                      Hurghada · Cairo · Luxor · Aswan
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                      <Clock className="h-4 w-4 text-[#C9A14A]" />
                      Punctual pickups
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A14A]" />
                    Verified operations &amp; driver coordination
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/transfer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A14A] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#DDB96A] hover:-translate-y-0.5"
                  >
                    Book a Transfer
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contactus"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/12 hover:border-white/25"
                  >
                    <MessageCircle className="h-4 w-4 text-[#C9A14A]" />
                    Talk to Concierge
                  </Link>
                </div>

                <div className="flex-wrap gap-2 hidden lg:flex">
                  <span className="rounded-sm border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/50">
                    Private · Door-to-door
                  </span>
                  <span className="rounded-sm border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/50">
                    Fast support
                  </span>
                  <span className="rounded-sm border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/50">
                    Clean vehicles
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/6 backdrop-blur px-5 py-2.5 text-xs font-semibold text-white/50">
            <CheckCircle2 className="h-4 w-4 text-[#C9A14A]" />
            Licensed · Verified · Premium service
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
