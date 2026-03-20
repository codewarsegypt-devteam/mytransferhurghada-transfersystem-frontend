"use client";

import { motion } from "framer-motion";
import {
  Check,
  Plane,
  Clock,
  UserRound,
  Luggage,
} from "lucide-react";

const benefits = [
  "Strong reputation across Hurghada & the Red Sea",
  "Free cancellation on eligible bookings",
  "Licensed drivers & modern, air-conditioned vehicles",
  "24/7 support before and during your trip",
  "Fixed, transparent pricing — no surprises",
];

const whyTransfer = [
  {
    icon: Plane,
    title: "Meet & greet",
    text: "Driver tracks your arrival and waits with a clear sign — easy to spot after a long flight.",
  },
  {
    icon: Clock,
    title: "On time",
    text: "We plan around traffic and flight delays so you’re not left waiting.",
  },
  {
    icon: Luggage,
    title: "Room for bags",
    text: "Choose the right vehicle for luggage, family, or extra comfort.",
  },
  {
    icon: UserRound,
    title: "Private & calm",
    text: "Door-to-door service without the stress of queues or negotiating fares.",
  },
];

export default function WhyBookWithUs() {
  return (
    <section className="relative border-t border-slate-200/80 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/80">
              Why book with us
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Built for travelers who want clarity
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              From booking to drop-off, we focus on simple steps, clear communication, and
              dependable service.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm lg:col-span-8 lg:p-8"
          >
            <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
              Why book a transfer
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              A pre-booked transfer saves time and removes guesswork — especially after a flight or
              when you’re new to the area.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {whyTransfer.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white bg-white p-5 shadow-sm"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-main/10 text-main">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-base font-bold text-slate-900">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
