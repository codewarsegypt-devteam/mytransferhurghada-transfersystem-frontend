'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { TripItemDto } from '@/lib/types/tripsTypes';

interface TripCardProps {
  trip: TripItemDto;
  className?: string;
  index?: number;
}

export default function TripCard({ trip, className = '', index = 0 }: TripCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      whileHover={{ y: -6 }}
      className={className}
    >
      <Link href={`/trips/${trip.slug}`} className="block">
        <div className="group relative bg-white rounded-md overflow-hidden border border-[#E2E8F0] hover:border-main/30 hover:shadow-[0_8px_32px_rgba(27,53,101,0.12)] transition-all duration-300 h-full">
          {/* Image */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <Image
                src={trip.coverImageURL}
                alt={trip.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0D1B2A]/70 via-[#0D1B2A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Discount Badge */}
            {trip.discount != null && trip.discount.value > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 + index * 0.1
                }}
                className="absolute top-3 right-3 z-10"
              >
                <div className="bg-[#C9A14A] text-white px-3 py-1.5 rounded-sm font-bold text-xs shadow-lg flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {trip.discount.value}% OFF
                </div>
              </motion.div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-main text-white text-xs font-semibold px-3 py-1.5 rounded-sm tracking-wide uppercase">
                {trip.category}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 space-y-3">
            {/* Location */}
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C9A14A] shrink-0" />
              <span className="font-medium">{trip.city}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[#0F172A] leading-tight line-clamp-1 group-hover:text-main transition-colors duration-300">
              {trip.title}
            </h3>

            {/* Overview */}
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
              This is a demo overview text to be replaced with the actual overview text from the trip data. replaced with the actual overview text from the trip data.
            </p>

            {/* Divider */}
            <div className="border-t border-[#E2E8F0]" />

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">From</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-main">
                    {trip.price.adult}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    {trip.price.currency.currencyCode}/person
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-2 text-main font-semibold text-sm"
              >
                <span className="hidden sm:inline text-sm text-slate-600">View Details</span>
                <div className="w-9 h-9 rounded-md bg-main flex items-center justify-center group-hover:bg-secondary transition-colors shadow-sm">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C9A14A] origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
