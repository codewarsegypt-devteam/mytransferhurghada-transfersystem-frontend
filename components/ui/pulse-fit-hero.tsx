"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Clock3, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroTransferForm } from "../hero components/HeroTransferForm";

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

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified Service",
    text: "Trusted drivers and reliable routes",
  },
  {
    icon: Clock3,
    title: "On-Time Pickup",
    text: "Smooth coordination for every ride",
  },
  {
    icon: BadgeDollarSign,
    title: "Fixed Price",
    text: "Clear pricing with no surprises",
  },
];

export default function TransferBookingHero({
  className,
  backgroundImageUrl = "/assets/pexels-clickerhappy-804463.jpg",
}: TransferHeroProps) {
  return (
    <section
      className={cn("relative min-h-screen overflow-hidden", className)}
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

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            {/* <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A] backdrop-blur-sm">
              Private Transfers
            </span> */}

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
              Fast booking for your
              <span className="block text-[#C9A14A]">
                next transfer in Egypt
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-center">
              Select your pickup, destination, and travel date to find the right
              transfer route with clear pricing and smooth confirmation.
            </p>
          </motion.div>

          <div className="flex justify-center mt-10 md:mt-0">
            <HeroTransferForm />
          </div>

          {/* Trust items */}
          {/* <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {trustItems.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-center backdrop-blur-sm"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A14A]/15 text-[#C9A14A]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  {text}
                </p>
              </div>
            ))}
          </motion.div> */}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent" />
    </section>
  );
}
