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
    <section className=" py-16 lg:py-20 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            subtitle="Why Travel With Us"
            title="Simple, Reliable, and Comfortable"
            description="We focus on making every transfer easy, smooth, and stress-free from start to finish."
          />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-main/10 text-main">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/transfer"
            className="inline-flex items-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Book Your Ride
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}