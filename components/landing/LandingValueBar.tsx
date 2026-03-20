"use client";

import { motion } from "framer-motion";
import { PiggyBank, ThumbsUp, Clock3 } from "lucide-react";

const items = [
  {
    icon: PiggyBank,
    title: "Great value",
    text: "Competitive rates with clear quotes — no hidden extras at the door.",
  },
  {
    icon: ThumbsUp,
    title: "Trusted drivers",
    text: "Professional, licensed drivers who know local routes and airport procedures.",
  },
  {
    icon: Clock3,
    title: "Save time",
    text: "Skip the taxi queue and go straight to your hotel or next stop.",
  },
];

export default function LandingValueBar() {
  return (
    <section className="border-t border-amber-200/60 bg-[#F5D78A] py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-xl font-extrabold tracking-tight text-[#0D1B2A] sm:text-2xl">
            Why book your transfers with My Transfer Egypt?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#0D1B2A]/75 sm:text-base">
            Three reasons guests choose us for airport and hotel transfers across Egypt.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-[#0D1B2A]/10 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D1B2A]/10 text-[#0D1B2A]">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-extrabold uppercase tracking-wide text-[#0D1B2A]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0D1B2A]/75">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
