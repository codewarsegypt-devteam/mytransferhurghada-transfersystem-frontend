"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowRight,
  Star,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

type Story = {
  id: number;
  title: string;
  text: string;
  author: string;
  meta: string;
};

const stories: Story[] = [
  {
    id: 1,
    title: "Smooth booking",
    text: "Everything was easy to arrange, and the team stayed helpful from the first message to arrival.",
    author: "Olivia Carter",
    meta: "Private transfer",
  },
  {
    id: 2,
    title: "Right on time",
    text: "Our driver arrived exactly when promised, and the whole transfer felt calm and well organized.",
    author: "Daniel Moore",
    meta: "Airport pickup",
  },
  {
    id: 3,
    title: "Comfortable ride",
    text: "Clean vehicle, friendly service, and a very relaxed experience after a long flight.",
    author: "Sophia Lee",
    meta: "Hotel drop-off",
  },
  {
    id: 4,
    title: "Fast support",
    text: "We had a quick question and got a clear answer immediately. Great communication.",
    author: "Ahmed N.",
    meta: "24/7 support",
  },
  {
    id: 5,
    title: "Great value",
    text: "Clear pricing and a premium experience. We would book again without thinking twice.",
    author: "Maria S.",
    meta: "Fixed price",
  },
];

function clampIndex(i: number, len: number) {
  return (i + len) % len;
}

type ReviewsProps = {
  /** Split trust column + tighter carousel (home landing) */
  variant?: "default" | "landing";
};

export default function Reviews({ variant = "default" }: ReviewsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // autoplay
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((p) => clampIndex(p + 1, stories.length));
    }, 4500);
    return () => clearInterval(t);
  }, [paused]);

  // responsive visible count (1 / 2 / 3 — landing uses max 2)
  const [count, setCount] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (variant === "landing") {
        setCount(w >= 768 ? 2 : 1);
      } else {
        setCount(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [variant]);

  const current = useMemo(() => {
    const arr: Story[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(stories[clampIndex(index + i, stories.length)]);
    }
    return arr;
  }, [index, count]);

  const prev = () => setIndex((p) => clampIndex(p - 1, stories.length));
  const next = () => setIndex((p) => clampIndex(p + 1, stories.length));

  const gridCols =
    variant === "landing"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const carousel = (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={["grid gap-5", gridCols].join(" ")}>
        {current.map((s, i) => (
          <motion.div
            key={`${s.id}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-main/10 text-main">
                <Quote className="h-4 w-4" />
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {s.meta}
              </span>
            </div>

            <div className="mt-3 flex gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className="h-4 w-4 fill-current" aria-hidden />
              ))}
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-slate-900">{s.title}</h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.text}</p>

            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <p className="text-sm font-bold text-main">{s.author}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          className="h-10 w-10 rounded-xl border border-[#E2E8F0] bg-white text-main transition hover:border-main hover:bg-main hover:text-white"
          aria-label="Previous"
        >
          <ChevronLeft className="mx-auto h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {stories.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={[
                "h-2 rounded-full transition-all",
                i === index ? "w-8 bg-main" : "w-2 bg-[#E2E8F0] hover:bg-main/30",
              ].join(" ")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="h-10 w-10 rounded-xl border border-[#E2E8F0] bg-white text-main transition hover:border-main hover:bg-main hover:text-white"
          aria-label="Next"
        >
          <ChevronRight className="mx-auto h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden border-t border-[#E2E8F0] bg-[#F8FAFC] py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {variant === "landing" ? (
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/80">
                Guest feedback
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Loved by travelers
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Real reviews from guests who booked transfers and trips with us.
              </p>

              <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-emerald-700">Excellent</p>
                <div className="mt-2 flex gap-0.5 text-emerald-600">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="h-5 w-5 fill-current" aria-hidden />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Based on <span className="font-semibold text-slate-900">2,400+</span> verified
                  reviews across channels.
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-8">{carousel}</div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
            >
              <SectionHeader
                color="000000"
                subtitle="Guest Feedback"
                title="What Travelers Remember Most"
                description="Short notes from guests who enjoyed a smooth, comfortable experience."
              />
            </motion.div>

            <div className="mx-auto mt-10 max-w-7xl">{carousel}</div>

            <div className="mt-10 text-center">
              <Link
                href="/transfer"
                className="inline-flex items-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Plan Your Trip
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}

        {variant === "landing" && (
          <div className="mt-10 text-center">
            <Link
              href="/transfer"
              className="inline-flex items-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
            >
              Book a transfer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}