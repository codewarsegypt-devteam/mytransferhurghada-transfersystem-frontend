"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripItemDto } from "@/lib/types/tripsTypes";
import TripCard from "@/components/ui/TripCard";
import HeroText from "@/components/ui/HeroText";
import { HeroTransferForm } from "../hero components/HeroTransferForm";

const CARD_WIDTH_MOBILE = 300;
const CARD_WIDTH_DESKTOP = 420;
const CARD_GAP = 24;

function CarouselBlock({ trips }: { trips: TripItemDto[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  const duplicatedTrips = useMemo(() => [...trips, ...trips], [trips]);
  const offsetMobile = trips.length * (CARD_WIDTH_MOBILE + CARD_GAP);
  const offsetDesktop = trips.length * (CARD_WIDTH_DESKTOP + CARD_GAP);
  const duration = Math.max(16, trips.length * 4);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "100px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="relative h-[450px] min-[765px]:h-[480px] overflow-visible bg-transparent translate-y-[-250px] md:translate-y-[-300px] z-10 w-full pt-12 sm:pt-14 pb-14 sm:pb-16"
    >
      <div
        className="overflow-hidden w-full"
        style={{ contain: "layout style paint" }}
      >
        <div
          className={cn(
            "carousel-track flex items-stretch gap-6 px-4 sm:px-6",
            !isInView && "paused",
          )}
          style={
            {
              width: "max-content",
              ["--carousel-offset-mobile" as string]: `-${offsetMobile}px`,
              ["--carousel-offset-desktop" as string]: `-${offsetDesktop}px`,
              ["--carousel-duration" as string]: `${duration}s`,
            } as React.CSSProperties
          }
        >
          {duplicatedTrips.map((trip, index) => (
            <div
              key={`${trip.id}-${index}`}
              className="shrink-0 w-[300px] sm:w-[420px] py-5"
            >
              <TripCard trip={trip} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 mt-10">
        <button
          type="button"
          className="bg-main cursor-pointer text-white px-8 py-3.5 text-sm rounded-md font-semibold shadow-lg hover:bg-secondary hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out flex items-center gap-2"
          onClick={() => {
            window.location.href = "/trips";
          }}
        >
          Explore All Trips
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

const HERO_TITLE_ROTATING_WORDS = ["Fox", "Travel", "Egypt"] as const;
const HERO_TITLE_LONGEST_LENGTH = Math.max(
  ...HERO_TITLE_ROTATING_WORDS.map((w) => w.length),
);

export interface NavigationItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

export interface PulseFitHeroProps {
  trips?: TripItemDto[];
  backgroundImageUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  trips = [],
  backgroundImageUrl = "/assets/heroImg.jpeg",
  className,
  children,
}: PulseFitHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden",
        className,
      )}
      style={{
        background: "linear-gradient(180deg, #0D1B2A 0%, #1B3565 40%, #0F172A 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center pt-[100px] md:pt-[140px] w-full min-h-[120vh]">
          {backgroundImageUrl && (
            <>
              <Image
                src={backgroundImageUrl}
                alt=""
                fill
                sizes="100vw"
                priority
                className="absolute inset-0 w-full h-full object-cover object-center"
                aria-hidden={true}
                draggable={false}
                quality={80}
              />
              <div
                className="absolute inset-0 bg-linear-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/70 to-[#0D1B2A]/55"
                aria-hidden
              />
              {/* Subtle vignette sides */}
              <div
                className="absolute inset-0 bg-linear-to-r from-[#0D1B2A]/30 via-transparent to-[#0D1B2A]/30"
                aria-hidden
              />
            </>
          )}

          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 sm:py-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center text-center max-w-4xl w-full"
              style={{ gap: "clamp(20px, 4vw, 32px)" }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3"
              >
                <span className="w-6 h-px bg-[#C9A14A]" />
                <span className="text-[#C9A14A] text-xs font-semibold uppercase tracking-[0.18em]">
                  Discover Egypt
                </span>
                <span className="w-6 h-px bg-[#C9A14A]" />
              </motion.div>

              {/* Title */}
              <h1 className="flex flex-col items-center justify-between w-full gap-3 sm:gap-4 text-white text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="shrink-0">
                  Adventure &amp; Experience
                </span>
                <span
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-main border border-[#C9A14A]/30 py-0.5 sm:py-1 md:py-2 px-3 sm:px-3 md:px-4 overflow-hidden"
                  style={{ minWidth: `${HERO_TITLE_LONGEST_LENGTH + 1.2}ch` }}
                  aria-hidden
                >
                  <HeroText
                    texts={[...HERO_TITLE_ROTATING_WORDS]}
                    mainClassName="text-[#C9A14A] overflow-hidden justify-center"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/70 max-w-xl text-base md:text-lg leading-relaxed">
                Sea trips, desert safaris, and private transfers — your adventure
                in Egypt made simple.{" "}
                <br className="hidden sm:block" />
                Travel, explore, and book easily, all in one place.
              </p>

              <HeroTransferForm />
            </motion.div>
          </div>
        </div>
      )}

      {/* {trips.length > 0 && <CarouselBlock trips={trips} />} */}
    </section>
  );
}
