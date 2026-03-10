"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, Sparkles, ShieldCheck } from "lucide-react";
import SectionHeader from "./SectionHeader";

const items = [
  {
    icon: ShieldCheck,
    title: "Trusted Service",
    description: "Safe, reliable, and professionally managed transfers.",
  },
  {
    icon: Headphones,
    title: "Quick Support",
    description: "Our team is ready to help you before and during your trip.",
  },
  {
    icon: Sparkles,
    title: "Smooth Experience",
    description: "Simple booking, clear details, and comfortable rides.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-main/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            color="000000"
            subtitle="Why Travel With Us"
            title="Simple, Reliable, and Comfortable"
            description="We focus on making every transfer easy, smooth, and stress-free from start to finish."
          />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main luxury card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:col-span-12 lg:p-8"
          >
            <div className="absolute " />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 ">
              {/* Left content */}
              <div className="lg:col-span-4">
                {/* <div className="inline-flex items-center gap-2 rounded-full border border-main/15 bg-main/5 px-3 py-1 text-xs font-semibold text-main">
                  <Sparkles className="h-4 w-4" />
                  Premium transfer experience
                </div> */}

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Everything built around comfort and trust
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  From booking to arrival, we focus on the details that make your
                  journey feel smooth, clear, and professionally handled.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    Professional service
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    Fast communication
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    Stress-free booking
                  </span>
                </div>
              </div>

              {/* Right features */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                {items.map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-main/[0.04] via-transparent to-secondary/[0.05] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main/10 text-main transition-all duration-300 group-hover:bg-main group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        {title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Ready to book your next ride?
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Enjoy a transfer experience that feels easy from the very first step.
                </p>
              </div>

              <Link
                href="/transfer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 hover:bg-secondary"
              >
                Book Your Ride
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}