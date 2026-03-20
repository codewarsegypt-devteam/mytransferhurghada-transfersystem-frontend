"use client";

import { motion } from "framer-motion";
import {
  Check,
  Plane,
  HandCoins,
  Clock,
  Building2,
} from "lucide-react";

const benefits = [
  "Excellent reputation",
  "No credit card fees",
  "Tolls included",
  "Free cancellation",
  "Professional drivers",
];

const whyTransfer = [
  {
    icon: Plane,
    title: "Meet & greet",
    text: "We track your flight to ensure your driver is waiting when you land.",
  },
  {
    icon: HandCoins,
    title: "Value",
    text: "Enjoy high quality transfer experience at surprisingly low prices.",
  },
  {
    icon: Clock,
    title: "Speedy",
    text: "No queues, no hassle - we’ll get you to your destination quickly.",
  },
  {
    icon: Building2,
    title: "Door-to-Door",
    text: "For complete peace of mind we’ll take you directly to your hotel door.",
  },
];

export default function WhyBookWithUs() {
  return (
    <section className="relative border-t border-slate-200/70 bg-[#ECECEC] py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          {/* <div className="grid grid-cols-3 gap-2">
            {["Reviews", "Trustpilot", "Tripadvisor"].map((name) => (
              <div
                key={name}
                className="w-[86px] rounded-sm border border-slate-300 bg-white px-1 py-1 text-center shadow-[0_1px_2px_rgba(0,0,0,0.07)]"
              >
                <p className="text-[9px] font-semibold text-slate-600">{name}</p>
                <p className="text-[8px] tracking-[0.08em] text-emerald-600">★★★★★</p>
                <p className="text-[8px] text-slate-500">9.x out of 10</p>
              </div>
            ))}
          </div> */}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <h2 className="text-[34px] font-bold text-slate-800">Why book with us</h2>

            <div className="mt-3 border border-slate-300 bg-white px-4 py-4">
              <ul className="space-y-2.5">
                {benefits.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="border border-slate-300 bg-white p-5 lg:col-span-8"
          >
            <h3 className="text-[34px] font-bold text-slate-800">Why book a transfer</h3>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {whyTransfer.map(({ icon: Icon, title, text }) => (
                <div key={title} className="text-center sm:text-left">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-slate-800">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
