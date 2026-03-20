"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fleet = [
  {
    name: "Shared shuttle",
    from: "From $12",
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  {
    name: "Private car",
    from: "From $18",
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
  {
    name: "VIP / executive",
    from: "From $35",
    src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
  },
  {
    name: "Minivan",
    from: "From $28",
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
  },
  {
    name: "Large group",
    from: "On request",
    src: "https://images.unsplash.com/photo-1570125909232-eb363cdeb4fc?w=800&q=80",
  },
];

export default function TransferFleetRow() {
  return (
    <section className="border-t border-slate-200/80 bg-[#F8FAFC] py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/80">
              Choose your ride
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Options for every group size
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Pick the vehicle that fits your trip — prices shown as a guide; final fare depends on
              route and date.
            </p>
          </div>

          <Link
            href="/transfer"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-main px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary sm:self-auto"
          >
            Book a transfer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fleet.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="w-[220px] shrink-0 sm:w-[240px]"
            >
              <Link
                href="/transfer"
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold text-main">{item.from}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
