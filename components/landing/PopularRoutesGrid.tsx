"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const routes = [
  { label: "Hurghada Airport → El Gouna", hint: "pp from $18" },
  { label: "Hurghada Airport → Sahl Hasheesh", hint: "pp from $15" },
  { label: "Hurghada Airport → Makadi Bay", hint: "pp from $18" },
  { label: "Hurghada Airport → Soma Bay", hint: "pp from $18" },
  { label: "Hurghada → Luxor (day trip)", hint: "from $120" },
  { label: "Hurghada → Cairo (long distance)", hint: "on request" },
  { label: "Sharm Airport → Naama Bay", hint: "pp from $22" },
  { label: "Cairo Airport → New Cairo", hint: "pp from $25" },
];

export default function PopularRoutesGrid() {
  const left = routes.slice(0, Math.ceil(routes.length / 2));
  const right = routes.slice(Math.ceil(routes.length / 2));

  return (
    <section className="border-t border-slate-200/80 bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/80">
            Popular routes
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Transfers travelers book often
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Tap a route to start booking — prices are indicative and may vary by date and vehicle.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {[left, right].map((col, ci) => (
            <ul key={ci} className="space-y-2">
              {col.map((r) => (
                <li key={r.label}>
                  <Link
                    href="/transfer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-left transition hover:border-main/25 hover:bg-white"
                  >
                    <span className="text-sm font-semibold text-slate-900">{r.label}</span>
                    <span className="shrink-0 text-xs font-semibold text-main">{r.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Link
            href="/transfer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-main hover:text-secondary"
          >
            See all transfer options
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-main"
          >
            Browse sea & desert trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
