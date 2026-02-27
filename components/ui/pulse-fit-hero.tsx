"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripItemDto } from "@/lib/types/tripsTypes";
import TripCard from "@/components/ui/TripCard";
import HeroText from "@/components/ui/HeroText";
import { HeroTransferForm } from "../hero components/HeroTransferForm";

const CARD_WIDTH_MOBILE = 300;
const CARD_WIDTH_DESKTOP = 420;
const CARD_GAP = 24;

/** Carousel with CSS animation (GPU-friendly) and pause when off-screen. */
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
          className="bg-main cursor-pointer text-white px-6 py-4 text-sm rounded-full font-semibold shadow-lg hover:shadow-l hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out"
          onClick={() => {
            window.location.href = "/trips";
          }}
        >
          Explore trips
        </button>
      </div>
    </motion.div>
  );
}

/** Rotating words in the hero title; longest length is used to reserve layout space. */
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
  /** Optional list of trips to show in the bottom carousel (TripCard). Demo data only; no fetch. */
  trips?: TripItemDto[];
  /** Optional background image URL for the main hero content area (title + CTAs). */
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
        background:
          "linear-gradient(180deg, var(--off-white) 0%, rgba(243, 114, 42, 0.06) 40%, #FFFFFF 100%)",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center pt-[100px] md:pt-[140px] w-full min-h-[120vh]">
          {/* Background image for main content area only */}
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
                className="absolute inset-0 bg-linear-to-b from-black/40 via-black/65 to-black/40"
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
              {/* Title: left = static text, right = rotating word in a fixed-width slot to avoid layout shift */}
              <h1 className="flex flex-col items-center justify-between w-full gap-3 sm:gap-4 text-white text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="shrink-0">
                  Adventure &<span className="text-main"></span> Experience
                </span>
                <span
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-main py-0.5 sm:py-1 md:py-2 px-2 sm:px-2 md:px-3 overflow-hidden"
                  style={{ minWidth: `${HERO_TITLE_LONGEST_LENGTH + 1.2}ch` }}
                  aria-hidden
                >
                  <HeroText
                    texts={[...HERO_TITLE_ROTATING_WORDS]}
                    mainClassName="text-white overflow-hidden justify-center"
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
              <p className="text-white/80 font-weight-400 font-size-clamp-14px-2-2vw-20px line-height-1-6 max-width-600px">
                Sea trips, desert safaris, and private transfers—your adventure
                in Egypt made simple. <br />
                Travel, explore, and book easily, all in one place.
              </p>

              <HeroTransferForm />
            </motion.div>
          </div>
        </div>
      )}

      {/* TripCard carousel: CSS-driven animation + pause w  hen off-screen for performance */}
      {trips.length > 0 && <CarouselBlock trips={trips} />}
    </section>
  );
}
