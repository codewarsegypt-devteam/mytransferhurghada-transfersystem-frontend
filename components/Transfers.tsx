"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Shield,
  Sparkles,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

interface TransferOption {
  id: number;
  title: string;
  description: string;
  routes: string[];
  price: string;
  duration: string;
  image: string;
  popular?: boolean;
}

const transferOptions: TransferOption[] = [
  {
    id: 1,
    title: "Airport Transfer",
    description: "Comfortable ride from airport to your hotel",
    routes: ["Airport", "Hotel Zone", "Downtown"],
    price: "25",
    duration: "30-45 min",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
    popular: true,
  },
  {
    id: 2,
    title: "Hotel Transfer",
    description: "Convenient transfers between hotels",
    routes: ["Any Hotel", "Beach Resorts", "City Hotels"],
    price: "20",
    duration: "20-40 min",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80",
    popular: false,
  },
  {
    id: 3,
    title: "Custom Transfer",
    description: "Personalized transfers to any destination",
    routes: ["Custom Route", "Multiple Stops", "Flexible"],
    price: "35",
    duration: "Flexible",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80",
    popular: false,
  },
];

const keyFeatures = [
  { icon: DollarSign, title: "Fixed Prices", description: "No surprises, no hidden fees" },
  { icon: Car, title: "Executive Vehicles", description: "Modern, air-conditioned comfort" },
  { icon: Shield, title: "Professional Drivers", description: "Licensed, experienced, reliable" },
  { icon: Clock, title: "On-Time Pickup", description: "We respect your schedule" },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function StepPill({
  active,
  label,
  index,
}: {
  active: boolean;
  label: string;
  index: number;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border",
        active
          ? "bg-main text-white border-main shadow-sm"
          : "bg-white text-slate-600 border-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
          active ? "bg-white/20" : "bg-slate-100 text-slate-600",
        ].join(" ")}
      >
        {index}
      </span>
      {label}
    </div>
  );
}

function OptionRow({
  option,
  selected,
  onSelect,
}: {
  option: TransferOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl border transition-all",
        "bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
        selected ? "border-main shadow-[0_12px_40px_rgba(27,53,101,0.12)]" : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Thumb */}
        <div className="relative h-44 sm:h-auto sm:w-44 shrink-0 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${option.image}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0D1B2A]/75 via-[#0D1B2A]/25 to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {option.popular && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A14A] px-2.5 py-1 text-[11px] font-bold text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Popular
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white border border-white/15 backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-[#C9A14A]" />
              {option.duration}
            </span>
            <span className="inline-flex items-baseline gap-1 rounded-full bg-main px-2.5 py-1 text-white">
              <span className="text-[10px] opacity-80">from</span>
              <span className="text-sm font-extrabold">${option.price}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                  {option.title}
                </h3>
                {selected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-main/10 text-main border border-main/15 px-2 py-0.5 text-[11px] font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Selected
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{option.description}</p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-[#C9A14A]" />
                Typical routes
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {option.routes.map((r, i) => (
              <span
                key={i}
                className="rounded-full bg-[#F0F4F8] px-3 py-1 text-xs font-semibold text-main border border-[#E2E8F0]"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <BadgeCheck className="h-4 w-4 text-[#C9A14A]" />
              Executive vehicles • Licensed drivers
            </span>

            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border transition",
                selected
                  ? "bg-main text-white border-main"
                  : "bg-white text-slate-700 border-slate-200",
              ].join(" ")}
            >
              Choose
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Transfers() {
  const [selectedId, setSelectedId] = useState<number>(transferOptions.find((o) => o.popular)?.id ?? transferOptions[0].id);

  const selected = useMemo(
    () => transferOptions.find((o) => o.id === selectedId) ?? transferOptions[0],
    [selectedId]
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden bg-[#F8FAFC] px-4 py-14 lg:py-20 border-t border-[#E2E8F0]"
    >
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-120px] h-[360px] w-[360px] rounded-full bg-main/6 blur-2xl" />
        <div className="absolute -bottom-24 left-[-120px] h-[360px] w-[360px] rounded-full bg-[#C9A14A]/8 blur-2xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            color="000000"
            subtitle="Reliable Transportation"
            title="Build Your Private Transfer"
            description="Choose a transfer type, review details, and book in seconds — with fixed pricing and premium service."
          />
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <StepPill active label="Choose Transfer" index={1} />
          <div className="hidden sm:block h-px w-10 bg-slate-200" />
          <StepPill active={false} label="Add Details" index={2} />
          <div className="hidden sm:block h-px w-10 bg-slate-200" />
          <StepPill active={false} label="Confirm & Pay" index={3} />
        </motion.div>

        {/* Main layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* List */}
          <div className="lg:col-span-8 space-y-4">
            {transferOptions.map((option) => (
              <motion.div
                key={option.id}
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <OptionRow
                  option={option}
                  selected={selectedId === option.id}
                  onSelect={() => setSelectedId(option.id)}
                />
              </motion.div>
            ))}

            {/* Trust strip (mobile-first) */}
            {/* <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-main/10 text-main border border-main/15">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Why travelers choose us</p>
                  <p className="text-xs text-slate-600">
                    Premium fleet, punctual pickups, and transparent pricing.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keyFeatures.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200">
                        <Icon className="h-4 w-4 text-[#C9A14A]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">{title}</p>
                        <p className="mt-0.5 text-xs text-slate-600">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sticky summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <motion.div
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="p-5 border-b border-slate-200 bg-linear-to-b from-slate-50 to-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Selected
                      </p>
                      <h4 className="mt-1 text-lg font-extrabold text-slate-900">
                        {selected.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">{selected.description}</p>
                    </div>

                    {selected.popular && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#C9A14A] px-2.5 py-1 text-[11px] font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-slate-500">Starting from</p>
                      <p className="mt-0.5 text-xl font-extrabold text-slate-900">
                        ${selected.price}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-slate-500">Estimated time</p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-900 inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#C9A14A]" />
                        {selected.duration}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">Typical routes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.routes.map((r, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[#F0F4F8] px-3 py-1 text-xs font-semibold text-main border border-[#E2E8F0]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200">
                      <BadgeCheck className="h-5 w-5 text-[#C9A14A]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900">Premium service included</p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Professional drivers, comfortable vehicles, and transparent pricing.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/transfer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Continue to Booking
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/contactus"
                      className="inline-flex items-center justify-center rounded-xl border border-main/20 bg-white px-5 py-3 text-sm font-extrabold text-main transition-all hover:bg-[#F0F4F8] hover:border-main/40"
                    >
                      Talk to a Concierge
                    </Link>

                    <p className="text-center text-[11px] text-slate-500 mt-1">
                      You can adjust pickup details on the next step.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Micro reassurance */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Shield className="h-4 w-4 text-[#C9A14A]" />
                  Safe & insured
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="h-4 w-4 text-[#C9A14A]" />
                  On-time pickup
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <DollarSign className="h-4 w-4 text-[#C9A14A]" />
                  Fixed price
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: tiny animated confirmation on selection */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="mt-8 text-center text-sm text-slate-600"
          >
            Selected: <span className="font-bold text-slate-900">{selected.title}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}