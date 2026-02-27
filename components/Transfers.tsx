"use client";

import Link from "next/link";
import {
  Car,
  Shield,
  DollarSign,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
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
    routes: [" Airport", "Hotel Zone", "Downtown"],
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

function TransferCard({ option }: { option: TransferOption }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-white shadow-soft border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.08]"
          style={{ backgroundImage: `url('${option.image}')` }}
        />

        {/* Luxury overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {option.popular && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-[#2C3539] shadow-sm border border-white/30">
              <CheckCircle2 className="w-4 h-4 text-[#F3722A]" />
              Most Popular
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <div className="rounded-full bg-black/35 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white border border-white/15">
            <span className="opacity-90">from</span>{" "}
            <span className="text-[13px] font-bold">${option.price}</span>
          </div>
        </div>

        {/* Bottom glass title */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/15 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  {option.title}
                </h3>
                <p className="mt-0.5 text-sm text-white/80 line-clamp-1">
                  {option.description}
                </p>
              </div>

              <div className="shrink-0">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white border border-white/15">
                  <Clock className="w-4 h-4" />
                  {option.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Routes */}
        <div className="flex items-start gap-2">
          <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3722A]/10 text-[#F3722A] border border-[#F3722A]/15">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Typical routes
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.routes.map((route, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-[#F5EDE4] px-3 py-1 text-xs font-medium text-[#2C3539] border border-black/5"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-6 flex items-center justify-between pt-5 border-t border-black/5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
          
            <span className="font-medium">Private • Door-to-door</span>
          </div>

          <Link
            href="/transfer"
            className="inline-flex items-center gap-2 rounded-full bg-[#F3722A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(243,114,42,0.25)] transition-all hover:bg-[#F15A22] hover:translate-y-[-1px]"
          >
            Book now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div> */}
      </div>

      {/* Subtle corner highlight */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#F9C74F]/25 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

export default function Transfers() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-[#F5EDE4] to-white px-4 py-12 lg:py-16">
      {/* Premium background ornaments */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-120px] h-[320px] w-[320px] rounded-full bg-[#F3722A]/18 blur-3xl" />
        <div className="absolute -bottom-28 left-[-140px] h-[360px] w-[360px] rounded-full bg-[#F9C74F]/22 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        <SectionHeader
          subtitle="Reliable Transportation"
          title="Private Transfers Safe, Comfortable & Premium"
          description="Enjoy a seamless ride with fixed pricing, executive vehicles, and punctual pickups crafted for a smooth, luxury experience."
        />

   

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {transferOptions.map((option) => (
            <TransferCard key={option.id} option={option} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/transfer"
            className="inline-flex items-center justify-center rounded-full bg-[#F3722A] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(243,114,42,0.25)] transition-all hover:bg-[#F15A22] hover:translate-y-[-1px] w-full sm:w-auto"
          >
            Book  Transfer
          </Link>

          <Link
            href="/contactus"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-[#2C3539] transition-all hover:bg-white hover:border-black/15 w-full sm:w-auto"
          >
            Talk to concierge
          </Link>
        </div>
      </div>
    </section>
  );
}