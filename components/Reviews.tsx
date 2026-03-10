"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";
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

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // responsive visible count (1 / 2 / 3)
  const visibleCount = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }, []);

  // autoplay
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((p) => clampIndex(p + 1, stories.length));
    }, 4500);
    return () => clearInterval(t);
  }, [paused]);

  // keep responsive count updated on resize (simple + safe)
  const [count, setCount] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const current = useMemo(() => {
    const arr: Story[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(stories[clampIndex(index + i, stories.length)]);
    }
    return arr;
  }, [index, count]);

  const prev = () => setIndex((p) => clampIndex(p - 1, stories.length));
  const next = () => setIndex((p) => clampIndex(p + 1, stories.length));

  return (
    <section className="relative py-16 lg:py-20 bg-[#F8FAFC] border-t border-[#E2E8F0] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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

        {/* Carousel */}
        <div
          className="mt-10 max-w-7xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

                <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                  {s.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {s.text}
                </p>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                  <p className="text-sm font-bold text-main">{s.author}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-xl border border-[#E2E8F0] bg-white text-main transition hover:bg-main hover:text-white hover:border-main"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 mx-auto" />
            </button>

            <div className="flex items-center gap-2">
              {stories.map((_, i) => (
                <button
                  key={i}
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
              onClick={next}
              className="h-10 w-10 rounded-xl border border-[#E2E8F0] bg-white text-main transition hover:bg-main hover:text-white hover:border-main"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/transfer"
            className="inline-flex items-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Plan Your Trip
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}