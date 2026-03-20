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
      className={cn("relative min-h-[min(100dvh,900px)] overflow-hidden", className)}
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
          className="object-cover"
          aria-hidden
        />

        <div className="absolute inset-0 bg-[#08111F]/70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,17,31,0.82) 0%, rgba(8,17,31,0.62) 42%, rgba(8,17,31,0.92) 100%)",
          }}
          aria-hidden
        />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 40px)",
          }}
          aria-hidden
        />

        <div className="absolute -top-24 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[#C9A14A]/15 blur-3xl" />
      </div>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent" />

      <div className="relative mx-auto flex min-h-[min(100dvh,900px)] max-w-7xl items-center px-4 py-28 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Reliable, low-cost airport &amp; hotel transfers
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Book a private ride across the Red Sea region and major Egyptian cities — clear
              prices, professional drivers, and easy confirmation.
            </p>
          </motion.div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <HeroTransferForm variant="landing" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-md"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  {b.label}
                </p>
                <p className="mt-1 text-lg font-extrabold text-white">{b.score}</p>
                <p className="text-xs text-white/55">{b.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent" />
    </section>
  );
}
