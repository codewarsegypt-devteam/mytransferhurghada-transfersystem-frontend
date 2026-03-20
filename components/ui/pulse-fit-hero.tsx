"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroTransferForm } from "../hero components/HeroTransferForm";

const trustBadges = [
  { label: "Google Reviews", score: "4.9", sub: "Average rating" },
  { label: "Trustpilot", score: "4.8", sub: "Excellent" },
  { label: "Tripadvisor", score: "5.0", sub: "Travelers’ choice" },
];

type TransferHeroProps = {
  className?: string;
  backgroundImageUrl?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function TransferBookingHero({
  className,
  backgroundImageUrl = "/assets/pexels-clickerhappy-804463.jpg",
}: TransferHeroProps) {
  return (
    <section
      className={cn("relative overflow-hidden", className)}
      aria-label="Transfer booking hero"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />

        <div className="absolute inset-0 bg-[#003B5A]/35" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,52,84,0.35) 0%, rgba(0,52,84,0.22) 46%, rgba(0,52,84,0.42) 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white/55 to-transparent" />

      <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="w-full max-w-5xl">
          {/* Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl text-left"
          >
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2.2rem] lg:leading-tight">
              Reliable, low cost airport transfers
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
              Book a private transfer or shared shuttle at over 700 airports, stations and ports
              worldwide.
            </p>
          </motion.div>

          <div className="mt-6 flex justify-start sm:mt-8">
            <HeroTransferForm variant="landing" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-7 grid max-w-md grid-cols-1 gap-2 sm:max-w-none sm:grid-cols-3"
          >
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="rounded-md border border-black/10 bg-white px-3 py-2 text-center shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {b.label}
                </p>
                <p className="mt-0.5 text-base font-extrabold text-slate-900">{b.score}</p>
                <p className="text-[11px] text-slate-500">{b.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white/55 to-transparent" />
    </section>
  );
}
