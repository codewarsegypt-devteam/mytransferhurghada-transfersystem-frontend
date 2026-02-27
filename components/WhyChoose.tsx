"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Car,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

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
  icon: React.ComponentType<any>;
  title: string;
  description: string;
};

function TimelinePoint({ point, active }: { point: Point; active?: boolean }) {
  const Icon = point.icon;

  return (
    <div className="group relative flex gap-4 rounded-3xl border border-black/10 bg-white/70 backdrop-blur px-4 py-4 shadow-sm transition-all hover:shadow-md hover:bg-white/80">
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all",
          active
            ? "bg-[#F3722A] text-white border-[#F3722A]/30 shadow-[0_12px_28px_rgba(243,114,42,0.25)]"
            : "bg-white/80 text-[#F3722A] border-black/10 group-hover:bg-[#F3722A] group-hover:text-white group-hover:border-[#F3722A]/30",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <div className="text-[15px] font-extrabold tracking-tight text-[#2C3539]">
          {point.title}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-gray-700/90">
          {point.description}
        </div>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  const images = useMemo(
    () => ({
      timelineBg:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1800&q=80",
    }),
    []
  );

  const points: Point[] = useMemo(
    () => [
      {
        icon: Shield,
        title: "Licensed & Verified",
        description:
          "Certified by Egyptian tourism authorities  fully compliant and trusted.",
      },
      {
        icon: Users,
        title: "Local Experts, Real Support",
        description:
          "Professionals who know Egypt deeply  with fast, human assistance.",
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
    <section className="relative overflow-hidden  bg py-14 lg:py-20">
      {/* Premium background ornaments */}
      {/* <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-28 right-[-140px] h-[360px] w-[360px] rounded-full bg-[#F3722A]/16 blur-3xl" />
        <div className="absolute -bottom-28 left-[-150px] h-[380px] w-[380px] rounded-full bg-[#F9C74F]/18 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />
      </div> */}

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Why Choose Us"
          title=""
          // description="Luxury isn’t only vehicles — it’s clarity, reliability, and people who care."
        />

        <div className="mx-auto mt-10 max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/65 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
            {/* background image */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${images.timelineBg}')` }}
              />
              {/* luxury glass overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-white/88 via-white/70 to-white/50" />
              <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-white/30" />
            </div>

            {/* inner highlight */}
            <div
              className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#F9C74F]/22 blur-3xl"
              aria-hidden
            />

            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Top bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-700 border border-black/10">
                    <Sparkles className="h-4 w-4 text-[#F3722A]" />
                    Our promise
                  </div> */}

                  <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C3539]">
                  A Premium Travel Experience, Designed Around You
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
                    Premium travel is built on trust, comfort, and coordination 
                    every step should feel effortless.
                  </p>
                </div>

                {/* Count-up badge inside card */}
                <div
                  ref={badgeRef}
                  className=" hidden lg:block shrink-0 rounded-full border border-black/10 bg-white/75 backdrop-blur px-4 py-3 shadow-sm "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3722A]/10 border border-[#F3722A]/15">
                      <Shield className="h-5 w-5 text-[#F3722A]" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Trusted
                      </div>
                      <div className="text-xl font-extrabold text-[#2C3539] tabular-nums">
                        {formatNumber(value)}+
                      </div>
                      <div className="text-xs text-gray-600">happy travelers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium chips */}
              {/* <div className="mt-6 flex flex-wrap gap-2">
                {["Fixed pricing", "Verified team", "Modern vehicles", "On-time pickup"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs font-semibold text-[#2C3539]"
                    >
                      {t}
                    </span>
                  )
                )}
              </div> */}

              {/* Timeline as 2 columns on desktop */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                <TimelinePoint point={points[0]} active />
                <TimelinePoint point={points[1]} />
                <TimelinePoint point={points[2]} />
                {/* Extra luxury proof card */}
                <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur px-4 py-4 shadow-sm">
                  <div className="text-[15px] font-extrabold tracking-tight text-[#2C3539]">
                    Coverage & Coordination
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2C3539]">
                      <MapPin className="h-4 w-4 text-[#F3722A]" />
                      Hurghada • Cairo • Luxor • Aswan
                    </div>
                    <div className="h-4 w-px bg-black/10 hidden sm:block" />
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2C3539]">
                      <Clock className="h-4 w-4 text-[#F3722A]" />
                      Punctual pickups
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-[#F3722A]" />
                    Verified operations & driver coordination
                  </div>
                </div>
              </div>

              {/* CTA Row */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/transfer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F3722A] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(243,114,42,0.25)] transition-all hover:bg-[#F15A22] hover:translate-y-[-1px]"
                  >
                    Book a transfer
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contactus"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-[#2C3539] transition-all hover:bg-white hover:border-black/15"
                  >
                    <MessageCircle className="h-4 w-4 text-[#F3722A]" />
                    Talk to concierge
                  </Link>
                </div>

                <div className=" flex-wrap gap-2 hidden lg:flex">
                  <span className="rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs font-semibold text-gray-700">
                    Private • Door-to-door
                  </span>
                  <span className="rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs font-semibold text-gray-700">
                    Fast support
                  </span>
                  <span className="rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs font-semibold text-gray-700">
                    Clean vehicles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur px-5 py-2.5 text-xs font-semibold text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-[#F3722A]" />
            Licensed • Verified • Premium service
          </div>
        </div>
      </div>
    </section>
  );
}