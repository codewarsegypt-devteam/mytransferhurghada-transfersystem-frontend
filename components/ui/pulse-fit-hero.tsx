"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripItemDto } from "@/lib/types/tripsTypes";
import TripCard from "@/components/ui/TripCard";
import HeroText from "@/components/ui/HeroText";

/** Rotating words in the hero title; longest length is used to reserve layout space. */
const HERO_TITLE_ROTATING_WORDS = ["Fox", "Travel", "Egypt"] as const;
const HERO_TITLE_LONGEST_LENGTH = Math.max(...HERO_TITLE_ROTATING_WORDS.map((w) => w.length));

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
        className

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
                  Adventure &
                  <span className="text-main"></span> Experience
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
                Sea trips, desert safaris, and private transfers—your adventure in Egypt made simple. <br />
                Travel, explore, and book easily, all in one place.
              </p>

              {/* CTA Bar - Transportation / Transfer (design only) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:mt-10 w-full max-w-4xl"
              >
                <p className="text-white/90 text-sm font-medium mb-2.5 text-center">
                  Book your transfer in seconds
                </p>
                <div
                  className="w-full rounded-2xl overflow-hidden 
                  flex flex-col sm:flex-row items-stretch gap-0 sm:gap-0 flex-nowrap min-w-0 
                  bg-white/80 backdrop-blur-md 
                  shadow-[0_4px_24px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.6)_inset,0_0_40px_-8px_rgba(243,114,42,0.15)]"
                  
                >
                  {/* From */}
                  <div className="flex-1 min-w-0 flex items-center shrink-0 basis-auto sm:flex-1 border-b sm:border-b-0 sm:border-r border-(--light-grey)/80">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-white/60 transition-colors min-w-0 group"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0 group-hover:bg-main/15 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From
                        </span>
                        <span className="block text-sm font-medium text-gray-800 truncate">
                          Pickup location
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                    </button>
                  </div>
                  {/* To */}
                  <div className="flex-1 min-w-0 flex items-center shrink-0 basis-auto sm:flex-1 border-b sm:border-b-0 sm:border-r border-(--light-grey)/80">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-white/60 transition-colors min-w-0 group"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0 group-hover:bg-main/15 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          To
                        </span>
                        <span className="block text-sm font-medium text-gray-800 truncate">
                          Destination
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                    </button>
                  </div>
                  {/* Date */}
                  <div className="flex-1 min-w-0 flex items-center shrink-0 basis-auto sm:flex-[0.85] border-b sm:border-b-0 sm:border-r border-(--light-grey)/80">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-white/60 transition-colors min-w-0 group"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-main/10 text-main shrink-0 group-hover:bg-main/15 transition-colors">
                        <CalendarDays className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </span>
                        <span className="block text-sm font-medium text-gray-800 truncate">
                          Select date
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                    </button>
                  </div>
                  {/* Action button */}
                  <div className="shrink-0 p-2.5 sm:p-3 flex items-center justify-center bg-linear-to-br from-main to-secondary">
                    <button
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-gray-900 font-semibold px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Book transfer
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}

      {/* TripCard carousel */}
      {trips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative h-[410px] min-[765px]:h-[450px] overflow-visible bg-transparent translate-y-[-250px] md:translate-y-[-300px] z-10 w-full pt-12 sm:pt-14 pb-14 sm:pb-16"
        >

          {/* Scrolling container: TripCard per trip, duplicated for seamless loop */}
          <motion.div
            className="flex items-stretch gap-6 px-4 sm:px-6"
            animate={{
              x: [0, -(trips.length * (320 + 24))],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: trips.length * 4,
                ease: "easeInOut",
              },
            }}
            style={{ width: "max-content" }}
          >
            {[...trips, ...trips].map((trip, index) => (
              <div
                key={`${trip.id}-${index}`}
                className="shrink-0 w-[300px] sm:w-[420px]"
              >
                <TripCard trip={trip} index={index} />
              </div>
            ))}
          </motion.div>
          {/* CTA Buttons center */}
          <div className="flex flex-row items-center justify-center gap-4 mt-10">
            <button type="button" className="bg-main text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => {
              window.location.href = "/trips";
            }}>
              Explore trips
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
