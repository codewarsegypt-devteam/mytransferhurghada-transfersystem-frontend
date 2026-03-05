"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};


export default function PopularDestinationHero() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      className="relative overflow-hidden bg-[#fff2e0] py-16 sm:py-20"
    >
      {/* subtle border/top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-black/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp}>
          <SectionHeader
            subtitle="Popular Destination"
            title="Discover the Magic of the Red Sea"
          />
        </motion.div>

        {/* Optional flight paths */}
        {/* <DottedFlightPath side="left" />
        <DottedFlightPath side="right" /> */}

        {/* Collage */}
        <div className="relative mt-10 lg:mt-14">
          {/* LEFT tall image */}
          <motion.div
            variants={fadeLeft}
            className="absolute left-0 top-2 hidden lg:block"
          >
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
          </motion.div>

          {/* RIGHT tall image */}
          <motion.div
            variants={fadeRight}
            className="absolute right-0 top-2 hidden lg:block"
          >
            <div className="relative h-[250px] w-[250px] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              <Image
                src={IMAGES.right.src}
                alt={IMAGES.right.alt}
                fill
                className="object-cover"
                sizes="250px"
              />
            </div>
          </motion.div>

          {/* CENTER images container */}
          <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4 lg:gap-6">
            <div className="hidden lg:block lg:col-span-2" />

            {/* Center-wide image */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-6">
              <div className="relative h-[240px] w-full overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[280px]">
                <Image
                  src={IMAGES.centerWide.src}
                  alt={IMAGES.centerWide.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </motion.div>

            {/* Right stack */}
            <motion.div
              variants={staggerContainer}
              className="col-span-12 lg:col-span-4"
            >
              <div className="relative">
                {/* small top image */}
                <motion.div
                  variants={fadeUp}
                  className="relative z-20 h-[180px] w-[72%] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[200px]"
                >
                  <Image
                    src={IMAGES.centerSmallTop.src}
                    alt={IMAGES.centerSmallTop.alt}
                    fill
                    className="object-cover"
                    sizes="420px"
                  />
                </motion.div>

                {/* small bottom image */}
                <motion.div
                  variants={fadeUp}
                  className="relative -mt-10 ml-[28%] h-[180px] w-[72%] overflow-hidden rounded-none shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:h-[200px]"
                >
                  <Image
                    src={IMAGES.centerSmallBottom.src}
                    alt={IMAGES.centerSmallBottom.alt}
                    fill
                    className="object-cover"
                    sizes="420px"
                  />
                </motion.div>
              </div>
            </motion.div>

            <div className="hidden lg:block lg:col-span-2" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
