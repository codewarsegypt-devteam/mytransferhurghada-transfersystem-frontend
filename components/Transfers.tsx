"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Car,
  Shield,
  DollarSign,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
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
  {
    icon: DollarSign,
    title: "Fixed Prices",
    description: "No surprises, no hidden fees",
  },
  {
    icon: Car,
    title: "Executive Vehicles",
    description: "Modern, air-conditioned comfort",
  },
  {
    icon: Shield,
    title: "Professional Drivers",
    description: "Licensed, experienced, reliable",
  },
  {
    icon: Clock,
    title: "On-Time Pickup",
    description: "We respect your schedule",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function TransferCard({
  option,
  index,
}: {
  option: TransferOption;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-md bg-white border border-[#E2E8F0] hover:border-main/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(27,53,101,0.12)]"
    >
      {/* Image */}
      <div className="relative h-52 sm:h-60 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
          style={{ backgroundImage: `url('${option.image}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0D1B2A]/80 via-[#0D1B2A]/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {option.popular && (
            <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#C9A14A] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Most Popular
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <div className="rounded-sm bg-main px-2.5 py-1 text-xs font-semibold text-white">
            <span className="opacity-80 text-[11px]">from</span>{" "}
            <span className="font-bold">${option.price}</span>
          </div>
        </div>

        {/* Bottom title */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="rounded-sm bg-[#0D1B2A]/70 backdrop-blur-sm border border-white/10 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {option.title}
                </h3>
                <p className="mt-0.5 text-xs text-white/70 line-clamp-1">
                  {option.description}
                </p>
              </div>
              <div className="shrink-0">
                <div className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2.5 py-1 text-xs font-semibold text-white border border-white/15">
                  <Clock className="w-3.5 h-3.5 text-[#C9A14A]" />
                  {option.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-sm bg-main/8 text-main border border-main/12">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Typical routes
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {option.routes.map((route, idx) => (
                <span
                  key={idx}
                  className="rounded-sm bg-[#F0F4F8] px-2.5 py-1 text-xs font-medium text-main border border-[#E2E8F0]"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Transfers() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-[#F8FAFC] px-4 py-14 lg:py-20 border-t border-[#E2E8F0]"
    >
      {/* Decorative geometric accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-main/3 rounded-bl-[200px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C9A14A]/4 rounded-tr-[150px]" />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            subtitle="Reliable Transportation"
            title="Private Transfers — Safe, Comfortable & Premium"
            description="Enjoy a seamless ride with fixed pricing, executive vehicles, and punctual pickups crafted for a smooth, luxury experience."
          />
        </motion.div>

        {/* Feature pills */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-2 mb-10 -mt-4"
        >
          {keyFeatures.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="inline-flex items-center gap-2 rounded-sm bg-white border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#334155] shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-[#C9A14A]" />
              {title}
            </div>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {transferOptions.map((option, index) => (
            <TransferCard key={option.id} option={option} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/transfer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto"
          >
            Book a Transfer
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contactus"
            className="inline-flex items-center justify-center rounded-md border border-main/20 bg-white px-7 py-3 text-sm font-semibold text-main transition-all hover:bg-[#F0F4F8] hover:border-main/40 w-full sm:w-auto"
          >
            Talk to a Concierge
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
