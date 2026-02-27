"use client";

import Image from "next/image";
import Link from "next/link";
import { Plane } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Img = { src: string; alt: string };

const IMAGES: {
  left: Img;
  right: Img;
  centerWide: Img;
  centerSmallTop: Img;
  centerSmallBottom: Img;
} = {
  left: {
    src: "/assets/about.webp",
    alt: "Traveler on a cliff",
  },
  right: {
    src: "/assets/contact.avif",
    alt: "Island view",
  },
  centerWide: {
    src: "/assets/heroimg.jpeg",
    alt: "Mountain city view",
  },
  centerSmallTop: {
    src: "/assets/trips.avif",
    alt: "Castle view",
  },
  centerSmallBottom: {
    src: "/assets/trips2.avif",
    alt: "Friends travel",
  },
};

function DottedFlightPath({
  side,
}: {
  side: "left" | "right";
}) {
  return (
    <svg
      className={[
        "absolute top-[250px] hidden lg:block",
        side === "left" ? "left-[120px]" : "right-[120px]",
      ].join(" ")}
      width="360"
      height="140"
      viewBox="0 0 360 140"
      fill="none"
      aria-hidden="true"
    >
      {/* dotted line */}
      <path
        d={
          side === "left"
            ? "M8 110 C 80 20, 190 20, 260 82 C 296 114, 320 118, 352 110"
            : "M352 110 C 280 20, 170 20, 100 82 C 64 114, 40 118, 8 110"
        }
        stroke="rgba(44,53,57,0.28)"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />

      {/* little curl */}
      <path
        d={side === "left" ? "M352 110 C 340 120, 330 122, 320 110" : "M8 110 C 20 120, 30 122, 40 110"}
        stroke="rgba(44,53,57,0.28)"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PopularDestinationHero() {
  return (
    <section className="relative overflow-hidden bg-[#fff2e0] py-16 sm:py-20">
      {/* subtle border/top line like the screenshot */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-black/10" />

      {/* soft background dots */}
      {/* <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]"
        aria-hidden
      /> */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Popular Destination"
          title="Most Popular Destinations in Egypt"
          // description="Popular Destination"
        />

        {/* flight paths + planes */}
        {/* <DottedFlightPath side="left" />
        <DottedFlightPath side="right" />

        <Plane
          className="absolute left-[360px] top-[260px] hidden lg:block text-[#143B63]"
          size={28}
        />
        <Plane
          className="absolute right-[360px] top-[260px] hidden lg:block text-[#143B63]"
          size={28}
        /> */}

        {/* Collage */}
        <div className="relative mt-10 lg:mt-14">
          {/* LEFT tall image */}
          <div className="absolute left-0 top-2 hidden lg:block">
            <div className="relative h-[250px] w-[250px] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              <Image
                src={IMAGES.left.src}
                alt={IMAGES.left.alt}
                fill
                className="object-cover"
                sizes="250px"
                priority
              />
            </div>
          </div>

          {/* RIGHT tall image */}
          <div className="absolute right-0 top-2 hidden lg:block">
            <div className="relative h-[250px] w-[250px] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              <Image
                src={IMAGES.right.src}
                alt={IMAGES.right.alt}
                fill
                className="object-cover"
                sizes="250px"
              />
            </div>
          </div>

          {/* CENTER images container */}
          <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4 lg:gap-6">
            {/* Spacer columns for large screens (keeps center balanced) */}
            <div className="hidden lg:block lg:col-span-2" />

            {/* Center-wide image */}
            <div className="col-span-12 lg:col-span-6">
              <div className="relative h-[240px] w-full overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[280px]">
                <Image
                  src={IMAGES.centerWide.src}
                  alt={IMAGES.centerWide.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </div>

            {/* Right stack */}
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                {/* small top image */}
                <div className="relative z-20 h-[180px] w-[72%] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[200px]">
                  <Image
                    src={IMAGES.centerSmallTop.src}
                    alt={IMAGES.centerSmallTop.alt}
                    fill
                    className="object-cover"
                    sizes="420px"
                  />
                </div>

                {/* small bottom image (offset) */}
                <div className="relative -mt-10 ml-[28%] h-[180px] w-[72%] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[200px]">
                  <Image
                    src={IMAGES.centerSmallBottom.src}
                    alt={IMAGES.centerSmallBottom.alt}
                    fill
                    className="object-cover"
                    sizes="420px"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-2" />
          </div>
        </div>

      
      </div>
    </section>
  );
}