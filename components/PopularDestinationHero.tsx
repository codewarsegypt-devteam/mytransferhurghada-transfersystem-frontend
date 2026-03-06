"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Img = { src: string; alt: string };

const IMAGES: {
  hero: Img;
  strip: Img[];
} = {
  hero: { src: "/assets/heroimg.jpeg", alt: "Mountain city view" },
  strip: [
    { src: "/assets/about.webp", alt: "Traveler on a cliff" },
    { src: "/assets/contact.avif", alt: "Island view" },
    { src: "/assets/trips.avif", alt: "Castle view" },
    { src: "/assets/trips2.avif", alt: "Friends travel" },
  ],
};

const destinations = ["Hurghada", "Luxor", "Cairo", "Sharm El Sheikh", "Aswan"];

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const floatIn = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: "easeOut" } },
};

export default function PopularDestinationHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      {/* Background hero image */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero.src}
          alt={IMAGES.hero.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* cinematic overlays */}
        <div className="absolute inset-0 bg-[#0B1220]/70" />
        <div className="absolute inset-0 bg-linear-to-b from-[#0B1220]/30 via-[#0B1220]/65 to-[#0B1220]" />
        {/* subtle gold glow */}
        <div className="absolute -top-24 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#C9A14A]/12 blur-3xl" />
      </div>

      {/* top / bottom accents */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#C9A14A] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#C9A14A] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7"
          >
            <motion.div variants={fade as Variants}>
              <SectionHeader
                subtitle="Popular Destination"
                title="Discover the Magic of the Red Sea"
              />
            </motion.div>

            <motion.p
              variants={fade as Variants}
              className="mt-4 max-w-xl text-white/70 text-sm sm:text-base leading-relaxed"
            >
              Curated experiences across Egypt’s most iconic cities — seamless planning,
              premium comfort, and unforgettable views.
            </motion.p>

            {/* Destination chips */}
            <motion.div variants={fade as Variants} className="mt-6 flex flex-wrap gap-2">
              {destinations.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/6 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#C9A14A]" />
                  {d}
                </span>
              ))}
            </motion.div>

            {/* CTA (اختياري) */}
            <motion.div variants={fade as Variants} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore Destinations
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contactus"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white/90 backdrop-blur-sm transition-all hover:bg-white/8"
              >
                Talk to a Concierge
              </Link>
            </motion.div>
          </motion.div>

          {/* Photo strip (New layout, not collage) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="lg:col-span-5"
          >
            <motion.div
              variants={floatIn as Variants}
              className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="grid grid-cols-2 gap-3">
                {IMAGES.strip.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 300px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
                  </div>
                ))}
              </div>

              {/* little label */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs font-semibold text-white/70 tracking-widest uppercase">
                  Handpicked Views
                </p>
                <span className="text-xs font-bold text-[#C9A14A]">Premium Routes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom “ticker” bar (new caption idea) */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-12 overflow-hidden"
        >
          <div className="rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-white/65">
              {destinations.map((d) => (
                <span key={d} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A14A]" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}